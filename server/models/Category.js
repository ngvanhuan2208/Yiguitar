const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'Guitar', 'Accessory', etc.
  subCategories: [{ type: String }] // ['Acoustic', 'Classic'] or ['Capo', 'Strings']
});

module.exports = mongoose.model('Category', categorySchema);
