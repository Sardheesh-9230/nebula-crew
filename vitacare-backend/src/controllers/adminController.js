const Doctor = require('../models/Doctor');
const StateHealthOfficer = require('../models/StateHealthOfficer');
const RegionalHealthOfficer = require('../models/RegionalHealthOfficer');

// ==================== DOCTOR MANAGEMENT ====================

// @desc    Get all doctors
// @route   GET /api/v1/admin/doctors
// @access  Private/Admin
exports.getAllDoctors = async (req, res, next) => {
  try {
    const { status, specialization, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.verificationStatus = status;
    if (specialization) query.specialization = specialization;

    const doctors = await Doctor.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register doctor (Admin only)
// @route   POST /api/v1/admin/doctors
// @access  Private/Admin
exports.registerDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      registrationNumber,
      specialization,
      qualifications,
      experience,
      hospitalName,
      contactNumber
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { registrationNumber }]
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or registration number already exists'
      });
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      registrationNumber,
      specialization,
      qualifications: qualifications || [],
      experience: experience || 0,
      hospitalName,
      contactNumber,
      verificationStatus: 'verified', // Admin-registered doctors are auto-verified
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        registrationNumber: doctor.registrationNumber,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor
// @route   PUT /api/v1/admin/doctors/:id
// @access  Private/Admin
exports.updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor
// @route   DELETE /api/v1/admin/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== STATE HEALTH OFFICER MANAGEMENT ====================

// @desc    Get all state health officers
// @route   GET /api/v1/admin/state-officers
// @access  Private/Admin
exports.getAllStateOfficers = async (req, res, next) => {
  try {
    const { state, status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (state) query.state = state;
    if (status) query.verificationStatus = status;

    const officers = await StateHealthOfficer.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await StateHealthOfficer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: officers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: officers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register state health officer (Admin only)
// @route   POST /api/v1/admin/state-officers
// @access  Private/Admin
exports.registerStateOfficer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      state,
      designation,
      department,
      contactNumber
    } = req.body;

    // Check if officer already exists
    const existingOfficer = await StateHealthOfficer.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingOfficer) {
      return res.status(400).json({
        success: false,
        message: 'State Health Officer with this email or employee ID already exists'
      });
    }

    // Create officer
    const officer = await StateHealthOfficer.create({
      name,
      email,
      password,
      employeeId,
      state,
      designation,
      department,
      contactNumber,
      verificationStatus: 'verified', // Admin-registered officers are auto-verified
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'State Health Officer registered successfully',
      data: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        employeeId: officer.employeeId,
        state: officer.state
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update state health officer
// @route   PUT /api/v1/admin/state-officers/:id
// @access  Private/Admin
exports.updateStateOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password;

    const officer = await StateHealthOfficer.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: 'State Health Officer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'State Health Officer updated successfully',
      data: officer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete state health officer
// @route   DELETE /api/v1/admin/state-officers/:id
// @access  Private/Admin
exports.deleteStateOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const officer = await StateHealthOfficer.findByIdAndDelete(id);

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: 'State Health Officer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'State Health Officer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REGIONAL HEALTH OFFICER MANAGEMENT ====================

// @desc    Get all regional health officers
// @route   GET /api/v1/admin/regional-officers
// @access  Private/Admin
exports.getAllRegionalOfficers = async (req, res, next) => {
  try {
    const { region, status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (region) query.region = region;
    if (status) query.verificationStatus = status;

    const officers = await RegionalHealthOfficer.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await RegionalHealthOfficer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: officers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: officers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register regional health officer (Admin only)
// @route   POST /api/v1/admin/regional-officers
// @access  Private/Admin
exports.registerRegionalOfficer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      region,
      designation,
      department,
      contactNumber
    } = req.body;

    // Check if officer already exists
    const existingOfficer = await RegionalHealthOfficer.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingOfficer) {
      return res.status(400).json({
        success: false,
        message: 'Regional Health Officer with this email or employee ID already exists'
      });
    }

    // Create officer
    const officer = await RegionalHealthOfficer.create({
      name,
      email,
      password,
      employeeId,
      region,
      designation,
      department,
      contactNumber,
      verificationStatus: 'verified', // Admin-registered officers are auto-verified
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Regional Health Officer registered successfully',
      data: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        employeeId: officer.employeeId,
        region: officer.region
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update regional health officer
// @route   PUT /api/v1/admin/regional-officers/:id
// @access  Private/Admin
exports.updateRegionalOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password;

    const officer = await RegionalHealthOfficer.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: 'Regional Health Officer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Regional Health Officer updated successfully',
      data: officer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete regional health officer
// @route   DELETE /api/v1/admin/regional-officers/:id
// @access  Private/Admin
exports.deleteRegionalOfficer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const officer = await RegionalHealthOfficer.findByIdAndDelete(id);

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: 'Regional Health Officer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Regional Health Officer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DASHBOARD STATISTICS ====================

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/statistics
// @access  Private/Admin
exports.getDashboardStatistics = async (req, res, next) => {
  try {
    const [
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      totalStateOfficers,
      totalRegionalOfficers
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ verificationStatus: 'verified' }),
      Doctor.countDocuments({ verificationStatus: 'pending' }),
      StateHealthOfficer.countDocuments(),
      RegionalHealthOfficer.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        doctors: {
          total: totalDoctors,
          verified: verifiedDoctors,
          pending: pendingDoctors
        },
        stateOfficers: {
          total: totalStateOfficers
        },
        regionalOfficers: {
          total: totalRegionalOfficers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
