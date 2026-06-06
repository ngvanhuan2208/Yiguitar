const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  author: { type: String }, // Who transcribed the tab
  price: { type: Number, default: 0 },
  image: { type: String },
  genre: { type: String, default: 'Pop' },
  demoVideo: { type: String },
  downloadsCount: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  files: [
    { 
      name: { type: String }, 
      url: { type: String }, 
      fileType: { type: String, enum: ['PDF', 'GPX', 'BackingTrack'] }
    }
  ],
  difficulty: { type: String, enum: ['Cơ bản', 'Trung bình', 'Nâng cao'] },
  category: { type: String, default: 'Tab' }
});

module.exports = mongoose.model('Tab', tabSchema);
