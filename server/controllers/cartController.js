const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items });
    else { cart.items = items; cart.updatedAt = Date.now(); }
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
