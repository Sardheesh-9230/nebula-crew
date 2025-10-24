const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get user appointments
// @route   GET /api/v1/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    console.log('=== GET APPOINTMENTS ===');
    console.log('User:', req.user._id, 'Role:', req.user.role);
    console.log('Query params:', req.query);
    
    const { status, startDate, endDate } = req.query;
    
    let query = {};

    // If user is a citizen, get their appointments
    if (req.user.role === 'citizen') {
      query.patientId = req.user._id;
    } 
    // If user is a doctor, get appointments for them
    else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        query.doctorId = doctor._id;
      }
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    const appointments = await Appointment.find(query)
      .populate('patientId', 'healthId profile.firstName profile.lastName mobileNumber')
      .populate('doctorId', 'userId registrationNumber specialization consultationFee')
      .populate('hospitalId', 'name address contactInfo')
      .sort({ appointmentDate: -1 });

    console.log('Found appointments:', appointments.length);
    console.log('Appointments:', JSON.stringify(appointments, null, 2));

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    next(error);
  }
};

// @desc    Get single appointment
// @route   GET /api/v1/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'healthId profile mobileNumber')
      .populate('doctorId')
      .populate('hospitalId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book new appointment
// @route   POST /api/v1/appointments
// @access  Private
exports.bookAppointment = async (req, res, next) => {
  try {
    console.log('=== BOOKING APPOINTMENT ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user._id);
    
    // Validate required fields
    if (!req.body.appointmentDate || !req.body.timeSlot) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Appointment date and time slot are required'
      });
    }

    // Validate timeSlot structure
    if (!req.body.timeSlot.start || !req.body.timeSlot.end) {
      console.log('Invalid timeSlot structure:', req.body.timeSlot);
      return res.status(400).json({
        success: false,
        message: 'Time slot must have start and end times'
      });
    }

    const appointmentData = {
      patientId: req.user._id,
      appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot,
      type: req.body.type || 'in-person',
      reason: req.body.reason || 'General consultation',
      symptoms: req.body.symptoms || [],
      consultationFee: req.body.consultationFee || 500
    };

    // Add doctorId and hospitalId only if they are valid MongoDB ObjectIds
    const mongoose = require('mongoose');
    if (req.body.doctorId && mongoose.Types.ObjectId.isValid(req.body.doctorId)) {
      appointmentData.doctorId = req.body.doctorId;
    }
    if (req.body.hospitalId && mongoose.Types.ObjectId.isValid(req.body.hospitalId)) {
      appointmentData.hospitalId = req.body.hospitalId;
    }

    console.log('Processed appointment data:', JSON.stringify(appointmentData, null, 2));

    // Check if slot is available only if doctorId is provided
    if (appointmentData.doctorId) {
      const existingAppointment = await Appointment.findOne({
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        'timeSlot.start': appointmentData.timeSlot.start,
        status: { $in: ['pending', 'scheduled', 'confirmed'] }
      });

      if (existingAppointment) {
        console.log('Time slot already booked or pending');
        return res.status(400).json({
          success: false,
          message: 'This time slot is not available'
        });
      }
    }

    const appointment = await Appointment.create(appointmentData);
    console.log('Appointment created successfully:', appointment);

    // Send notification to doctor if doctorId is provided
    if (appointmentData.doctorId) {
      try {
        const doctor = await Doctor.findById(appointmentData.doctorId).populate('userId');
        if (doctor && doctor.userId) {
          const patient = await User.findById(req.user._id);
          const patientName = patient.profile?.firstName 
            ? `${patient.profile.firstName} ${patient.profile.lastName || ''}`
            : patient.healthId || 'A patient';

          await Notification.create({
            user: doctor.userId._id,
            type: 'appointment',
            severity: 'high',
            title: '🩺 New Appointment Request',
            message: `${patientName} has requested an appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.timeSlot.start}. Please review and approve or reject.`,
            data: {
              appointmentId: appointment._id,
              patientId: req.user._id,
              patientName: patientName,
              appointmentDate: appointment.appointmentDate,
              timeSlot: appointment.timeSlot,
              reason: appointment.reason
            },
            actionUrl: `/appointments/${appointment._id}`,
            sentVia: ['app']
          });
          console.log('Notification sent to doctor:', doctor.userId._id);
        }
      } catch (notifError) {
        console.error('Error sending notification to doctor:', notifError);
        // Don't fail the appointment booking if notification fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Appointment request sent successfully. Waiting for doctor approval.',
      data: appointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/v1/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available slots for a doctor
// @route   GET /api/v1/appointments/doctor/:doctorId/slots
// @access  Private
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.doctorId;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get all booked appointments for the doctor on the specified date
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: new Date(date),
      status: { $in: ['pending', 'scheduled', 'confirmed'] }
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot.start);

    res.status(200).json({
      success: true,
      data: {
        availableSlots: doctor.availableSlots,
        bookedSlots,
        date
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve appointment (Doctor only)
// @route   PUT /api/v1/appointments/:id/approve
// @access  Private (Doctor)
exports.approveAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the appointment is for this doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this appointment'
      });
    }

    // Check if appointment is in pending status
    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve appointment with status: ${appointment.status}`
      });
    }

    // Update appointment status to confirmed
    appointment.status = 'confirmed';
    await appointment.save();

    // Send notification to patient
    try {
      const patient = await User.findById(appointment.patientId);
      const doctorUser = await User.findById(req.user._id);
      const doctorName = doctorUser.profile?.firstName 
        ? `Dr. ${doctorUser.profile.firstName} ${doctorUser.profile.lastName || ''}`
        : `Dr. ${doctor.registrationNumber}`;

      await Notification.create({
        user: appointment.patientId,
        type: 'appointment',
        severity: 'high',
        title: '✅ Appointment Confirmed',
        message: `Your appointment with ${doctorName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.timeSlot.start} has been confirmed.`,
        data: {
          appointmentId: appointment._id,
          doctorId: doctor._id,
          doctorName: doctorName,
          appointmentDate: appointment.appointmentDate,
          timeSlot: appointment.timeSlot,
          status: 'confirmed'
        },
        actionUrl: `/appointments/${appointment._id}`,
        sentVia: ['app']
      });
    } catch (notifError) {
      console.error('Error sending notification to patient:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment approved successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject appointment (Doctor only)
// @route   PUT /api/v1/appointments/:id/reject
// @access  Private (Doctor)
exports.rejectAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the appointment is for this doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this appointment'
      });
    }

    // Check if appointment is in pending status
    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject appointment with status: ${appointment.status}`
      });
    }

    // Update appointment status to rejected
    appointment.status = 'rejected';
    appointment.cancellationReason = req.body.reason || 'Rejected by doctor';
    await appointment.save();

    // Send notification to patient
    try {
      const patient = await User.findById(appointment.patientId);
      const doctorUser = await User.findById(req.user._id);
      const doctorName = doctorUser.profile?.firstName 
        ? `Dr. ${doctorUser.profile.firstName} ${doctorUser.profile.lastName || ''}`
        : `Dr. ${doctor.registrationNumber}`;

      await Notification.create({
        user: appointment.patientId,
        type: 'appointment',
        severity: 'medium',
        title: '❌ Appointment Not Approved',
        message: `Your appointment request with ${doctorName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.timeSlot.start} was not approved. ${appointment.cancellationReason}`,
        data: {
          appointmentId: appointment._id,
          doctorId: doctor._id,
          doctorName: doctorName,
          appointmentDate: appointment.appointmentDate,
          timeSlot: appointment.timeSlot,
          status: 'rejected',
          reason: appointment.cancellationReason
        },
        actionUrl: '/appointments',
        sentVia: ['app']
      });
    } catch (notifError) {
      console.error('Error sending notification to patient:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment rejected successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

