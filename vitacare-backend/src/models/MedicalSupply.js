const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const medicalSupplySchema = new mongoose.Schema({
  supply_id: {
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
  supply_category: {
    type: String,
    enum: ['medicines', 'vaccines', 'consumables', 'blood_products', 'reagents', 'surgical_supplies', 'diagnostic_supplies'],
    required: true,
    index: true
  },
  supply_name: {
    type: String,
    required: true,
    maxlength: 200,
    index: true
  },
  supply_details: {
    generic_name: String,
    brand_name: String,
    strength: String, // e.g., "500mg", "10ml"
    dosage_form: String, // tablet, capsule, injection, etc.
    therapeutic_category: String,
    drug_classification: String,
    schedule_category: String // H, H1, X, etc.
  },
  batch_information: {
    batch_number: {
      type: String,
      required: true,
      index: true
    },
    manufacturing_date: Date,
    expiry_date: {
      type: Date,
      required: true,
      index: true
    },
    manufacturer: {
      name: String,
      license_number: String,
      country: String
    },
    quality_certificates: [String]
  },
  inventory_status: {
    current_stock: {
      type: Number,
      required: true,
      min: 0
    },
    minimum_stock_level: {
      type: Number,
      required: true,
      min: 0
    },
    maximum_stock_level: {
      type: Number,
      default: 1000
    },
    reorder_point: {
      type: Number,
      required: true,
      min: 0
    },
    reserved_stock: {
      type: Number,
      default: 0,
      min: 0
    },
    available_stock: {
      type: Number,
      default: 0,
      min: 0
    },
    unit_of_measurement: {
      type: String,
      required: true // tablets, vials, bottles, boxes, strips
    }
  },
  procurement_info: {
    supplier_name: {
      type: String,
      required: true
    },
    supplier_contact: {
      phone: String,
      email: String,
      address: String
    },
    purchase_order_number: String,
    purchase_date: Date,
    unit_cost: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    total_cost: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    tax_details: {
      gst_rate: Number,
      gst_amount: mongoose.Schema.Types.Decimal128,
      other_taxes: mongoose.Schema.Types.Decimal128
    },
    payment_terms: String,
    delivery_date: Date
  },
  storage_management: {
    storage_requirements: {
      temperature_range: {
        type: String,
        required: true // "2-8°C", "Room Temperature", etc.
      },
      humidity_range: String,
      light_protection: {
        type: Boolean,
        default: false
      },
      special_conditions: String
    },
    storage_location: {
      department: {
        type: String,
        required: true
      },
      room_number: String,
      rack_number: String,
      position: String,
      refrigerator_id: String // For temperature-sensitive items
    },
    cold_chain_maintained: {
      type: Boolean,
      default: true
    },
    storage_compliance_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    }
  },
  usage_tracking: {
    consumption_rate_daily: {
      type: Number,
      default: 0
    },
    consumption_rate_weekly: {
      type: Number,
      default: 0
    },
    consumption_rate_monthly: {
      type: Number,
      default: 0
    },
    seasonal_variation: {
      type: String,
      enum: ['high_summer', 'high_winter', 'high_monsoon', 'stable'],
      default: 'stable'
    },
    peak_consumption_months: [String],
    usage_pattern: {
      type: String,
      enum: ['increasing', 'stable', 'decreasing'],
      default: 'stable'
    },
    last_dispensed: Date,
    total_dispensed_this_month: {
      type: Number,
      default: 0
    }
  },
  dispensing_info: {
    department_allocated: {
      type: String,
      maxlength: 100
    },
    prescription_required: {
      type: Boolean,
      default: true
    },
    dispensing_restrictions: [String],
    authorized_dispensers: [{
      staff_id: String,
      name: String,
      designation: String,
      authorization_level: String
    }],
    dispensing_log: [{
      date: Date,
      quantity_dispensed: Number,
      dispensed_to: {
        patient_id: String,
        patient_name: String,
        prescription_number: String,
        doctor_name: String
      },
      dispensed_by: {
        staff_id: String,
        staff_name: String
      },
      purpose: String,
      balance_after_dispensing: Number
    }]
  },
  quality_control: {
    quality_status: {
      type: String,
      enum: ['approved', 'pending_qc', 'rejected', 'recalled'],
      default: 'pending_qc'
    },
    quality_tests_required: [String],
    quality_certificates: [String],
    batch_recall_info: {
      is_recalled: {
        type: Boolean,
        default: false
      },
      recall_date: Date,
      recall_reason: String,
      recall_authority: String,
      action_taken: String
    },
    adverse_events: [{
      event_date: Date,
      event_description: String,
      severity: String,
      patient_affected: String,
      reported_to_authority: Boolean,
      investigation_status: String
    }]
  },
  alerts_monitoring: {
    expiry_alert_days: {
      type: Number,
      default: 30
    },
    low_stock_alert_enabled: {
      type: Boolean,
      default: true
    },
    temperature_alert_enabled: {
      type: Boolean,
      default: true
    },
    current_alerts: [{
      alert_type: {
        type: String,
        enum: ['low_stock', 'expiry_soon', 'expired', 'temperature_breach', 'quality_issue']
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
    }]
  },
  financial_tracking: {
    current_stock_value: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    monthly_consumption_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    wastage_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    insurance_coverage: {
      covered: Boolean,
      policy_number: String,
      coverage_amount: mongoose.Schema.Types.Decimal128
    },
    cost_per_unit_trends: [{
      date: Date,
      cost: mongoose.Schema.Types.Decimal128,
      supplier: String
    }]
  },
  regulatory_compliance: {
    drug_license_required: {
      type: Boolean,
      default: false
    },
    narcotics_license_required: {
      type: Boolean,
      default: false
    },
    import_license_number: String,
    regulatory_approvals: [{
      approval_body: String,
      approval_number: String,
      approval_date: Date,
      expiry_date: Date
    }],
    prescription_audit_trail: [{
      audit_date: Date,
      auditor: String,
      compliance_score: Number,
      findings: [String],
      corrective_actions: [String]
    }]
  },
  last_restocked: Date,
  last_updated: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'medical_supplies'
});

// Compound indexes for efficient queries
medicalSupplySchema.index({ hospital_id: 1, supply_category: 1, 'inventory_status.current_stock': 1 });
medicalSupplySchema.index({ rho_id: 1, 'batch_information.expiry_date': 1 });
medicalSupplySchema.index({ 'inventory_status.current_stock': 1, 'inventory_status.minimum_stock_level': 1 });
medicalSupplySchema.index({ supply_name: 'text', 'supply_details.generic_name': 'text' });

// TTL index for expired supplies
medicalSupplySchema.index({ 'batch_information.expiry_date': 1 }, { 
  partialFilterExpression: { 'batch_information.expiry_date': { $lt: new Date() } }
});

// Pre-save middleware
medicalSupplySchema.pre('save', function(next) {
  // Calculate available stock
  this.inventory_status.available_stock = Math.max(0, 
    this.inventory_status.current_stock - this.inventory_status.reserved_stock
  );
  
  // Calculate current stock value
  const unitCost = parseFloat(this.procurement_info.unit_cost.toString());
  this.financial_tracking.current_stock_value = unitCost * this.inventory_status.current_stock;
  
  // Check and update alerts
  this.checkAndUpdateAlerts();
  
  this.last_updated = Date.now();
  next();
});

// Method to check and update alerts
medicalSupplySchema.methods.checkAndUpdateAlerts = function() {
  this.alerts_monitoring.current_alerts = []; // Reset alerts
  
  // Check for low stock
  if (this.inventory_status.current_stock <= this.inventory_status.minimum_stock_level) {
    this.alerts_monitoring.current_alerts.push({
      alert_type: 'low_stock',
      severity: this.inventory_status.current_stock === 0 ? 'critical' : 'high',
      message: `Stock level is ${this.inventory_status.current_stock} units, below minimum of ${this.inventory_status.minimum_stock_level}`,
      created_at: new Date(),
      resolved: false
    });
  }
  
  // Check for expiry
  const today = new Date();
  const expiryDate = new Date(this.batch_information.expiry_date);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 0) {
    this.alerts_monitoring.current_alerts.push({
      alert_type: 'expired',
      severity: 'critical',
      message: `Supply expired on ${expiryDate.toDateString()}`,
      created_at: new Date(),
      resolved: false
    });
  } else if (daysUntilExpiry <= this.alerts_monitoring.expiry_alert_days) {
    this.alerts_monitoring.current_alerts.push({
      alert_type: 'expiry_soon',
      severity: daysUntilExpiry <= 7 ? 'high' : 'medium',
      message: `Supply expires in ${daysUntilExpiry} days`,
      created_at: new Date(),
      resolved: false
    });
  }
};

