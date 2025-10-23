const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const healthZoneSchema = new mongoose.Schema({
  zone_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  zone_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  zone_type: {
    type: String,
    enum: ['metropolitan', 'urban', 'rural', 'tribal'],
    required: true
  },
  district_ids: [{
    type: String,
    required: true
  }],
  district_names: [{
    type: String,
    required: true
  }],
  taluk_ids: [{
    type: String
  }],
  taluk_names: [{
    type: String
  }],
  population: {
    type: Number,
    required: true,
    min: 0
  },
  area_sq_km: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0
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
  geographic_boundaries: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  },
  administrative_details: {
    state: {
      type: String,
      required: true,
      default: 'Tamil Nadu'
    },
    created_by_sho: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approval_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approval_date: Date,
    last_boundary_update: Date
  },
  health_infrastructure: {
    total_hospitals: {
      type: Number,
      default: 0
    },
    phc_count: {
      type: Number,
      default: 0
    },
    chc_count: {
      type: Number,
      default: 0
    },
    district_hospital_count: {
      type: Number,
      default: 0
    },
    private_hospitals: {
      type: Number,
      default: 0
    },
    total_beds: {
      type: Number,
      default: 0
    },
    doctors_count: {
      type: Number,
      default: 0
    },
    nurses_count: {
      type: Number,
      default: 0
    }
  },
  health_metrics: {
    disease_burden_index: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    healthcare_accessibility_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    average_response_time: {
      type: Number, // in minutes
      default: 0
    },
    patient_satisfaction_avg: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    camps_conducted_monthly: {
      type: Number,
      default: 0
    },
    outbreak_incidents: {
      type: Number,
      default: 0
    }
  },
  resource_allocation: {
    monthly_budget: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    utilized_budget: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    emergency_fund: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    equipment_allocation_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
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
  collection: 'health_zones'
});

// Geospatial index for geographic queries
healthZoneSchema.index({ geographic_boundaries: '2dsphere' });
healthZoneSchema.index({ zone_type: 1, rho_id: 1 });
healthZoneSchema.index({ district_ids: 1 });
healthZoneSchema.index({ 'administrative_details.created_by_sho': 1 });

// Pre-save middleware
healthZoneSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Virtual for population density
healthZoneSchema.virtual('population_density').get(function() {
  const area = parseFloat(this.area_sq_km.toString());
  return area > 0 ? (this.population / area).toFixed(2) : 0;
});

// Method to check if coordinates are within zone
healthZoneSchema.methods.containsPoint = function(longitude, latitude) {
  // Simplified point-in-polygon check - in production use proper geospatial queries
  return mongoose.model('HealthZone').findOne({
    _id: this._id,
    geographic_boundaries: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }
    }
  });
};

// Static method to find zones by RHO
healthZoneSchema.statics.findByRHO = function(rhoId) {
  return this.find({
    rho_id: rhoId,
    'administrative_details.approval_status': 'approved'
  });
};

// Static method to get zone statistics
healthZoneSchema.statics.getZoneStatistics = function() {
  return this.aggregate([
    {
      $match: {
        'administrative_details.approval_status': 'approved'
      }
    },
    {
      $group: {
        _id: '$zone_type',
        total_zones: { $sum: 1 },
        total_population: { $sum: '$population' },
        total_area: { $sum: { $toDouble: '$area_sq_km' } },
        avg_hospitals: { $avg: '$health_infrastructure.total_hospitals' },
        avg_satisfaction: { $avg: '$health_metrics.patient_satisfaction_avg' }
      }
    }
  ]);
};

module.exports = mongoose.model('HealthZone', healthZoneSchema);