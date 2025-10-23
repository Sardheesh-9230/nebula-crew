const express = require('express');
const router = express.Router();
const {
  getRHODashboard,
  getManagedHospitals,
  updateHospitalStatus,
  manageHospitalResources,
  createMedicalCamp,
  getRHOCamps,
  updateCampStatus,
  reportOutbreak,
  getRHOAnalytics
} = require('../controllers/rhoController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes and authorize RHO only
router.use(protect);
router.use(authorize('RHO'));

// RHO Dashboard Routes
router.get('/dashboard', getRHODashboard);
router.get('/analytics', getRHOAnalytics);

// Hospital Management Routes
router.get('/hospitals', getManagedHospitals);
router.put('/hospital/:hospitalId/status', updateHospitalStatus);
router.put('/hospital/:hospitalId/resources', manageHospitalResources);

// Medical Camp Routes
router.get('/camps', getRHOCamps);
router.post('/camp/create', createMedicalCamp);
router.put('/camp/:campId/status', updateCampStatus);

// Outbreak Management Routes
router.post('/outbreak/report', reportOutbreak);

module.exports = router;