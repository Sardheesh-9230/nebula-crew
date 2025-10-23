const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const outbreakManagementSchema = new mongoose.Schema({
  outbreak_id: {
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
  disease_info: {
    disease_name: {
      type: String,
      required: true,
      index: true
    },
    disease_code: String, // ICD-10 code
    outbreak_category: {
      type: String,
      enum: ['communicable', 'non_communicable', 'epidemic', 'pandemic', 'endemic', 'foodborne', 'waterborne'],
      required: true
    },
    pathogen_type: {
      type: String,
      enum: ['viral', 'bacterial', 'parasitic', 'fungal', 'toxic', 'unknown']
    },
    transmission_mode: [String], // airborne, contact, vector, foodborne, etc.
    incubation_period_days: {
      min: Number,
      max: Number
    },
    infectious_period_days: Number
  },
  outbreak_scope: {
    affected_areas: [{
      area_type: {
        type: String,
        enum: ['village', 'taluk', 'district', 'state']
      },
      area_name: String,
      population: Number,
      cases_reported: Number,
      attack_rate: Number, // percentage
      coordinates: {
        type: {
          type: String,
          enum: ['Point', 'Polygon'],
          default: 'Point'
        },
        coordinates: mongoose.Schema.Types.Mixed
      }
    }],
    geographic_spread: {
      type: String,
      enum: ['localized', 'regional', 'widespread'],
      default: 'localized'
    },
    population_at_risk: Number,
    high_risk_groups: [String]
  },
  timeline_tracking: {
    first_case_reported: {
      type: Date,
      required: true,
      index: true
    },
    index_case_details: {
      patient_id: String,
      age: Number,
      gender: String,
      occupation: String,
      travel_history: String,
      symptom_onset: Date
    },
    outbreak_declared_date: Date,
    peak_date: Date,
    decline_start_date: Date,
    outbreak_resolved_date: Date,
    total_duration_days: Number
  },
  case_management: {
    total_cases: {
      type: Number,
      default: 0,
      index: true
    },
    confirmed_cases: {
      type: Number,
      default: 0
    },
    probable_cases: {
      type: Number,
      default: 0
    },
    suspected_cases: {
      type: Number,
      default: 0
    },
    active_cases: {
      type: Number,
      default: 0
    },
    recovered_cases: {
      type: Number,
      default: 0
    },
    deaths: {
      type: Number,
      default: 0
    },
    case_fatality_rate: {
      type: Number,
      default: 0
    },
    hospitalized_cases: {
      type: Number,
      default: 0
    },
    icu_cases: {
      type: Number,
      default: 0
    }
  },
  daily_tracking: [{
    date: Date,
    new_cases: Number,
    cumulative_cases: Number,
    new_deaths: Number,
    cumulative_deaths: Number,
    new_recoveries: Number,
    cumulative_recoveries: Number,
    tests_conducted: Number,
    positivity_rate: Number,
    reproduction_number: Number // R0/Rt
  }],
  containment_measures: {
    containment_status: {
      type: String,
      enum: ['spreading', 'contained', 'controlled', 'resolved'],
      default: 'spreading',
      index: true
    },
    containment_zone_declared: {
      type: Boolean,
      default: false
    },
    containment_areas: [{
      area_name: String,
      area_type: String,
      population_affected: Number,
      restrictions_imposed: [String],
      date_declared: Date,
      date_lifted: Date
    }],
    public_health_measures: [{
      measure_type: {
        type: String,
        enum: ['isolation', 'quarantine', 'lockdown', 'curfew', 'ban_gatherings', 'school_closure']
      },
      description: String,
      implementation_date: Date,
      expected_end_date: Date,
      actual_end_date: Date,
      compliance_rate: Number,
      effectiveness_score: Number
    }]
  },
  response_activities: {
    response_camps_organized: {
      type: Number,
      default: 0
    },
    screening_camps: [{
      camp_id: String,
      location: String,
      date: Date,
      people_screened: Number,
      positive_cases_found: Number
    }],
    vaccination_drives: [{
      vaccine_type: String,
      target_population: Number,
      doses_administered: Number,
      coverage_percentage: Number,
      adverse_events: Number
    }],
    contact_tracing: {
      contacts_identified: Number,
      contacts_traced: Number,
      contacts_tested: Number,
      secondary_cases_found: Number,
      tracing_completion_rate: Number
    },
    isolation_facilities: {
      centers_setup: Number,
      total_capacity: Number,
      current_occupancy: Number,
      isolation_compliance_rate: Number
    },
    testing_strategy: {
      total_tests_conducted: Number,
      rapid_antigen_tests: Number,
      rt_pcr_tests: Number,
      other_tests: Number,
      testing_rate_per_1000: Number,
      turnaround_time_hours: Number
    }
  },
  resource_deployment: {
    human_resources: [{
      resource_type: String,
      quantity_deployed: Number,
      source_hospital: String,
      deployment_duration_days: Number,
      cost: mongoose.Schema.Types.Decimal128
    }],
    medical_supplies: [{
      supply_name: String,
      quantity_used: Number,
      cost: mongoose.Schema.Types.Decimal128,
      source: String
    }],
    equipment_deployed: [{
      equipment_name: String,
      quantity: Number,
      deployment_location: String,
      utilization_hours: Number
    }],
    infrastructure_setup: [{
      facility_type: String,
      location: String,
      capacity: Number,
      setup_cost: mongoose.Schema.Types.Decimal128,
      operational_cost_daily: mongoose.Schema.Types.Decimal128
    }]
  },
  communication_awareness: {
    public_awareness_campaigns: [{
      campaign_type: String,
      medium: String, // radio, tv, newspaper, social media, etc.
      reach_estimate: Number,
      start_date: Date,
      end_date: Date,
      cost: mongoose.Schema.Types.Decimal128,
      effectiveness_score: Number
    }],
    community_engagement: [{
      activity_type: String,
      target_group: String,
      participants_count: Number,
      date: Date,
      feedback_score: Number
    }],
    health_education_materials: [{
      material_type: String,
      language: String,
      quantity_distributed: Number,
      distribution_channels: [String]
    }],
    rumor_monitoring: [{
      rumor_content: String,
      source: String,
      verification_status: String,
      corrective_action: String,
      date_identified: Date
    }]
  },
  coordination_collaboration: {
    coordination_agencies: [{
      agency_name: String,
      agency_type: {
        type: String,
        enum: ['government', 'who', 'ngo', 'private', 'international']
      },
      role: String,
      contact_person: String,
      collaboration_level: String,
      resources_contributed: String
    }],
    inter_district_coordination: [{
      district_name: String,
      coordination_type: String,
      information_shared: String,
      resources_shared: String,
      joint_activities: [String]
    }],
    reporting_hierarchy: [{
      report_to: String,
      report_frequency: String,
      last_reported: Date,
      report_format: String
    }]
  },
  surveillance_monitoring: {
    surveillance_type: {
      type: String,
      enum: ['active', 'passive', 'enhanced', 'syndromic'],
      default: 'active'
    },
    surveillance_sites: [{
      site_name: String,
      site_type: String,
      population_covered: Number,
      reporting_frequency: String,
      last_report_date: Date
    }],
    early_warning_indicators: [{
      indicator_name: String,
      threshold_value: Number,
      current_value: Number,
      alert_level: String,
      last_updated: Date
    }],
    laboratory_surveillance: {
      samples_collected: Number,
      samples_tested: Number,
      positive_samples: Number,
      turnaround_time_avg: Number,
      lab_capacity_utilization: Number
    }
  },
  financial_tracking: {
    total_cost: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    cost_breakdown: {
      personnel_costs: mongoose.Schema.Types.Decimal128,
      medical_supplies: mongoose.Schema.Types.Decimal128,
      equipment_procurement: mongoose.Schema.Types.Decimal128,
      infrastructure_setup: mongoose.Schema.Types.Decimal128,
      transportation: mongoose.Schema.Types.Decimal128,
      communication: mongoose.Schema.Types.Decimal128,
      laboratory_testing: mongoose.Schema.Types.Decimal128,
      contingency: mongoose.Schema.Types.Decimal128
    },
    funding_sources: [{
      source_name: String,
      amount: mongoose.Schema.Types.Decimal128,
      utilization_status: String
    }],
    cost_per_case: mongoose.Schema.Types.Decimal128,
    cost_effectiveness_metrics: {
      cost_per_case_averted: mongoose.Schema.Types.Decimal128,
      cost_per_life_saved: mongoose.Schema.Types.Decimal128,
      economic_impact_averted: mongoose.Schema.Types.Decimal128
    }
  },
  impact_assessment: {
    health_impact: {
      morbidity_reduction: Number,
      mortality_reduction: Number,
      disability_adjusted_life_years: Number,
      quality_adjusted_life_years: Number
    },
    social_impact: {
      schools_affected: Number,
      businesses_affected: Number,
      employment_impact: Number,
      social_disruption_score: Number
    },
    economic_impact: {
      direct_healthcare_costs: mongoose.Schema.Types.Decimal128,
      productivity_losses: mongoose.Schema.Types.Decimal128,
      tourism_impact: mongoose.Schema.Types.Decimal128,
      trade_impact: mongoose.Schema.Types.Decimal128,
      total_economic_burden: mongoose.Schema.Types.Decimal128
    }
  },
  lessons_documentation: {
    lessons_learned: [String],
    best_practices: [String],
    challenges_faced: [String],
    gaps_identified: [String],
    recommendations: [String],
    preparedness_improvements: [String],
    policy_changes_needed: [String]
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
  collection: 'outbreak_management'
});

// Indexes for performance
outbreakManagementSchema.index({ rho_id: 1, 'disease_info.disease_name': 1 });
outbreakManagementSchema.index({ 'timeline_tracking.first_case_reported': -1 });
outbreakManagementSchema.index({ 'containment_measures.containment_status': 1 });
outbreakManagementSchema.index({ 'outbreak_scope.affected_areas.coordinates': '2dsphere' });

// Pre-save middleware
outbreakManagementSchema.pre('save', function(next) {
  // Calculate case fatality rate
  if (this.case_management.total_cases > 0) {
    this.case_management.case_fatality_rate = 
      (this.case_management.deaths / this.case_management.total_cases) * 100;
  }
  
  // Calculate total duration if resolved
  if (this.timeline_tracking.outbreak_resolved_date && this.timeline_tracking.first_case_reported) {
    const diffTime = this.timeline_tracking.outbreak_resolved_date - this.timeline_tracking.first_case_reported;
    this.timeline_tracking.total_duration_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  this.updated_at = Date.now();
  next();
});

// Method to update daily tracking
outbreakManagementSchema.methods.addDailyUpdate = function(dailyData) {
  this.daily_tracking.push(dailyData);
  
  // Update cumulative case counts
  this.case_management.total_cases = dailyData.cumulative_cases;
  this.case_management.deaths = dailyData.cumulative_deaths;
  this.case_management.recovered_cases = dailyData.cumulative_recoveries;
  this.case_management.active_cases = 
    dailyData.cumulative_cases - dailyData.cumulative_deaths - dailyData.cumulative_recoveries;
  
  return this.save();
};

// Method to declare outbreak contained
outbreakManagementSchema.methods.declareContained = function() {
  this.containment_measures.containment_status = 'contained';
  return this.save();
};

// Method to resolve outbreak
outbreakManagementSchema.methods.resolveOutbreak = function(resolutionDate = new Date()) {
  this.containment_measures.containment_status = 'resolved';
  this.timeline_tracking.outbreak_resolved_date = resolutionDate;
  return this.save();
};

// Static method to get active outbreaks by RHO
outbreakManagementSchema.statics.getActiveOutbreaks = function(rhoId) {
  return this.find({
    rho_id: rhoId,
    'containment_measures.containment_status': { $in: ['spreading', 'contained'] }
  }).sort({ 'timeline_tracking.first_case_reported': -1 });
};

// Static method to get outbreak statistics
outbreakManagementSchema.statics.getOutbreakStatistics = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        'timeline_tracking.first_case_reported': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$disease_info.disease_name',
        total_outbreaks: { $sum: 1 },
        total_cases: { $sum: '$case_management.total_cases' },
        total_deaths: { $sum: '$case_management.deaths' },
        avg_duration: { $avg: '$timeline_tracking.total_duration_days' },
        total_cost: { $sum: { $toDouble: '$financial_tracking.total_cost' } },
        resolved_outbreaks: {
          $sum: {
            $cond: [{ $eq: ['$containment_measures.containment_status', 'resolved'] }, 1, 0]
          }
        }
      }
    },
    {
      $addFields: {
        case_fatality_rate: { $divide: ['$total_deaths', '$total_cases'] },
        resolution_rate: { $divide: ['$resolved_outbreaks', '$total_outbreaks'] },
        cost_per_case: { $divide: ['$total_cost', '$total_cases'] }
      }
    }
  ]);
};

module.exports = mongoose.model('OutbreakManagement', outbreakManagementSchema);