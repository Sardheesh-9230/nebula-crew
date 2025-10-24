const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
    index: true,
    default: () => `APT${uuidv4().split('-')[0].toUpperCase()}`
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: false, // Made optional for testing
    index: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: false // Made optional for testing
  },
  appointmentDate: {
    type: Date,
    required: true,
    index: true
  },
  timeSlot: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['in-person', 'telemedicine'],
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rejected'],
    default: 'pending'
  },
  reason: String,
  symptoms: [String],
  notes: String,
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  consultationFee: {
    type: Number,
    required: true
  },
  reminders: [{
    sentAt: Date,
    type: {
      type: String,
      enum: ['sms', 'email', 'push']
    }
  }],
  telemedicineLink: String,
  cancellationReason: String
}, {
  timestamps: true
});

appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
