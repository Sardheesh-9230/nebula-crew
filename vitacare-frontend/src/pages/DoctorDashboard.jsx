import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Divider,
  Fade,
  Badge,
  LinearProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  LocalHospital,
  CalendarToday,
  People,
  TrendingUp,
  Search,
  Visibility,
  VideoCall,
  Assignment,
  Warning,
  Schedule,
  Add,
  Healing,
  Favorite,
  Timeline,
  HealthAndSafety,
  Notifications,
  Person,
  Phone,
  Email,
  LocationOn,
  Bloodtype,
  MonitorHeart,
  Assessment,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('healthId');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const fetchDoctorProfile = async () => {
    try {
      const response = await api.get('/doctors/profile/me');
      setDoctorProfile(response.data.data);
    } catch (error) {
      toast.error('Failed to load doctor profile');
      // If no doctor profile exists, redirect to registration
      if (error.response?.status === 404) {
        navigate('/doctor/register');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warning('Please enter a search term');
      return;
    }

    try {
      setSearching(true);
      const response = await api.get('/doctors/patients/search', {
        params: { query: searchQuery, searchBy }
      });
      setPatients(response.data.data.patients);
      
      if (response.data.data.patients.length === 0) {
        toast.info('No patients found');
      }
    } catch (error) {
      toast.error('Failed to search patients');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
            👨‍⚕️ Doctor Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome, Dr. {doctorProfile?.userId?.profile?.firstName} {doctorProfile?.userId?.profile?.lastName}
          </Typography>
        </Box>

        {/* Doctor Info Card */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'rgba(255,255,255,0.3)' }}>
              <LocalHospital sx={{ fontSize: 50 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Dr. {doctorProfile?.userId?.profile?.firstName} {doctorProfile?.userId?.profile?.lastName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {doctorProfile?.specialization?.map((spec, index) => (
                  <Chip 
                    key={index}
                    label={spec}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                ))}
              </Box>
              <Typography variant="body2">
                Registration: {doctorProfile?.registrationNumber}
              </Typography>
              <Typography variant="body2">
                Experience: {doctorProfile?.experience} years
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>0</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Today's Appointments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>0</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Patients
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {doctorProfile?.rating?.toFixed(1) || '0.0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VideoCall sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Chip 
                      label={doctorProfile?.telemedicineEnabled ? 'Enabled' : 'Disabled'}
                      color={doctorProfile?.telemedicineEnabled ? 'success' : 'default'}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Telemedicine
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Patient Search */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Search Patient Records
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, UHI, or mobile number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={searching}
              sx={{ minWidth: 120 }}
            >
              {searching ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>

          {/* Search Results */}
          {patients.length > 0 && (
            <List>
              {patients.map((patient) => (
                <ListItem
                  key={patient._id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end">
                        <Visibility />
                      </IconButton>
                    </Box>
                  }
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {patient.profile?.firstName?.charAt(0)}
                      {patient.profile?.lastName?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${patient.profile?.firstName || ''} ${patient.profile?.lastName || ''}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" component="span">
                          UHI: {patient.healthId}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          Mobile: {patient.mobileNumber}
                        </Typography>
                        {patient.chronicConditions?.length > 0 && (
                          <>
                            <br />
                            <Typography variant="caption" color="warning.main">
                              Chronic: {patient.chronicConditions.join(', ')}
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {patients.length === 0 && searchQuery && !searching && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No patients found. Try a different search term.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default DoctorDashboard;
