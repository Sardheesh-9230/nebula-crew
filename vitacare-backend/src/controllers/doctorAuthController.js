const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'doctor' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id, role: 'doctor' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '90d'
  });
};

// @desc    Register new doctor
// @route   POST /api/v1/auth/doctor/register
// @access  Public (or Admin only in production)
exports.registerDoctor = async (req, res, next) => {
  try {
    const { 
      userId,
      email, 
      password, 
      firstName, 
      lastName,
      mobileNumber,
      registrationNumber,
      specialization,
      qualifications,
      experience
    } = req.body;

    // Validate required fields
    if (!userId || !email || !password || !firstName || !lastName || !mobileNumber || !registrationNumber || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [{ email }, { userId }, { registrationNumber }] 
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already exists with provided email, userId, or registration number'
      });
    }

    // Create doctor
    const doctor = await Doctor.create({
      userId,
      email,
      password,
      profile: {
        firstName,
        lastName,
        mobileNumber
      },
      registrationNumber,
      specialization: Array.isArray(specialization) ? specialization : [specialization],
      qualifications: qualifications || [],
      experience: experience || 0
    });

    // Generate tokens
    const token = generateToken(doctor._id);
    const refreshToken = generateRefreshToken(doctor._id);

    // Save refresh token to doctor
    doctor.refreshToken = refreshToken;
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: {
        user: {
          id: doctor._id,
          userId: doctor.userId,
          email: doctor.email,
          role: doctor.role,
          profile: doctor.profile,
          specialization: doctor.specialization
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering doctor',
      error: error.message
    });
  }
};

// @desc    Login doctor
// @route   POST /api/v1/auth/doctor/login
// @access  Public
exports.loginDoctor = async (req, res, next) => {
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

    // Check for doctor by email or userId
    const doctor = await Doctor.findOne({ 
      $or: [{ email: loginIdentifier }, { userId: loginIdentifier }] 
    }).select('+password');

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await doctor.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if doctor is active
    if (!doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    doctor.lastLogin = Date.now();

    // Generate tokens
    const token = generateToken(doctor._id);
    const refreshToken = generateRefreshToken(doctor._id);

    // Save refresh token
    doctor.refreshToken = refreshToken;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: doctor._id,
          userId: doctor.userId,
          email: doctor.email,
          role: doctor.role,
          profile: doctor.profile,
          specialization: doctor.specialization
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in doctor
// @route   GET /api/v1/auth/doctor/me
// @access  Private
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user._id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Logout doctor
// @route   POST /api/v1/auth/doctor/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    
    if (doctor) {
      doctor.refreshToken = null;
      await doctor.save();
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
// @route   POST /api/v1/auth/doctor/refresh-token
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

    // Find doctor
    const doctor = await Doctor.findById(decoded.id);

    if (!doctor || doctor.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newToken = generateToken(doctor._id);

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
