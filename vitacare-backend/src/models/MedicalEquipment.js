const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const medicalEquipmentSchema = new mongoose.Schema({
  equipment_id: {
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
  equipment_type: {
    type: String,
    enum: [
      'xray', 'ct_scan', 'mri', 'ultrasound', 'ventilator', 'dialysis', 
      'ecg', 'defibrillator', 'oxygen_concentrator', 'anesthesia_machine',
      'surgical_table', 'autoclave', 'blood_analyzer', 'chemistry_analyzer',
      'microscope', 'endoscope', 'laser_therapy', 'physiotherapy_equipment'
    ],
    required: true,
    index: true
  },
  equipment_name: {
    type: String,
    required: true,
    maxlength: 200
  },
  technical_specifications: {
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    serial_number: {
      type: String,
      required: true,
      unique: true
    },
    manufacturing_year: Number,
    country_of_origin: String,
    power_requirements: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number
    },
    technical_features: [String]
  },
  operational_status: {
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'out_of_order', 'scheduled_maintenance', 'calibration', 'upgrade'],
      default: 'operational',
      index: true
    },
    operational_efficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    last_calibration_date: Date,
    next_calibration_due: Date,
    calibration_frequency_days: {
      type: Number,
      default: 90
    },
    performance_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 8
    }
  },
  maintenance_tracking: {
    last_maintenance: Date,
    next_maintenance_due: Date,
    maintenance_frequency_days: {
      type: Number,
      default: 30
    },
    total_maintenance_hours: {
      type: Number,
      default: 0
    },
    maintenance_cost_monthly: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    preventive_maintenance_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 85
    },
    maintenance_history: [{
      date: Date,
      maintenance_type: {
        type: String,
        enum: ['routine', 'preventive', 'corrective', 'emergency', 'calibration']
      },
      duration_hours: Number,
      cost: mongoose.Schema.Types.Decimal128,
      technician: String,
      vendor: String,
      work_description: String,
      parts_replaced: [String],
      issues_found: [String],
      next_service_recommendation: Date
    }]
  },
  utilization_metrics: {
    utilization_hours_today: {
      type: Number,
      default: 0,
      min: 0,
      max: 24
    },
    utilization_hours_this_week: {
      type: Number,
      default: 0
    },
    utilization_hours_this_month: {
      type: Number,
      default: 0
    },
    total_utilization_hours: {
      type: Number,
      default: 0
    },
    average_daily_usage: {
      type: Number,
      default: 0
    },
    peak_usage_hours: [String], // e.g., ['09:00-11:00', '14:00-16:00']
    utilization_trend: {
      type: String,
      enum: ['increasing', 'stable', 'decreasing'],
      default: 'stable'
    },
    patients_served_today: {
      type: Number,
      default: 0
    },
    patients_served_this_month: {
      type: Number,
      default: 0
    }
  },
  location_assignment: {
    department_location: {
      type: String,
      required: true,
      maxlength: 100
    },
    building: String,
    floor: String,
    room_number: String,
    exact_coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    },
    is_portable: {
      type: Boolean,
      default: false
    },
    current_location: String, // For portable equipment
    movement_history: [{
      from_location: String,
      to_location: String,
      moved_date: Date,
      moved_by: String,
      reason: String
    }]
  },
  operator_management: {
    primary_operator: {
      staff_id: String,
      name: String,
      qualification: String,
      certification_level: String,
      contact: String
    },
    certified_operators: [{
      staff_id: String,
      name: String,
      certification_date: Date,
      certification_expiry: Date,
      competency_level: String
    }],
    operator_assigned: {
      type: String,
      maxlength: 100
    },
    training_required: {
      type: Boolean,
      default: false
    },
    training_records: [{
      staff_id: String,
      training_date: Date,
      training_type: String,
      trainer_name: String,
      certification_awarded: Boolean
    }]
  },
  financial_tracking: {
    procurement_date: Date,
    procurement_cost: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    installation_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    annual_maintenance_contract_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    depreciation_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 10
    },
    current_book_value: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    insurance_value: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    revenue_generated_monthly: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    }
  },
  warranty_service: {
    warranty_expiry: Date,
    warranty_provider: String,
    warranty_terms: String,
    extended_warranty: {
      has_extended: Boolean,
      provider: String,
      expiry_date: Date,
      coverage_details: String
    },
    service_contract: {
      has_amc: Boolean,
      provider: String,
      contract_start: Date,
      contract_end: Date,
      service_level: String,
      response_time_hours: Number
    }
  },
  quality_compliance: {
    regulatory_approvals: [{
      approval_body: String,
      approval_number: String,
      approval_date: Date,
      expiry_date: Date,
      compliance_status: {
        type: String,
        enum: ['compliant', 'non_compliant', 'pending_renewal']
      }
    }],
    quality_certifications: [String],
    safety_incidents: [{
      incident_date: Date,
      incident_type: String,
      severity_level: String,
      description: String,
      corrective_action: String,
      resolved: Boolean,
      resolution_date: Date
    }],
    audit_history: [{
      audit_date: Date,
      auditor: String,
      audit_type: String,
      findings: [String],
      compliance_score: Number,
      recommendations: [String]
    }]
  },
  booking_schedule: [{
    booking_id: String,
    patient_id: String,
    patient_name: String,
    booking_date: Date,
    time_slot: String,
    procedure_type: String,
    estimated_duration: Number,
    doctor_assigned: String,
    booking_status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled']
    },
    priority_level: {
      type: String,
      enum: ['routine', 'urgent', 'emergency']
    }
  }],
  performance_analytics: {
    uptime_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 95
    },
    downtime_hours_this_month: {
      type: Number,
      default: 0
    },
    efficiency_rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8
    },
    patient_throughput: {
      daily_average: Number,
      monthly_total: Number,
      yearly_total: Number
    },
    cost_per_procedure: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    roi_monthly: {
      type: Number,
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
  collection: 'medical_equipment'
});

