const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  points: {
    total: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },
  badges: [{
    name: {
      type: String,
      required: true
    },
    icon: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['health', 'checkup', 'quiz', 'fitness', 'consistency']
    }
  }],
  achievements: [{
    type: {
      type: String,
      enum: [
        'first_checkup',
        'annual_checkup',
        'health_quiz',
        'symptom_check',
        'record_update',
        'five_checkups',
        'ten_quizzes',
        'health_score_80',
        'consistent_user'
      ]
    },
    completedAt: Date
  }],
  healthScore: {
    current: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    history: [{
      score: Number,
      date: Date
    }]
  },
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  },
  activities: [{
    type: {
      type: String,
      enum: [
        'checkup_completed',
        'quiz_completed',
        'record_updated',
        'symptom_checked',
        'appointment_attended'
      ]
    },
    points: Number,
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  level: {
    current: {
      type: Number,
      default: 1
    },
    experience: {
      type: Number,
      default: 0
    },
    nextLevelAt: {
      type: Number,
      default: 100
    }
  },
  rewards: [{
    type: String,
    code: String,
    description: String,
    expiresAt: Date,
    isUsed: {
      type: Boolean,
      default: false
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Method to add points
gamificationSchema.methods.addPoints = async function(points, activity) {
  this.points.total += points;
  this.points.monthly += points;
  
  // Add to activities
  this.activities.push({
    type: activity,
    points,
    description: `Earned ${points} points for ${activity}`,
    date: new Date()
  });
  
  // Update level
  this.level.experience += points;
  while (this.level.experience >= this.level.nextLevelAt) {
    this.level.current += 1;
    this.level.experience -= this.level.nextLevelAt;
    this.level.nextLevelAt = Math.floor(this.level.nextLevelAt * 1.5);
  }
  
  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActivity = this.streaks.lastActivity ? 
    new Date(this.streaks.lastActivity).setHours(0, 0, 0, 0) : null;
  
  if (!lastActivity || today - lastActivity === 86400000) {
    this.streaks.current += 1;
    if (this.streaks.current > this.streaks.longest) {
      this.streaks.longest = this.streaks.current;
    }
  } else if (today - lastActivity > 86400000) {
    this.streaks.current = 1;
  }
  this.streaks.lastActivity = new Date();
  
  return await this.save();
};

// Method to award badge
gamificationSchema.methods.awardBadge = async function(badgeData) {
  const exists = this.badges.find(b => b.name === badgeData.name);
  if (!exists) {
    this.badges.push(badgeData);
    return await this.save();
  }
  return this;
};

// Method to update health score
gamificationSchema.methods.updateHealthScore = async function(newScore) {
  this.healthScore.history.push({
    score: this.healthScore.current,
    date: new Date()
  });
  this.healthScore.current = newScore;
  
  // Keep only last 30 days of history
  if (this.healthScore.history.length > 30) {
    this.healthScore.history = this.healthScore.history.slice(-30);
  }
  
  return await this.save();
};

// Static method to get leaderboard
gamificationSchema.statics.getLeaderboard = async function(limit = 10, period = 'all') {
  const sortField = period === 'monthly' ? 'points.monthly' : 'points.total';
  return await this.find()
    .sort({ [sortField]: -1 })
    .limit(limit)
    .populate('user', 'profile.firstName profile.lastName healthId');
};

// Reset monthly points (to be run via cron job)
gamificationSchema.statics.resetMonthlyPoints = async function() {
  return await this.updateMany(
    {},
    { 
      'points.monthly': 0,
      'points.lastReset': new Date()
    }
  );
};

module.exports = mongoose.model('Gamification', gamificationSchema);
