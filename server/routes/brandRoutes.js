const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', brandController.getBrands);
router.post('/', protect, isAdmin, brandController.createBrand);
router.put('/:id', protect, isAdmin, brandController.updateBrand);
router.delete('/:id', protect, isAdmin, brandController.deleteBrand);

module.exports = router;
