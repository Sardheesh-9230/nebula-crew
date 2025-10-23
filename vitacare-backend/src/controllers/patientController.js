const asyncHandler = require('express-async-handler');
const PatientHospitalInfo = require('../models/PatientHospitalInfo');
const PatientAppointment = require('../models/PatientAppointment');
const HospitalRealtimeStatus = require('../models/HospitalRealtimeStatus');
const HospitalRHOMapping = require('../models/HospitalRHOMapping');
const MedicalCamp = require('../models/MedicalCamp');
const geolib = require('geolib');

// @desc    Search hospitals by location and services
// @route   POST /api/patient/hospitals/search
// @access  Public
const searchHospitals = asyncHandler(async (req, res) => {
  try {
    const {
      location, // { latitude, longitude }
      radius_km = 10,
      service_type,
      hospital_type,
      insurance_accepted,
      emergency_services = false,
      availability_required = false
    } = req.body;
    
    let query = { patient_visible: true };
    
    // Filter by hospital type
    if (hospital_type) {
      query.hospital_type = hospital_type;
    }
    
    // Filter by emergency services
    if (emergency_services) {
      query['services.emergency_care'] = true;
    }
    
    // Filter by insurance
    if (insurance_accepted) {
      query['insurance_info.accepted_schemes'] = { $in: [insurance_accepted] };
    }
    
    // Filter by service type
    if (service_type) {
      query[`services.specialties.${service_type}`] = true;
    }
    
    let hospitals = await PatientHospitalInfo.find(query);
    
    // Filter by location if provided
    if (location) {
      hospitals = hospitals.filter(hospital => {
        if (!hospital.contact_info?.coordinates?.coordinates) return false;
        
        const [hospitalLon, hospitalLat] = hospital.contact_info.coordinates.coordinates;
        const distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: hospitalLat, longitude: hospitalLon }
        );
        
        return distance <= (radius_km * 1000); // Convert km to meters
      });
      
      // Sort by distance
      hospitals = hospitals.map(hospital => {
        const [hospitalLon, hospitalLat] = hospital.contact_info.coordinates.coordinates;
        const distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: hospitalLat, longitude: hospitalLon }
        );
        
        return {
          ...hospital.toObject(),
          distance_meters: distance,
          distance_km: (distance / 1000).toFixed(2)
        };
      }).sort((a, b) => a.distance_meters - b.distance_meters);
    }
    
    // Get real-time availability if required
    if (availability_required) {
      const hospitalsWithAvailability = await Promise.all(
        hospitals.map(async (hospital) => {
          const realtimeStatus = await HospitalRealtimeStatus.findOne({
            hospital_id: hospital.hospital_id
          }).sort({ last_updated: -1 });
          
          return {
            ...hospital,
            real_time_availability: realtimeStatus?.bed_status || null,
            last_status_update: realtimeStatus?.last_updated || null
          };
        })
      );
      
      hospitals = hospitalsWithAvailability;
    }
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      search_params: {
        location,
        radius_km,
        service_type,
        hospital_type,
        emergency_services,
        availability_required
      },
      data: hospitals
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching hospitals',
      error: error.message
    });
  }
});

// @desc    Get hospital details by ID
// @route   GET /api/patient/hospital/:hospitalId
// @access  Public
const getHospitalDetails = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  
  try {
    const hospital = await PatientHospitalInfo.findOne({
      hospital_id: hospitalId,
      patient_visible: true
    });
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found or not accessible'
      });
    }
    
    // Get real-time status
    const realtimeStatus = await HospitalRealtimeStatus.findOne({
      hospital_id: hospitalId
    }).sort({ last_updated: -1 });
    
    // Get RHO information
    const rhoMapping = await HospitalRHOMapping.findOne({
      hospital_id: hospitalId,
      status: 'active'
    });
    
    // Get recent patient ratings/reviews
    const recentAppointments = await PatientAppointment.find({
      hospital_id: hospitalId,
      'appointment_status.status': 'completed',
      'feedback.rating': { $exists: true }
    })
    .sort({ 'appointment_details.date': -1 })
    .limit(10)
    .select('feedback patient_info.patient_name');
    
    const hospitalDetails = {
      ...hospital.toObject(),
      real_time_status: realtimeStatus,
      rho_mapping: rhoMapping,
      recent_reviews: recentAppointments.map(apt => ({
        patient_name: apt.patient_info.patient_name,
        rating: apt.feedback.rating,
        review: apt.feedback.comments,
        date: apt.appointment_details.date
      }))
    };
    
    res.status(200).json({
      success: true,
      data: hospitalDetails
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hospital details',
      error: error.message
    });
  }
});

