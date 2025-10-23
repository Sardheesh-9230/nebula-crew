const express = require('express');
const {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  logout,
  refreshToken
} = require('../controllers/doctorAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/me', protect, getDoctorProfile);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
