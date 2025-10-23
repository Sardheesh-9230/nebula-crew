const asyncHandler = require('express-async-handler');
const CampAnalytics = require('../models/CampAnalytics');
const MedicalCamp = require('../models/MedicalCamp');
const RegionalHealthOfficer = require('../models/RegionalHealthOfficer');
const HospitalRHOMapping = require('../models/HospitalRHOMapping');
const HospitalRealtimeStatus = require('../models/HospitalRealtimeStatus');
const PatientAppointment = require('../models/PatientAppointment');
const OutbreakManagement = require('../models/OutbreakManagement');
const HealthZone = require('../models/HealthZone');
const moment = require('moment');

// @desc    Get comprehensive SHO analytics
// @route   GET /api/analytics/sho/comprehensive
// @access  Private (SHO only)
const getSHOComprehensiveAnalytics = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  const { period = '30d', zone_type, district } = req.query;
  
  try {
    let startDate;
    switch (period) {
      case '7d':
        startDate = moment().subtract(7, 'days').toDate();
        break;
      case '30d':
        startDate = moment().subtract(30, 'days').toDate();
        break;
      case '90d':
        startDate = moment().subtract(90, 'days').toDate();
        break;
      case '6m':
        startDate = moment().subtract(6, 'months').toDate();
        break;
      case '1y':
        startDate = moment().subtract(1, 'year').toDate();
        break;
      default:
        startDate = moment().subtract(30, 'days').toDate();
    }
    
    // Get RHOs under this SHO
    let rhoQuery = { created_by: shoId };
    if (zone_type) rhoQuery.zone_type = zone_type;
    
    const rhos = await RegionalHealthOfficer.find(rhoQuery);
    const rhoIds = rhos.map(rho => rho.rho_id);
    
    // Zone-wise performance analytics
    const zoneAnalytics = await getZoneWiseAnalytics(rhoIds, startDate, district);
    
    // Hospital performance analytics
    const hospitalAnalytics = await getHospitalPerformanceAnalytics(rhoIds, startDate);
    
    // Camp effectiveness analytics
    const campAnalytics = await getCampEffectivenessAnalytics(rhoIds, startDate);
    
    // Patient satisfaction analytics
    const patientSatisfactionAnalytics = await getPatientSatisfactionAnalytics(rhoIds, startDate);
    
    // Resource utilization analytics
    const resourceUtilizationAnalytics = await getResourceUtilizationAnalytics(rhoIds, startDate);
    
    // Population coverage analytics
    const populationCoverageAnalytics = await getPopulationCoverageAnalytics(rhos, district);
    
    // Outbreak management analytics
    const outbreakAnalytics = await getOutbreakAnalytics(rhoIds, startDate);
    
    // Predictive analytics and recommendations
    const predictiveAnalytics = await generatePredictiveAnalytics(rhoIds, startDate);
    
    const comprehensiveAnalytics = {
      metadata: {
        period,
        start_date: startDate,
        end_date: new Date(),
        total_rhos: rhos.length,
        filters: { zone_type, district }
      },
      zone_analytics: zoneAnalytics,
      hospital_performance: hospitalAnalytics,
      camp_effectiveness: campAnalytics,
      patient_satisfaction: patientSatisfactionAnalytics,
      resource_utilization: resourceUtilizationAnalytics,
      population_coverage: populationCoverageAnalytics,
      outbreak_management: outbreakAnalytics,
      predictive_insights: predictiveAnalytics,
      executive_summary: generateExecutiveSummary({
        zoneAnalytics,
        hospitalAnalytics,
        campAnalytics,
        patientSatisfactionAnalytics,
        resourceUtilizationAnalytics,
        outbreakAnalytics
      })
    };
    
    res.status(200).json({
      success: true,
      data: comprehensiveAnalytics
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating comprehensive analytics',
      error: error.message
    });
  }
});

