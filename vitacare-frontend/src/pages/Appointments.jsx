import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Event,
  Add,
  Cancel,
  CheckCircle,
  CalendarToday,
  AccessTime,
  VideoCall,
  LocalHospital,
  WarningAmber,
} from '@mui/icons-material';
import { getAppointments, cancelAppointment } from '../redux/slices/appointmentsSlice';

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments, loading } = useSelector((state) => state.appointments);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedAppointment) {
      dispatch(cancelAppointment({
        id: selectedAppointment._id,
        reason: 'Cancelled by user'
      }));
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      confirmed: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      completed: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      cancelled: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      'no-show': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };
    return colors[status] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      case 'completed':
        return <CheckCircle />;
      default:
        return <AccessTime />;
    }
  };

  const filterAppointments = (appointments, filterType) => {
    const now = new Date();
    switch (filterType) {
      case 'upcoming':
        return appointments.filter(
          (apt) => new Date(apt.appointmentDate) > now && apt.status !== 'cancelled'
        );
      case 'past':
        return appointments.filter(
          (apt) => new Date(apt.appointmentDate) <= now || apt.status === 'completed'
        );
      case 'cancelled':
        return appointments.filter((apt) => apt.status === 'cancelled');
      default:
        return appointments;
    }
  };

  const filteredAppointments = filterAppointments(
    appointments,
    tabValue === 0 ? 'upcoming' : tabValue === 1 ? 'past' : 'cancelled'
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                📅 My Appointments
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Manage your upcoming and past appointments
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              size="large"
              onClick={() => navigate('/book-appointment')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Book Appointment
            </Button>
          </Box>
        </Fade>

        {/* Tabs Section */}
        <Slide direction="down" in timeout={800}>
          <Paper sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.05)',
                  },
                },
                '& .Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                },
              }}
            >
              <Tab label="🔮 Upcoming" />
              <Tab label="✅ Past" />
              <Tab label="❌ Cancelled" />
            </Tabs>
          </Paper>
        </Slide>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">Loading appointments...</Typography>
          </Box>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <Zoom in timeout={1000}>
            <Card sx={{ 
              p: 8, 
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.2)',
            }}>
              <Event sx={{ fontSize: 100, color: '#667eea', opacity: 0.3, mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                No {tabValue === 0 ? 'Upcoming' : tabValue === 1 ? 'Past' : 'Cancelled'} Appointments
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                {tabValue === 0 ? 'Book your first appointment to get started.' : 'No appointments found in this category.'}
              </Typography>
              {tabValue === 0 && (
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Book Your First Appointment
                </Button>
              )}
            </Card>
          </Zoom>
        )}

        {/* Appointments Grid */}
        <Grid container spacing={3}>
          {filteredAppointments.map((appointment, index) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Zoom in timeout={600 + index * 100}>
                <Card sx={{
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: getStatusColor(appointment.status),
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                          Appointment ID
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          #{appointment.appointmentId || appointment._id.slice(-6)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(appointment.status)}
                        label={appointment.status.toUpperCase()}
                        sx={{
                          background: getStatusColor(appointment.status),
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>

                    {/* Type Badge */}
                    <Chip
                      icon={appointment.type === 'video' ? <VideoCall /> : <LocalHospital />}
                      label={appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                      variant="outlined"
                      sx={{
                        mb: 3,
                        borderColor: '#667eea',
                        color: '#667eea',
                        fontWeight: 600,
                      }}
                    />

                    <Divider sx={{ mb: 3 }} />

                    {/* Date & Time */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}>
                          <CalendarToday sx={{ color: '#667eea', fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Appointment Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%)',
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}>
                          <AccessTime sx={{ color: '#43e97b', fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Time Slot
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {appointment.timeSlot?.start} - {appointment.timeSlot?.end}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Reason */}
                    {appointment.reason && (
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(102, 126, 234, 0.05)',
                        mb: 2,
                      }}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                          Reason for Visit
                        </Typography>
                        <Typography variant="body2">
                          {appointment.reason}
                        </Typography>
                      </Box>
                    )}

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                      {appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
                        <>
                          {appointment.type === 'video' && (
                            <Button
                              variant="contained"
                              startIcon={<VideoCall />}
                              fullWidth
                              sx={{
                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                                },
                              }}
                            >
                              Join Call
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            startIcon={<Cancel />}
                            fullWidth
                            onClick={() => handleCancelClick(appointment)}
                            sx={{
                              borderColor: '#f5576c',
                              color: '#f5576c',
                              fontWeight: 600,
                              '&:hover': {
                                borderColor: '#f093fb',
                                background: 'rgba(245, 87, 108, 0.1)',
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            fontWeight: 600,
                          }}
                        >
                          View Details
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Cancel Confirmation Dialog */}
        <Dialog 
          open={cancelDialogOpen} 
          onClose={() => setCancelDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 400,
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <WarningAmber />
            Cancel Appointment
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to cancel this appointment?
            </Typography>
            {selectedAppointment && (
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                background: 'rgba(245, 87, 108, 0.05)',
                border: '1px solid rgba(245, 87, 108, 0.2)',
              }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {selectedAppointment.timeSlot?.start} - {selectedAppointment.timeSlot?.end}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setCancelDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#764ba2',
                  background: 'rgba(102, 126, 234, 0.1)',
                },
              }}
            >
              No, Keep It
            </Button>
            <Button 
              onClick={handleCancelConfirm} 
              variant="contained"
              startIcon={<Cancel />}
              sx={{
                background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                },
              }}
            >
              Yes, Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Appointments;
