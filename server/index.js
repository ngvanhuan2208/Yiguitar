const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const morgan = require('morgan');
const logger = require('./utils/logger');


// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const articleRoutes = require('./routes/articleRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const brandRoutes = require('./routes/brandRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const courseRoutes = require('./routes/courseRoutes');
const tabRoutes = require('./routes/tabRoutes');
const cartRoutes = require('./routes/cartRoutes');
const chatRoutes = require('./routes/chatRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { generateChatResponse } = require('./services/aiService');

// Models (Needed for Socket.io and initial setup)
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();

// HTTP Request Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180',
  'http://localhost:5181',
  process.env.CLIENT_URL
].filter(Boolean);

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Pass io to app context so controllers can access it
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
  frameguard: false, // Tắt X-Frame-Options cũ
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "frame-ancestors": ["'self'", ...ALLOWED_ORIGINS], // Chỉ cho phép các domain được tin tưởng (frontend) nhúng iframe, đảm bảo bảo mật chống Clickjacking
    },
  },
}));

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  next();
});

app.use(xss());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/guitar-shop';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Register Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tabs', tabRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Auth Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Auth required'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('User not found'));
    socket.user = { _id: user._id, name: user.name, role: user.role };
    next();
  } catch (err) { next(new Error('Invalid token')); }
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('⚡ Authenticated socket connection:', socket.id, '| User:', socket.user.name);

  socket.on('join-chat', (userId) => {
    if (socket.user.role === 'admin' || socket.user._id.toString() === userId) {
      socket.join(userId);
      console.log(`👤 ${socket.user.name} joined room: ${userId}`);
    }
  });

  socket.on('send-message', async (data) => {
    try {
      const { conversationId, content } = data;
      const newMessage = await Message.create({
        conversationId,
        sender: socket.user._id,
        senderRole: socket.user.role,
        content
      });
      const populated = await Message.findById(newMessage._id).populate('sender', 'name avatar');
      io.to(conversationId).emit('receive-message', populated);
      
      if (socket.user.role === 'user') {
        io.emit('new-chat-notification', {
          userId: conversationId,
          content: content.substring(0, 50)
        });

        // TỰ ĐỘNG PHẢN HỒI BẰNG AI (Tích hợp Gemini)
        setTimeout(async () => {
          try {
            const aiReply = await generateChatResponse(content);
            
            // Lưu tin nhắn AI vào Database
            const aiMessageSaved = await Message.create({
              conversationId,
              sender: null, 
              senderRole: 'admin',
              content: aiReply
            });

            const populatedAI = await Message.findById(aiMessageSaved._id).populate('sender', 'name avatar');
            io.to(conversationId).emit('receive-message', populatedAI);
          } catch (aiErr) {
            console.error('AI Reply Error:', aiErr);
          }
        }, 1500); // Trì hoãn 1.5 giây tạo cảm giác tự nhiên
      }
    } catch (err) { console.error('Socket error:', err); }
  });

  socket.on('typing', (data) => socket.to(data.conversationId).emit('typing', data));
  
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.user.name);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

http.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});

// Graceful Shutdown — Giải phóng cổng khi nodemon restart
const gracefulShutdown = (signal) => {
  console.log(`\n⚠️ ${signal} received. Closing server gracefully...`);
  http.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
  // Force close sau 3 giây nếu server không đóng kịp
  setTimeout(() => process.exit(1), 3000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
