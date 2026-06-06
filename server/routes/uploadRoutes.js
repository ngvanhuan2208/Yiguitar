const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Sửa lỗi encoding cho tên file tiếng Việt bị biến dạng (Multer mặc định đọc theo chuẩn latin1)
    const originalNameUtf8 = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + originalNameUtf8);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
    if (allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname).toLowerCase())) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP, SVG) và PDF!'));
  }
});

router.post('/', protect, isAdmin, upload.array('images', 10), (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const fileUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