// @desc    Get RHO performance comparison
// @route   GET /api/analytics/rho/comparison
// @access  Private (SHO only)
const getRHOPerformanceComparison = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  const { period = '30d', metrics = 'all' } = req.query;
  
  try {
    let startDate = moment().subtract(30, 'days').toDate();
    if (period === '90d') startDate = moment().subtract(90, 'days').toDate();
    
    const rhos = await RegionalHealthOfficer.find({ created_by: shoId });
    
    const rhoComparisons = await Promise.all(
      rhos.map(async (rho) => {
        const [campStats, hospitalStats, patientStats] = await Promise.all([
          getCampStatsForRHO(rho.rho_id, startDate),
          getHospitalStatsForRHO(rho.rho_id, startDate),
          getPatientStatsForRHO(rho.rho_id, startDate)
        ]);
        
        return {
          rho_info: {
            rho_id: rho.rho_id,
            name: rho.name,
            zone_type: rho.zone_type,
            population_covered: rho.population_covered
          },
          performance_metrics: {
            camp_performance: campStats,
            hospital_performance: hospitalStats,
            patient_satisfaction: patientStats,
            overall_score: calculateOverallScore(campStats, hospitalStats, patientStats)
          }
        };
      })
    );
    
    // Rank RHOs by performance
    rhoComparisons.sort((a, b) => b.performance_metrics.overall_score - a.performance_metrics.overall_score);
    
    res.status(200).json({
      success: true,
      data: {
        period,
        comparison_date: new Date(),
        rho_rankings: rhoComparisons,
        top_performer: rhoComparisons[0],
        improvement_needed: rhoComparisons.filter(rho => rho.performance_metrics.overall_score < 70)
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating RHO comparison',
      error: error.message
    });
  }
});

// @desc    Get camp analytics dashboard
// @route   GET /api/analytics/camps/dashboard
// @access  Private (SHO/RHO)
const getCampAnalyticsDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { period = '90d', camp_type, rho_id } = req.query;
  
  try {
    let startDate = moment().subtract(90, 'days').toDate();
    if (period === '180d') startDate = moment().subtract(180, 'days').toDate();
    if (period === '1y') startDate = moment().subtract(1, 'year').toDate();
    
    let query = { analytics_date: { $gte: startDate } };
    
    // Filter based on user role
    if (userRole === 'RHO') {
      const rho = await RegionalHealthOfficer.findOne({ user_id: userId });
      if (!rho) {
        return res.status(404).json({
          success: false,
          message: 'RHO profile not found'
        });
      }
      query.rho_id = rho.rho_id;
    } else if (userRole === 'SHO') {
      const rhos = await RegionalHealthOfficer.find({ created_by: userId });
      query.rho_id = { $in: rhos.map(rho => rho.rho_id) };
    }
    
    if (rho_id) query.rho_id = rho_id;
    
    // Get camp analytics
    const campAnalytics = await CampAnalytics.find(query).sort({ analytics_date: -1 });
    
    // Get camp type filter
    if (camp_type) {
      const campIds = campAnalytics.map(ca => ca.camp_id);
      const camps = await MedicalCamp.find({
        camp_id: { $in: campIds },
        camp_type: camp_type
      }).select('camp_id');
      const filteredCampIds = camps.map(c => c.camp_id);
      
      const filteredAnalytics = campAnalytics.filter(ca => 
        filteredCampIds.includes(ca.camp_id)
      );
      campAnalytics.length = 0;
      campAnalytics.push(...filteredAnalytics);
    }
    
    // Aggregate analytics
    const dashboardData = {
      summary: {
        total_camps: campAnalytics.length,
        total_beneficiaries: campAnalytics.reduce((sum, ca) => 
          sum + ca.performance_metrics.beneficiaries_served, 0),
        avg_satisfaction: (campAnalytics.reduce((sum, ca) => 
          sum + ca.quality_metrics.satisfaction_score, 0) / campAnalytics.length || 0).toFixed(2),
        avg_attendance_rate: (campAnalytics.reduce((sum, ca) => 
          sum + ca.performance_metrics.attendance_rate, 0) / campAnalytics.length || 0).toFixed(2),
        total_cost: campAnalytics.reduce((sum, ca) => 
          sum + ca.cost_metrics.total_cost, 0)
      },
      monthly_trends: generateMonthlyTrends(campAnalytics),
      performance_by_type: await generateCampTypePerformance(query),
      geographic_distribution: await generateGeographicDistribution(query),
      cost_effectiveness_analysis: generateCostEffectivenessAnalysis(campAnalytics),
      quality_metrics: generateQualityMetrics(campAnalytics),
      recommendations: generateCampRecommendations(campAnalytics)
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating camp analytics dashboard',
      error: error.message
    });
  }
});

