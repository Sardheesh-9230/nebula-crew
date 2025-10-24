const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get all medical records for user
// @route   GET /api/v1/records
// @access  Private
exports.getMedicalRecords = async (req, res, next) => {
  try {
    const { recordType, startDate, endDate } = req.query;
    
    let query = { healthId: req.user.healthId };

    if (recordType) {
      query.recordType = recordType;
    }

    if (startDate || endDate) {
      query['metadata.date'] = {};
      if (startDate) query['metadata.date'].$gte = new Date(startDate);
      if (endDate) query['metadata.date'].$lte = new Date(endDate);
    }

    const records = await MedicalRecord.find(query)
      .populate('metadata.doctorId', 'userId registrationNumber specialization')
      .populate('metadata.hospitalId', 'name address')
      .sort({ 'metadata.date': -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medical record
// @route   GET /api/v1/records/:id
// @access  Private
exports.getMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('metadata.doctorId', 'userId registrationNumber specialization')
      .populate('metadata.hospitalId', 'name address');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check if user has access
    if (record.healthId !== req.user.healthId && 
        !record.consentedUsers.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this record'
      });
    }

    // Log access
    record.accessLog.push({
      accessedBy: req.user._id,
      accessedAt: Date.now(),
      purpose: 'View record'
    });
    await record.save();

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create medical record
// @route   POST /api/v1/records
// @access  Private (Doctor/Hospital)
exports.createMedicalRecord = async (req, res, next) => {
  try {
    const recordData = {
      healthId: req.body.healthId,
      recordType: req.body.recordType,
      metadata: req.body.metadata,
      prescriptions: req.body.prescriptions,
      labResults: req.body.labResults,
      isPrivate: req.body.isPrivate,
      tags: req.body.tags
    };

    const record = await MedicalRecord.create(recordData);

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medical record
// @route   PUT /api/v1/records/:id
// @access  Private (Doctor/Hospital)
exports.updateMedicalRecord = async (req, res, next) => {
  try {
    let record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grant access to medical record
// @route   POST /api/v1/records/consent
// @access  Private
exports.grantAccess = async (req, res, next) => {
  try {
    const { recordId, userId } = req.body;

    const record = await MedicalRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check if requesting user owns the record
    if (record.healthId !== req.user.healthId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to grant access to this record'
      });
    }

    // Add user to consented users if not already there
    if (!record.consentedUsers.includes(userId)) {
      record.consentedUsers.push(userId);
      await record.save();
    }

    res.status(200).json({
      success: true,
      message: 'Access granted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke access to medical record
// @route   DELETE /api/v1/records/consent/:userId
// @access  Private
exports.revokeAccess = async (req, res, next) => {
  try {
    const { recordId } = req.body;
    const { userId } = req.params;

    const record = await MedicalRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check if requesting user owns the record
    if (record.healthId !== req.user.healthId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to revoke access to this record'
      });
    }

    // Remove user from consented users
    record.consentedUsers = record.consentedUsers.filter(
      id => id.toString() !== userId
    );
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Access revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload medical record file
// @route   POST /api/v1/records/upload
// @access  Private
exports.uploadMedicalRecord = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title, description, recordType, date } = req.body;

    // Get user's healthId
    const healthId = req.user.healthId || req.user._id;

    // Create file URL
    const fileUrl = `/uploads/medical-records/${req.file.filename}`;

    // Create medical record with file information
    const recordData = {
      healthId: healthId,
      recordType: recordType || 'lab_report',
      metadata: {
        title: title || req.file.originalname,
        description: description || '',
        date: date ? new Date(date) : new Date(),
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      },
      isPrivate: true,
      tags: [recordType || 'lab_report']
    };

    const record = await MedicalRecord.create(recordData);

    res.status(201).json({
      success: true,
      message: 'Medical record uploaded successfully',
      data: record
    });
  } catch (error) {
    // If error occurs, delete the uploaded file
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../../uploads/medical-records', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};
