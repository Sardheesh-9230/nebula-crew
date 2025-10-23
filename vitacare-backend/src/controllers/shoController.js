const asyncHandler = require('express-async-handler');
const RegionalHealthOfficer = require('../models/RegionalHealthOfficer');
const HealthZone = require('../models/HealthZone');
const HospitalRHOMapping = require('../models/HospitalRHOMapping');
const PatientHospitalInfo = require('../models/PatientHospitalInfo');
const HospitalRealtimeStatus = require('../models/HospitalRealtimeStatus');
const MedicalCamp = require('../models/MedicalCamp');
const OutbreakManagement = require('../models/OutbreakManagement');
const CampAnalytics = require('../models/CampAnalytics');

// @desc    Get SHO dashboard overview
// @route   GET /api/sho/dashboard
// @access  Private (SHO only)
const getSHODashboard = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  
  try {
    // Get all RHOs created by this SHO
    const rhos = await RegionalHealthOfficer.find({ created_by: shoId }).select('-__v');
    
    // Get all zones
    const zones = await HealthZone.find({ 'administrative_details.created_by_sho': shoId });
    
    // Get zone statistics
    const zoneStats = await HealthZone.getZoneStatistics();
    
    // Get hospital mappings count
    const hospitalMappings = await HospitalRHOMapping.find({
      'assignment_details.assigned_by_sho': shoId,
      status: 'active'
    }).countDocuments();
    
    // Get active camps
    const activeCamps = await MedicalCamp.find({
      'camp_status.status': { $in: ['ongoing', 'approved'] }
    }).countDocuments();
    
    // Get active outbreaks
    const activeOutbreaks = await OutbreakManagement.find({
      'containment_measures.containment_status': { $in: ['spreading', 'contained'] }
    }).countDocuments();
    
    // Calculate performance metrics
    const totalPopulation = rhos.reduce((sum, rho) => sum + rho.population_covered, 0);
    const avgPatientSatisfaction = rhos.reduce((sum, rho) => 
      sum + rho.performance_metrics.patient_satisfaction_score, 0) / rhos.length || 0;
    
    const dashboardData = {
      summary: {
        total_rhos: rhos.length,
        total_zones: zones.length,
        total_hospitals_managed: hospitalMappings,
        total_population_covered: totalPopulation,
        active_camps: activeCamps,
        active_outbreaks: activeOutbreaks,
        avg_patient_satisfaction: avgPatientSatisfaction.toFixed(2)
      },
      rhos: rhos,
      zone_statistics: zoneStats,
      recent_activities: await getRecentActivities(shoId),
      performance_trends: await getPerformanceTrends(shoId),
      alerts: await getCriticalAlerts(shoId)
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching SHO dashboard data',
      error: error.message
    });
  }
});