// Indexes for performance optimization
medicalEquipmentSchema.index({ hospital_id: 1, equipment_type: 1 });
medicalEquipmentSchema.index({ rho_id: 1, 'operational_status.status': 1 });
medicalEquipmentSchema.index({ 'maintenance_tracking.next_maintenance_due': 1 });
medicalEquipmentSchema.index({ 'warranty_service.warranty_expiry': 1 });
medicalEquipmentSchema.index({ 'location_assignment.department_location': 1 });
medicalEquipmentSchema.index({ 'technical_specifications.serial_number': 1 });

// Pre-save middleware
medicalEquipmentSchema.pre('save', function(next) {
  // Calculate current book value based on depreciation
  if (this.financial_tracking.procurement_cost && this.financial_tracking.depreciation_rate) {
    const yearsSincePurchase = this.financial_tracking.procurement_date ? 
      (Date.now() - this.financial_tracking.procurement_date.getTime()) / (1000 * 60 * 60 * 24 * 365) : 0;
    
    const procurementCost = parseFloat(this.financial_tracking.procurement_cost.toString());
    const depreciationAmount = (procurementCost * this.financial_tracking.depreciation_rate * yearsSincePurchase) / 100;
    this.financial_tracking.current_book_value = Math.max(0, procurementCost - depreciationAmount);
  }
  
  this.updated_at = Date.now();
  next();
});

// Method to schedule maintenance
medicalEquipmentSchema.methods.scheduleMaintenance = function(maintenanceType, scheduledDate, technician, notes) {
  this.maintenance_tracking.maintenance_history.push({
    date: scheduledDate,
    maintenance_type: maintenanceType,
    technician: technician,
    work_description: notes,
    next_service_recommendation: new Date(scheduledDate.getTime() + (this.maintenance_tracking.maintenance_frequency_days * 24 * 60 * 60 * 1000))
  });
  
  this.operational_status.status = 'scheduled_maintenance';
  return this.save();
};

// Method to update utilization
medicalEquipmentSchema.methods.updateUtilization = function(hoursUsed, patientsServed = 1) {
  this.utilization_metrics.utilization_hours_today += hoursUsed;
  this.utilization_metrics.utilization_hours_this_week += hoursUsed;
  this.utilization_metrics.utilization_hours_this_month += hoursUsed;
  this.utilization_metrics.total_utilization_hours += hoursUsed;
  this.utilization_metrics.patients_served_today += patientsServed;
  this.utilization_metrics.patients_served_this_month += patientsServed;
  
  return this.save();
};

// Method to book equipment
medicalEquipmentSchema.methods.bookEquipment = function(bookingDetails) {
  this.booking_schedule.push({
    booking_id: uuidv4(),
    ...bookingDetails,
    booking_status: 'scheduled'
  });
  
  return this.save();
};

