const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Thống kê doanh thu (Gọi từ RevenueReport.jsx)
router.get('/revenue-stats', protect, isAdmin, orderController.getRevenueStats);

module.exports = router;
