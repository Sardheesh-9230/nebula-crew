const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const hospitalRealtimeStatusSchema = new mongoose.Schema({
  status_id: {
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
  rho_id: {
    type: String,
    ref: 'RegionalHealthOfficer',
    required: true,
    index: true
  },
  hospital_name: {
    type: String,
    required: true
  },
  // Real-time bed availability
  bed_status: {
    general_beds_available: {
      type: Number,
      required: true,
      min: 0
    },
    icu_beds_available: {
      type: Number,
      required: true,
      min: 0
    },
    emergency_beds_available: {
      type: Number,
      required: true,
      min: 0
    },
    maternity_beds_available: {
      type: Number,
      default: 0,
      min: 0
    },
    pediatric_beds_available: {
      type: Number,
      default: 0,
      min: 0
    },
    isolation_beds_available: {
      type: Number,
      default: 0,
      min: 0
    },
    last_bed_update: {
      type: Date,
      default: Date.now
    }
  },
  // Staff availability
  staff_status: {
    doctors_available: {
      type: Number,
      required: true,
      min: 0
    },
    nurses_available: {
      type: Number,
      required: true,
      min: 0
    },
    specialists_available: {
      type: Number,
      default: 0,
      min: 0
    },
    technicians_available: {
      type: Number,
      default: 0,
      min: 0
    },
    on_duty_staff: [{
      staff_id: String,
      name: String,
      role: String,
      department: String,
      shift_end_time: Date
    }],
    last_staff_update: {
      type: Date,
      default: Date.now
    }
  },
  // Service availability
  service_status: {
    opd_status: {
      type: String,
      enum: ['open', 'closed', 'limited'],
      default: 'open'
    },
    emergency_services_status: {
      type: String,
      enum: ['active', 'limited', 'unavailable'],
      default: 'active'
    },
    surgery_available: {
      type: Boolean,
      default: true
    },
    lab_services_available: {
      type: Boolean,
      default: true
    },
    pharmacy_open: {
      type: Boolean,
      default: true
    },
    blood_bank_available: {
      type: Boolean,
      default: false
    },
    ambulance_available: {
      type: Number,
      default: 0
    }
  },
  // Wait times and appointments
  patient_flow: {
    average_wait_time: {
      type: Number, // in minutes
      default: 0
    },
    current_queue_length: {
      opd: { type: Number, default: 0 },
      emergency: { type: Number, default: 0 },
      specialist: { type: Number, default: 0 }
    },
    appointment_slots_available: {
      today: { type: Number, default: 0 },
      tomorrow: { type: Number, default: 0 },
      this_week: { type: Number, default: 0 }
    },
    patients_treated_today: {
      type: Number,
      default: 0
    }
  },
  // Equipment status
  equipment_status: {
    critical_equipment_available: {
      ventilators: { type: Number, default: 0 },
      oxygen_concentrators: { type: Number, default: 0 },
      defibrillators: { type: Number, default: 0 },
      xray_machines: { type: Number, default: 0 },
      ultrasound: { type: Number, default: 0 }
    },
    equipment_under_maintenance: [{
      equipment_name: String,
      expected_repair_date: Date,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      }
    }]
  },
  // Emergency and alerts
  alerts_notifications: [{
    alert_type: {
      type: String,
      enum: ['bed_shortage', 'staff_shortage', 'equipment_failure', 'emergency_overflow', 'medicine_shortage']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    message: String,
    created_at: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolved_at: Date
  }],
  // Power and infrastructure
  infrastructure_status: {
    power_status: {
      type: String,
      enum: ['normal', 'backup', 'limited', 'outage'],
      default: 'normal'
    },
    water_supply: {
      type: String,
      enum: ['normal', 'limited', 'shortage'],
      default: 'normal'
    },
    oxygen_supply: {
      pressure: {
        type: String,
        enum: ['normal', 'low', 'critical'],
        default: 'normal'
      },
      backup_available: {
        type: Boolean,
        default: true
      }
    },
    internet_connectivity: {
      type: String,
      enum: ['excellent', 'good', 'poor', 'offline'],
      default: 'good'
    }
  },
  last_updated: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // RHO or hospital staff
  },
  auto_update_enabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'hospital_realtime_status'
});

