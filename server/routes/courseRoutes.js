const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/courses/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const courseUpload = multer({ 
  storage: courseStorage,
  limits: { fileSize: 105 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|pdf/;
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype);
    if (extValid || mimeValid) return cb(null, true);
    cb(new Error('Chỉ chấp nhận file ảnh, video và PDF!'));
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
  { name: 'attachments[]', maxCount: 10 }
]);

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', protect, isAdmin, courseUpload, courseController.createCourse);
router.put('/:id', protect, isAdmin, courseUpload, courseController.updateCourse);
router.delete('/:id', protect, isAdmin, courseController.deleteCourse);

module.exports = router;
