const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  healthId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  policyNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  insuranceProvider: {
    type: String,
    required: true
  },
  policyType: {
    type: String,
    required: true
  },
  coverageAmount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  premiumAmount: {
    type: Number,
    required: true
  },
  familyMembers: [{
    name: String,
    relation: String,
    healthId: String
  }],
  claims: [{
    claimId: String,
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    claimAmount: Number,
    approvedAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'settled'],
      default: 'pending'
    },
    claimDate: Date,
    settlementDate: Date,
    documents: [String]
  }],
  networkHospitals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

insuranceSchema.index({ healthId: 1 });
insuranceSchema.index({ endDate: 1 });

module.exports = mongoose.model('Insurance', insuranceSchema);
