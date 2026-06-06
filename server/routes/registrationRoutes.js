const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', registrationController.submitRegistration);
router.get('/', protect, isAdmin, registrationController.getRegistrations);
router.patch('/:id', protect, isAdmin, registrationController.updateRegistrationStatus);
router.delete('/:id', protect, isAdmin, registrationController.deleteRegistration);

module.exports = router;
