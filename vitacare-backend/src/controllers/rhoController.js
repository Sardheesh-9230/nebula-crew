const asyncHandler = require('express-async-handler');
const RegionalHealthOfficer = require('../models/RegionalHealthOfficer');
const HospitalRHOMapping = require('../models/HospitalRHOMapping');
const PatientHospitalInfo = require('../models/PatientHospitalInfo');
const HospitalRealtimeStatus = require('../models/HospitalRealtimeStatus');
const HospitalResource = require('../models/HospitalResource');
const MedicalEquipment = require('../models/MedicalEquipment');
const MedicalSupply = require('../models/MedicalSupply');
const MedicalCamp = require('../models/MedicalCamp');
const OutbreakManagement = require('../models/OutbreakManagement');
const CampAnalytics = require('../models/CampAnalytics');
const moment = require('moment');

// @desc    Get RHO dashboard overview
// @route   GET /api/rho/dashboard
// @access  Private (RHO only)
const getRHODashboard = asyncHandler(async (req, res) => {
  const rhoUserId = req.user.id;
  
  try {
    // Find RHO profile
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    // Get hospitals under management
    const hospitals = await HospitalRHOMapping.find({ 
      rho_id: rho.rho_id,
      status: 'active'
    });
    
    // Get real-time hospital status
    const hospitalStatuses = await Promise.all(
      hospitals.map(async (hospital) => {
        const status = await HospitalRealtimeStatus.findOne({ 
          hospital_id: hospital.hospital_id 
        }).sort({ last_updated: -1 });
        
        return {
          hospital_id: hospital.hospital_id,
          hospital_name: hospital.hospital_name,
          status: status || null
        };
      })
    );
    
    // Calculate bed availability
    const totalBeds = hospitalStatuses.reduce((sum, h) => 
      sum + (h.status?.bed_status?.total_beds || 0), 0);
    const availableBeds = hospitalStatuses.reduce((sum, h) => 
      sum + (h.status?.bed_status?.available_beds || 0), 0);
    
    // Get active camps
    const activeCamps = await MedicalCamp.find({
      rho_id: rho.rho_id,
      'camp_status.status': { $in: ['ongoing', 'approved'] }
    });
    
    // Get pending requests
    const pendingCamps = await MedicalCamp.find({
      rho_id: rho.rho_id,
      'camp_status.status': 'pending_approval'
    }).countDocuments();
    
    // Get active outbreaks
    const activeOutbreaks = await OutbreakManagement.find({
      rho_id: rho.rho_id,
      'containment_measures.containment_status': { $ne: 'resolved' }
    });
    
    // Get alerts
    const criticalAlerts = await getCriticalAlertsForRHO(rho.rho_id);
    
    // Performance metrics
    const performanceMetrics = await calculateRHOPerformance(rho.rho_id);
    
    const dashboardData = {
      rho_info: {
        name: rho.name,
        zone_type: rho.zone_type,
        population_covered: rho.population_covered,
        authority_level: rho.authority_level
      },
      summary: {
        hospitals_managed: hospitals.length,
        total_beds: totalBeds,
        available_beds: availableBeds,
        bed_occupancy_rate: totalBeds > 0 ? ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1) : 0,
        active_camps: activeCamps.length,
        pending_approvals: pendingCamps,
        active_outbreaks: activeOutbreaks.length
      },
      hospital_statuses: hospitalStatuses,
      active_camps: activeCamps,
      active_outbreaks: activeOutbreaks,
      critical_alerts: criticalAlerts,
      performance_metrics: performanceMetrics
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching RHO dashboard',
      error: error.message
    });
  }
});

