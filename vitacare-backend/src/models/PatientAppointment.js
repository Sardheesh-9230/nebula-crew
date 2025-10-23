const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const patientAppointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  patient_id: {
    type: String,
    required: true,
    index: true
  },
  patient_info: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[\+]?[1-9][\d]{0,15}$/
    },
    email: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    address: {
      street: String,
      district: String,
      state: String,
      pincode: String
    }
  },
  hospital_id: {
    type: String,
    required: true,
    index: true
  },
  hospital_name: {
    type: String,
    required: true
  },
  rho_id: {
    type: String,
    ref: 'RegionalHealthOfficer',
    required: true,
    index: true
  },
  rho_name: {
    type: String,
    required: true
  },
  appointment_details: {
    doctor_id: String,
    doctor_name: String,
    department: String,
    specialization: String,
    appointment_date: {
      type: Date,
      required: true,
      index: true
    },
    appointment_time: {
      type: String,
      required: true
    },
    estimated_duration: {
      type: Number, // in minutes
      default: 30
    },
    consultation_type: {
      type: String,
      enum: ['general', 'specialist', 'emergency', 'follow_up', 'procedure'],
      default: 'general'
    }
  },
  service_details: {
    service_type: {
      type: String,
      required: true
    },
    service_category: {
      type: String,
      enum: ['consultation', 'diagnostic', 'treatment', 'surgery', 'emergency']
    },
    estimated_cost: {
      type: Number,
      default: 0
    },
    insurance_applicable: {
      type: Boolean,
      default: false
    },
    insurance_details: {
      provider: String,
      policy_number: String,
      coverage_percentage: Number
    }
  },
  booking_info: {
    booking_source: {
      type: String,
      enum: ['mobile_app', 'web', 'phone', 'walk_in', 'referral'],
      default: 'mobile_app'
    },
    booking_agent: String, // Staff member who booked if not self-booking
    priority_level: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      default: 'routine'
    },
    special_requirements: String,
    preferred_language: {
      type: String,
      default: 'Tamil'
    }
  },
  status_tracking: {
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled'
    },
    confirmation_date: Date,
    check_in_time: Date,
    consultation_start_time: Date,
    consultation_end_time: Date,
    cancellation_reason: String,
    cancelled_by: {
      type: String,
      enum: ['patient', 'hospital', 'doctor', 'system']
    }
  },
  token_info: {
    token_number: String,
    queue_position: Number,
    estimated_wait_time: Number, // in minutes
    current_token_being_served: String
  },
  reminder_notifications: [{
    notification_type: {
      type: String,
      enum: ['sms', 'email', 'push', 'call']
    },
    sent_at: Date,
    content: String,
    delivery_status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    }
  }],
  payment_info: {
    consultation_fee: Number,
    additional_charges: Number,
    total_amount: Number,
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'partially_paid', 'refunded'],
      default: 'pending'
    },
    payment_method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'insurance', 'free']
    },
    transaction_id: String,
    receipt_number: String
  },
  medical_notes: {
    chief_complaint: String,
    doctor_observations: String,
    diagnosis: String,
    prescribed_medicines: [{
      medicine_name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    prescribed_tests: [String],
    follow_up_required: {
      type: Boolean,
      default: false
    },
    next_appointment_date: Date,
    referral_to_specialist: {
      required: Boolean,
      specialist_type: String,
      hospital_referred: String,
      urgency: String
    }
  },
  feedback: {
    patient_rating: {
      type: Number,
      min: 1,
      max: 5
    },
    doctor_rating: {
      type: Number,
      min: 1,
      max: 5
    },
    hospital_rating: {
      type: Number,
      min: 1,
      max: 5
    },
    wait_time_rating: {
      type: Number,
      min: 1,
      max: 5
    },
    overall_experience: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    would_recommend: {
      type: Boolean,
      default: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'patient_appointments'
});

// Indexes for efficient queries
patientAppointmentSchema.index({ patient_id: 1, 'appointment_details.appointment_date': -1 });
patientAppointmentSchema.index({ hospital_id: 1, 'appointment_details.appointment_date': 1 });
patientAppointmentSchema.index({ rho_id: 1, 'status_tracking.status': 1 });
patientAppointmentSchema.index({ 'appointment_details.doctor_id': 1, 'appointment_details.appointment_date': 1 });
patientAppointmentSchema.index({ 'status_tracking.status': 1, 'booking_info.priority_level': 1 });

// Pre-save middleware
patientAppointmentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Method to confirm appointment
patientAppointmentSchema.methods.confirmAppointment = function() {
  this.status_tracking.status = 'confirmed';
  this.status_tracking.confirmation_date = new Date();
  return this.save();
};

// Method to check-in patient
patientAppointmentSchema.methods.checkInPatient = function() {
  this.status_tracking.status = 'checked_in';
  this.status_tracking.check_in_time = new Date();
  return this.save();
};

// Method to start consultation
patientAppointmentSchema.methods.startConsultation = function() {
  this.status_tracking.status = 'in_progress';
  this.status_tracking.consultation_start_time = new Date();
  return this.save();
};

// Method to complete appointment
patientAppointmentSchema.methods.completeAppointment = function(medicalNotes = {}) {
  this.status_tracking.status = 'completed';
  this.status_tracking.consultation_end_time = new Date();
  
  if (medicalNotes) {
    Object.assign(this.medical_notes, medicalNotes);
  }
  
  return this.save();
};

// Method to cancel appointment
patientAppointmentSchema.methods.cancelAppointment = function(reason, cancelledBy = 'patient') {
  this.status_tracking.status = 'cancelled';
  this.status_tracking.cancellation_reason = reason;
  this.status_tracking.cancelled_by = cancelledBy;
  return this.save();
};

// Method to add patient feedback
patientAppointmentSchema.methods.addFeedback = function(feedbackData) {
  Object.assign(this.feedback, feedbackData);
  return this.save();
};

// Method to send reminder notification
patientAppointmentSchema.methods.sendReminder = function(notificationType, content) {
  this.reminder_notifications.push({
    notification_type: notificationType,
    sent_at: new Date(),
    content: content,
    delivery_status: 'sent'
  });
  return this.save();
};

// Static method to get appointments by date range
patientAppointmentSchema.statics.getAppointmentsByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    'appointment_details.appointment_date': {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (filters.hospitalId) query.hospital_id = filters.hospitalId;
  if (filters.rhoId) query.rho_id = filters.rhoId;
  if (filters.doctorId) query['appointment_details.doctor_id'] = filters.doctorId;
  if (filters.status) query['status_tracking.status'] = filters.status;
  
  return this.find(query).sort({ 'appointment_details.appointment_date': 1 });
};

// Static method to get patient appointment history
patientAppointmentSchema.statics.getPatientHistory = function(patientId, limit = 20) {
  return this.find({ patient_id: patientId })
    .sort({ 'appointment_details.appointment_date': -1 })
    .limit(limit);
};

// Static method to get doctor's schedule
patientAppointmentSchema.statics.getDoctorSchedule = function(doctorId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    'appointment_details.doctor_id': doctorId,
    'appointment_details.appointment_date': {
      $gte: startOfDay,
      $lte: endOfDay
    },
    'status_tracking.status': { $in: ['scheduled', 'confirmed', 'checked_in', 'in_progress'] }
  }).sort({ 'appointment_details.appointment_time': 1 });
};

