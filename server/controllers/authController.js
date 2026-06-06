const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../utils/emailService');

const Otp = require('../models/Otp');

// Register - Sinh mã OTP và gửi qua Email
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có tối thiểu 6 ký tự.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã tồn tại.' });

    // Tạo mã OTP ngẫu nhiên 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Log OTP để test (chỉ ở DEV)
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log('OTP:', otp);
    }

    // Lưu OTP vào DB (xóa mã cũ nếu có)
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    // Gửi email
    await emailService.sendOtpEmail({ email, otp });

    res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn', otpSent: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP và Tạo User
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Mã xác thực không đúng hoặc đã hết hạn.' });
    }

    // Đảm bảo user chưa tồn tại (tránh lỗi race condition)
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã tồn tại.' });

    // Tạo user
    const user = await User.create({ name, email, password });
    
    // Xóa OTP
    await Otp.deleteMany({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, address: user.address, avatar: user.avatar, token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, address: user.address, avatar: user.avatar, token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, address: user.address, avatar: user.avatar, token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Vui lòng nhập email.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await emailService.sendPasswordResetEmail({ email: user.email, resetUrl });
    res.json({ message: 'Vui lòng kiểm tra email để đặt lại mật khẩu!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
    }
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Đặt lại mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// Avatar Upload
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn một file ảnh.' });
    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarPath }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    await user.save();
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, address: user.address, avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
    }
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
