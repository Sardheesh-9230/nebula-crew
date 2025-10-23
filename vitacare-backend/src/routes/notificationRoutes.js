const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  broadcastProximityAlert
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.route('/')
  .get(getNotifications)
  .post(createNotification); // Admin only - add admin middleware if needed

router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/proximity-alert', broadcastProximityAlert); // Add admin middleware

module.exports = router;
