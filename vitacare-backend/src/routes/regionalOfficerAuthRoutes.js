const express = require('express');
const {
  registerRegionalOfficer,
  loginRegionalOfficer,
  getRegionalOfficerProfile,
  logout,
  refreshToken
} = require('../controllers/regionalOfficerAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerRegionalOfficer);
router.post('/login', loginRegionalOfficer);
router.get('/me', protect, getRegionalOfficerProfile);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
