const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const hospitalResourceSchema = new mongoose.Schema({
  resource_id: {
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
  resource_category: {
    type: String,
    enum: ['medical_equipment', 'medical_supplies', 'human_resources', 'infrastructure', 'financial'],
    required: true,
    index: true
  },
  resource_type: {
    type: String,
    required: true, // e.g., 'X-ray Machine', 'Ventilator', 'Doctor', 'ICU Bed'
    index: true
  },
  resource_name: {
    type: String,
    required: true,
    maxlength: 200
  },
  resource_specifications: {
    brand: String,
    model: String,
    serial_number: String,
    purchase_date: Date,
    warranty_expiry: Date,
    vendor_info: {
      name: String,
      contact: String,
      support_phone: String
    }
  },
  quantity_info: {
    current_quantity: {
      type: Number,
      required: true,
      min: 0
    },
    total_capacity: {
      type: Number,
      required: true,
      min: 0
    },
    reserved_quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    available_quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    unit_of_measurement: {
      type: String,
      required: true, // 'units', 'liters', 'hours', 'beds', 'kg'
      maxlength: 50
    }
  },
  status_info: {
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance', 'out_of_order', 'expired', 'reserved'],
      default: 'available',
      index: true
    },
    operational_hours_today: {
      type: Number,
      default: 0
    },
    utilization_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    condition_rating: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    last_inspection_date: Date,
    next_inspection_due: Date
  },
  location_info: {
    department: {
      type: String,
      required: true,
      maxlength: 100
    },
    building: String,
    floor: String,
    room_number: String,
    exact_location: String
  },
  maintenance_info: {
    last_maintenance_date: Date,
    next_maintenance_due: Date,
    maintenance_frequency_days: {
      type: Number,
      default: 90
    },
    maintenance_cost_annual: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    maintenance_vendor: String,
    maintenance_notes: [String]
  },
  supply_specific: {
    expiry_date: Date,
    batch_number: String,
    supplier_name: String,
    cost_per_unit: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    storage_requirements: {
      temperature_range: String,
      humidity_range: String,
      special_conditions: String
    },
    consumption_rate: {
      daily_average: Number,
      weekly_trend: Number,
      seasonal_variation: Number
    }
  },
  alert_thresholds: {
    minimum_quantity: {
      type: Number,
      required: true,
      default: 0
    },
    critical_quantity: {
      type: Number,
      default: 0
    },
    reorder_point: {
      type: Number,
      default: 0
    },
    expiry_alert_days: {
      type: Number,
      default: 30
    }
  },
  cost_info: {
    procurement_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    annual_operating_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    depreciation_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 10
    },
    current_value: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    }
  },
  usage_tracking: {
    daily_usage: [{
      date: Date,
      quantity_used: Number,
      hours_operated: Number,
      efficiency_rating: Number
    }],
    peak_usage_hours: [String],
    usage_trends: {
      increasing: Boolean,
      seasonal_pattern: String,
      predictive_need: Number
    }
  },
  allocation_info: {
    allocated_to_department: String,
    primary_operator: {
      staff_id: String,
      name: String,
      qualification: String
    },
    backup_operators: [{
      staff_id: String,
      name: String,
      availability: String
    }],
    booking_schedule: [{
      date: Date,
      time_slot: String,
      booked_by: String,
      purpose: String,
      patient_id: String
    }]
  },
  compliance_safety: {
    safety_certification: {
      certified: Boolean,
      certification_body: String,
      certificate_expiry: Date
    },
    regulatory_compliance: [{
      regulation_name: String,
      compliance_status: {
        type: String,
        enum: ['compliant', 'non_compliant', 'pending']
      },
      last_audit_date: Date,
      next_audit_due: Date
    }],
    safety_incidents: [{
      date: Date,
      incident_type: String,
      severity: String,
      description: String,
      resolved: Boolean
    }]
  },
  last_updated: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // Hospital staff or RHO
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'hospital_resources'
});

// Compound indexes for efficient queries
hospitalResourceSchema.index({ hospital_id: 1, resource_category: 1, 'status_info.status': 1 });
hospitalResourceSchema.index({ rho_id: 1, resource_category: 1, 'alert_thresholds.minimum_quantity': 1 });
hospitalResourceSchema.index({ 'supply_specific.expiry_date': 1, 'status_info.status': 1 });
hospitalResourceSchema.index({ resource_type: 1, 'location_info.department': 1 });

// Pre-save middleware
hospitalResourceSchema.pre('save', function(next) {
  // Calculate available quantity
  this.quantity_info.available_quantity = Math.max(0, 
    this.quantity_info.current_quantity - this.quantity_info.reserved_quantity
  );
  
  // Calculate utilization percentage
  if (this.quantity_info.total_capacity > 0) {
    this.status_info.utilization_percentage = Math.round(
      ((this.quantity_info.total_capacity - this.quantity_info.available_quantity) / 
       this.quantity_info.total_capacity) * 100
    );
  }
  
  this.last_updated = Date.now();
  next();
});

// Method to check if resource needs restocking
hospitalResourceSchema.methods.needsRestocking = function() {
  return this.quantity_info.current_quantity <= this.alert_thresholds.minimum_quantity;
};

// Method to check if resource is expiring soon
hospitalResourceSchema.methods.isExpiringSoon = function() {
  if (!this.supply_specific.expiry_date) return false;
  
  const today = new Date();
  const expiryDate = new Date(this.supply_specific.expiry_date);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  return daysUntilExpiry <= this.alert_thresholds.expiry_alert_days;
};