// @desc    Get hospitals under RHO management
// @route   GET /api/rho/hospitals
// @access  Private (RHO only)
const getManagedHospitals = asyncHandler(async (req, res) => {
  const rhoUserId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    const hospitals = await HospitalRHOMapping.find({ 
      rho_id: rho.rho_id,
      status: 'active'
    });
    
    // Get detailed info for each hospital
    const hospitalDetails = await Promise.all(
      hospitals.map(async (mapping) => {
        const [hospitalInfo, realtimeStatus, resources] = await Promise.all([
          PatientHospitalInfo.findOne({ hospital_id: mapping.hospital_id }),
          HospitalRealtimeStatus.findOne({ hospital_id: mapping.hospital_id })
            .sort({ last_updated: -1 }),
          HospitalResource.findOne({ hospital_id: mapping.hospital_id })
            .sort({ last_updated: -1 })
        ]);
        
        return {
          mapping,
          info: hospitalInfo,
          realtime_status: realtimeStatus,
          resources: resources
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: hospitalDetails.length,
      data: hospitalDetails
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching managed hospitals',
      error: error.message
    });
  }
});

// @desc    Update hospital real-time status
// @route   PUT /api/rho/hospital/:hospitalId/status
// @access  Private (RHO only)
const updateHospitalStatus = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  const rhoUserId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    // Verify hospital is under RHO management
    const mapping = await HospitalRHOMapping.findOne({
      hospital_id: hospitalId,
      rho_id: rho.rho_id,
      status: 'active'
    });
    
    if (!mapping) {
      return res.status(403).json({
        success: false,
        message: 'Hospital not under your management'
      });
    }
    
    const statusUpdate = {
      ...req.body,
      hospital_id: hospitalId,
      rho_id: rho.rho_id,
      last_updated: new Date(),
      updated_by: rho.name
    };
    
    // Update or create status
    const hospitalStatus = await HospitalRealtimeStatus.findOneAndUpdate(
      { hospital_id: hospitalId },
      statusUpdate,
      { new: true, upsert: true }
    );
    
    // Update patient-visible info if bed status changed
    if (req.body.bed_status) {
      await PatientHospitalInfo.findOneAndUpdate(
        { hospital_id: hospitalId },
        {
          'services.bed_availability': {
            general_beds: req.body.bed_status.general_beds,
            icu_beds: req.body.bed_status.icu_beds,
            emergency_beds: req.body.bed_status.emergency_beds,
            last_updated: new Date()
          }
        }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Hospital status updated successfully',
      data: hospitalStatus
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hospital status',
      error: error.message
    });
  }
});

// @desc    Manage hospital resources
// @route   PUT /api/rho/hospital/:hospitalId/resources
// @access  Private (RHO only)
const manageHospitalResources = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  const rhoUserId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    // Verify hospital access
    const mapping = await HospitalRHOMapping.findOne({
      hospital_id: hospitalId,
      rho_id: rho.rho_id,
      status: 'active'
    });
    
    if (!mapping) {
      return res.status(403).json({
        success: false,
        message: 'Hospital not under your management'
      });
    }
    
    const resourceUpdate = {
      ...req.body,
      hospital_id: hospitalId,
      rho_id: rho.rho_id,
      last_updated: new Date(),
      updated_by: rho.name
    };
    
    const resources = await HospitalResource.findOneAndUpdate(
      { hospital_id: hospitalId },
      resourceUpdate,
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Hospital resources updated successfully',
      data: resources
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hospital resources',
      error: error.message
    });
  }
});

// @desc    Create medical camp
// @route   POST /api/rho/camp/create
// @access  Private (RHO only)
const createMedicalCamp = asyncHandler(async (req, res) => {
  const rhoUserId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    const campData = {
      ...req.body,
      rho_id: rho.rho_id,
      rho_name: rho.name,
      camp_status: {
        status: 'pending_approval',
        created_by: rho.name,
        created_at: new Date()
      },
      created_by: rho.name
    };
    
    const camp = new MedicalCamp(campData);
    await camp.save();
    
    res.status(201).json({
      success: true,
      message: 'Medical camp created successfully',
      data: camp
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating medical camp',
      error: error.message
    });
  }
});

// @desc    Get RHO's medical camps
// @route   GET /api/rho/camps
// @access  Private (RHO only)
const getRHOCamps = asyncHandler(async (req, res) => {
  const rhoUserId = req.user.id;
  const { status, camp_type, limit = 20, page = 1 } = req.query;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    let query = { rho_id: rho.rho_id };
    
    if (status) query['camp_status.status'] = status;
    if (camp_type) query.camp_type = camp_type;
    
    const skip = (page - 1) * limit;
    
    const [camps, total] = await Promise.all([
      MedicalCamp.find(query)
        .sort({ created_at: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      MedicalCamp.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: camps.length,
      total,
      pages: Math.ceil(total / limit),
      current_page: parseInt(page),
      data: camps
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching camps',
      error: error.message
    });
  }
});

// @desc    Update camp status
// @route   PUT /api/rho/camp/:campId/status
// @access  Private (RHO only)
const updateCampStatus = asyncHandler(async (req, res) => {
  const { campId } = req.params;
  const { status, notes } = req.body;
  const rhoUserId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    const camp = await MedicalCamp.findOne({ 
      camp_id: campId,
      rho_id: rho.rho_id
    });
    
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: 'Camp not found or access denied'
      });
    }
    
    camp.camp_status.status = status;
    camp.camp_status.last_updated = new Date();
    camp.camp_status.updated_by = rho.name;
    
    if (notes) {
      camp.camp_status.notes = notes;
    }
    
    await camp.save();
    
    res.status(200).json({
      success: true,
      message: 'Camp status updated successfully',
      data: camp
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating camp status',
      error: error.message
    });
  }
});