// TTL index to automatically remove old status records (keep 30 days)
hospitalRealtimeStatusSchema.index({ last_updated: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Indexes for real-time queries
hospitalRealtimeStatusSchema.index({ hospital_id: 1, last_updated: -1 });
hospitalRealtimeStatusSchema.index({ rho_id: 1, last_updated: -1 });
hospitalRealtimeStatusSchema.index({ 'service_status.emergency_services_status': 1 });
hospitalRealtimeStatusSchema.index({ 'alerts_notifications.severity': 1, 'alerts_notifications.resolved': 1 });

// Pre-save middleware
hospitalRealtimeStatusSchema.pre('save', function(next) {
  this.last_updated = Date.now();
  next();
});

// Method to add alert
hospitalRealtimeStatusSchema.methods.addAlert = function(alertType, severity, message) {
  this.alerts_notifications.push({
    alert_type: alertType,
    severity: severity,
    message: message,
    created_at: new Date(),
    resolved: false
  });
  return this.save();
};

// Method to resolve alert
hospitalRealtimeStatusSchema.methods.resolveAlert = function(alertId) {
  const alert = this.alerts_notifications.id(alertId);
  if (alert) {
    alert.resolved = true;
    alert.resolved_at = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to update bed status
hospitalRealtimeStatusSchema.methods.updateBedStatus = function(bedUpdates) {
  Object.assign(this.bed_status, bedUpdates);
  this.bed_status.last_bed_update = new Date();
  return this.save();
};

// Method to calculate occupancy rate
hospitalRealtimeStatusSchema.methods.calculateOccupancyRate = function() {
  const totalAvailable = this.bed_status.general_beds_available + 
                        this.bed_status.icu_beds_available + 
                        this.bed_status.emergency_beds_available;
  
  // This would need total capacity from hospital info
  // For now, returning available beds
  return {
    available_beds: totalAvailable,
    critical_beds_available: this.bed_status.icu_beds_available + this.bed_status.emergency_beds_available
  };
};

// Static method to get current status of all hospitals under RHO
hospitalRealtimeStatusSchema.statics.getCurrentStatusByRHO = function(rhoId) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        last_updated: {
          $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
        }
      }
    },
    {
      $sort: { hospital_id: 1, last_updated: -1 }
    },
    {
      $group: {
        _id: '$hospital_id',
        latest_status: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$latest_status' }
    }
  ]);
};

// Static method to get emergency capacity overview
hospitalRealtimeStatusSchema.statics.getEmergencyCapacityOverview = function(rhoId = null) {
  const matchStage = {
    'service_status.emergency_services_status': { $ne: 'unavailable' },
    last_updated: {
      $gte: new Date(Date.now() - 1 * 60 * 60 * 1000) // Last 1 hour
    }
  };
  
  if (rhoId) {
    matchStage.rho_id = rhoId;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$rho_id',
        total_hospitals: { $sum: 1 },
        total_emergency_beds: { $sum: '$bed_status.emergency_beds_available' },
        total_icu_beds: { $sum: '$bed_status.icu_beds_available' },
        hospitals_with_ambulance: {
          $sum: {
            $cond: [{ $gt: ['$service_status.ambulance_available', 0] }, 1, 0]
          }
        },
        critical_alerts: {
          $sum: {
            $size: {
              $filter: {
                input: '$alerts_notifications',
                cond: {
                  $and: [
                    { $eq: ['$$this.severity', 'critical'] },
                    { $eq: ['$$this.resolved', false] }
                  ]
                }
              }
            }
          }
        }
      }
    }
  ]);
};

// Static method to get hospitals with available capacity
hospitalRealtimeStatusSchema.statics.getHospitalsWithCapacity = function(longitude, latitude, maxDistance = 25000) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { 'bed_status.general_beds_available': { $gt: 0 } },
          { 'bed_status.emergency_beds_available': { $gt: 0 } }
        ],
        'service_status.emergency_services_status': { $ne: 'unavailable' },
        last_updated: {
          $gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
        }
      }
    },
    {
      $lookup: {
        from: 'patient_hospital_info',
        localField: 'hospital_id',
        foreignField: 'hospital_id',
        as: 'hospital_info'
      }
    },
    {
      $unwind: '$hospital_info'
    },
    {
      $addFields: {
        distance: {
          $let: {
            vars: {
              coords: '$hospital_info.contact_info.coordinates.coordinates'
            },
            in: {
              $sqrt: {
                $add: [
                  { $pow: [{ $subtract: [{ $arrayElemAt: ['$$coords', 0] }, longitude] }, 2] },
                  { $pow: [{ $subtract: [{ $arrayElemAt: ['$$coords', 1] }, latitude] }, 2] }
                ]
              }
            }
          }
        }
      }
    },
    {
      $match: {
        distance: { $lte: maxDistance / 111000 } // Rough conversion to degrees
      }
    },
    {
      $sort: { distance: 1 }
    },
    {
      $limit: 20
    }
  ]);
};

module.exports = mongoose.model('HospitalRealtimeStatus', hospitalRealtimeStatusSchema);