// @desc    Create new RHO for district
// @route   POST /api/sho/rho/create
// @access  Private (SHO only)
const createRHO = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  
  try {
    const {
      name,
      qualification,
      experience_years,
      zone_assignment,
      authority_scope,
      contact_info,
      facilities_under_direct_management
    } = req.body;
    
    // Validate zone assignment based on population density
    const populationDensity = zone_assignment.total_population / zone_assignment.area_sq_km;
    let recommendedZoneType;
    
    if (zone_assignment.total_population > 1000000) {
      recommendedZoneType = 'urban'; // Dense districts need multiple zones
    } else if (zone_assignment.total_population > 500000) {
      recommendedZoneType = 'district'; // Medium districts get single RHO
    } else {
      recommendedZoneType = 'rural'; // Less dense districts like Namakkal
    }
    
    // Create RHO
    const newRHO = new RegionalHealthOfficer({
      name,
      qualification,
      experience_years,
      zone_type: zone_assignment.zone_type || recommendedZoneType,
      coverage_area: zone_assignment.geographic_boundaries,
      population_covered: zone_assignment.total_population,
      authority_level: zone_assignment.total_population > 1000000 ? 'zone_specific' : 'full_district',
      direct_management: true, // As per specification - no coordinators
      contact_info,
      assigned_districts: zone_assignment.districts || [],
      assigned_taluks: zone_assignment.taluks || [],
      created_by: shoId
    });
    
    await newRHO.save();
    
    // Create zone entry
    const zone = new HealthZone({
      zone_name: `${zone_assignment.district} - ${name} Zone`,
      zone_type: recommendedZoneType === 'urban' ? 'urban' : 'rural',
      district_ids: zone_assignment.districts?.map(d => d.district_id) || [],
      district_names: zone_assignment.districts?.map(d => d.district_name) || [],
      taluk_ids: zone_assignment.taluks?.map(t => t.taluk_id) || [],
      taluk_names: zone_assignment.taluks?.map(t => t.taluk_name) || [],
      population: zone_assignment.total_population,
      area_sq_km: zone_assignment.area_sq_km,
      rho_id: newRHO.rho_id,
      rho_name: name,
      geographic_boundaries: zone_assignment.geographic_boundaries,
      administrative_details: {
        created_by_sho: shoId,
        approval_status: 'approved'
      }
    });
    
    await zone.save();
    
    // Create hospital mappings if facilities provided
    if (facilities_under_direct_management && facilities_under_direct_management.length > 0) {
      const hospitalMappings = facilities_under_direct_management.map(facility => ({
        hospital_id: facility.hospital_id || `hosp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        hospital_name: facility.name,
        rho_id: newRHO.rho_id,
        rho_name: name,
        assignment_details: {
          assigned_by_sho: shoId,
          district: facility.district || zone_assignment.district,
          taluk: facility.taluk
        },
        patient_visible: true,
        online_booking_enabled: true,
        emergency_services_active: true
      }));
      
      await HospitalRHOMapping.insertMany(hospitalMappings);
    }
    
    // Update RHO with hospital count
    newRHO.performance_metrics.hospitals_managed_count = facilities_under_direct_management?.length || 0;
    await newRHO.save();
    
    res.status(201).json({
      success: true,
      message: `RHO created successfully for ${zone_assignment.district}`,
      data: {
        rho: newRHO,
        zone: zone,
        recommended_zone_type: recommendedZoneType,
        population_density: populationDensity.toFixed(2)
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating RHO',
      error: error.message
    });
  }
});

// @desc    Create multiple zones for dense district
// @route   POST /api/sho/rho/create-multi-zone
// @access  Private (SHO only)
const createMultiZoneRHOs = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  
  try {
    const { district, district_id, zones } = req.body;
    
    const createdRHOs = [];
    const createdZones = [];
    
    for (const zoneData of zones) {
      // Create RHO for each zone
      const rho = new RegionalHealthOfficer({
        name: zoneData.rho_name,
        qualification: zoneData.rho_qualification,
        experience_years: zoneData.experience_years,
        zone_type: zoneData.zone_type,
        coverage_area: zoneData.geographic_boundaries,
        population_covered: zoneData.population,
        authority_level: 'zone_specific',
        direct_management: true,
        contact_info: zoneData.contact_info,
        assigned_districts: [{ district_id, district_name: district, population: zoneData.population }],
        created_by: shoId
      });
      
      await rho.save();
      createdRHOs.push(rho);
      
      // Create zone
      const zone = new HealthZone({
        zone_name: zoneData.zone_name,
        zone_type: zoneData.zone_type,
        district_ids: [district_id],
        district_names: [district],
        population: zoneData.population,
        area_sq_km: zoneData.area_sq_km,
        rho_id: rho.rho_id,
        rho_name: zoneData.rho_name,
        geographic_boundaries: zoneData.geographic_boundaries,
        administrative_details: {
          created_by_sho: shoId,
          approval_status: 'approved'
        }
      });
      
      await zone.save();
      createdZones.push(zone);
    }
    
    res.status(201).json({
      success: true,
      message: `Multiple zones created successfully for ${district}`,
      data: {
        rhos: createdRHOs,
        zones: createdZones,
        total_zones_created: zones.length
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating multi-zone RHOs',
      error: error.message
    });
  }
});

// @desc    Get zone-wise hospital distribution
// @route   GET /api/sho/zones/:zoneId/hospitals
// @access  Private (SHO only)
const getZoneHospitals = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;
  
  try {
    const zone = await HealthZone.findOne({ zone_id: zoneId });
    
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }
    
    const hospitals = await HospitalRHOMapping.find({ 
      rho_id: zone.rho_id,
      status: 'active'
    }).populate('rho_id');
    
    const hospitalDetails = await Promise.all(
      hospitals.map(async (mapping) => {
        const hospitalInfo = await PatientHospitalInfo.findOne({ hospital_id: mapping.hospital_id });
        const realtimeStatus = await HospitalRealtimeStatus.findOne({ hospital_id: mapping.hospital_id })
          .sort({ last_updated: -1 });
        
        return {
          mapping,
          info: hospitalInfo,
          status: realtimeStatus
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        zone_info: {
          zone_name: zone.zone_name,
          zone_type: zone.zone_type,
          population: zone.population,
          rho_name: zone.rho_name
        },
        hospitals: hospitalDetails
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching zone hospitals',
      error: error.message
    });
  }
});

// @desc    Get all RHOs with performance metrics
// @route   GET /api/sho/rhos
// @access  Private (SHO only)
const getAllRHOs = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  const { zone_type, status, sort_by = 'created_at', order = 'desc' } = req.query;
  
  try {
    let query = { created_by: shoId };
    
    if (zone_type) query.zone_type = zone_type;
    if (status) query.status = status;
    
    const sortOptions = {};
    sortOptions[sort_by] = order === 'desc' ? -1 : 1;
    
    const rhos = await RegionalHealthOfficer.find(query).sort(sortOptions);
    
    // Get performance stats for each RHO
    const rhosWithStats = await Promise.all(
      rhos.map(async (rho) => {
        const hospitalStats = await HospitalRHOMapping.getRHOPerformanceStats(rho.rho_id);
        const campStats = await MedicalCamp.find({ 
          rho_id: rho.rho_id,
          'camp_status.status': 'completed'
        }).countDocuments();
        
        const outbreakStats = await OutbreakManagement.find({
          rho_id: rho.rho_id
        }).countDocuments();
        
        return {
          ...rho.toObject(),
          statistics: {
            hospital_performance: hospitalStats[0] || {},
            camps_organized: campStats,
            outbreaks_managed: outbreakStats
          }
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: rhosWithStats.length,
      data: rhosWithStats
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching RHOs',
      error: error.message
    });
  }
});

// @desc    Update RHO details
// @route   PUT /api/sho/rho/:rhoId
// @access  Private (SHO only)
const updateRHO = asyncHandler(async (req, res) => {
  const { rhoId } = req.params;
  const shoId = req.user.id;
  
  try {
    const rho = await RegionalHealthOfficer.findOne({ 
      rho_id: rhoId, 
      created_by: shoId 
    });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO not found or access denied'
      });
    }
    
    const updates = req.body;
    Object.assign(rho, updates);
    
    await rho.save();
    
    res.status(200).json({
      success: true,
      message: 'RHO updated successfully',
      data: rho
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating RHO',
      error: error.message
    });
  }
});

// @desc    Assign hospital to RHO
// @route   POST /api/sho/hospital/assign
// @access  Private (SHO only)
const assignHospitalToRHO = asyncHandler(async (req, res) => {
  const shoId = req.user.id;
  
  try {
    const {
      hospital_id,
      hospital_name,
      rho_id,
      district,
      taluk,
      coordinates,
      hospital_type
    } = req.body;
    
    // Verify RHO exists and belongs to this SHO
    const rho = await RegionalHealthOfficer.findOne({
      rho_id,
      created_by: shoId
    });
    
    if (!rho) {
      return res.status(404).json({
        success: false,
        message: 'RHO not found or access denied'
      });
    }
    
    // Create hospital mapping
    const mapping = new HospitalRHOMapping({
      hospital_id,
      hospital_name,
      rho_id,
      rho_name: rho.name,
      assignment_details: {
        assigned_by_sho: shoId,
        district,
        taluk,
        geographic_location: {
          coordinates: coordinates
        }
      },
      patient_visible: true,
      online_booking_enabled: true
    });
    
    await mapping.save();
    
    // Update RHO hospital count
    rho.performance_metrics.hospitals_managed_count += 1;
    await rho.save();
    
    // Create patient-visible hospital info
    const hospitalInfo = new PatientHospitalInfo({
      hospital_id,
      rho_id,
      hospital_name,
      hospital_type: hospital_type || 'PHC',
      contact_info: {
        address: {
          district,
          taluk
        },
        coordinates: {
          coordinates: coordinates
        }
      },
      rho_info: {
        rho_name: rho.name,
        rho_contact: rho.contact_info.phone
      },
      updated_by: shoId
    });
    
    await hospitalInfo.save();
    
    res.status(201).json({
      success: true,
      message: 'Hospital assigned to RHO successfully',
      data: {
        mapping,
        hospital_info: hospitalInfo
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning hospital to RHO',
      error: error.message
    });
  }
});

// Helper functions
async function getRecentActivities(shoId) {
  // Get recent RHO creations, camp approvals, etc.
  const recentRHOs = await RegionalHealthOfficer.find({ created_by: shoId })
    .sort({ created_at: -1 })
    .limit(5)
    .select('name zone_type created_at');
    
  const recentCamps = await MedicalCamp.find({
    'camp_status.approval_workflow.approver_role': 'SHO'
  })
    .sort({ created_at: -1 })
    .limit(5)
    .select('camp_name camp_type created_at');
    
  return {
    recent_rho_creations: recentRHOs,
    recent_camp_approvals: recentCamps
  };
}

async function getPerformanceTrends(shoId) {
  // Calculate trends over last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const campTrends = await CampAnalytics.aggregate([
    {
      $lookup: {
        from: 'medical_camps',
        localField: 'camp_id',
        foreignField: 'camp_id',
        as: 'camp_info'
      }
    },
    {
      $unwind: '$camp_info'
    },
    {
      $lookup: {
        from: 'regional_health_officers',
        localField: 'rho_id',
        foreignField: 'rho_id',
        as: 'rho_info'
      }
    },
    {
      $unwind: '$rho_info'
    },
    {
      $match: {
        'rho_info.created_by': shoId,
        analytics_date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$analytics_date' },
          month: { $month: '$analytics_date' }
        },
        avg_satisfaction: { $avg: '$quality_metrics.satisfaction_score' },
        avg_attendance: { $avg: '$performance_metrics.attendance_rate' },
        total_beneficiaries: { $sum: '$performance_metrics.beneficiaries_served' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
  
  return campTrends;
}

async function getCriticalAlerts(shoId) {
  // Get critical alerts from all RHOs under this SHO
  const rhos = await RegionalHealthOfficer.find({ created_by: shoId }).select('rho_id');
  const rhoIds = rhos.map(rho => rho.rho_id);
  
  // Get hospital status alerts
  const hospitalAlerts = await HospitalRealtimeStatus.find({
    rho_id: { $in: rhoIds },
    'alerts_notifications.severity': 'critical',
    'alerts_notifications.resolved': false
  }).limit(10);
  
  // Get outbreak alerts
  const outbreakAlerts = await OutbreakManagement.find({
    rho_id: { $in: rhoIds },
    'containment_measures.containment_status': 'spreading'
  }).limit(5);
  
  return {
    hospital_alerts: hospitalAlerts,
    outbreak_alerts: outbreakAlerts
  };
}

module.exports = {
  getSHODashboard,
  createRHO,
  createMultiZoneRHOs,
  getZoneHospitals,
  getAllRHOs,
  updateRHO,
  assignHospitalToRHO
};