import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
} from '@mui/material';
import {
  LocalHospital,
  CalendarToday,
  People,
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
  Flag,
  Send,
  Edit,
  Close,
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

const EnhancedDoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    prescription: '',
    notes: '',
  });

  // Mock data - Replace with actual API calls
  const todaySchedule = [
    { id: 1, time: '09:00 AM', patient: 'Rajesh Kumar', type: 'telemedicine', status: 'upcoming' },
    { id: 2, time: '10:30 AM', patient: 'Priya Sharma', type: 'in-person', status: 'upcoming' },
    { id: 3, time: '02:00 PM', patient: 'Amit Patel', type: 'telemedicine', status: 'completed' },
    { id: 4, time: '03:30 PM', patient: 'Sunita Devi', type: 'in-person', status: 'upcoming' },
  ];

  const recentPatients = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      uhiId: 'UHI123456', 
      lastVisit: '2 days ago',
      condition: 'Diabetes Type 2',
      riskLevel: 'medium',
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      uhiId: 'UHI234567', 
      lastVisit: '1 week ago',
      condition: 'Hypertension',
      riskLevel: 'high',
    },
    { 
      id: 3, 
      name: 'Amit Patel', 
      uhiId: 'UHI345678', 
      lastVisit: '3 days ago',
      condition: 'Respiratory Infection',
      riskLevel: 'low',
    },
  ];

  const vitalsData = [
    { time: '8 AM', heartRate: 72, bp: 120, oxygen: 98 },
    { time: '10 AM', heartRate: 78, bp: 125, oxygen: 97 },
    { time: '12 PM', heartRate: 75, bp: 122, oxygen: 98 },
    { time: '2 PM', heartRate: 80, bp: 128, oxygen: 96 },
    { time: '4 PM', heartRate: 76, bp: 124, oxygen: 97 },
    { time: '6 PM', heartRate: 74, bp: 121, oxygen: 98 },
  ];

  const alerts = [
    { id: 1, type: 'critical', message: 'Patient #UHI123456 shows abnormal vitals', time: '10 mins ago' },
    { id: 2, type: 'info', message: 'Regional health alert: Dengue cases increasing', time: '2 hours ago' },
  ];

  const stats = [
    {
      title: "Today's Appointments",
      value: '8',
      change: '+2',
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
    },
    {
      title: 'Total Patients',
      value: '245',
      change: '+12',
      icon: <People sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(245, 87, 108, 0.1)',
    },
    {
      title: 'Pending Tasks',
      value: '5',
      change: '-2',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
    },
    {
      title: 'Success Rate',
      value: '96%',
      change: '+1%',
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: 'rgba(67, 233, 123, 0.1)',
    },
  ];

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setPatientDialogOpen(true);
  };

  const handleAddRecord = () => {
    setRecordDialogOpen(true);
  };

  const handleSaveRecord = () => {
    // API call to save record
    toast.success('Medical record added successfully');
    setRecordDialogOpen(false);
    setNewRecord({ diagnosis: '', prescription: '', notes: '' });
  };

  const handleFlagPatient = () => {
    toast.success('Patient flagged as high-risk. Regional office notified.');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c15 50%, #667eea15 100%)',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    mr: 2,
                  }}
                >
                  <LocalHospital sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Doctor Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Welcome, Dr. {user?.profile?.firstName || 'Doctor'} • Clinical Management Portal
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<VideoCall />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 3,
                  py: 1.5,
                }}
              >
                Start Telemedicine
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Fade in timeout={800}>
            <Box sx={{ mb: 3 }}>
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.type === 'critical' ? 'error' : 'info'}
                  sx={{ mb: 1, borderRadius: 2 }}
                  action={
                    <Button size="small" color="inherit">View</Button>
                  }
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" fontWeight="medium">{alert.message}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>{alert.time}</Typography>
                  </Box>
                </Alert>
              ))}
            </Box>
          </Fade>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000 + index * 100}>
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
                          background: stat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ color: stat.gradient }}>{stat.icon}</Box>
                      </Box>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          background: stat.gradient,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Patient Search & Recent Patients */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={1200}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Patient Management
                  </Typography>
                  
                  {/* Search */}
                  <TextField
                    fullWidth
                    placeholder="Search by UHI, name, or Aadhaar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Recent Patients */}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Recent Patient Interactions
                  </Typography>
                  <List>
                    {recentPatients.map((patient) => (
                      <ListItem
                        key={patient.id}
                        onClick={() => handlePatientClick(patient)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          background: 'rgba(0,0,0,0.02)',
                          cursor: 'pointer',
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            background: patient.riskLevel === 'high' 
                              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                              : patient.riskLevel === 'medium'
                              ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                              : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                          }}>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {patient.name}
                              </Typography>
                              <Chip
                                label={patient.riskLevel}
                                size="small"
                                sx={{
                                  fontSize: '0.7rem',
                                  height: 20,
                                  background: patient.riskLevel === 'high' ? '#f5576c' : patient.riskLevel === 'medium' ? '#ffa726' : '#43e97b',
                                  color: 'white',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2">{patient.condition}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                UHI: {patient.uhiId} • Last visit: {patient.lastVisit}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton>
                          <Visibility />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Today's Schedule */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={1400}>
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Schedule sx={{ fontSize: 28, mr: 1, color: '#667eea' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Today's Schedule
                    </Typography>
                  </Box>
                  <List>
                    {todaySchedule.map((appointment) => (
                      <ListItem
                        key={appointment.id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          background: appointment.status === 'completed' 
                            ? 'rgba(67, 233, 123, 0.1)' 
                            : 'rgba(102, 126, 234, 0.1)',
                          border: '1px solid',
                          borderColor: appointment.status === 'completed' ? '#43e97b' : '#667eea',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            background: appointment.status === 'completed'
                              ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}>
                            {appointment.type === 'telemedicine' ? <VideoCall /> : <LocalHospital />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="bold">
                              {appointment.time}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2">{appointment.patient}</Typography>
                              <Chip
                                label={appointment.type}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 18, mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Add Appointment
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Vitals Tracking Chart */}
        <Fade in timeout={1600}>
          <Card sx={{ 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            mb: 4,
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Patient Vitals Monitoring (Last Selected Patient)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#f5576c" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="bp" stroke="#667eea" strokeWidth={2} name="BP (Systolic)" />
                  <Line type="monotone" dataKey="oxygen" stroke="#43e97b" strokeWidth={2} name="Oxygen %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Fade>

        {/* Patient Detail Dialog */}
        <Dialog
          open={patientDialogOpen}
          onClose={() => setPatientDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">
                Patient Health Record
              </Typography>
              <IconButton onClick={() => setPatientDialogOpen(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedPatient && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body1" fontWeight="bold">{selectedPatient.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">UHI ID</Typography>
                    <Typography variant="body1" fontWeight="bold">{selectedPatient.uhiId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Condition</Typography>
                    <Typography variant="body1">{selectedPatient.condition}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                    <Chip
                      label={selectedPatient.riskLevel.toUpperCase()}
                      size="small"
                      sx={{
                        background: selectedPatient.riskLevel === 'high' ? '#f5576c' : selectedPatient.riskLevel === 'medium' ? '#ffa726' : '#43e97b',
                        color: 'white',
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Medical History Timeline
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Recent consultations and treatments will appear here.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddRecord}
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Add New Record
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Flag />}
                    onClick={handleFlagPatient}
                    color="error"
                  >
                    Flag as High Risk
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VideoCall />}
                  >
                    Start Consultation
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Record Dialog */}
        <Dialog
          open={recordDialogOpen}
          onClose={() => setRecordDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Diagnosis"
              value={newRecord.diagnosis}
              onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Prescription"
              multiline
              rows={3}
              value={newRecord.prescription}
              onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={2}
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecordDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveRecord}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              Save Record
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EnhancedDoctorDashboard;
