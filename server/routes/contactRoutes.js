const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', contactController.submitContact);
router.get('/', protect, isAdmin, contactController.getContacts);
router.delete('/:id', protect, isAdmin, contactController.deleteContact);

module.exports = router;
