const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const StateHealthOfficer = require('../models/StateHealthOfficer');
const RegionalHealthOfficer = require('../models/RegionalHealthOfficer');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Determine which model to use based on role in token
    let user;
    const role = decoded.role;

    if (role === 'doctor') {
      user = await Doctor.findById(decoded.id).select('-password');
    } else if (role === 'state-officer') {
      user = await StateHealthOfficer.findById(decoded.id).select('-password');
    } else if (role === 'regional-officer') {
      user = await RegionalHealthOfficer.findById(decoded.id).select('-password');
    } else {
      // Default to User (patient) model
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = user;
    req.userRole = role || user.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
