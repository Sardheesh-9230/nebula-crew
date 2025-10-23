const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const hospitalRHOMappingSchema = new mongoose.Schema({
  mapping_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
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
  assignment_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'transferred', 'closed'],
    default: 'active'
  },
  management_type: {
    type: String,
    enum: ['direct'],
    default: 'direct' // Only direct management as per specification
  },
  patient_visible: {
    type: Boolean,
    default: true // Hospital visible to patients
  },
  online_booking_enabled: {
    type: Boolean,
    default: true
  },
  emergency_services_active: {
    type: Boolean,
    default: true
  },
  assignment_details: {
    assigned_by_sho: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignment_reason: {
      type: String,
      maxlength: 500
    },
    zone_id: {
      type: String,
      ref: 'HealthZone'
    },
    district: {
      type: String,
      required: true
    },
    taluk: String,
    geographic_location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  performance_tracking: {
    patient_satisfaction: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    resource_utilization: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    emergency_response_time: {
      type: Number, // in minutes
      default: 0
    },
    bed_occupancy_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    monthly_patient_count: {
      type: Number,
      default: 0
    },
    revenue_generated: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    }
  },
  transfer_history: [{
    from_rho: String,
    to_rho: String,
    transfer_date: Date,
    transfer_reason: String,
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
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
  collection: 'hospital_rho_mapping'
});

// Indexes
hospitalRHOMappingSchema.index({ hospital_id: 1, rho_id: 1 }, { unique: true });
hospitalRHOMappingSchema.index({ status: 1, patient_visible: 1 });
hospitalRHOMappingSchema.index({ 'assignment_details.geographic_location': '2dsphere' });
hospitalRHOMappingSchema.index({ 'assignment_details.district': 1 });

// Pre-save middleware
hospitalRHOMappingSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Method to transfer hospital to another RHO
hospitalRHOMappingSchema.methods.transferToRHO = function(newRhoId, newRhoName, reason, approvedBy) {
  // Add to transfer history
  this.transfer_history.push({
    from_rho: this.rho_id,
    to_rho: newRhoId,
    transfer_date: new Date(),
    transfer_reason: reason,
    approved_by: approvedBy
  });
  
  // Update current assignment
  this.rho_id = newRhoId;
  this.rho_name = newRhoName;
  this.assignment_date = new Date();
  
  return this.save();
};

// Static method to get hospitals by RHO
hospitalRHOMappingSchema.statics.findByRHO = function(rhoId, includeInactive = false) {
  const query = { rho_id: rhoId };
  if (!includeInactive) {
    query.status = 'active';
  }
  return this.find(query);
};

// Static method to get patient-visible hospitals in area
hospitalRHOMappingSchema.statics.findPatientVisibleInArea = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    status: 'active',
    patient_visible: true,
    'assignment_details.geographic_location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

// Static method to get RHO performance statistics
hospitalRHOMappingSchema.statics.getRHOPerformanceStats = function(rhoId) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        status: 'active'
      }
    },
    {
      $group: {
        _id: '$rho_id',
        total_hospitals: { $sum: 1 },
        avg_patient_satisfaction: { $avg: '$performance_tracking.patient_satisfaction' },
        avg_resource_utilization: { $avg: '$performance_tracking.resource_utilization' },
        avg_response_time: { $avg: '$performance_tracking.emergency_response_time' },
        avg_bed_occupancy: { $avg: '$performance_tracking.bed_occupancy_rate' },
        total_patients_monthly: { $sum: '$performance_tracking.monthly_patient_count' },
        total_revenue: { $sum: { $toDouble: '$performance_tracking.revenue_generated' } }
      }
    }
  ]);
};

module.exports = mongoose.model('HospitalRHOMapping', hospitalRHOMappingSchema);