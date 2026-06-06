const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', protect, isAdmin, articleController.createArticle);
router.put('/:id', protect, isAdmin, articleController.updateArticle);
router.delete('/:id', protect, isAdmin, articleController.deleteArticle);

module.exports = router;