// Method to report equipment issue
medicalEquipmentSchema.methods.reportIssue = function(issueType, severity, description, reportedBy) {
  this.quality_compliance.safety_incidents.push({
    incident_date: new Date(),
    incident_type: issueType,
    severity_level: severity,
    description: description,
    resolved: false
  });
  
  if (severity === 'critical' || severity === 'high') {
    this.operational_status.status = 'out_of_order';
  }
  
  return this.save();
};

// Static method to get equipment by RHO and type
medicalEquipmentSchema.statics.getEquipmentByRHO = function(rhoId, equipmentType = null) {
  const query = { rho_id: rhoId };
  if (equipmentType) query.equipment_type = equipmentType;
  
  return this.find(query).sort({ hospital_name: 1, equipment_name: 1 });
};

// Static method to get maintenance due equipment
medicalEquipmentSchema.statics.getMaintenanceDue = function(rhoId, daysAhead = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return this.find({
    rho_id: rhoId,
    'maintenance_tracking.next_maintenance_due': { $lte: futureDate },
    'operational_status.status': { $ne: 'out_of_order' }
  }).sort({ 'maintenance_tracking.next_maintenance_due': 1 });
};

// Static method to get equipment utilization report
medicalEquipmentSchema.statics.getUtilizationReport = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        updated_at: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          hospital_id: '$hospital_id',
          equipment_type: '$equipment_type'
        },
        total_equipment: { $sum: 1 },
        avg_utilization_hours: { $avg: '$utilization_metrics.utilization_hours_this_month' },
        total_patients_served: { $sum: '$utilization_metrics.patients_served_this_month' },
        avg_uptime: { $avg: '$performance_analytics.uptime_percentage' },
        operational_count: {
          $sum: {
            $cond: [{ $eq: ['$operational_status.status', 'operational'] }, 1, 0]
          }
        },
        maintenance_count: {
          $sum: {
            $cond: [{ $in: ['$operational_status.status', ['maintenance', 'scheduled_maintenance']] }, 1, 0]
          }
        },
        out_of_order_count: {
          $sum: {
            $cond: [{ $eq: ['$operational_status.status', 'out_of_order'] }, 1, 0]
          }
        },
        total_value: { $sum: { $toDouble: '$financial_tracking.current_book_value' } },
        total_revenue: { $sum: { $toDouble: '$financial_tracking.revenue_generated_monthly' } }
      }
    },
    {
      $sort: { '_id.hospital_id': 1, '_id.equipment_type': 1 }
    }
  ]);
};

// Static method to get equipment alerts and notifications
medicalEquipmentSchema.statics.getEquipmentAlerts = function(rhoId) {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        $or: [
          { 'operational_status.status': 'out_of_order' },
          { 'maintenance_tracking.next_maintenance_due': { $lte: oneWeekFromNow } },
          { 'warranty_service.warranty_expiry': { $lte: oneWeekFromNow } },
          { 'performance_analytics.uptime_percentage': { $lt: 80 } }
        ]
      }
    },
    {
      $project: {
        equipment_name: 1,
        hospital_name: 1,
        equipment_type: 1,
        'operational_status.status': 1,
        'maintenance_tracking.next_maintenance_due': 1,
        'warranty_service.warranty_expiry': 1,
        'performance_analytics.uptime_percentage': 1,
        alert_type: {
          $switch: {
            branches: [
              { case: { $eq: ['$operational_status.status', 'out_of_order'] }, then: 'out_of_order' },
              { case: { $lte: ['$maintenance_tracking.next_maintenance_due', oneWeekFromNow] }, then: 'maintenance_due' },
              { case: { $lte: ['$warranty_service.warranty_expiry', oneWeekFromNow] }, then: 'warranty_expiring' },
              { case: { $lt: ['$performance_analytics.uptime_percentage', 80] }, then: 'low_uptime' }
            ],
            default: 'unknown'
          }
        },
        severity: {
          $switch: {
            branches: [
              { case: { $eq: ['$operational_status.status', 'out_of_order'] }, then: 'critical' },
              { case: { $lt: ['$performance_analytics.uptime_percentage', 60] }, then: 'critical' },
              { case: { $lte: ['$maintenance_tracking.next_maintenance_due', today] }, then: 'high' },
              { case: { $lte: ['$warranty_service.warranty_expiry', today] }, then: 'high' }
            ],
            default: 'medium'
          }
        }
      }
    },
    {
      $sort: { severity: 1, hospital_name: 1 }
    }
  ]);
};

module.exports = mongoose.model('MedicalEquipment', medicalEquipmentSchema);