// @desc    Generate predictive analytics
// @route   GET /api/analytics/predictive
// @access  Private (SHO only)
const getPredictiveAnalytics = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  const { forecast_period = '90d' } = req.query;
  
  try {
    const rhos = await RegionalHealthOfficer.find({ created_by: shoId });
    const rhoIds = rhos.map(rho => rho.rho_id);
    
    // Historical data for predictions
    const historicalData = await CampAnalytics.find({
      rho_id: { $in: rhoIds },
      analytics_date: { $gte: moment().subtract(1, 'year').toDate() }
    }).sort({ analytics_date: 1 });
    
    // Demand forecasting
    const demandForecast = generateDemandForecast(historicalData, forecast_period);
    
    // Resource requirement predictions
    const resourcePredictions = generateResourcePredictions(historicalData, rhos);
    
    // Risk assessments
    const riskAssessments = await generateRiskAssessments(rhoIds);
    
    // Optimization recommendations
    const optimizationRecommendations = generateOptimizationRecommendations(historicalData, rhos);
    
    const predictiveAnalytics = {
      forecast_period,
      generated_at: new Date(),
      demand_forecast: demandForecast,
      resource_predictions: resourcePredictions,
      risk_assessments: riskAssessments,
      optimization_recommendations: optimizationRecommendations,
      confidence_scores: {
        demand_forecast: calculateConfidenceScore(historicalData, 'demand'),
        resource_prediction: calculateConfidenceScore(historicalData, 'resource'),
        risk_assessment: calculateConfidenceScore(historicalData, 'risk')
      }
    };
    
    res.status(200).json({
      success: true,
      data: predictiveAnalytics
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating predictive analytics',
      error: error.message
    });
  }
});

// Helper functions
async function getZoneWiseAnalytics(rhoIds, startDate, district) {
  let query = { rho_id: { $in: rhoIds } };
  if (district) query.district_names = district;
  
  const zones = await HealthZone.find(query);
  
  const zoneAnalytics = await Promise.all(
    zones.map(async (zone) => {
      const campAnalytics = await CampAnalytics.find({
        rho_id: zone.rho_id,
        analytics_date: { $gte: startDate }
      });
      
      const hospitalMappings = await HospitalRHOMapping.find({
        rho_id: zone.rho_id,
        status: 'active'
      });
      
      return {
        zone_info: {
          zone_id: zone.zone_id,
          zone_name: zone.zone_name,
          zone_type: zone.zone_type,
          population: zone.population,
          rho_name: zone.rho_name
        },
        performance: {
          camps_conducted: campAnalytics.length,
          beneficiaries_served: campAnalytics.reduce((sum, ca) => 
            sum + ca.performance_metrics.beneficiaries_served, 0),
          hospitals_managed: hospitalMappings.length,
          coverage_ratio: zone.population > 0 ? 
            (campAnalytics.reduce((sum, ca) => sum + ca.performance_metrics.beneficiaries_served, 0) / zone.population * 100).toFixed(2) : 0
        }
      };
    })
  );
  
  return zoneAnalytics;
}

