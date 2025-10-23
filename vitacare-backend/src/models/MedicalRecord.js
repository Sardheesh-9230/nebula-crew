const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  healthId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  recordType: {
    type: String,
    enum: ['prescription', 'lab_report', 'imaging', 'vaccination', 'surgery', 'consultation'],
    required: true
  },
  blockchainHash: {
    type: String,
    index: true
  },
  metadata: {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    date: {
      type: Date,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    diagnosis: String,
    symptoms: [String],
    fileUrls: [String],
    fileTypes: [String]
  },
  prescriptions: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical']
    }
  }],
  accessLog: [{
    accessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessedAt: {
      type: Date,
      default: Date.now
    },
    purpose: String
  }],
  consentedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
medicalRecordSchema.index({ healthId: 1, 'metadata.date': -1 });
medicalRecordSchema.index({ recordType: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
