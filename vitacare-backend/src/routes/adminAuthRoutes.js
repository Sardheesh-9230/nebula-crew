const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin,
  updatePassword
} = require('../controllers/adminAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Auth routes
router.post('/register', registerAdmin); // Should be protected with super admin middleware in production
router.post('/login', loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

module.exports = router;
