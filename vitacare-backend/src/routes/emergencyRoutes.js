const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  triggerSOS,
  getEmergencyContacts,
  addEmergencyContact,
  deleteEmergencyContact
} = require('../controllers/emergencyController');

// All routes require authentication
router.use(protect);

// Emergency SOS
router.post('/sos', triggerSOS);

// Emergency Contacts
router.get('/contacts', getEmergencyContacts);
router.post('/contacts', addEmergencyContact);
router.delete('/contacts/:contactId', deleteEmergencyContact);

module.exports = router;
