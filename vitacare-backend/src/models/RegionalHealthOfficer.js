const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const regionalHealthOfficerSchema = new mongoose.Schema({
  rho_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  qualification: {
    type: String,
    required: true,
    maxlength: 200
  },
  experience_years: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  zone_type: {
    type: String,
    enum: ['district', 'multi_district', 'urban', 'semi_urban', 'rural'],
    required: true
  },
  coverage_area: {
    type: mongoose.Schema.Types.Mixed, // Geographic boundaries in GeoJSON
    required: true
  },
  population_covered: {
    type: Number,
    required: true,
    min: 0
  },
  authority_level: {
    type: String,
    enum: ['full_district', 'multi_district', 'zone_specific'],
    required: true
  },
  direct_management: {
    type: Boolean,
    default: true // No coordinators, direct management
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred'],
    default: 'active'
  },
  contact_info: {
    phone: {
      type: String,
      required: true,
      match: /^[\+]?[1-9][\d]{0,15}$/
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    office_address: {
      type: String,
      required: true
    }
  },
  assigned_districts: [{
    district_id: String,
    district_name: String,
    population: Number,
    area_sq_km: Number
  }],
  assigned_taluks: [{
    taluk_id: String,
    taluk_name: String,
    district_name: String,
    population: Number
  }],
  hospitals_managed: [{
    hospital_id: String,
    hospital_name: String,
    hospital_type: {
      type: String,
      enum: ['PHC', 'CHC', 'SDH', 'DH', 'Specialty', 'Private']
    },
    assignment_date: Date,
    status: {
      type: String,
      enum: ['active', 'transferred', 'closed'],
      default: 'active'
    }
  }],
  performance_metrics: {
    hospitals_managed_count: {
      type: Number,
      default: 0
    },
    camps_organized: {
      type: Number,
      default: 0
    },
    outbreaks_managed: {
      type: Number,
      default: 0
    },
    patient_satisfaction_score: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    resource_efficiency_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    emergency_response_time: {
      type: Number, // in minutes
      default: 0
    }
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // SHO ID
    required: true
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
  collection: 'regional_health_officers'
});

// Indexes for better query performance
regionalHealthOfficerSchema.index({ zone_type: 1, status: 1 });
regionalHealthOfficerSchema.index({ coverage_area: '2dsphere' });
regionalHealthOfficerSchema.index({ created_by: 1 });
regionalHealthOfficerSchema.index({ 'assigned_districts.district_id': 1 });

// Pre-save middleware to update timestamps
regionalHealthOfficerSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Virtual for full name with qualification
regionalHealthOfficerSchema.virtual('display_name').get(function() {
  return `${this.name} (${this.qualification})`;
});

// Method to calculate total population under management
regionalHealthOfficerSchema.methods.getTotalPopulation = function() {
  return this.assigned_districts.reduce((total, district) => total + (district.population || 0), 0) +
         this.assigned_taluks.reduce((total, taluk) => total + (taluk.population || 0), 0);
};

// Static method to find RHO by district
regionalHealthOfficerSchema.statics.findByDistrict = function(districtId) {
  return this.find({
    'assigned_districts.district_id': districtId,
    status: 'active'
  });
};

// Static method to find RHO by zone type
regionalHealthOfficerSchema.statics.findByZoneType = function(zoneType) {
  return this.find({
    zone_type: zoneType,
    status: 'active'
  });
};

module.exports = mongoose.model('RegionalHealthOfficer', regionalHealthOfficerSchema);