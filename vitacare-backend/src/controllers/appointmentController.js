const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get user appointments
// @route   GET /api/v1/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
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

    const appointments = await Appointment.find(query)
      .populate('patientId', 'healthId profile.firstName profile.lastName mobileNumber')
      .populate('doctorId', 'userId registrationNumber specialization consultationFee')
      .populate('hospitalId', 'name address contactInfo')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
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
    const appointmentData = {
      patientId: req.user._id,
      doctorId: req.body.doctorId,
      hospitalId: req.body.hospitalId,
      appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot,
      type: req.body.type || 'in-person',
      reason: req.body.reason,
      symptoms: req.body.symptoms,
      consultationFee: req.body.consultationFee
    };

    // Check if slot is available (simplified check)
    const existingAppointment = await Appointment.findOne({
      doctorId: appointmentData.doctorId,
      appointmentDate: appointmentData.appointmentDate,
      'timeSlot.start': appointmentData.timeSlot.start,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is not available'
      });
    }

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
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
      status: { $in: ['scheduled', 'confirmed'] }
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