// Method to dispense supply
medicalSupplySchema.methods.dispenseSupply = function(quantity, dispensingInfo, dispensedBy) {
  if (this.inventory_status.available_stock < quantity) {
    throw new Error('Insufficient stock available for dispensing');
  }
  
  // Update stock
  this.inventory_status.current_stock -= quantity;
  this.usage_tracking.total_dispensed_this_month += quantity;
  this.usage_tracking.last_dispensed = new Date();
  
  // Add to dispensing log
  this.dispensing_info.dispensing_log.push({
    date: new Date(),
    quantity_dispensed: quantity,
    dispensed_to: dispensingInfo,
    dispensed_by: dispensedBy,
    purpose: dispensingInfo.purpose || 'Patient treatment',
    balance_after_dispensing: this.inventory_status.current_stock
  });
  
  return this.save();
};

// Method to restock supply
medicalSupplySchema.methods.restockSupply = function(quantity, procurementInfo) {
  this.inventory_status.current_stock += quantity;
  this.last_restocked = new Date();
  
  // Update procurement info if provided
  if (procurementInfo) {
    Object.assign(this.procurement_info, procurementInfo);
  }
  
  return this.save();
};

// Method to reserve stock
medicalSupplySchema.methods.reserveStock = function(quantity, reservationDetails) {
  if (this.inventory_status.available_stock < quantity) {
    throw new Error('Insufficient available stock for reservation');
  }
  
  this.inventory_status.reserved_stock += quantity;
  return this.save();
};

