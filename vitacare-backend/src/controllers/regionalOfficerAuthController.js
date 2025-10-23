const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const RegionalHealthOfficer = require('../models/RegionalHealthOfficer');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'regional-officer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id, role: 'regional-officer' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '90d'
  });
};

// @desc    Register new regional health officer
// @route   POST /api/v1/auth/regional-officer/register
// @access  Public (or Admin only in production)
exports.registerRegionalOfficer = async (req, res, next) => {
  try {
    const { 
      userId,
      email, 
      password, 
      firstName, 
      lastName,
      mobileNumber,
      employeeId,
      designation,
      region,
      districts,
      state
    } = req.body;

    // Validate required fields
    if (!userId || !email || !password || !firstName || !lastName || !mobileNumber || !employeeId || !region) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if officer already exists
    const existingOfficer = await RegionalHealthOfficer.findOne({ 
      $or: [{ email }, { userId }, { 'officialDetails.employeeId': employeeId }] 
    });

    if (existingOfficer) {
      return res.status(400).json({
        success: false,
        message: 'Regional health officer already exists with provided email, userId, or employee ID'
      });
    }

    // Create regional health officer
    const officer = await RegionalHealthOfficer.create({
      userId,
      email,
      password,
      profile: {
        firstName,
        lastName,
        mobileNumber
      },
      officialDetails: {
        employeeId,
        designation: designation || 'Regional Health Officer'
      },
      jurisdiction: {
        region,
        districts: districts || [],
        state: state || ''
      }
    });

    // Generate tokens
    const token = generateToken(officer._id);
    const refreshToken = generateRefreshToken(officer._id);

    // Save refresh token
    officer.refreshToken = refreshToken;
    await officer.save();

    res.status(201).json({
      success: true,
      message: 'Regional health officer registered successfully',
      data: {
        user: {
          id: officer._id,
          userId: officer.userId,
          email: officer.email,
          role: officer.role,
          profile: officer.profile,
          jurisdiction: officer.jurisdiction
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Regional officer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering regional health officer',
      error: error.message
    });
  }
};

// @desc    Login regional health officer
// @route   POST /api/v1/auth/regional-officer/login
// @access  Public
exports.loginRegionalOfficer = async (req, res, next) => {
  try {
    const { email, userId, password } = req.body;
    const loginIdentifier = email || userId;

    // Validate input
    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/userId and password'
      });
    }

    // Check for officer
    const officer = await RegionalHealthOfficer.findOne({ 
      $or: [{ email: loginIdentifier }, { userId: loginIdentifier }] 
    }).select('+password');

    if (!officer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await officer.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if officer is active
    if (!officer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    officer.lastLogin = Date.now();

    // Generate tokens
    const token = generateToken(officer._id);
    const refreshToken = generateRefreshToken(officer._id);

    // Save refresh token
    officer.refreshToken = refreshToken;
    await officer.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: officer._id,
          userId: officer.userId,
          email: officer.email,
          role: officer.role,
          profile: officer.profile,
          jurisdiction: officer.jurisdiction
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Regional officer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in regional health officer
// @route   GET /api/v1/auth/regional-officer/me
// @access  Private
exports.getRegionalOfficerProfile = async (req, res, next) => {
  try {
    const officer = await RegionalHealthOfficer.findById(req.user._id);

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: 'Regional health officer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: officer
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Logout regional health officer
// @route   POST /api/v1/auth/regional-officer/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const officer = await RegionalHealthOfficer.findById(req.user._id);
    
    if (officer) {
      officer.refreshToken = null;
      await officer.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/regional-officer/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find officer
    const officer = await RegionalHealthOfficer.findById(decoded.id);

    if (!officer || officer.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newToken = generateToken(officer._id);

    res.status(200).json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      error: error.message
    });
  }
};
