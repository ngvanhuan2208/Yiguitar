const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProductReviews = async (req, res) => {
  try {
    res.json(await Review.find({ product: req.params.id }).populate('user', 'name avatar').sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (await Review.findOne({ user: req.user._id, product: productId })) return res.status(400).json({ message: 'Đã đánh giá rồi!' });
    
    // Check if the user has purchased this product and the order is completed
    const hasPurchased = await Order.findOne({
      userId: req.user._id,
      status: 'Hoàn thành',
      'items.productId': productId
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Bạn cần mua và nhận sản phẩm này để có thể đánh giá.' });
    }
    
    const review = await new Review({ user: req.user._id, product: productId, rating, comment }).save();
    
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviews: reviews.length });
    
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
