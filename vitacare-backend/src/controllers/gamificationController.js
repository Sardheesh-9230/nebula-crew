const Gamification = require('../models/Gamification');

// @desc    Get user gamification data
// @route   GET /api/gamification
// @access  Private
const getGamificationData = async (req, res) => {
  try {
    let gamification = await Gamification.findOne({ user: req.user._id });

    if (!gamification) {
      // Create new gamification record if doesn't exist
      gamification = await Gamification.create({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      data: gamification
    });

  } catch (error) {
    console.error('Get gamification data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve gamification data',
      error: error.message
    });
  }
};

// @desc    Add points for an activity
// @route   POST /api/gamification/points
// @access  Private
const addPoints = async (req, res) => {
  try {
    const { activityType, points, description } = req.body;

    if (!activityType || !points) {
      return res.status(400).json({
        success: false,
        message: 'Activity type and points are required'
      });
    }

    let gamification = await Gamification.findOne({ user: req.user._id });

    if (!gamification) {
      gamification = await Gamification.create({ user: req.user._id });
    }

    await gamification.addPoints(activityType, points, description);

    res.status(200).json({
      success: true,
      message: `${points} points added for ${activityType}`,
      data: gamification
    });

  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add points',
      error: error.message
    });
  }
};

// @desc    Award badge to user
// @route   POST /api/gamification/badge
// @access  Private
const awardBadge = async (req, res) => {
  try {
    const { name, icon, description, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Badge name and category are required'
      });
    }

    let gamification = await Gamification.findOne({ user: req.user._id });

    if (!gamification) {
      gamification = await Gamification.create({ user: req.user._id });
    }

    await gamification.awardBadge({ name, icon, description, category });

    res.status(200).json({
      success: true,
      message: `Badge "${name}" awarded successfully`,
      data: gamification
    });

  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to award badge',
      error: error.message
    });
  }
};

// @desc    Update health score
// @route   POST /api/gamification/health-score
// @access  Private
const updateHealthScore = async (req, res) => {
  try {
    const { score } = req.body;

    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Health score must be between 0 and 100'
      });
    }

    let gamification = await Gamification.findOne({ user: req.user._id });

    if (!gamification) {
      gamification = await Gamification.create({ user: req.user._id });
    }

    await gamification.updateHealthScore(score);

    res.status(200).json({
      success: true,
      message: 'Health score updated successfully',
      data: gamification
    });

  } catch (error) {
    console.error('Update health score error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health score',
      error: error.message
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all', limit = 10 } = req.query;

    const leaderboard = await Gamification.getLeaderboard(period, parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        period,
        leaderboard
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard',
      error: error.message
    });
  }
};

// @desc    Get user's rank
// @route   GET /api/gamification/rank
// @access  Private
const getUserRank = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    const leaderboard = await Gamification.getLeaderboard(period, 1000);
    const userRank = leaderboard.findIndex(
      entry => entry.user._id.toString() === req.user._id.toString()
    ) + 1;

    const userGamification = await Gamification.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        rank: userRank || 'Unranked',
        totalUsers: leaderboard.length,
        points: period === 'monthly' ? userGamification?.points.monthly : userGamification?.points.total,
        period
      }
    });

  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user rank',
      error: error.message
    });
  }
};

// @desc    Get achievements
// @route   GET /api/gamification/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    const gamification = await Gamification.findOne({ user: req.user._id });

    if (!gamification) {
      return res.status(200).json({
        success: true,
        data: {
          badges: [],
          totalBadges: 0,
          recentActivities: []
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        badges: gamification.badges,
        totalBadges: gamification.badges.length,
        recentActivities: gamification.activities.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve achievements',
      error: error.message
    });
  }
};

module.exports = {
  getGamificationData,
  addPoints,
  awardBadge,
  updateHealthScore,
  getLeaderboard,
  getUserRank,
  getAchievements
};
