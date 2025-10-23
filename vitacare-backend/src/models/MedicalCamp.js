const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const medicalCampSchema = new mongoose.Schema({
  camp_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
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
  camp_name: {
    type: String,
    required: true,
    maxlength: 200
  },
  camp_type: {
    type: String,
    enum: ['outbreak_response', 'preventive_healthcare', 'specialized_screening', 'emergency_response', 'vaccination_drive', 'awareness_campaign'],
    required: true,
    index: true
  },
  camp_purpose: {
    type: String,
    required: true,
    maxlength: 500 // Detailed purpose and objectives
  },
  camp_objectives: [{
    objective: String,
    target_metric: String,
    target_value: Number,
    achieved_value: {
      type: Number,
      default: 0
    }
  }],
  location_details: {
    address: {
      village: String,
      taluk: String,
      district: String,
      state: {
        type: String,
        default: 'Tamil Nadu'
      },
      pincode: String,
      landmark: String
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    },
    venue_details: {
      venue_name: String,
      venue_type: {
        type: String,
        enum: ['community_center', 'school', 'temple', 'government_building', 'hospital', 'open_ground']
      },
      capacity: Number,
      facilities_available: [String],
      accessibility_features: [String]
    },
    transport_accessibility: {
      nearest_bus_stop: String,
      distance_from_main_road: Number, // in km
      parking_available: Boolean,
      wheelchair_accessible: Boolean
    }
  },
  scheduling: {
    start_date: {
      type: Date,
      required: true,
      index: true
    },
    end_date: {
      type: Date,
      required: true,
      index: true
    },
    duration_days: {
      type: Number,
      required: true
    },
    daily_timings: {
      start_time: String,
      end_time: String,
      lunch_break: {
        start: String,
        end: String
      }
    },
    expected_daily_footfall: Number,
    working_days: [String] // ['Monday', 'Tuesday', ...]
  },
  target_population: {
    total_target: {
      type: Number,
      required: true
    },
    demographic_breakdown: {
      children_under_5: Number,
      children_5_to_18: Number,
      adults_18_to_60: Number,
      elderly_above_60: Number,
      pregnant_women: Number
    },
    special_groups: [{
      group_name: String,
      target_count: Number,
      special_requirements: String
    }],
    estimated_beneficiaries: {
      type: Number,
      required: true
    },
    actual_beneficiaries_served: {
      type: Number,
      default: 0
    }
  },
  camp_status: {
    status: {
      type: String,
      enum: ['planned', 'approved', 'preparation', 'ongoing', 'completed', 'cancelled', 'postponed'],
      default: 'planned',
      index: true
    },
    approval_workflow: [{
      stage: String,
      approver_role: String,
      approver_name: String,
      approval_date: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
      },
      comments: String
    }],
    status_history: [{
      previous_status: String,
      new_status: String,
      changed_date: Date,
      changed_by: String,
      reason: String
    }]
  },
  organizing_details: {
    organizing_hospital_id: {
      type: String,
      required: true
    },
    organizing_hospital_name: String,
    camp_coordinator: {
      staff_id: String,
      name: String,
      designation: String,
      contact_phone: String,
      email: String
    },
    partner_organizations: [{
      name: String,
      type: {
        type: String,
        enum: ['ngo', 'government', 'private', 'international', 'community']
      },
      role: String,
      contact_person: String,
      contact_details: String,
      contribution: String
    }],
    volunteer_organizations: [{
      organization_name: String,
      volunteer_count: Number,
      coordinator_name: String,
      coordinator_contact: String
    }]
  },
  budget_management: {
    budget_allocated: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    budget_breakdown: {
      staff_costs: mongoose.Schema.Types.Decimal128,
      equipment_transport: mongoose.Schema.Types.Decimal128,
      medicines_supplies: mongoose.Schema.Types.Decimal128,
      venue_logistics: mongoose.Schema.Types.Decimal128,
      food_refreshments: mongoose.Schema.Types.Decimal128,
      awareness_materials: mongoose.Schema.Types.Decimal128,
      contingency: mongoose.Schema.Types.Decimal128
    },
    budget_utilized: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    budget_remaining: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    expense_tracking: [{
      date: Date,
      category: String,
      description: String,
      amount: mongoose.Schema.Types.Decimal128,
      approved_by: String,
      receipt_number: String
    }]
  },
  staff_deployment: {
    doctors: [{
      staff_id: String,
      name: String,
      specialization: String,
      source_hospital: String,
      role_in_camp: String,
      contact: String,
      shift_timings: String
    }],
    nurses: [{
      staff_id: String,
      name: String,
      source_hospital: String,
      experience_years: Number,
      contact: String,
      assigned_duties: [String]
    }],
    technicians: [{
      staff_id: String,
      name: String,
      specialization: String,
      source_hospital: String,
      equipment_responsibility: [String]
    }],
    support_staff: [{
      staff_id: String,
      name: String,
      role: String,
      source_hospital: String,
      responsibilities: [String]
    }],
    volunteers: [{
      volunteer_id: String,
      name: String,
      organization: String,
      contact: String,
      assigned_tasks: [String],
      training_completed: Boolean
    }],
    total_staff_deployed: {
      type: Number,
      default: 0
    }
  },
  services_offered: [{
    service_category: {
      type: String,
      enum: ['consultation', 'screening', 'vaccination', 'diagnostic', 'treatment', 'awareness', 'referral']
    },
    service_name: {
      type: String,
      required: true
    },
    service_description: String,
    target_beneficiaries: Number,
    actual_beneficiaries: {
      type: Number,
      default: 0
    },
    resources_required: [String],
    staff_assigned: [String],
    service_metrics: {
      completion_rate: Number,
      satisfaction_score: Number,
      average_time_per_beneficiary: Number
    }
  }],
  equipment_deployed: [{
    equipment_id: String,
    equipment_name: String,
    equipment_type: String,
    source_hospital: String,
    deployment_date: Date,
    return_date: Date,
    condition_before: String,
    condition_after: String,
    usage_hours: Number,
    operator_assigned: String
  }],
  medicines_supplies: [{
    supply_id: String,
    supply_name: String,
    category: String,
    quantity_allocated: Number,
    quantity_used: Number,
    quantity_remaining: Number,
    source_hospital: String,
    expiry_date: Date,
    cost_per_unit: mongoose.Schema.Types.Decimal128,
    total_cost: mongoose.Schema.Types.Decimal128
  }],
  logistics_transport: {
    transportation_arranged: [{
      vehicle_type: String,
      vehicle_number: String,
      purpose: String, // staff transport, equipment transport, patient transport
      driver_details: String,
      fuel_allocated: Number,
      distance_covered: Number
    }],
    accommodation: [{
      type: String, // hotel, guest house, community hall
      capacity: Number,
      cost_per_day: mongoose.Schema.Types.Decimal128,
      booked_for: [String] // staff names
    }],
    catering_arrangements: {
      meals_planned: Number,
      cost_per_meal: mongoose.Schema.Types.Decimal128,
      vendor_details: String,
      special_dietary_requirements: [String]
    }
  },
  beneficiary_tracking: {
    registration_process: {
      pre_registration_count: Number,
      walk_in_count: Number,
      total_registered: Number,
      registration_method: [String] // online, phone, on-spot
    },
    beneficiary_demographics: {
      age_groups: {
        under_5: Number,
        age_5_18: Number,
        age_18_60: Number,
        above_60: Number
      },
      gender_distribution: {
        male: Number,
        female: Number,
        other: Number
      },
      special_categories: {
        pregnant_women: Number,
        lactating_mothers: Number,
        disabled: Number,
        chronic_patients: Number
      }
    },
    daily_attendance: [{
      date: Date,
      registered_count: Number,
      served_count: Number,
      pending_count: Number,
      no_show_count: Number
    }],
    services_utilization: [{
      service_name: String,
      beneficiaries_count: Number,
      completion_rate: Number,
      average_waiting_time: Number
    }]
  },
  outcomes_results: {
    health_outcomes: {
      cases_detected: [{
        condition: String,
        new_cases: Number,
        follow_up_cases: Number,
        severity: String
      }],
      treatments_provided: [{
        treatment_type: String,
        beneficiaries_count: Number,
        success_rate: Number,
        complications: Number
      }],
      referrals_made: [{
        referral_type: String,
        referral_hospital: String,
        patient_count: Number,
        urgency_level: String,
        follow_up_status: String
      }]
    },
    screening_results: [{
      screening_type: String,
      total_screened: Number,
      positive_cases: Number,
      negative_cases: Number,
      inconclusive_cases: Number
    }],
    vaccination_results: [{
      vaccine_type: String,
      doses_administered: Number,
      age_group: String,
      adverse_events: Number,
      coverage_percentage: Number
    }],
    awareness_impact: {
      sessions_conducted: Number,
      participants_count: Number,
      materials_distributed: Number,
      feedback_collected: Number,
      knowledge_improvement_score: Number
    }
  },
  performance_metrics: {
    efficiency_metrics: {
      beneficiaries_per_hour: Number,
      cost_per_beneficiary: mongoose.Schema.Types.Decimal128,
      staff_utilization_rate: Number,
      resource_utilization_rate: Number
    },
    quality_metrics: {
      service_quality_score: Number,
      beneficiary_satisfaction: Number,
      staff_satisfaction: Number,
      complaint_resolution_rate: Number
    },
    impact_metrics: {
      health_improvement_score: Number,
      community_coverage_percentage: Number,
      follow_up_compliance_rate: Number,
      referral_completion_rate: Number
    }
  },
  feedback_evaluation: {
    beneficiary_feedback: [{
      feedback_date: Date,
      beneficiary_id: String,
      service_rating: Number,
      staff_rating: Number,
      facility_rating: Number,
      wait_time_rating: Number,
      overall_experience: Number,
      suggestions: String,
      would_recommend: Boolean
    }],
    staff_feedback: [{
      staff_id: String,
      feedback_date: Date,
      organization_rating: Number,
      resource_adequacy: Number,
      workload_rating: Number,
      coordination_rating: Number,
      suggestions: String
    }],
    partner_feedback: [{
      organization_name: String,
      collaboration_rating: Number,
      coordination_effectiveness: Number,
      resource_sharing_satisfaction: Number,
      future_collaboration_interest: Boolean,
      suggestions: String
    }],
    community_feedback: {
      community_leaders_feedback: String,
      local_government_feedback: String,
      media_coverage: [String],
      social_media_mentions: Number,
      overall_community_satisfaction: Number
    }
  },
  lessons_learned: {
    successes: [String],
    challenges: [String],
    improvement_areas: [String],
    best_practices: [String],
    recommendations: [String],
    scalability_potential: String,
    sustainability_factors: [String]
  },
  reporting_documentation: {
    daily_reports: [{
      date: Date,
      report_content: String,
      reported_by: String,
      key_highlights: [String],
      issues_faced: [String]
    }],
    photographic_evidence: [String], // URLs to images
    media_coverage: [{
      media_outlet: String,
      coverage_type: String, // newspaper, tv, radio, online
      coverage_date: Date,
      content_summary: String,
      media_file_url: String
    }],
    official_documents: [{
      document_type: String,
      document_name: String,
      file_url: String,
      uploaded_by: String,
      upload_date: Date
    }]
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
  collection: 'medical_camps'
});

