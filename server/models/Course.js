const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorPhone: { type: String }, // NEW
  type: { type: String, enum: ['Online', 'Offline'], required: true },
  level: { type: String, default: 'Cơ bản' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  schedule: { type: String }, // For Offline courses (e.g., T2-T4-T6)
  location: { type: String }, // For Offline (e.g., 'Quận 1', 'Quận 7')
  maxStudents: { type: Number, default: 20 }, // For Offline
  studentsCount: { type: Number, default: 0 },
  
  benefits: [{ type: String }], // NEW: Bạn sẽ học được gì
  curriculum: [{ 
    title: { type: String }, 
    lessons: [{ type: String }] 
  }], // NEW: Cấu trúc Chương > Bài
  
  lessons: [{ 
    title: { type: String }, 
    videoUrl: { type: String }, 
    duration: { type: String } 
  }], // LEGACY (Keep for compatibility)
  totalDuration: { type: String }, // e.g. '10 giờ'
  attachments: [{ name: String, url: String }], // Tài liệu đính kèm
  introVideo: { type: String }, // Intro video link (Trailer)
  
  description: { type: String },
  status: { type: Boolean, default: true }, // Bật/Tắt khóa học
  category: { type: String, default: 'Course' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
