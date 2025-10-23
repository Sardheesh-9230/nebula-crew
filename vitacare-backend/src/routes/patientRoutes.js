const express = require('express');
const router = express.Router();
const {
  searchHospitals,
  getHospitalDetails,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  submitFeedback,
  searchMedicalCamps
} = require('../controllers/patientController');

const { protect, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/hospitals/search', searchHospitals);
router.get('/hospital/:hospitalId', getHospitalDetails);
router.post('/camps/search', searchMedicalCamps);

// Protected routes (authentication required)
router.use(protect);

// Appointment management (Patient only)
router.post('/appointment/book', authorize('patient'), bookAppointment);
router.get('/appointments', authorize('patient'), getPatientAppointments);
router.put('/appointment/:appointmentId/cancel', authorize('patient'), cancelAppointment);
router.put('/appointment/:appointmentId/feedback', authorize('patient'), submitFeedback);

module.exports = router;