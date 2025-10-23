const Notification = require('../models/Notification');

// @desc    Get all notifications for user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, isRead } = req.query;
    
    const query = { user: req.user._id };
    
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        notifications,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notifications count
// @route   GET /api/v1/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    
    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.markAsRead();
    
    res.status(200).json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.markAllAsRead(req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notification (Admin/System)
// @route   POST /api/v1/notifications
// @access  Private/Admin
exports.createNotification = async (req, res, next) => {
  try {
    const { userId, type, severity, title, message, data, actionUrl, metadata } = req.body;
    
    const notification = await Notification.create({
      user: userId,
      type,
      severity,
      title,
      message,
      data,
      actionUrl,
      metadata,
      sentVia: ['app']
    });
    
    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('notification', notification);
    }
    
    res.status(201).json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast proximity alert (Admin only)
// @route   POST /api/v1/notifications/proximity-alert
// @access  Private/Admin
exports.broadcastProximityAlert = async (req, res, next) => {
  try {
    const { location, radius, diseaseType, severity, title, message } = req.body;
    
    // Find users within radius (simplified - in production use proper geospatial query)
    const User = require('../models/User');
    const users = await User.find({
      'profile.address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          $maxDistance: radius * 1000 // convert km to meters
        }
      }
    });
    
    // Create notifications for all affected users
    const notifications = await Promise.all(
      users.map(user => 
        Notification.create({
          user: user._id,
          type: 'proximity_infection',
          severity,
          title,
          message,
          metadata: {
            diseaseType,
            location,
            radius,
            affectedCount: users.length
          },
          sentVia: ['app', 'sms']
        })
      )
    );
    
    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      notifications.forEach((notification, index) => {
        io.to(users[index]._id.toString()).emit('notification', notification);
      });
    }
    
    res.status(201).json({
      success: true,
      message: `Alert sent to ${users.length} users`,
      data: { affectedUsers: users.length }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
