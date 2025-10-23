import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
} from '@mui/material';
import {
  Event,
  Add,
  Cancel,
  CheckCircle,
} from '@mui/icons-material';
import { getAppointments, cancelAppointment } from '../redux/slices/appointmentsSlice';

const Appointments = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
      scheduled: 'info',
      confirmed: 'success',
      completed: 'default',
      cancelled: 'error',
      'no-show': 'warning',
    };
    return colors[status] || 'default';
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {t('appointments')}
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          {t('bookAppointment')}
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Upcoming" />
          <Tab label="Past" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>

      {loading && <Typography>Loading...</Typography>}

      {!loading && filteredAppointments.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Event sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            {t('noAppointments')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Book your first appointment to get started.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} startIcon={<Add />}>
            {t('bookAppointment')}
          </Button>
        </Paper>
      )}

      <Grid container spacing={3}>
        {filteredAppointments.map((appointment) => (
          <Grid item xs={12} md={6} key={appointment._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      Appointment #{appointment.appointmentId}
                    </Typography>
                    <Chip
                      label={appointment.status.toUpperCase()}
                      color={getStatusColor(appointment.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Chip
                    label={appointment.type}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Time:</strong> {appointment.timeSlot.start} - {appointment.timeSlot.end}
                  </Typography>
                  
                  {appointment.doctorId && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Doctor:</strong> {appointment.doctorId.specialization?.[0] || 'General'}
                    </Typography>
                  )}

                  {appointment.hospitalId && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Hospital:</strong> {appointment.hospitalId.name}
                    </Typography>
                  )}

                  {appointment.reason && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Reason:</strong> {appointment.reason}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Fee:</strong> ₹{appointment.consultationFee}
                  </Typography>
                </Box>

                {appointment.status === 'scheduled' && new Date(appointment.appointmentDate) > new Date() && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CheckCircle />}
                      color="success"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Cancel />}
                      color="error"
                      onClick={() => handleCancelClick(appointment)}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment?
          </Typography>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Date: {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Time: {selectedAppointment.timeSlot.start}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            No, Keep It
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
