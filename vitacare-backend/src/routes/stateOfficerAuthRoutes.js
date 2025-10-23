const express = require('express');
const {
  registerStateOfficer,
  loginStateOfficer,
  getStateOfficerProfile,
  logout,
  refreshToken
} = require('../controllers/stateOfficerAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerStateOfficer);
router.post('/login', loginStateOfficer);
router.get('/me', protect, getStateOfficerProfile);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
