const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  healthId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['citizen', 'doctor', 'hospital_admin', 'govt_official', 'insurance_officer', 'health_worker'],
    default: 'citizen'
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    profilePhoto: String,
    languages: [String],
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  emergencyContacts: [{
    name: String,
    relationship: String,
    mobile: String
  }],
  allergies: [String],
  chronicConditions: [String],
  region: String,
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  refreshToken: String
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate health ID
userSchema.statics.generateHealthId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VH${timestamp}${random}`;
};

module.exports = mongoose.model('User', userSchema);
