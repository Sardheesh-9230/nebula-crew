const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  searchDoctors,
  getDoctorById,
  searchPatients
} = require('../controllers/doctorController');

// Public routes
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/register', protect, registerDoctor);
router.get('/profile/me', protect, getDoctorProfile);
router.put('/profile', protect, updateDoctorProfile);
router.get('/patients/search', protect, searchPatients);

module.exports = router;
