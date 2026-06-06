const express = require('express');
const router = express.Router();
const tabController = require('../controllers/tabController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

const downloadLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 3, message: { message: 'Tải quá nhanh!' } });

router.get('/', tabController.getTabs);
router.get('/:id', tabController.getTabById);
router.post('/:id/download', downloadLimiter, tabController.downloadTab);
router.post('/', protect, isAdmin, tabController.createTab);
router.put('/:id', protect, isAdmin, tabController.updateTab);
router.delete('/:id', protect, isAdmin, tabController.deleteTab);

module.exports = router;