// Method to reserve resource quantity
hospitalResourceSchema.methods.reserveQuantity = function(quantity, reservedBy, purpose) {
  if (this.quantity_info.available_quantity >= quantity) {
    this.quantity_info.reserved_quantity += quantity;
    
    // Add to booking schedule if it's equipment
    if (this.resource_category === 'medical_equipment') {
      this.allocation_info.booking_schedule.push({
        date: new Date(),
        time_slot: 'reserved',
        booked_by: reservedBy,
        purpose: purpose
      });
    }
    
    return this.save();
  }
  throw new Error('Insufficient quantity available for reservation');
};

// Method to update resource usage
hospitalResourceSchema.methods.updateUsage = function(quantityUsed, hoursOperated = 0) {
  // Update current usage
  if (quantityUsed > 0) {
    this.quantity_info.current_quantity = Math.max(0, 
      this.quantity_info.current_quantity - quantityUsed
    );
  }
  
  // Add to daily usage tracking
  const today = new Date().toISOString().split('T')[0];
  const todayUsage = this.usage_tracking.daily_usage.find(
    usage => usage.date.toISOString().split('T')[0] === today
  );
  
  if (todayUsage) {
    todayUsage.quantity_used += quantityUsed;
    todayUsage.hours_operated += hoursOperated;
  } else {
    this.usage_tracking.daily_usage.push({
      date: new Date(),
      quantity_used: quantityUsed,
      hours_operated: hoursOperated,
      efficiency_rating: Math.random() * 5 + 5 // Placeholder calculation
    });
  }
  
  // Update operational hours for today
  this.status_info.operational_hours_today += hoursOperated;
  
  return this.save();
};

// Static method to get resources by category for RHO
hospitalResourceSchema.statics.getResourcesByCategory = function(rhoId, category, hospitalId = null) {
  const query = { rho_id: rhoId, resource_category: category };
  if (hospitalId) query.hospital_id = hospitalId;
  
  return this.find(query).sort({ hospital_id: 1, resource_name: 1 });
};

// Static method to get resource alerts
hospitalResourceSchema.statics.getResourceAlerts = function(rhoId, hospitalId = null) {
  const query = { rho_id: rhoId };
  if (hospitalId) query.hospital_id = hospitalId;
  
  return this.aggregate([
    { $match: query },
    {
      $addFields: {
        needs_restock: {
          $lte: ['$quantity_info.current_quantity', '$alert_thresholds.minimum_quantity']
        },
        is_expiring: {
          $and: [
            { $ne: ['$supply_specific.expiry_date', null] },
            {
              $lte: [
                '$supply_specific.expiry_date',
                { $dateAdd: { 
                  startDate: new Date(), 
                  unit: 'day', 
                  amount: '$alert_thresholds.expiry_alert_days' 
                }}
              ]
            }
          ]
        },
        needs_maintenance: {
          $lte: ['$maintenance_info.next_maintenance_due', new Date()]
        }
      }
    },
    {
      $match: {
        $or: [
          { needs_restock: true },
          { is_expiring: true },
          { needs_maintenance: true },
          { 'status_info.status': 'out_of_order' }
        ]
      }
    },
    {
      $project: {
        resource_name: 1,
        hospital_name: 1,
        resource_category: 1,
        'quantity_info.current_quantity': 1,
        'alert_thresholds.minimum_quantity': 1,
        'supply_specific.expiry_date': 1,
        'maintenance_info.next_maintenance_due': 1,
        'status_info.status': 1,
        alert_type: {
          $switch: {
            branches: [
              { case: '$needs_restock', then: 'low_stock' },
              { case: '$is_expiring', then: 'expiring_soon' },
              { case: '$needs_maintenance', then: 'maintenance_due' },
              { case: { $eq: ['$status_info.status', 'out_of_order'] }, then: 'out_of_order' }
            ],
            default: 'unknown'
          }
        },
        severity: {
          $switch: {
            branches: [
              { case: { $eq: ['$status_info.status', 'out_of_order'] }, then: 'critical' },
              { case: { $lte: ['$quantity_info.current_quantity', '$alert_thresholds.critical_quantity'] }, then: 'critical' },
              { case: '$needs_restock', then: 'high' },
              { case: '$is_expiring', then: 'medium' },
              { case: '$needs_maintenance', then: 'low' }
            ],
            default: 'low'
          }
        }
      }
    },
    { $sort: { severity: 1, hospital_name: 1 } }
  ]);
};

// Static method to get resource utilization statistics
hospitalResourceSchema.statics.getUtilizationStats = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        last_updated: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          hospital_id: '$hospital_id',
          category: '$resource_category'
        },
        total_resources: { $sum: 1 },
        avg_utilization: { $avg: '$status_info.utilization_percentage' },
        resources_in_use: {
          $sum: {
            $cond: [{ $eq: ['$status_info.status', 'in_use'] }, 1, 0]
          }
        },
        resources_maintenance: {
          $sum: {
            $cond: [{ $eq: ['$status_info.status', 'maintenance'] }, 1, 0]
          }
        },
        resources_out_of_order: {
          $sum: {
            $cond: [{ $eq: ['$status_info.status', 'out_of_order'] }, 1, 0]
          }
        },
        total_value: {
          $sum: { $toDouble: '$cost_info.current_value' }
        }
      }
    },
    {
      $group: {
        _id: '$_id.hospital_id',
        categories: {
          $push: {
            category: '$_id.category',
            stats: {
              total: '$total_resources',
              avg_utilization: '$avg_utilization',
              in_use: '$resources_in_use',
              maintenance: '$resources_maintenance',
              out_of_order: '$resources_out_of_order',
              value: '$total_value'
            }
          }
        },
        hospital_totals: {
          total_resources: { $sum: '$total_resources' },
          avg_utilization: { $avg: '$avg_utilization' },
          total_value: { $sum: '$total_value' }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('HospitalResource', hospitalResourceSchema);