// Indexes for efficient queries
medicalCampSchema.index({ rho_id: 1, camp_type: 1, 'camp_status.status': 1 });
medicalCampSchema.index({ 'scheduling.start_date': 1, 'scheduling.end_date': 1 });
medicalCampSchema.index({ 'location_details.coordinates': '2dsphere' });
medicalCampSchema.index({ 'location_details.address.district': 1, 'location_details.address.taluk': 1 });
medicalCampSchema.index({ 'organizing_details.organizing_hospital_id': 1 });

// Pre-save middleware
medicalCampSchema.pre('save', function(next) {
  // Calculate budget remaining
  const allocated = parseFloat(this.budget_management.budget_allocated.toString());
  const utilized = parseFloat(this.budget_management.budget_utilized.toString());
  this.budget_management.budget_remaining = allocated - utilized;
  
  // Calculate total staff deployed
  this.staff_deployment.total_staff_deployed = 
    this.staff_deployment.doctors.length +
    this.staff_deployment.nurses.length +
    this.staff_deployment.technicians.length +
    this.staff_deployment.support_staff.length +
    this.staff_deployment.volunteers.length;
  
  this.updated_at = Date.now();
  next();
});

// Method to approve camp
medicalCampSchema.methods.approveCamp = function(approverName, approverRole, comments = '') {
  this.camp_status.status = 'approved';
  this.camp_status.approval_workflow.push({
    stage: 'final_approval',
    approver_role: approverRole,
    approver_name: approverName,
    approval_date: new Date(),
    status: 'approved',
    comments: comments
  });
  
  return this.save();
};

