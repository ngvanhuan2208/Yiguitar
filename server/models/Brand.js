const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  description: { type: String },
  mainCategory: { type: String, enum: ['Guitar', 'Accessory', 'Course', 'Tab'] }, // Taxonomy
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', brandSchema);
