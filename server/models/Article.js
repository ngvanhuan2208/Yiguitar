const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, enum: ['Guitar', 'Tin tức'], required: true },
  author: { type: String, default: 'Admin Yi Guitar' },
  isFeatured: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
