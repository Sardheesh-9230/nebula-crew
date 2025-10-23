const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  specialization: [{
    type: String,
    required: true
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: true
  },
  hospitals: [{
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    department: String,
    designation: String
  }],
  consultationFee: {
    type: Number,
    default: 0
  },
  availableSlots: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String,
    slotDuration: {
      type: Number,
      default: 30
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  languages: [String],
  telemedicineEnabled: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'hospitals.hospitalId': 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
