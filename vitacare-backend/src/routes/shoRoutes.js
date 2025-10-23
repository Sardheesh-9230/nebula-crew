const express = require('express');
const router = express.Router();
const {
  getSHODashboard,
  createRHO,
  createMultiZoneRHOs,
  getZoneHospitals,
  getAllRHOs,
  updateRHO,
  assignHospitalToRHO
} = require('../controllers/shoController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes and authorize SHO only
router.use(protect);
router.use(authorize('SHO'));

// SHO Dashboard Routes
router.get('/dashboard', getSHODashboard);

// RHO Management Routes
router.get('/rhos', getAllRHOs);
router.post('/rho/create', createRHO);
router.post('/rho/create-multi-zone', createMultiZoneRHOs);
router.put('/rho/:rhoId', updateRHO);

// Zone Management Routes
router.get('/zones/:zoneId/hospitals', getZoneHospitals);

// Hospital Assignment Routes
router.post('/hospital/assign', assignHospitalToRHO);

module.exports = router;