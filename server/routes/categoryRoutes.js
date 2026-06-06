const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', categoryController.getCategories);
router.post('/', protect, isAdmin, categoryController.createCategory);
router.put('/:id', protect, isAdmin, categoryController.updateCategory);
router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

router.post('/sub', protect, isAdmin, categoryController.addSubCategory);
router.delete('/sub', protect, isAdmin, categoryController.deleteSubCategory);

module.exports = router;