async function getHospitalPerformanceAnalytics(rhoIds, startDate) {
  const hospitalMappings = await HospitalRHOMapping.find({
    rho_id: { $in: rhoIds },
    status: 'active'
  });
  
  const hospitalIds = hospitalMappings.map(hm => hm.hospital_id);
  
  const appointments = await PatientAppointment.find({
    hospital_id: { $in: hospitalIds },
    'appointment_details.date': { $gte: startDate }
  });
  
  const hospitalPerformance = hospitalIds.map(hospitalId => {
    const hospitalAppointments = appointments.filter(apt => apt.hospital_id === hospitalId);
    const completedAppointments = hospitalAppointments.filter(apt => 
      apt.appointment_status.status === 'completed'
    );
    const avgRating = completedAppointments.length > 0 ? 
      completedAppointments.reduce((sum, apt) => sum + (apt.feedback?.rating || 0), 0) / completedAppointments.length : 0;
    
    return {
      hospital_id: hospitalId,
      total_appointments: hospitalAppointments.length,
      completed_appointments: completedAppointments.length,
      completion_rate: hospitalAppointments.length > 0 ? 
        (completedAppointments.length / hospitalAppointments.length * 100).toFixed(2) : 0,
      avg_patient_rating: avgRating.toFixed(2)
    };
  });
  
  return {
    total_hospitals: hospitalIds.length,
    avg_completion_rate: hospitalPerformance.length > 0 ? 
      (hospitalPerformance.reduce((sum, hp) => sum + parseFloat(hp.completion_rate), 0) / hospitalPerformance.length).toFixed(2) : 0,
    avg_patient_rating: hospitalPerformance.length > 0 ? 
      (hospitalPerformance.reduce((sum, hp) => sum + parseFloat(hp.avg_patient_rating), 0) / hospitalPerformance.length).toFixed(2) : 0,
    hospital_details: hospitalPerformance
  };
}

async function getCampEffectivenessAnalytics(rhoIds, startDate) {
  const campAnalytics = await CampAnalytics.find({
    rho_id: { $in: rhoIds },
    analytics_date: { $gte: startDate }
  });
  
  return {
    total_camps: campAnalytics.length,
    total_beneficiaries: campAnalytics.reduce((sum, ca) => 
      sum + ca.performance_metrics.beneficiaries_served, 0),
    avg_satisfaction: campAnalytics.length > 0 ? 
      (campAnalytics.reduce((sum, ca) => sum + ca.quality_metrics.satisfaction_score, 0) / campAnalytics.length).toFixed(2) : 0,
    avg_attendance_rate: campAnalytics.length > 0 ? 
      (campAnalytics.reduce((sum, ca) => sum + ca.performance_metrics.attendance_rate, 0) / campAnalytics.length).toFixed(2) : 0,
    cost_per_beneficiary: campAnalytics.length > 0 ? 
      (campAnalytics.reduce((sum, ca) => sum + ca.cost_metrics.cost_per_beneficiary, 0) / campAnalytics.length).toFixed(2) : 0
  };
}

function generateMonthlyTrends(campAnalytics) {
  const monthlyData = {};
  
  campAnalytics.forEach(ca => {
    const month = moment(ca.analytics_date).format('YYYY-MM');
    if (!monthlyData[month]) {
      monthlyData[month] = {
        camps: 0,
        beneficiaries: 0,
        total_cost: 0,
        satisfaction_scores: []
      };
    }
    
    monthlyData[month].camps += 1;
    monthlyData[month].beneficiaries += ca.performance_metrics.beneficiaries_served;
    monthlyData[month].total_cost += ca.cost_metrics.total_cost;
    monthlyData[month].satisfaction_scores.push(ca.quality_metrics.satisfaction_score);
  });
  
  return Object.keys(monthlyData)
    .sort()
    .map(month => ({
      month,
      ...monthlyData[month],
      avg_satisfaction: monthlyData[month].satisfaction_scores.length > 0 ? 
        (monthlyData[month].satisfaction_scores.reduce((a, b) => a + b, 0) / monthlyData[month].satisfaction_scores.length).toFixed(2) : 0
    }));
}

