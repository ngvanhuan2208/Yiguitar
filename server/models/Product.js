const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  category: { type: String, required: true }, // 'Guitar', 'Accessory', etc.
  type: { type: String }, // 'Acoustic', 'Classic', 'Electric', 'Strings', etc.
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  description: { type: String }, // For detailed product intro
  videoId: { type: String },     // YouTube video ID for sound test
  instructor: { type: String }, // For Courses
  level: { type: String },      // 'Cơ bản', 'Nâng cao', etc.
  artist: { type: String },      // For Tabs
  tabimage: { type: String },    // For Tabs (Full image URL)
  stock: { type: Number, default: 0 },
  warranty: { type: String, default: '12 Tháng' },
  createdAt: { type: Date, default: Date.now },
});

productSchema.index({ category: 1, brand: 1 });

module.exports = mongoose.model('Product', productSchema);
