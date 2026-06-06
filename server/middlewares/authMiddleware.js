const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware protect: Xác thực JWT token từ Header
 */
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có quyền truy cập.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại hoặc đã bị xóa.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Protect Middleware Error:', err.message);
    res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};

/**
 * Middleware isAdmin: Kiểm tra quyền quản trị viên
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Từ chối truy cập!' });
  }
  next();
};

module.exports = { protect, isAdmin };
