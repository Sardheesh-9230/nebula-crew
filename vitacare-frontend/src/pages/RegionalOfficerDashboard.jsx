import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Fade,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Badge,
  IconButton,
} from '@mui/material';
import {
  Place,
  LocalHospital,
  Warning,
  People,
  NotificationsActive,
  HealthAndSafety,
  LocationOn,
  PersonPin,
  Error as ErrorIcon,
  Visibility,
  Send,
  Security,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const RegionalOfficerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock data - Replace with actual API calls
  const regionalStats = {
    registeredWorkers: 12500,
    newCasesToday: 45,
    activeOutbreaks: 3,
    regionalRiskScore: 68,
    sosAlerts24h: 12,
  };

  const outbreakData = [
    { 
      id: 1, 
      disease: 'Dengue', 
      location: 'Industrial Area - Sector 5', 
      cases: 23, 
      severity: 'high',
      status: 'active',
      reported: '6 hours ago'
    },
    { 
      id: 2, 
      disease: 'Typhoid', 
      location: 'Migrant Camp - North Zone', 
      cases: 15, 
      severity: 'medium',
      status: 'monitoring',
      reported: '1 day ago'
    },
    { 
      id: 3, 
      disease: 'Respiratory Infection', 
      location: 'Construction Site - East', 
      cases: 8, 
      severity: 'low',
      status: 'contained',
      reported: '3 days ago'
    },
  ];

  const proximityAlerts = [
    { 
      id: 1, 
      workerA: 'Worker #12345', 
      workerB: 'Worker #67890', 
      disease: 'TB',
      distance: '5m',
      time: '15 mins ago',
      action: 'pending'
    },
    { 
      id: 2, 
      workerA: 'Worker #23456', 
      workerB: 'Worker #78901', 
      disease: 'COVID-19',
      distance: '3m',
      time: '1 hour ago',
      action: 'notified'
    },
    { 
      id: 3, 
      workerA: 'Worker #34567', 
      workerB: 'Worker #89012', 
      disease: 'Dengue',
      distance: '8m',
      time: '2 hours ago',
      action: 'notified'
    },
  ];

  const highRiskCases = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      uhiId: 'UHI123456', 
      condition: 'Severe Respiratory Distress',
      risk: 'Critical',
      doctor: 'Dr. Sharma',
      lastUpdated: '30 mins ago'
    },
    { 
      id: 2, 
      name: 'Amit Patel', 
      uhiId: 'UHI234567', 
      condition: 'High Fever + TB Symptoms',
      risk: 'High',
      doctor: 'Dr. Verma',
      lastUpdated: '2 hours ago'
    },
    { 
      id: 3, 
      name: 'Suresh Singh', 
      uhiId: 'UHI345678', 
      condition: 'Dengue - Platelet Count Low',
      risk: 'High',
      doctor: 'Dr. Reddy',
      lastUpdated: '4 hours ago'
    },
  ];

  const localFacilities = [
    { name: 'District Hospital', beds: 45, available: 12, doctors: 23 },
    { name: 'Primary Health Center - A', beds: 20, available: 8, doctors: 8 },
    { name: 'Primary Health Center - B', beds: 15, available: 5, doctors: 6 },
    { name: 'Community Clinic - North', beds: 10, available: 7, doctors: 4 },
  ];

  const weeklyTrend = [
    { day: 'Mon', cases: 12, tests: 45 },
    { day: 'Tue', cases: 19, tests: 52 },
    { day: 'Wed', cases: 15, tests: 48 },
    { day: 'Thu', cases: 22, tests: 61 },
    { day: 'Fri', cases: 18, tests: 55 },
    { day: 'Sat', cases: 25, tests: 58 },
    { day: 'Sun', cases: 20, tests: 50 },
  ];

  const performanceMetrics = [
    { subject: 'Response Time', A: 85, fullMark: 100 },
    { subject: 'Record Keeping', A: 92, fullMark: 100 },
    { subject: 'Telemedicine', A: 78, fullMark: 100 },
    { subject: 'Compliance', A: 88, fullMark: 100 },
    { subject: 'Coverage', A: 95, fullMark: 100 },
  ];

  const kpiCards = [
    {
      title: 'Registered Workers',
      value: regionalStats.registeredWorkers.toLocaleString(),
      change: '+5.2%',
      icon: <People sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
    },
    {
      title: 'New Cases Today',
      value: regionalStats.newCasesToday,
      change: '+12',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(245, 87, 108, 0.1)',
    },
    {
      title: 'Active Outbreaks',
      value: regionalStats.activeOutbreaks,
      change: '+1',
      icon: <Warning sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgColor: 'rgba(254, 225, 64, 0.1)',
    },
    {
      title: 'SOS Alerts (24h)',
      value: regionalStats.sosAlerts24h,
      change: '-3',
      icon: <NotificationsActive sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4facfe15 0%, #00f2fe15 50%, #43e97b15 100%)',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    mr: 2,
                  }}
                >
                  <Place sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ 
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Regional Health Office Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user?.jurisdiction?.region || 'Ernakulam District'} • Operational Management Center
                  </Typography>
                </Box>
              </Box>
              <Chip
                icon={<HealthAndSafety />}
                label={`Risk Score: ${regionalStats.regionalRiskScore}/100`}
                sx={{
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  px: 2,
                  py: 3,
                }}
              />
            </Box>
          </Box>
        </Fade>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={800 + index * 100}>
                <Card
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === index ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: hoveredCard === index 
                      ? '0 20px 40px rgba(0,0,0,0.15)' 
                      : '0 8px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 3,
                          background: card.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ color: card.gradient }}>{card.icon}</Box>
                      </Box>
                      <Chip
                        label={card.change}
                        size="small"
                        sx={{
                          background: card.gradient,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Active Outbreaks & Weekly Trend */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Warning sx={{ fontSize: 28, mr: 1, color: '#f5576c' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Active Outbreak Alerts
                    </Typography>
                  </Box>
                  <List>
                    {outbreakData.map((outbreak, index) => (
                      <React.Fragment key={outbreak.id}>
                        <ListItem
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            background: outbreak.severity === 'high' 
                              ? 'rgba(245, 87, 108, 0.1)' 
                              : outbreak.severity === 'medium'
                              ? 'rgba(255, 167, 38, 0.1)'
                              : 'rgba(67, 233, 123, 0.1)',
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              background: outbreak.severity === 'high' 
                                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
                                : outbreak.severity === 'medium'
                                ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                                : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            }}>
                              <Warning />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {outbreak.disease}
                                </Typography>
                                <Chip
                                  label={outbreak.status.toUpperCase()}
                                  size="small"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: 20,
                                    background: outbreak.status === 'active' ? '#f5576c' : '#ffa726',
                                    color: 'white',
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                                  <Typography variant="body2">{outbreak.location}</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {outbreak.cases} cases • Reported {outbreak.reported}
                                </Typography>
                              </Box>
                            }
                          />
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                          >
                            Manage
                          </Button>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Weekly Case Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="cases" fill="#f5576c" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="tests" fill="#4facfe" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Proximity Alerts & High-Risk Cases */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Fade in timeout={1400}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Security sx={{ fontSize: 28, mr: 1, color: '#4facfe' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Proximity Alert Management
                    </Typography>
                  </Box>
                  <List>
                    {proximityAlerts.map((alert) => (
                      <ListItem
                        key={alert.id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          background: 'rgba(79, 172, 254, 0.05)',
                          border: '1px solid rgba(79, 172, 254, 0.2)',
                        }}
                      >
                        <ListItemAvatar>
                          <Badge badgeContent={alert.distance} color="error">
                            <Avatar sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                              <PersonPin />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium">
                              {alert.workerA} ↔ {alert.workerB}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Chip
                                label={alert.disease}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 20, mt: 0.5, mr: 0.5 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                • {alert.time}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label={alert.action}
                          size="small"
                          color={alert.action === 'pending' ? 'warning' : 'success'}
                          sx={{ mr: 1 }}
                        />
                        <IconButton size="small" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                          <Send fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5}>
            <Fade in timeout={1600}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Regional Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={performanceMetrics}>
                      <PolarGrid stroke="#667eea" />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Performance" dataKey="A" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* High-Risk Cases & Local Facilities */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Fade in timeout={1800}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ErrorIcon sx={{ fontSize: 28, mr: 1, color: '#f5576c' }} />
                    <Typography variant="h6" fontWeight="bold">
                      High-Risk Cases Requiring Follow-up
                    </Typography>
                  </Box>
                  <List>
                    {highRiskCases.map((patient) => (
                      <ListItem
                        key={patient.id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          background: 'rgba(245, 87, 108, 0.05)',
                          border: '1px solid rgba(245, 87, 108, 0.2)',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            {patient.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {patient.name}
                              </Typography>
                              <Chip
                                label={patient.risk}
                                size="small"
                                color={patient.risk === 'Critical' ? 'error' : 'warning'}
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {patient.condition}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                UHI: {patient.uhiId} • {patient.doctor} • Updated {patient.lastUpdated}
                              </Typography>
                            </Box>
                          }
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                        >
                          View
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5}>
            <Fade in timeout={2000}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Local Healthcare Facilities
                  </Typography>
                  {localFacilities.map((facility, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {facility.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {facility.available}/{facility.beds} beds
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(facility.available / facility.beds) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          mb: 0.5,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: (facility.available / facility.beds) > 0.3 
                              ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                              : 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {facility.doctors} doctors available
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegionalOfficerDashboard;