// @desc    Report outbreak
// @route   POST /api/rho/outbreak/report
// @access  Private (RHO only)
const reportOutbreak = asyncHandler(async (req, res) => {
  const rhoUserId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
    const outbreakData = {
      ...req.body,
      rho_id: rho.rho_id,
      rho_name: rho.name,
      outbreak_status: {
        reported_date: new Date(),
        reported_by: rho.name,
        current_status: 'under_investigation'
      }
    };
    
    const outbreak = new OutbreakManagement(outbreakData);
    await outbreak.save();
    
    res.status(201).json({
      success: true,
      message: 'Outbreak reported successfully',
      data: outbreak
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reporting outbreak',
      error: error.message
    });
  }
});

// @desc    Get RHO performance analytics
// @route   GET /api/rho/analytics
// @access  Private (RHO only)
const getRHOAnalytics = asyncHandler(async (req, res) => {
  const rhoUserId = req.user.id;
  const { period = '30d' } = req.query;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ user_id: rhoUserId });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO profile not found'
      });
    }
    
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
      case '1y':
        startDate = moment().subtract(1, 'year').toDate();
        break;
      default:
        startDate = moment().subtract(30, 'days').toDate();
    }
    
    // Get camp analytics
    const campAnalytics = await CampAnalytics.find({
      rho_id: rho.rho_id,
      analytics_date: { $gte: startDate }
    }).sort({ analytics_date: -1 });
    
    // Calculate hospital performance
    const hospitalPerformance = await HospitalRHOMapping.getRHOPerformanceStats(rho.rho_id);
    
    // Get resource utilization trends
    const resourceTrends = await getResourceTrends(rho.rho_id, startDate);
    
    const analytics = {
      period,
      start_date: startDate,
      end_date: new Date(),
      camp_analytics: campAnalytics,
      hospital_performance: hospitalPerformance[0] || {},
      resource_trends: resourceTrends,
      summary: {
        total_camps: campAnalytics.length,
        avg_satisfaction: campAnalytics.reduce((sum, c) => 
          sum + c.quality_metrics.satisfaction_score, 0) / campAnalytics.length || 0,
        total_beneficiaries: campAnalytics.reduce((sum, c) => 
          sum + c.performance_metrics.beneficiaries_served, 0)
      }
    };
    
    res.status(200).json({
      success: true,
      data: analytics
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// Helper functions
async function getCriticalAlertsForRHO(rhoId) {
  const hospitalAlerts = await HospitalRealtimeStatus.find({
    rho_id: rhoId,
    'alerts_notifications.severity': { $in: ['critical', 'high'] },
    'alerts_notifications.resolved': false
  }).limit(10);
  
  return hospitalAlerts;
}

async function calculateRHOPerformance(rhoId) {
  const [hospitalStats, campStats] = await Promise.all([
    HospitalRHOMapping.getRHOPerformanceStats(rhoId),
    CampAnalytics.find({ rho_id: rhoId })
      .sort({ analytics_date: -1 })
      .limit(10)
  ]);
  
  const avgCampSatisfaction = campStats.reduce((sum, c) => 
    sum + c.quality_metrics.satisfaction_score, 0) / campStats.length || 0;
  
  return {
    hospital_performance: hospitalStats[0] || {},
    camp_performance: {
      avg_satisfaction: avgCampSatisfaction.toFixed(2),
      recent_camps: campStats.length
    }
  };
}

async function getResourceTrends(rhoId, startDate) {
  // Get hospitals under RHO
  const hospitals = await HospitalRHOMapping.find({ 
    rho_id: rhoId,
    status: 'active'
  }).select('hospital_id');
  
  const hospitalIds = hospitals.map(h => h.hospital_id);
  
  // Get resource data
  const resources = await HospitalResource.find({
    hospital_id: { $in: hospitalIds },
    last_updated: { $gte: startDate }
  }).sort({ last_updated: 1 });
  
  return resources;
}

module.exports = {
  getRHODashboard,
  getManagedHospitals,
  updateHospitalStatus,
  manageHospitalResources,
  createMedicalCamp,
  getRHOCamps,
  updateCampStatus,
  reportOutbreak,
  getRHOAnalytics
};