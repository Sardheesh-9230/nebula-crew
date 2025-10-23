const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Register as doctor
// @route   POST /api/doctors/register
// @access  Private
const registerDoctor = async (req, res) => {
  try {
    const {
      registrationNumber,
      specialization,
      qualifications,
      experience,
      hospitals,
      consultationFee,
      availableSlots,
      languages,
      telemedicineEnabled
    } = req.body;

    // Check if user already has a doctor profile
    const existingDoctor = await Doctor.findOne({ userId: req.user._id });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists for this user'
      });
    }

    // Check if registration number is unique
    const duplicateReg = await Doctor.findOne({ registrationNumber });
    if (duplicateReg) {
      return res.status(400).json({
        success: false,
        message: 'Registration number already in use'
      });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: req.user._id,
      registrationNumber,
      specialization,
      qualifications,
      experience,
      hospitals,
      consultationFee,
      availableSlots,
      languages,
      telemedicineEnabled
    });

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });

    const populatedDoctor = await Doctor.findById(doctor._id).populate('userId', 'profile email mobileNumber healthId');

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: populatedDoctor
    });

  } catch (error) {
    console.error('Register doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register doctor',
      error: error.message
    });
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id })
      .populate('userId', 'profile email mobileNumber healthId')
      .populate('hospitals.hospitalId');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
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
      message: 'Failed to retrieve doctor profile',
      error: error.message
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private
const updateDoctorProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'specialization',
      'qualifications',
      'experience',
      'hospitals',
      'consultationFee',
      'availableSlots',
      'languages',
      'telemedicineEnabled'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'profile email mobileNumber healthId');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor
    });

  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile',
      error: error.message
    });
  }
};

// @desc    Search doctors
// @route   GET /api/doctors/search
// @access  Public
const searchDoctors = async (req, res) => {
  try {
    const { 
      specialization, 
      name, 
      hospital,
      minExperience,
      maxFee,
      telemedicine,
      page = 1, 
      limit = 10 
    } = req.query;

    const query = { isVerified: true };

    if (specialization) {
      query.specialization = { $in: [specialization] };
    }

    if (minExperience) {
      query.experience = { $gte: parseInt(minExperience) };
    }

    if (maxFee) {
      query.consultationFee = { $lte: parseInt(maxFee) };
    }

    if (telemedicine === 'true') {
      query.telemedicineEnabled = true;
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'profile email mobileNumber')
      .populate('hospitals.hospitalId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, totalReviews: -1 });

    // Filter by name if provided (on populated data)
    let filteredDoctors = doctors;
    if (name) {
      const searchTerm = name.toLowerCase();
      filteredDoctors = doctors.filter(doc => 
        `${doc.userId.profile.firstName} ${doc.userId.profile.lastName}`.toLowerCase().includes(searchTerm)
      );
    }

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        doctors: filteredDoctors,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search doctors',
      error: error.message
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'profile email mobileNumber')
      .populate('hospitals.hospitalId');

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
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctor',
      error: error.message
    });
  }
};

// @desc    Search patients (for doctor use)
// @route   GET /api/doctors/patients/search
// @access  Private (Doctor only)
const searchPatients = async (req, res) => {
  try {
    // Verify user is a doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Doctor profile required.'
      });
    }

    const { query, searchBy = 'name' } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let searchQuery = {};

    switch(searchBy) {
      case 'healthId':
        searchQuery.healthId = query;
        break;
      case 'mobile':
        searchQuery.mobileNumber = query;
        break;
      case 'name':
      default:
        searchQuery.$or = [
          { 'profile.firstName': { $regex: query, $options: 'i' } },
          { 'profile.lastName': { $regex: query, $options: 'i' } }
        ];
    }

    const patients = await User.find(searchQuery)
      .select('healthId profile mobileNumber email allergies chronicConditions')
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        patients,
        total: patients.length
      }
    });

  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search patients',
      error: error.message
    });
  }
};

module.exports = {
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  searchDoctors,
  getDoctorById,
  searchPatients
};
