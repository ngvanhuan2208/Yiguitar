const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log('Cách dùng: node promote-admin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/guitar-shop')
  .then(async () => {
    const user = await User.findOne({ email: emailToPromote });
    
    if (!user) {
      console.log(`❌ Không tìm thấy người dùng có email: ${emailToPromote}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`✅ Chúc mừng! Tài khoản ${emailToPromote} đã được nâng cấp lên ADMIN thành công.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối Database:', err);
    process.exit(1);
  });
