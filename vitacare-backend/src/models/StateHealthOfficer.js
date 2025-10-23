const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const stateHealthOfficerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'state-officer',
    immutable: true
  },
  profile: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    profilePhoto: String,
    mobileNumber: {
      type: String,
      required: true
    }
  },
  officialDetails: {
    employeeId: {
      type: String,
      required: true,
      unique: true
    },
    designation: {
      type: String,
      required: true
    },
    department: String,
    joiningDate: Date,
    officeAddress: {
      building: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  jurisdiction: {
    state: {
      type: String,
      required: true
    },
    districts: [String],
    region: String
  },
  permissions: {
    canApproveHospitals: {
      type: Boolean,
      default: true
    },
    canManageDoctors: {
      type: Boolean,
      default: true
    },
    canViewReports: {
      type: Boolean,
      default: true
    },
    canManagePrograms: {
      type: Boolean,
      default: true
    },
    canAllocateBudget: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalHospitalsManaged: {
      type: Number,
      default: 0
    },
    totalDoctorsManaged: {
      type: Number,
      default: 0
    },
    totalPatientsInState: {
      type: Number,
      default: 0
    },
    activeProgramsManaged: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  refreshToken: String
}, {
  timestamps: true
});

// Hash password before saving
stateHealthOfficerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
stateHealthOfficerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate User ID
stateHealthOfficerSchema.statics.generateUserId = function(state) {
  const stateCode = state.substring(0, 2).toUpperCase();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `SHO${stateCode}${timestamp}${random}`.toUpperCase();
};

const StateHealthOfficer = mongoose.model('StateHealthOfficer', stateHealthOfficerSchema);

module.exports = StateHealthOfficer;