// Method to start camp
medicalCampSchema.methods.startCamp = function() {
  this.camp_status.status = 'ongoing';
  this.camp_status.status_history.push({
    previous_status: 'approved',
    new_status: 'ongoing',
    changed_date: new Date(),
    reason: 'Camp started as scheduled'
  });
  
  return this.save();
};

// Method to complete camp
medicalCampSchema.methods.completeCamp = function(finalReport = {}) {
  this.camp_status.status = 'completed';
  this.camp_status.status_history.push({
    previous_status: 'ongoing',
    new_status: 'completed',
    changed_date: new Date(),
    reason: 'Camp completed successfully'
  });
  
  // Add final outcomes if provided
  if (finalReport.beneficiaries_served) {
    this.target_population.actual_beneficiaries_served = finalReport.beneficiaries_served;
  }
  
  return this.save();
};

// Method to add daily attendance
medicalCampSchema.methods.addDailyAttendance = function(attendanceData) {
  this.beneficiary_tracking.daily_attendance.push(attendanceData);
  return this.save();
};

// Method to add expense
medicalCampSchema.methods.addExpense = function(expenseData) {
  this.budget_management.expense_tracking.push(expenseData);
  this.budget_management.budget_utilized = 
    this.budget_management.expense_tracking.reduce((total, expense) => 
      total + parseFloat(expense.amount.toString()), 0);
  
  return this.save();
};