// @desc    Book appointment
// @route   POST /api/patient/appointment/book
// @access  Private (Patient)
const bookAppointment = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  
  try {
    const {
      hospital_id,
      appointment_details,
      patient_info,
      insurance_info
    } = req.body;
    
    // Verify hospital exists and accepts bookings
    const hospital = await PatientHospitalInfo.findOne({
      hospital_id,
      patient_visible: true,
      'booking_info.online_booking_available': true
    });
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found or does not accept online bookings'
      });
    }
    
    // Check availability
    const requestedDate = new Date(appointment_details.date);
    const existingAppointments = await PatientAppointment.countDocuments({
      hospital_id,
      'appointment_details.date': {
        $gte: new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate()),
        $lt: new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate() + 1)
      },
      'appointment_status.status': { $in: ['confirmed', 'pending'] }
    });
    
    const maxDailyAppointments = hospital.booking_info?.max_daily_appointments || 50;
    
    if (existingAppointments >= maxDailyAppointments) {
      return res.status(400).json({
        success: false,
        message: 'No appointments available for the selected date'
      });
    }
    
    // Create appointment
    const appointment = new PatientAppointment({
      hospital_id,
      rho_id: hospital.rho_id,
      patient_info: {
        ...patient_info,
        patient_id: patientId
      },
      appointment_details,
      insurance_info,
      appointment_status: {
        status: 'pending',
        booking_date: new Date(),
        booking_method: 'online'
      }
    });
    
    await appointment.save();
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment_id: appointment.appointment_id,
        appointment,
        hospital_info: {
          name: hospital.hospital_name,
          contact: hospital.contact_info.phone,
          address: hospital.contact_info.address
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
});

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient)
const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const { status, limit = 20, page = 1 } = req.query;
  
  try {
    let query = { 'patient_info.patient_id': patientId };
    
    if (status) {
      query['appointment_status.status'] = status;
    }
    
    const skip = (page - 1) * limit;
    
    const [appointments, total] = await Promise.all([
      PatientAppointment.find(query)
        .sort({ 'appointment_details.date': -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate('hospital_id', 'hospital_name contact_info'),
      PatientAppointment.countDocuments(query)
    ]);
    
    // Get hospital details for each appointment
    const appointmentsWithHospitalDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const hospital = await PatientHospitalInfo.findOne({
          hospital_id: appointment.hospital_id
        }).select('hospital_name contact_info services');
        
        return {
          ...appointment.toObject(),
          hospital_details: hospital
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      current_page: parseInt(page),
      data: appointmentsWithHospitalDetails
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// @desc    Cancel appointment
// @route   PUT /api/patient/appointment/:appointmentId/cancel
// @access  Private (Patient)
const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const patientId = req.user.id;
  const { reason } = req.body;
  
  try {
    const appointment = await PatientAppointment.findOne({
      appointment_id: appointmentId,
      'patient_info.patient_id': patientId
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or access denied'
      });
    }
    
    if (appointment.appointment_status.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed appointment'
      });
    }
    
    appointment.appointment_status.status = 'cancelled';
    appointment.appointment_status.cancellation_reason = reason;
    appointment.appointment_status.cancelled_date = new Date();
    
    await appointment.save();
    
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
});

// @desc    Submit feedback for appointment
// @route   PUT /api/patient/appointment/:appointmentId/feedback
// @access  Private (Patient)
const submitFeedback = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const patientId = req.user.id;
  
  try {
    const appointment = await PatientAppointment.findOne({
      appointment_id: appointmentId,
      'patient_info.patient_id': patientId,
      'appointment_status.status': 'completed'
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or not eligible for feedback'
      });
    }
    
    appointment.feedback = {
      ...req.body,
      feedback_date: new Date()
    };
    
    await appointment.save();
    
    // Update hospital rating
    await updateHospitalRating(appointment.hospital_id);
    
    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: appointment.feedback
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});

// @desc    Search medical camps
// @route   POST /api/patient/camps/search
// @access  Public
const searchMedicalCamps = asyncHandler(async (req, res) => {
  try {
    const {
      location,
      radius_km = 20,
      camp_type,
      target_demographic,
      date_range
    } = req.body;
    
    let query = {
      'camp_status.status': { $in: ['approved', 'ongoing'] },
      patient_registration_open: true
    };
    
    if (camp_type) {
      query.camp_type = camp_type;
    }
    
    if (target_demographic) {
      query['target_demographics.primary_beneficiaries'] = { $in: [target_demographic] };
    }
    
    if (date_range) {
      query['camp_logistics.dates.start_date'] = { 
        $gte: new Date(date_range.start),
        $lte: new Date(date_range.end)
      };
    }
    
    let camps = await MedicalCamp.find(query).sort({ 'camp_logistics.dates.start_date': 1 });
    
    // Filter by location if provided
    if (location) {
      camps = camps.filter(camp => {
        if (!camp.camp_logistics?.location?.coordinates?.coordinates) return false;
        
        const [campLon, campLat] = camp.camp_logistics.location.coordinates.coordinates;
        const distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: campLat, longitude: campLon }
        );
        
        return distance <= (radius_km * 1000);
      });
      
      // Add distance and sort
      camps = camps.map(camp => {
        const [campLon, campLat] = camp.camp_logistics.location.coordinates.coordinates;
        const distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: campLat, longitude: campLon }
        );
        
        return {
          ...camp.toObject(),
          distance_meters: distance,
          distance_km: (distance / 1000).toFixed(2)
        };
      }).sort((a, b) => a.distance_meters - b.distance_meters);
    }
    
    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching medical camps',
      error: error.message
    });
  }
});

// Helper function to update hospital rating
async function updateHospitalRating(hospitalId) {
  const appointments = await PatientAppointment.find({
    hospital_id: hospitalId,
    'feedback.rating': { $exists: true }
  }).select('feedback.rating feedback.overall_satisfaction');
  
  if (appointments.length === 0) return;
  
  const avgRating = appointments.reduce((sum, apt) => sum + apt.feedback.rating, 0) / appointments.length;
  const avgSatisfaction = appointments.reduce((sum, apt) => sum + apt.feedback.overall_satisfaction, 0) / appointments.length;
  
  await PatientHospitalInfo.findOneAndUpdate(
    { hospital_id: hospitalId },
    {
      'patient_ratings.average_rating': avgRating.toFixed(1),
      'patient_ratings.total_reviews': appointments.length,
      'patient_ratings.satisfaction_score': avgSatisfaction.toFixed(1),
      'patient_ratings.last_updated': new Date()
    }
  );
}

module.exports = {
  searchHospitals,
  getHospitalDetails,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  submitFeedback,
  searchMedicalCamps
};