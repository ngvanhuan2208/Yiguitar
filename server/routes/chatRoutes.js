const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/conversations', protect, isAdmin, chatController.getConversations);
router.get('/:userId', protect, chatController.getChatHistory);
router.put('/read/:userId', protect, isAdmin, chatController.markAsRead);

module.exports = router;
