const express = require('express');
const {
  // Doctor management
  getAllDoctors,
  registerDoctor,
  updateDoctor,
  deleteDoctor,
  // State officer management
  getAllStateOfficers,
  registerStateOfficer,
  updateStateOfficer,
  deleteStateOfficer,
  // Regional officer management
  getAllRegionalOfficers,
  registerRegionalOfficer,
  updateRegionalOfficer,
  deleteRegionalOfficer,
  // Statistics
  getDashboardStatistics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes - admin only
router.use(protect);

// Dashboard statistics
router.get('/statistics', getDashboardStatistics);

// Doctor routes
router.route('/doctors')
  .get(getAllDoctors)
  .post(registerDoctor);

router.route('/doctors/:id')
  .put(updateDoctor)
  .delete(deleteDoctor);

// State Health Officer routes
router.route('/state-officers')
  .get(getAllStateOfficers)
  .post(registerStateOfficer);

router.route('/state-officers/:id')
  .put(updateStateOfficer)
  .delete(deleteStateOfficer);

// Regional Health Officer routes
router.route('/regional-officers')
  .get(getAllRegionalOfficers)
  .post(registerRegionalOfficer);

router.route('/regional-officers/:id')
  .put(updateRegionalOfficer)
  .delete(deleteRegionalOfficer);

module.exports = router;
