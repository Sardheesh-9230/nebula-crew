const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { 
      mobileNumber, 
      email, 
      password, 
      aadhaarNumber, 
      firstName, 
      lastName,
      bloodGroup,
      address,
      emergencyContact
    } = req.body;

    // Check registration time window (5:30 PM - 7:30 PM IST)
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const startTime = 17 * 60 + 30; // 5:30 PM
    const endTime = 19 * 60 + 30;   // 7:30 PM
    
    if (currentTime < startTime || currentTime > endTime) {
      return res.status(403).json({
        success: false,
        message: 'Patient registration is only allowed between 5:30 PM and 7:30 PM',
        registrationHours: '5:30 PM - 7:30 PM'
      });
    }

    // Validate required fields
    if (!aadhaarNumber || !firstName || !lastName || !mobileNumber || !bloodGroup || !emergencyContact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Aadhaar number, name, phone number, blood group, address, and emergency contact'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ mobileNumber }, { email }, { aadhaarNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with provided mobile, email or Aadhaar'
      });
    }

    // Generate UHI (Universal Health Identity) in format: FIRSTNAME1234
    const healthId = User.generateUHI(firstName, aadhaarNumber);

    // Create user with all patient registration fields
    const user = await User.create({
      healthId,
      mobileNumber,
      email,
      password,
      aadhaarNumber,
      profile: {
        firstName,
        lastName,
        bloodGroup,
        address: address || {}
      },
      emergencyContacts: emergencyContact ? [{
        name: emergencyContact.name,
        relationship: emergencyContact.relationship,
        mobile: emergencyContact.mobile
      }] : []
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        user: {
          id: user._id,
          healthId: user.healthId,
          mobileNumber: user.mobileNumber,
          email: user.email,
          role: user.role,
          profile: user.profile,
          emergencyContacts: user.emergencyContacts
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { mobileNumber, password, uhi } = req.body;
    const loginIdentifier = uhi || mobileNumber;

    // Validate input
    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide UHI/mobile number and password'
      });
    }

    // Check for user by UHI (healthId) or mobile number
    const user = await User.findOne({ 
      $or: [{ healthId: loginIdentifier }, { mobileNumber: loginIdentifier }] 
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          healthId: user.healthId,
          mobileNumber: user.mobileNumber,
          email: user.email,
          role: user.role,
          profile: user.profile
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Clear refresh token
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};
