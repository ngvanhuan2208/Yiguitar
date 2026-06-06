const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String }, // Optional but needed for confirmation
    phone: { type: String, required: true },
    address: { type: String },
    note: { type: String }
  },
  adminNote: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Chờ thanh toán', 'Chờ tư vấn', 'Đang xử lý', 'Đã thanh toán', 'Đang giao', 'Hoàn thành', 'Đã hủy'], 
    default: 'Chờ tư vấn' 
  },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
