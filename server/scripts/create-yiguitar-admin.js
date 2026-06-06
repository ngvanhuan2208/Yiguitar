const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const email = 'yiguitar@gmail.com';
const password = 'admin@2026';
const name = 'Yi Guitar Admin';

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/guitar-shop')
  .then(async () => {
    // Xóa nếu đã tồn tại để tránh lỗi trùng lặp khi chạy lại
    await User.deleteOne({ email });
    
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });
    
    console.log('✅ Đã tạo tài khoản Admin thành công:');
    console.log(`- Email: ${email}`);
    console.log(`- Password: ${password}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  });
