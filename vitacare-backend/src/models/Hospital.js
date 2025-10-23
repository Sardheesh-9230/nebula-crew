const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['government', 'private', 'trust', 'clinic'],
    required: true
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: [String],
    email: String,
    emergencyNumber: String,
    website: String
  },
  facilities: [String],
  specializations: [String],
  bedCapacity: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    icu: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 }
    },
    general: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 }
    },
    emergency: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 }
    }
  },
  departments: [{
    name: String,
    hodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    doctors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }]
  }],
  emergencyServices: {
    type: Boolean,
    default: false
  },
  ambulanceAvailable: {
    type: Boolean,
    default: false
  },
  insuranceAccepted: [String],
  accreditation: [String],
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
  images: [String],
  workingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

hospitalSchema.index({ name: 'text' });
hospitalSchema.index({ 'address.coordinates': '2dsphere' });
hospitalSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
