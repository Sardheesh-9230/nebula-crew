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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalHospital,
  People,
  Assessment,
  NotificationsActive,
  HealthAndSafety,
  LocationOn,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StateOfficerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock data - Replace with actual API calls
  const stateStats = {
    totalMigrantWorkers: 125000,
    healthRecordsProcessed: 45678,
    activeTelemedicine: 234,
    healthRiskIndex: 72,
    insuranceClaims: 8945,
  };

  const diseaseData = [
    { name: 'Jan', TB: 45, Dengue: 23, Malaria: 12, COVID: 8 },
    { name: 'Feb', TB: 52, Dengue: 28, Malaria: 15, COVID: 6 },
    { name: 'Mar', TB: 48, Dengue: 35, Malaria: 18, COVID: 4 },
    { name: 'Apr', TB: 61, Dengue: 42, Malaria: 22, COVID: 5 },
    { name: 'May', TB: 55, Dengue: 38, Malaria: 19, COVID: 3 },
    { name: 'Jun', TB: 67, Dengue: 45, Malaria: 25, COVID: 7 },
  ];

  const districtData = [
    { district: 'Ernakulam', cases: 345, risk: 'High', trend: 'up', color: '#f5576c' },
    { district: 'Thrissur', cases: 289, risk: 'Medium', trend: 'down', color: '#ffa726' },
    { district: 'Kozhikode', cases: 234, risk: 'Medium', trend: 'up', color: '#ffa726' },
    { district: 'Kannur', cases: 178, risk: 'Low', trend: 'down', color: '#43e97b' },
    { district: 'Alappuzha', cases: 156, risk: 'Low', trend: 'stable', color: '#43e97b' },
  ];

  const vaccinationProgress = [
    { name: 'First Dose', value: 85, color: '#667eea' },
    { name: 'Second Dose', value: 72, color: '#764ba2' },
    { name: 'Booster', value: 45, color: '#f093fb' },
  ];

  const resourceAllocation = [
    { resource: 'Hospital Beds', available: 1250, total: 2000 },
    { resource: 'ICU Beds', available: 89, total: 200 },
    { resource: 'Ventilators', available: 34, total: 80 },
    { resource: 'Oxygen Cylinders', available: 456, total: 800 },
  ];

  const recentAlerts = [
    { id: 1, type: 'outbreak', message: 'Dengue cluster detected in Ernakulam', severity: 'high', time: '2 hours ago' },
    { id: 2, type: 'resource', message: 'Low vaccine stock in Thrissur district', severity: 'medium', time: '5 hours ago' },
    { id: 3, type: 'sos', message: '23 SOS calls received from Kozhikode', severity: 'high', time: '1 day ago' },
  ];

  const kpiCards = [
    {
      title: 'Total Registered Workers',
      value: stateStats.totalMigrantWorkers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: <People sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
    },
    {
      title: 'Health Records Processed',
      value: stateStats.healthRecordsProcessed.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(245, 87, 108, 0.1)',
    },
    {
      title: 'Active Telemedicine',
      value: stateStats.activeTelemedicine,
      change: '+5%',
      trend: 'up',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
    },
    {
      title: 'Health Risk Index',
      value: `${stateStats.healthRiskIndex}/100`,
      change: '-3%',
      trend: 'down',
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: 'rgba(67, 233, 123, 0.1)',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 50%, #f5576c15 100%)',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mr: 2,
                }}
              >
                <DashboardIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  State Health Office Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome back, {user?.profile?.firstName || 'Officer'} • Strategic Health Intelligence Center
                </Typography>
              </Box>
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
                          color: card.gradient,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Chip
                        icon={card.trend === 'up' ? <ArrowUpward /> : <ArrowDownward />}
                        label={card.change}
                        size="small"
                        sx={{
                          background: card.trend === 'up' 
                            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' 
                            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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

        {/* Alerts Section */}
        <Fade in timeout={1000}>
          <Card sx={{ 
            mb: 4, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsActive sx={{ 
                  fontSize: 28, 
                  mr: 1,
                  color: '#f5576c',
                }} />
                <Typography variant="h6" fontWeight="bold">
                  Real-time Alerts & Notifications
                </Typography>
              </Box>
              {recentAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.severity === 'high' ? 'error' : 'warning'}
                  sx={{ 
                    mb: 1,
                    borderRadius: 2,
                    '&:last-child': { mb: 0 },
                  }}
                  action={
                    <Button size="small" color="inherit">
                      View
                    </Button>
                  }
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      {alert.time}
                    </Typography>
                  </Box>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Fade>

        {/* Disease Surveillance */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Fade in timeout={1200}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Disease Surveillance & Outbreak Intelligence
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={diseaseData}>
                      <defs>
                        <linearGradient id="colorTB" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDengue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5576c" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f5576c" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMalaria" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area type="monotone" dataKey="TB" stroke="#667eea" fillOpacity={1} fill="url(#colorTB)" />
                      <Area type="monotone" dataKey="Dengue" stroke="#f5576c" fillOpacity={1} fill="url(#colorDengue)" />
                      <Area type="monotone" dataKey="Malaria" stroke="#4facfe" fillOpacity={1} fill="url(#colorMalaria)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Fade in timeout={1400}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Vaccination Progress
                  </Typography>
                  {vaccinationProgress.map((item, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: item.color }}>
                          {item.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.value}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* District Heatmap & Resource Allocation */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Fade in timeout={1600}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    District-wise Disease Distribution
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>District</strong></TableCell>
                          <TableCell align="right"><strong>Active Cases</strong></TableCell>
                          <TableCell align="center"><strong>Risk Level</strong></TableCell>
                          <TableCell align="center"><strong>Trend</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {districtData.map((row) => (
                          <TableRow key={row.district} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ fontSize: 20, mr: 1, color: row.color }} />
                                {row.district}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {row.cases}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={row.risk}
                                size="small"
                                sx={{
                                  background: row.color,
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {row.trend === 'up' && <ArrowUpward sx={{ color: '#f5576c' }} />}
                              {row.trend === 'down' && <ArrowDownward sx={{ color: '#43e97b' }} />}
                              {row.trend === 'stable' && <Typography>—</Typography>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5}>
            <Fade in timeout={1800}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Resource Allocation
                  </Typography>
                  {resourceAllocation.map((resource, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {resource.resource}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {resource.available} / {resource.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(resource.available / resource.total) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: (resource.available / resource.total) > 0.5 
                              ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                              : 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                          },
                        }}
                      />
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

export default StateOfficerDashboard;
