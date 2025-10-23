const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getGamificationData,
  addPoints,
  awardBadge,
  updateHealthScore,
  getLeaderboard,
  getUserRank,
  getAchievements
} = require('../controllers/gamificationController');

// All routes require authentication
router.use(protect);

// Gamification data
router.get('/', getGamificationData);

// Points
router.post('/points', addPoints);

// Badges
router.post('/badge', awardBadge);

// Health score
router.post('/health-score', updateHealthScore);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

// User rank
router.get('/rank', getUserRank);

// Achievements
router.get('/achievements', getAchievements);

module.exports = router;
