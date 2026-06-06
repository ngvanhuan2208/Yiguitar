const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', protect, isAdmin, productController.createProduct);
router.put('/:id', protect, isAdmin, productController.updateProduct);
router.delete('/:id', protect, isAdmin, productController.deleteProduct);
router.patch('/:id/feature', protect, isAdmin, productController.toggleFeatured);

module.exports = router;
