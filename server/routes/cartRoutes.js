const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, cartController.getCart);
router.post('/sync', protect, cartController.syncCart);

module.exports = router;