// Static method to get RHO appointment analytics
patientAppointmentSchema.statics.getRHOAppointmentAnalytics = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        'appointment_details.appointment_date': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          hospital_id: '$hospital_id',
          status: '$status_tracking.status'
        },
        count: { $sum: 1 },
        avg_rating: { $avg: '$feedback.overall_experience' },
        total_revenue: { $sum: '$payment_info.total_amount' }
      }
    },
    {
      $group: {
        _id: '$_id.hospital_id',
        appointment_stats: {
          $push: {
            status: '$_id.status',
            count: '$count',
            avg_rating: '$avg_rating',
            revenue: '$total_revenue'
          }
        },
        total_appointments: { $sum: '$count' },
        total_revenue: { $sum: '$total_revenue' }
      }
    }
  ]);
};

// Static method to get upcoming appointments (for reminders)
patientAppointmentSchema.statics.getUpcomingAppointments = function(hoursAhead = 24) {
  const now = new Date();
  const futureTime = new Date(now.getTime() + (hoursAhead * 60 * 60 * 1000));
  
  return this.find({
    'appointment_details.appointment_date': {
      $gte: now,
      $lte: futureTime
    },
    'status_tracking.status': { $in: ['scheduled', 'confirmed'] }
  });
};

module.exports = mongoose.model('PatientAppointment', patientAppointmentSchema);