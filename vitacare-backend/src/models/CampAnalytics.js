const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const campAnalyticsSchema = new mongoose.Schema({
  analytics_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  camp_id: {
    type: String,
    ref: 'MedicalCamp',
    required: true,
    index: true
  },
  rho_id: {
    type: String,
    ref: 'RegionalHealthOfficer',
    required: true,
    index: true
  },
  camp_name: {
    type: String,
    required: true
  },
  analytics_date: {
    type: Date,
    required: true,
    index: true
  },
  metrics_type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'final'],
    required: true,
    index: true
  },
  
  // Performance Metrics
  performance_metrics: {
    beneficiaries_target: {
      type: Number,
      required: true
    },
    beneficiaries_served: {
      type: Number,
      required: true
    },
    attendance_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    service_completion_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    no_show_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    return_beneficiary_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Financial Metrics
  financial_metrics: {
    cost_per_beneficiary: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    budget_utilization_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    cost_variance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    roi_percentage: {
      type: Number,
      default: 0
    },
    cost_effectiveness_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  },
  
  // Resource Utilization Metrics
  resource_utilization: {
    staff_utilization_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    equipment_utilization_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    medicine_wastage_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    supply_efficiency_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    resource_optimization_index: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Time and Efficiency Metrics
  time_efficiency: {
    average_service_time: {
      type: Number, // minutes per beneficiary
      default: 0
    },
    average_wait_time: {
      type: Number, // minutes
      default: 0
    },
    peak_hour_efficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    setup_time_hours: {
      type: Number,
      default: 0
    },
    breakdown_time_hours: {
      type: Number,
      default: 0
    },
    operational_efficiency_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  },
  
  // Quality Metrics
  quality_metrics: {
    satisfaction_score: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    service_quality_rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    staff_competency_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    facility_quality_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    safety_compliance_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    infection_control_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Health Outcome Metrics
  health_outcomes: {
    referral_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    follow_up_compliance_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    disease_detection_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    treatment_success_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    adverse_event_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    clinical_improvement_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Coverage and Reach Metrics
  coverage_metrics: {
    community_coverage_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    target_group_reach: {
      children: { type: Number, default: 0 },
      adults: { type: Number, default: 0 },
      elderly: { type: Number, default: 0 },
      pregnant_women: { type: Number, default: 0 },
      chronic_patients: { type: Number, default: 0 }
    },
    geographical_reach_km: {
      type: Number,
      default: 0
    },
    accessibility_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    equity_index: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Service-specific Metrics
  service_analytics: [{
    service_name: String,
    service_type: String,
    beneficiaries_planned: Number,
    beneficiaries_served: Number,
    completion_rate: Number,
    average_duration: Number,
    cost_per_service: mongoose.Schema.Types.Decimal128,
    quality_score: Number,
    complications_rate: Number,
    patient_satisfaction: Number
  }],
  
  // Demographic Analytics
  demographic_breakdown: {
    age_distribution: {
      under_5: { served: Number, percentage: Number },
      age_5_18: { served: Number, percentage: Number },
      age_18_60: { served: Number, percentage: Number },
      above_60: { served: Number, percentage: Number }
    },
    gender_distribution: {
      male: { served: Number, percentage: Number },
      female: { served: Number, percentage: Number },
      other: { served: Number, percentage: Number }
    },
    socioeconomic_distribution: {
      bpl: { served: Number, percentage: Number },
      apl: { served: Number, percentage: Number },
      unidentified: { served: Number, percentage: Number }
    },
    health_status_distribution: {
      healthy: { served: Number, percentage: Number },
      chronic_conditions: { served: Number, percentage: Number },
      acute_conditions: { served: Number, percentage: Number },
      emergency_cases: { served: Number, percentage: Number }
    }
  },
  
  // Partner and Collaboration Metrics
  collaboration_metrics: {
    partner_collaboration_score: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    volunteer_effectiveness_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    community_engagement_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    inter_agency_coordination_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    knowledge_transfer_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  },
  
  // Innovation and Technology Metrics
  technology_metrics: {
    digital_registration_usage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    mobile_app_adoption: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    telemedicine_utilization: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    data_accuracy_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    innovation_implementation_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  },
  
  // Environmental and Sustainability Metrics
  sustainability_metrics: {
    waste_management_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    energy_efficiency_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    carbon_footprint_kg: {
      type: Number,
      default: 0
    },
    sustainable_practices_adoption: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    environmental_compliance_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Risk and Safety Metrics
  risk_safety_metrics: {
    safety_incidents_count: {
      type: Number,
      default: 0
    },
    risk_mitigation_effectiveness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    emergency_preparedness_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    contingency_plan_effectiveness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    staff_safety_compliance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Comparative Analytics
  comparative_metrics: {
    performance_vs_previous_camps: {
      improvement_percentage: Number,
      key_improvements: [String],
      areas_of_decline: [String]
    },
    benchmark_comparison: {
      vs_district_average: Number,
      vs_state_average: Number,
      vs_national_standard: Number,
      ranking_percentile: Number
    },
    peer_camp_comparison: [{
      camp_name: String,
      comparison_metric: String,
      performance_difference: Number,
      better_or_worse: String
    }]
  },
  
  // Predictive Indicators
  predictive_indicators: {
    future_demand_forecast: {
      next_month_demand: Number,
      seasonal_adjustment: Number,
      growth_trend: String
    },
    resource_need_prediction: [{
      resource_type: String,
      predicted_requirement: Number,
      confidence_level: Number
    }],
    success_probability_next_camp: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Lessons and Improvements
  insights_recommendations: {
    key_success_factors: [String],
    areas_for_improvement: [String],
    resource_optimization_suggestions: [String],
    process_improvement_recommendations: [String],
    technology_adoption_suggestions: [String],
    training_needs_identified: [String]
  },
  
  // Data Quality and Validation
  data_quality: {
    data_completeness_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    data_accuracy_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    validation_status: {
      type: String,
      enum: ['pending', 'validated', 'rejected'],
      default: 'pending'
    },
    validated_by: String,
    validation_date: Date
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
  collection: 'camp_analytics'
});

// Indexes for performance optimization
campAnalyticsSchema.index({ camp_id: 1, analytics_date: -1 });
campAnalyticsSchema.index({ rho_id: 1, metrics_type: 1, analytics_date: -1 });
campAnalyticsSchema.index({ 'performance_metrics.attendance_rate': -1 });
campAnalyticsSchema.index({ 'quality_metrics.satisfaction_score': -1 });

// TTL index to keep analytics data for 2 years
campAnalyticsSchema.index({ analytics_date: 1 }, { expireAfterSeconds: 2 * 365 * 24 * 60 * 60 });

// Pre-save middleware
campAnalyticsSchema.pre('save', function(next) {
  // Calculate overall performance score
  const performanceScore = (
    this.performance_metrics.attendance_rate +
    this.performance_metrics.service_completion_rate +
    this.quality_metrics.satisfaction_score * 20 + // Convert 5-point scale to 100
    this.resource_utilization.resource_optimization_index +
    this.coverage_metrics.community_coverage_percentage
  ) / 5;
  
  // Calculate composite efficiency index
  const efficiencyIndex = (
    this.financial_metrics.cost_effectiveness_score * 10 + // Convert to 100 scale
    this.time_efficiency.operational_efficiency_score * 10 +
    this.resource_utilization.supply_efficiency_score * 10
  ) / 3;
  
  this.updated_at = Date.now();
  next();
});

// Method to calculate overall camp performance score
campAnalyticsSchema.methods.calculateOverallScore = function() {
  const weights = {
    performance: 0.25,
    quality: 0.25,
    efficiency: 0.20,
    coverage: 0.15,
    outcomes: 0.15
  };
  
  const scores = {
    performance: (this.performance_metrics.attendance_rate + this.performance_metrics.service_completion_rate) / 2,
    quality: this.quality_metrics.satisfaction_score * 20, // Convert to 100 scale
    efficiency: this.time_efficiency.operational_efficiency_score * 10,
    coverage: this.coverage_metrics.community_coverage_percentage,
    outcomes: (this.health_outcomes.treatment_success_rate + this.health_outcomes.follow_up_compliance_rate) / 2
  };
  
  return Object.keys(weights).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);
};

// Method to generate performance insights
campAnalyticsSchema.methods.generateInsights = function() {
  const insights = [];
  
  // Attendance analysis
  if (this.performance_metrics.attendance_rate < 70) {
    insights.push('Low attendance rate - consider improving community outreach and scheduling');
  }
  
  // Cost efficiency analysis
  const avgCostPerBeneficiary = 500; // Baseline comparison
  const actualCost = parseFloat(this.financial_metrics.cost_per_beneficiary.toString());
  if (actualCost > avgCostPerBeneficiary * 1.2) {
    insights.push('Higher than average cost per beneficiary - review resource allocation');
  }
  
  // Quality score analysis
  if (this.quality_metrics.satisfaction_score < 3.5) {
    insights.push('Below average satisfaction score - focus on service quality improvement');
  }
  
  // Resource utilization analysis
  if (this.resource_utilization.medicine_wastage_percentage > 15) {
    insights.push('High medicine wastage - improve demand forecasting and inventory management');
  }
  
  return insights;
};

// Static method to get analytics summary for RHO dashboard
campAnalyticsSchema.statics.getRHOAnalyticsSummary = function(rhoId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        analytics_date: { $gte: startDate, $lte: endDate },
        metrics_type: 'final'
      }
    },
    {
      $group: {
        _id: null,
        total_camps: { $sum: 1 },
        total_beneficiaries_targeted: { $sum: '$performance_metrics.beneficiaries_target' },
        total_beneficiaries_served: { $sum: '$performance_metrics.beneficiaries_served' },
        avg_attendance_rate: { $avg: '$performance_metrics.attendance_rate' },
        avg_satisfaction_score: { $avg: '$quality_metrics.satisfaction_score' },
        avg_cost_per_beneficiary: { $avg: { $toDouble: '$financial_metrics.cost_per_beneficiary' } },
        total_budget_utilized: { $sum: { $toDouble: '$financial_metrics.cost_per_beneficiary' } },
        avg_community_coverage: { $avg: '$coverage_metrics.community_coverage_percentage' },
        avg_treatment_success: { $avg: '$health_outcomes.treatment_success_rate' }
      }
    },
    {
      $addFields: {
        overall_achievement_rate: {
          $multiply: [
            { $divide: ['$total_beneficiaries_served', '$total_beneficiaries_targeted'] },
            100
          ]
        }
      }
    }
  ]);
};

// Static method to get performance trends
campAnalyticsSchema.statics.getPerformanceTrends = function(rhoId, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    {
      $match: {
        rho_id: rhoId,
        analytics_date: { $gte: startDate },
        metrics_type: 'monthly'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$analytics_date' },
          month: { $month: '$analytics_date' }
        },
        camps_count: { $sum: 1 },
        avg_attendance: { $avg: '$performance_metrics.attendance_rate' },
        avg_satisfaction: { $avg: '$quality_metrics.satisfaction_score' },
        avg_coverage: { $avg: '$coverage_metrics.community_coverage_percentage' },
        total_beneficiaries: { $sum: '$performance_metrics.beneficiaries_served' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
};

// Static method to get best performing camps
campAnalyticsSchema.statics.getBestPerformingCamps = function(rhoId, limit = 10) {
  return this.find({
    rho_id: rhoId,
    metrics_type: 'final'
  })
  .sort({ 
    'quality_metrics.satisfaction_score': -1,
    'performance_metrics.attendance_rate': -1,
    'coverage_metrics.community_coverage_percentage': -1
  })
  .limit(limit);
};

module.exports = mongoose.model('CampAnalytics', campAnalyticsSchema);