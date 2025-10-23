import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import {
  MedicalServices,
  Event,
  Person,
  LocalHospital,
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

  useEffect(() => {
    dispatch(getMedicalRecords());
    dispatch(getAppointments());
  }, [dispatch]);

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
  ).slice(0, 3);

  const recentRecords = records.slice(0, 3);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}, {user?.profile?.firstName}!
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        {t('healthId')}: {user?.healthId}
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MedicalServices color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{records.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              {t('medicalRecords')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Event color="secondary" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{appointments.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              {t('appointments')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LocalHospital color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{upcomingAppointments.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              {t('upcomingAppointments')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Person color="info" sx={{ fontSize: 40 }} />
            <Typography variant="h4">1</Typography>
            <Typography variant="body2" color="textSecondary">
              Active Profile
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('upcomingAppointments')}
              </Typography>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => (
                  <Box key={apt._id} sx={{ mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {apt.timeSlot.start} - {apt.status}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {t('noAppointments')}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/appointments')}>
                View All
              </Button>
              <Button size="small" color="primary" onClick={() => navigate('/appointments')}>
                {t('bookAppointment')}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('recentRecords')}
              </Typography>
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <Box key={record._id} sx={{ mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2">
                      {record.metadata.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(record.metadata.date).toLocaleDateString()} - {record.recordType}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {t('noRecords')}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/records')}>
                {t('viewRecords')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
