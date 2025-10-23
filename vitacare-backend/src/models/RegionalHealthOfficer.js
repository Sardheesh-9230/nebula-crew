const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const regionalHealthOfficerSchema = new mongoose.Schema({
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
    default: 'regional-officer',
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
    region: {
      type: String,
      required: true
    },
    districts: [{
      type: String,
      required: true
    }],
    state: String,
    reportingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StateHealthOfficer'
    }
  },
  permissions: {
    canApproveHealthCenters: {
      type: Boolean,
      default: true
    },
    canManageHealthWorkers: {
      type: Boolean,
      default: true
    },
    canViewRegionalReports: {
      type: Boolean,
      default: true
    },
    canCoordinatePrograms: {
      type: Boolean,
      default: true
    },
    canAllocateResources: {
      type: Boolean,
      default: false
    }
  },
  statistics: {
    totalHealthCentersManaged: {
      type: Number,
      default: 0
    },
    totalHealthWorkersManaged: {
      type: Number,
      default: 0
    },
    totalPatientsInRegion: {
      type: Number,
      default: 0
    },
    activeProgramsCoordinated: {
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
regionalHealthOfficerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
regionalHealthOfficerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate User ID
regionalHealthOfficerSchema.statics.generateUserId = function(region) {
  const regionCode = region.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `RHO${regionCode}${timestamp}${random}`.toUpperCase();
};

const RegionalHealthOfficer = mongoose.model('RegionalHealthOfficer', regionalHealthOfficerSchema);

module.exports = RegionalHealthOfficer;
