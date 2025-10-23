const express = require('express');
const router = express.Router();
const {
  getSHOComprehensiveAnalytics,
  getRHOPerformanceComparison,
  getCampAnalyticsDashboard,
  getPredictiveAnalytics
} = require('../controllers/analyticsController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// SHO Analytics Routes
router.get('/sho/comprehensive', authorize('SHO'), getSHOComprehensiveAnalytics);
router.get('/rho/comparison', authorize('SHO'), getRHOPerformanceComparison);
router.get('/predictive', authorize('SHO'), getPredictiveAnalytics);

// Camp Analytics Routes (accessible by both SHO and RHO)
router.get('/camps/dashboard', authorize('SHO', 'RHO'), getCampAnalyticsDashboard);

module.exports = router;