const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/warranty-lookup', orderController.warrantyLookup);
router.post('/', protect, orderController.createOrder);
router.get('/', protect, isAdmin, orderController.getOrders);
router.get('/my-orders', protect, orderController.getMyOrders);
router.put('/:id', protect, isAdmin, orderController.updateOrder);
router.get('/revenue-stats', protect, isAdmin, orderController.getRevenueStats);

module.exports = router;