// Static method to get supplies by category for RHO
medicalSupplySchema.statics.getSuppliesByCategory = function(rhoId, category, hospitalId = null) {
  const query = { rho_id: rhoId, supply_category: category };
  if (hospitalId) query.hospital_id = hospitalId;
  
  return this.find(query).sort({ supply_name: 1, 'batch_information.expiry_date': 1 });
};

// Static method to get expiring supplies
medicalSupplySchema.statics.getExpiringSupplies = function(rhoId, daysAhead = 30, hospitalId = null) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  const query = {
    rho_id: rhoId,
    'batch_information.expiry_date': { $lte: futureDate },
    'inventory_status.current_stock': { $gt: 0 }
  };
  
  if (hospitalId) query.hospital_id = hospitalId;
  
  return this.find(query).sort({ 'batch_information.expiry_date': 1 });
};

// Static method to get low stock supplies
medicalSupplySchema.statics.getLowStockSupplies = function(rhoId, hospitalId = null) {
  const query = { rho_id: rhoId };
  if (hospitalId) query.hospital_id = hospitalId;
  
  return this.find(query).where('inventory_status.current_stock').lte('inventory_status.minimum_stock_level');
};

// Static method to get supply consumption analytics
medicalSupplySchema.statics.getConsumptionAnalytics = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        'dispensing_info.dispensing_log.date': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $unwind: '$dispensing_info.dispensing_log'
    },
    {
      $match: {
        'dispensing_info.dispensing_log.date': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          hospital_id: '$hospital_id',
          supply_category: '$supply_category',
          supply_name: '$supply_name'
        },
        total_dispensed: { $sum: '$dispensing_info.dispensing_log.quantity_dispensed' },
        total_cost: { 
          $sum: { 
            $multiply: [
              '$dispensing_info.dispensing_log.quantity_dispensed',
              { $toDouble: '$procurement_info.unit_cost' }
            ]
          }
        },
        dispensing_frequency: { $sum: 1 },
        avg_dispensing_quantity: { $avg: '$dispensing_info.dispensing_log.quantity_dispensed' }
      }
    },
    {
      $group: {
        _id: {
          hospital_id: '$_id.hospital_id',
          supply_category: '$_id.supply_category'
        },
        supplies: {
          $push: {
            supply_name: '$_id.supply_name',
            total_dispensed: '$total_dispensed',
            total_cost: '$total_cost',
            dispensing_frequency: '$dispensing_frequency',
            avg_quantity: '$avg_dispensing_quantity'
          }
        },
        category_total_cost: { $sum: '$total_cost' },
        category_total_quantity: { $sum: '$total_dispensed' }
      }
    },
    {
      $sort: { '_id.hospital_id': 1, '_id.supply_category': 1 }
    }
  ]);
};

// Static method to get supply alerts summary
medicalSupplySchema.statics.getAlertsummary = function(rhoId, hospitalId = null) {
  const query = { 
    rho_id: rhoId,
    'alerts_monitoring.current_alerts.resolved': false
  };
  if (hospitalId) query.hospital_id = hospitalId;
  
  return this.aggregate([
    { $match: query },
    { $unwind: '$alerts_monitoring.current_alerts' },
    {
      $match: {
        'alerts_monitoring.current_alerts.resolved': false
      }
    },
    {
      $group: {
        _id: {
          hospital_id: '$hospital_id',
          alert_type: '$alerts_monitoring.current_alerts.alert_type',
          severity: '$alerts_monitoring.current_alerts.severity'
        },
        count: { $sum: 1 },
        supplies: {
          $push: {
            supply_name: '$supply_name',
            current_stock: '$inventory_status.current_stock',
            expiry_date: '$batch_information.expiry_date'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id.hospital_id',
        alerts_by_type: {
          $push: {
            alert_type: '$_id.alert_type',
            severity: '$_id.severity',
            count: '$count',
            supplies: '$supplies'
          }
        },
        total_alerts: { $sum: '$count' }
      }
    }
  ]);
};

module.exports = mongoose.model('MedicalSupply', medicalSupplySchema);