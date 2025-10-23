import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Fade,
  Zoom,
  Slide,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  MedicalServices,
  Event,
  LocalHospital,
  TrendingUp,
  Favorite,
  Assignment,
  CalendarToday,
  ArrowForward,
  Add,
  CreditCard,
  LocalHospital as EmergencyIcon,
  CheckCircle,
  AccessTime,
  LocalPharmacy,
  Bloodtype,
  Phone,
} from '@mui/icons-material';
import { getMedicalRecords } from '../redux/slices/recordsSlice';
import { getAppointments } from '../redux/slices/appointmentsSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { records } = useSelector((state) => state.records);
  const { appointments } = useSelector((state) => state.appointments);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    dispatch(getMedicalRecords());
    dispatch(getAppointments());
  }, [dispatch]);

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
  ).slice(0, 3);

  const recentRecords = records.slice(0, 3);

  const stats = [
    {
      id: 1,
      title: t('medicalRecords'),
      value: records.length,
      icon: <MedicalServices sx={{ fontSize: 50 }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      delay: 100
    },
    {
      id: 2,
      title: t('appointments'),
      value: appointments.length,
      icon: <Event sx={{ fontSize: 50 }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(245, 87, 108, 0.1)',
      delay: 200
    },
    {
      id: 3,
      title: t('upcomingAppointments'),
      value: upcomingAppointments.length,
      icon: <LocalHospital sx={{ fontSize: 50 }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
      delay: 300
    },
    {
      id: 4,
      title: 'Health Score',
      value: '95%',
      icon: <Favorite sx={{ fontSize: 50 }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: 'rgba(67, 233, 123, 0.1)',
      delay: 400
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Welcome Header with Animation */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                animation: 'fadeInDown 1s ease-out'
              }}
            >
              {t('welcome')}, {user?.profile?.firstName}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 400
              }}
            >
              Here's your health overview today
            </Typography>
            <Chip 
              label={`Health ID: ${user?.healthId}`}
              color="primary"
              variant="outlined"
              sx={{ 
                mt: 2,
                px: 2,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }
              }}
            />
          </Box>
        </Fade>

        {/* Animated Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.id}>
              <Zoom in timeout={stat.delay}>
                <Card
                  onMouseEnter={() => setHoveredCard(stat.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: '100%',
                    background: hoveredCard === stat.id ? stat.color : '#fff',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredCard === stat.id ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                    boxShadow: hoveredCard === stat.id 
                      ? '0 20px 40px rgba(0,0,0,0.15)' 
                      : '0 2px 8px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: stat.color,
                      transform: hoveredCard === stat.id ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                      transformOrigin: 'left'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 70,
                          height: 70,
                          borderRadius: '16px',
                          background: hoveredCard === stat.id ? 'rgba(255,255,255,0.2)' : stat.bgColor,
                          color: hoveredCard === stat.id ? '#fff' : stat.color.split(' ')[1],
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {stat.icon}
                      </Box>
                      {stat.id === 4 && (
                        <TrendingUp 
                          sx={{ 
                            color: hoveredCard === stat.id ? '#fff' : '#43e97b',
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      )}
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        color: hoveredCard === stat.id ? '#fff' : 'text.primary',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: hoveredCard === stat.id ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                        fontWeight: 500,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions Section */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ⚡ Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  onClick={() => navigate('/profile')}
                  sx={{
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <CreditCard sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>
                      View UHI Card
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  onClick={() => navigate('/book-appointment')}
                  sx={{
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 24px rgba(245, 87, 108, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <CalendarToday sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>
                      Book Appointment
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  onClick={() => navigate('/records')}
                  sx={{
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: '#fff',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 24px rgba(79, 172, 254, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Assignment sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>
                      Upload Records
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: '#fff',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 24px rgba(67, 233, 123, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <EmergencyIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Emergency SOS
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>        {/* Health Insights & Activity Feed Row */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {/* Health Insights Card */}
          <Grid item xs={12} md={6}>
            <Grow in timeout={1400}>
              <Card sx={{
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Favorite sx={{ fontSize: 32, color: '#ff6b6b', mr: 1 }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      Health Insights
                    </Typography>
                  </Box>
                  <List>
                    <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, mb: 1 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: '#51cf66' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Blood Pressure"
                        secondary="Normal - 120/80 mmHg"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, mb: 1 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: '#51cf66' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Blood Sugar"
                        secondary="Normal - 95 mg/dL"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
                      <ListItemIcon>
                        <Bloodtype sx={{ color: '#fa5252' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Blood Group"
                        secondary={user?.profile?.bloodGroup || 'Not Set'}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  </List>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: '#fff',
                      color: '#ff6b6b',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#fff',
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    View Full Report
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Recent Activity Card */}
          <Grid item xs={12} md={6}>
            <Grow in timeout={1600}>
              <Card sx={{
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ fontSize: 32, color: '#339af0', mr: 1 }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      Recent Activity
                    </Typography>
                  </Box>
                  <List>
                    <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, mb: 1 }}>
                      <ListItemIcon>
                        <CalendarToday sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Appointment Booked"
                        secondary={upcomingAppointments[0] ? 
                          new Date(upcomingAppointments[0].appointmentDate).toLocaleDateString() : 
                          'No recent activity'
                        }
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, mb: 1 }}>
                      <ListItemIcon>
                        <Assignment sx={{ color: '#f5576c' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Records Uploaded"
                        secondary={`${records.length} documents available`}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
                      <ListItemIcon>
                        <LocalPharmacy sx={{ color: '#51cf66' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Prescriptions"
                        secondary="All medications up to date"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  </List>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: '#fff',
                      color: '#339af0',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#fff',
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Emergency Contacts Card */}
          {user?.emergencyContacts && user.emergencyContacts.length > 0 && (
            <Grid item xs={12}>
              <Grow in timeout={1800}>
                <Card sx={{
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                  boxShadow: '0 8px 32px rgba(245, 87, 108, 0.2)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ fontSize: 32, color: '#fff', mr: 1 }} />
                      <Typography variant="h6" fontWeight={700} color="#fff">
                        Emergency Contacts
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {user.emergencyContacts.map((contact, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box 
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.95)', 
                              borderRadius: 2, 
                              p: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                              },
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                              {contact.name}
                            </Typography>
                            <Chip 
                              label={contact.relationship}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(245, 87, 108, 0.1)',
                                color: '#f5576c',
                                fontWeight: 600,
                                my: 1,
                              }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                              <Phone sx={{ fontSize: 16, color: '#667eea' }} />
                              <Typography variant="body2" fontWeight={600} color="text.secondary">
                                {contact.mobile}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          )}
        </Grid>

        {/* Upcoming Appointments Section with Slide Animation */}
        <Slide direction="right" in timeout={1000}>
          <Box sx={{ mb: 6 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3 
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                📅 Upcoming Appointments
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => navigate('/book-appointment')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 20px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Book New
              </Button>
            </Box>

            <Grid container spacing={3}>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt, index) => (
                  <Grid item xs={12} md={4} key={apt._id}>
                    <Zoom in timeout={800 + index * 150}>
                      <Card sx={{
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        }} />
                        <CardContent sx={{ pt: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                              mr: 2,
                            }}>
                              <CalendarToday sx={{ color: '#667eea', fontSize: 28 }} />
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                                {new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </Typography>
                              <Chip 
                                label={apt.status} 
                                size="small" 
                                sx={{ 
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: '#fff',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                  height: 22,
                                }} 
                              />
                            </Box>
                          </Box>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'rgba(102, 126, 234, 0.05)', 
                            borderRadius: 2,
                            mb: 2 
                          }}>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                              Time Slot
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                              {apt.timeSlot.start}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                          <Button 
                            size="small" 
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/appointments')}
                            sx={{
                              color: '#667eea',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'rgba(102, 126, 234, 0.1)',
                              },
                            }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Zoom>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    borderRadius: 3,
                    border: '2px dashed rgba(102, 126, 234, 0.2)',
                  }}>
                    <CalendarToday sx={{ fontSize: 80, color: '#667eea', opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                      No Upcoming Appointments
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                      Book your first appointment to start your healthcare journey
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<Add />}
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => navigate('/book-appointment')}
                    >
                      Book Your First Appointment
                    </Button>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Slide>

        {/* Recent Medical Records Section with Grow Animation */}
        <Grow in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3 
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                📄 Recent Medical Records
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Add />}
                onClick={() => navigate('/records')}
                sx={{
                  borderColor: '#f5576c',
                  color: '#f5576c',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#f093fb',
                    borderWidth: 2,
                    background: 'rgba(240, 147, 251, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Upload New
              </Button>
            </Box>

            <Grid container spacing={3}>
              {recentRecords.length > 0 ? (
                recentRecords.map((record, index) => (
                  <Grid item xs={12} sm={6} md={4} key={record._id}>
                    <Fade in timeout={1000 + index * 100}>
                      <Card sx={{
                        height: '100%',
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 20px 40px rgba(245, 87, 108, 0.2)',
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #fff 0%, #fef9f8 100%)',
                        border: '1px solid rgba(245, 87, 108, 0.1)',
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                        }} />
                        <CardContent sx={{ pt: 3 }}>
                          <Box sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%)',
                            mb: 2,
                          }}>
                            <Assignment sx={{ color: '#f5576c', fontSize: 32 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                            {record.metadata.title}
                          </Typography>
                          <Chip 
                            label={record.recordType} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              color: '#fff',
                              fontWeight: 500,
                              mb: 2,
                              fontSize: '0.75rem',
                            }} 
                          />
                          <Typography variant="body2" color="textSecondary">
                            📅 {new Date(record.metadata.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                          <Button 
                            size="small"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/records')}
                            sx={{
                              color: '#f5576c',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'rgba(245, 87, 108, 0.1)',
                              },
                            }}
                          >
                            View
                          </Button>
                        </CardActions>
                      </Card>
                    </Fade>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%)',
                    borderRadius: 3,
                    border: '2px dashed rgba(245, 87, 108, 0.2)',
                  }}>
                    <Assignment sx={{ fontSize: 80, color: '#f5576c', opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                      No Medical Records Yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                      Upload your medical records to keep track of your health history
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<Add />}
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => navigate('/records')}
                    >
                      Upload Your First Record
                    </Button>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default Dashboard;
