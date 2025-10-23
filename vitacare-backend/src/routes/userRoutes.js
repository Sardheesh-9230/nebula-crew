const express = require('express');
const {
  getProfile,
  updateProfile,
  addEmergencyContact,
  removeEmergencyContact
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/emergency-contact')
  .post(addEmergencyContact);

router.route('/emergency-contact/:id')
  .delete(removeEmergencyContact);

module.exports = router;
