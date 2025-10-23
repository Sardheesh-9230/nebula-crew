import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  LocalFireDepartment,
  FitnessCenter,
  Favorite,
  Timeline,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { toast } from 'react-toastify';

const Gamification = () => {
  const [gamificationData, setGamificationData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchGamificationData();
    fetchLeaderboard();
    fetchUserRank();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const response = await api.get('/gamification');
      setGamificationData(response.data.data);
    } catch (error) {
      toast.error('Failed to load gamification data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/gamification/leaderboard?limit=10');
      setLeaderboard(response.data.data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
    }
  };

  const fetchUserRank = async () => {
    try {
      const response = await api.get('/gamification/rank');
      setUserRank(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user rank');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading || !gamificationData) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const levelProgress = ((gamificationData.level.experience / gamificationData.level.nextLevelAt) * 100) || 0;
  
  // Prepare health score chart data
  const chartData = gamificationData.healthScore.history.slice(-7).map((entry, index) => ({
    day: `Day ${index + 1}`,
    score: entry.score,
  }));

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            🏆 Health Gamification
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your progress, earn rewards, and compete with others
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Points</Typography>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {gamificationData.points.total.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalFireDepartment sx={{ mr: 1 }} />
                  <Typography variant="h6">Current Streak</Typography>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {gamificationData.streaks.current} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: '#fff'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmojiEvents sx={{ mr: 1 }} />
                  <Typography variant="h6">Badges</Typography>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {gamificationData.badges.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: '#fff'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Favorite sx={{ mr: 1 }} />
                  <Typography variant="h6">Health Score</Typography>
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {gamificationData.healthScore.current}/100
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Level & Rank */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Level Progress
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Level {gamificationData.level.current}</Typography>
                <Typography variant="body2">Level {gamificationData.level.current + 1}</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={levelProgress} 
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {gamificationData.level.experience} / {gamificationData.level.nextLevelAt} XP
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Your Ranking
              </Typography>
              {userRank && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}>
                      <Typography variant="h5" fontWeight={700}>
                        #{userRank.rank}
                      </Typography>
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        Rank {userRank.rank} of {userRank.totalUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userRank.points} points this {userRank.period}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab icon={<Timeline />} label="Health Score" />
            <Tab icon={<EmojiEvents />} label="Badges" />
            <Tab icon={<TrendingUp />} label="Leaderboard" />
            <Tab icon={<FitnessCenter />} label="Activities" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Health Score Trend (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Your Badges ({gamificationData.badges.length})
            </Typography>
            {gamificationData.badges.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No badges earned yet. Keep being healthy!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {gamificationData.badges.map((badge, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h2">{badge.icon || '🏅'}</Typography>
                          <Typography variant="h6" fontWeight={700} gutterBottom>
                            {badge.name}
                          </Typography>
                          <Chip label={badge.category} size="small" sx={{ mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {badge.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
              Top 10 Leaderboard
            </Typography>
            <List>
              {leaderboard.map((entry, index) => (
                <React.Fragment key={entry.user._id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: index === 0 ? '#FFD700' : 
                                index === 1 ? '#C0C0C0' : 
                                index === 2 ? '#CD7F32' : '#667eea'
                      }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${entry.user.profile.firstName} ${entry.user.profile.lastName}`}
                      secondary={`${entry.totalPoints.toLocaleString()} points • Level ${entry.level}`}
                    />
                    {index < 3 && (
                      <EmojiEvents sx={{ 
                        color: index === 0 ? '#FFD700' : 
                              index === 1 ? '#C0C0C0' : '#CD7F32'
                      }} />
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {tabValue === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
              Recent Activities
            </Typography>
            <List>
              {gamificationData.activities.slice(0, 10).map((activity, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Star />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description || activity.type}
                      secondary={new Date(activity.date).toLocaleString()}
                    />
                    <Chip label={`+${activity.points} pts`} color="success" size="small" />
                  </ListItem>
                </React.Fragment>
              ))}
              {gamificationData.activities.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No activities yet. Start your health journey!
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Gamification;