function generateExecutiveSummary(analytics) {
  return {
    key_achievements: [
      `${analytics.campAnalytics.total_camps} medical camps conducted`,
      `${analytics.campAnalytics.total_beneficiaries} beneficiaries served`,
      `${analytics.hospitalAnalytics.avg_completion_rate}% average appointment completion rate`,
      `${analytics.campAnalytics.avg_satisfaction} average camp satisfaction score`
    ],
    areas_for_improvement: [
      analytics.hospitalAnalytics.avg_patient_rating < 4 ? 'Hospital patient satisfaction needs improvement' : null,
      analytics.campAnalytics.avg_attendance_rate < 80 ? 'Camp attendance rates need enhancement' : null,
      analytics.outbreakAnalytics?.active_outbreaks > 2 ? 'Outbreak management requires attention' : null
    ].filter(Boolean),
    recommendations: [
      'Focus on improving patient experience in hospitals with low ratings',
      'Enhance camp promotion strategies to increase attendance',
      'Implement predictive analytics for better resource allocation'
    ]
  };
}

async function getCampStatsForRHO(rhoId, startDate) {
  const campAnalytics = await CampAnalytics.find({
    rho_id: rhoId,
    analytics_date: { $gte: startDate }
  });
  
  return {
    camps_conducted: campAnalytics.length,
    avg_satisfaction: campAnalytics.length > 0 ? 
      (campAnalytics.reduce((sum, ca) => sum + ca.quality_metrics.satisfaction_score, 0) / campAnalytics.length).toFixed(2) : 0,
    total_beneficiaries: campAnalytics.reduce((sum, ca) => sum + ca.performance_metrics.beneficiaries_served, 0),
    cost_efficiency: campAnalytics.length > 0 ? 
      (campAnalytics.reduce((sum, ca) => sum + ca.cost_metrics.cost_per_beneficiary, 0) / campAnalytics.length).toFixed(2) : 0
  };
}

async function getHospitalStatsForRHO(rhoId, startDate) {
  const hospitals = await HospitalRHOMapping.find({ rho_id: rhoId, status: 'active' });
  const hospitalIds = hospitals.map(h => h.hospital_id);
  
  const appointments = await PatientAppointment.find({
    hospital_id: { $in: hospitalIds },
    'appointment_details.date': { $gte: startDate }
  });
  
  const completedAppointments = appointments.filter(apt => 
    apt.appointment_status.status === 'completed'
  );
  
  return {
    hospitals_managed: hospitals.length,
    completion_rate: appointments.length > 0 ? 
      ((completedAppointments.length / appointments.length) * 100).toFixed(2) : 0,
    patient_satisfaction: completedAppointments.length > 0 ? 
      (completedAppointments.reduce((sum, apt) => sum + (apt.feedback?.rating || 0), 0) / completedAppointments.length).toFixed(2) : 0
  };
}

async function getPatientStatsForRHO(rhoId, startDate) {
  const hospitals = await HospitalRHOMapping.find({ rho_id: rhoId, status: 'active' });
  const hospitalIds = hospitals.map(h => h.hospital_id);
  
  const appointments = await PatientAppointment.find({
    hospital_id: { $in: hospitalIds },
    'appointment_details.date': { $gte: startDate },
    'feedback.rating': { $exists: true }
  });
  
  return {
    total_feedback: appointments.length,
    avg_rating: appointments.length > 0 ? 
      (appointments.reduce((sum, apt) => sum + apt.feedback.rating, 0) / appointments.length).toFixed(2) : 0,
    satisfaction_rate: appointments.length > 0 ? 
      (appointments.filter(apt => apt.feedback.rating >= 4).length / appointments.length * 100).toFixed(2) : 0
  };
}

function calculateOverallScore(campStats, hospitalStats, patientStats) {
  const campScore = (parseFloat(campStats.avg_satisfaction) * 0.4);
  const hospitalScore = (parseFloat(hospitalStats.completion_rate) * 0.3);
  const patientScore = (parseFloat(patientStats.avg_rating) * 20 * 0.3);
  
  return Math.min(100, campScore + hospitalScore + patientScore).toFixed(2);
}

module.exports = {
  getSHOComprehensiveAnalytics,
  getRHOPerformanceComparison,
  getCampAnalyticsDashboard,
  getPredictiveAnalytics
};