// Method to add beneficiary feedback
medicalCampSchema.methods.addBeneficiaryFeedback = function(feedbackData) {
  this.feedback_evaluation.beneficiary_feedback.push(feedbackData);
  
  // Recalculate average satisfaction if feedback exists
  if (this.feedback_evaluation.beneficiary_feedback.length > 0) {
    const avgSatisfaction = this.feedback_evaluation.beneficiary_feedback
      .reduce((sum, feedback) => sum + feedback.overall_experience, 0) / 
      this.feedback_evaluation.beneficiary_feedback.length;
    
    this.performance_metrics.quality_metrics.beneficiary_satisfaction = avgSatisfaction;
  }
  
  return this.save();
};

// Static method to get camps by RHO
medicalCampSchema.statics.getCampsByRHO = function(rhoId, status = null, campType = null) {
  const query = { rho_id: rhoId };
  if (status) query['camp_status.status'] = status;
  if (campType) query.camp_type = campType;
  
  return this.find(query).sort({ 'scheduling.start_date': -1 });
};

// Static method to get ongoing camps
medicalCampSchema.statics.getOngoingCamps = function(rhoId = null) {
  const query = { 'camp_status.status': 'ongoing' };
  if (rhoId) query.rho_id = rhoId;
  
  return this.find(query).sort({ 'scheduling.start_date': 1 });
};

// Static method to get upcoming camps
medicalCampSchema.statics.getUpcomingCamps = function(rhoId = null, daysAhead = 30) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const query = {
    'camp_status.status': { $in: ['approved', 'preparation'] },
    'scheduling.start_date': { $gte: today, $lte: futureDate }
  };
  
  if (rhoId) query.rho_id = rhoId;
  
  return this.find(query).sort({ 'scheduling.start_date': 1 });
};

// Static method to get camp performance analytics
medicalCampSchema.statics.getCampPerformanceAnalytics = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        'scheduling.start_date': { $gte: startDate, $lte: endDate },
        'camp_status.status': 'completed'
      }
    },
    {
      $group: {
        _id: '$camp_type',
        total_camps: { $sum: 1 },
        total_beneficiaries: { $sum: '$target_population.actual_beneficiaries_served' },
        total_budget_allocated: { $sum: { $toDouble: '$budget_management.budget_allocated' } },
        total_budget_utilized: { $sum: { $toDouble: '$budget_management.budget_utilized' } },
        avg_beneficiary_satisfaction: { $avg: '$performance_metrics.quality_metrics.beneficiary_satisfaction' },
        avg_cost_per_beneficiary: { $avg: { $toDouble: '$performance_metrics.efficiency_metrics.cost_per_beneficiary' } },
        avg_service_quality: { $avg: '$performance_metrics.quality_metrics.service_quality_score' }
      }
    },
    {
      $addFields: {
        budget_utilization_percentage: {
          $multiply: [
            { $divide: ['$total_budget_utilized', '$total_budget_allocated'] },
            100
          ]
        },
        avg_beneficiaries_per_camp: {
          $divide: ['$total_beneficiaries', '$total_camps']
        }
      }
    },
    {
      $sort: { total_camps: -1 }
    }
  ]);
};

// Static method to search camps by location
medicalCampSchema.statics.searchCampsByLocation = function(longitude, latitude, maxDistance = 50000) {
  return this.find({
    'location_details.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  }).limit(20);
};

module.exports = mongoose.model('MedicalCamp', medicalCampSchema);