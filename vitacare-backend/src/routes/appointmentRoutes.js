const express = require('express');
const {
  getAppointments,
  getAppointment,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getAppointments)
  .post(bookAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(cancelAppointment);

router.route('/doctor/:doctorId/slots')
  .get(getAvailableSlots);

module.exports = router;
