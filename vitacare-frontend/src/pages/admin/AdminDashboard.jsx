import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  MenuItem,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Badge,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  LocalHospital,
  PersonAdd,
  Edit,
  Delete,
  BarChart as BarChartIcon,
  People,
  TrendingUp,
  Assessment,
  PendingActions,
  CheckCircle,
  Cancel,
  Map,
  Business,
  Public,
  Apartment,
  Logout,
  AdminPanelSettings
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { adminLogout } from '../../redux/slices/adminSlice';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);

  const [tab, setTab] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [stateOfficers, setStateOfficers] = useState([]);
  const [regionalOfficers, setRegionalOfficers] = useState([]);
  const [stats, setStats] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentType, setCurrentType] = useState('');
  const [formData, setFormData] = useState({});
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [pendingSHO, setPendingSHO] = useState([]);
  const [pendingRHO, setPendingRHO] = useState([]);

  const handleLogout = async () => {
    await dispatch(adminLogout());
    navigate('/admin/login');
  };

  useEffect(() => {
    loadStatistics();
    loadDoctors();
    loadStateOfficers();
    loadRegionalOfficers();
    loadPendingRequests();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load statistics');
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await api.get('/admin/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const loadStateOfficers = async () => {
    try {
      const response = await api.get('/admin/state-officers');
      setStateOfficers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load state officers');
    }
  };

  const loadRegionalOfficers = async () => {
    try {
      const response = await api.get('/admin/regional-officers');
      setRegionalOfficers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load regional officers');
    }
  };

  const loadPendingRequests = async () => {
    try {
      // Load doctors with pending status
      const doctorsRes = await api.get('/admin/doctors?status=pending');
      setPendingDoctors(doctorsRes.data.data || []);

      // Load state officers with pending status
      const shoRes = await api.get('/admin/state-officers?status=pending');
      setPendingSHO(shoRes.data.data || []);

      // Load regional officers with pending status
      const rhoRes = await api.get('/admin/regional-officers?status=pending');
      setPendingRHO(rhoRes.data.data || []);
    } catch (error) {
      console.error('Failed to load pending requests');
    }
  };

  const handleApprove = async (type, id) => {
    try {
      let endpoint = '';
      if (type === 'doctor') endpoint = `/admin/doctors/${id}`;
      else if (type === 'state-officer') endpoint = `/admin/state-officers/${id}`;
      else if (type === 'regional-officer') endpoint = `/admin/regional-officers/${id}`;

      // Update user status to verified/active
      await api.put(endpoint, { status: 'verified' });
      toast.success(`${type.replace('-', ' ')} approved successfully!`);

      // Reload pending requests and statistics
      loadPendingRequests();
      loadDoctors();
      loadStateOfficers();
      loadRegionalOfficers();
    } catch (error) {
      toast.error(`Failed to approve ${type.replace('-', ' ')}`);
    }
  };

  const handleReject = async (type, id) => {
    if (!window.confirm('Are you sure you want to reject this registration request? This action cannot be undone.')) {
      return;
    }

    try {
      let endpoint = '';
      if (type === 'doctor') endpoint = `/admin/doctors/${id}`;
      else if (type === 'state-officer') endpoint = `/admin/state-officers/${id}`;
      else if (type === 'regional-officer') endpoint = `/admin/regional-officers/${id}`;

      // Delete the user or update status to rejected
      await api.delete(endpoint);
      toast.success(`${type.replace('-', ' ')} registration rejected`);

      // Reload pending requests and statistics
      loadPendingRequests();
      loadDoctors();
      loadStateOfficers();
      loadRegionalOfficers();
    } catch (error) {
      toast.error(`Failed to reject ${type.replace('-', ' ')}`);
    }
  };

  const handleOpenDialog = (type) => {
    setCurrentType(type);
    setFormData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      let endpoint = '';
      if (currentType === 'doctor') endpoint = '/admin/doctors';
      else if (currentType === 'state-officer') endpoint = '/admin/state-officers';
      else if (currentType === 'regional-officer') endpoint = '/admin/regional-officers';

      await api.post(endpoint, formData);
      toast.success(`${currentType.replace('-', ' ')} registered successfully!`);
      handleCloseDialog();
      
      // Reload data
      if (currentType === 'doctor') loadDoctors();
      else if (currentType === 'state-officer') loadStateOfficers();
      else loadRegionalOfficers();
      loadStatistics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      let endpoint = '';
      if (type === 'doctor') endpoint = `/admin/doctors/${id}`;
      else if (type === 'state-officer') endpoint = `/admin/state-officers/${id}`;
      else endpoint = `/admin/regional-officers/${id}`;

      await api.delete(endpoint);
      toast.success('User deleted successfully');
      
      if (type === 'doctor') loadDoctors();
      else if (type === 'state-officer') loadStateOfficers();
      else loadRegionalOfficers();
      loadStatistics();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <Box>
      {/* Admin Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)' }}>
        <Toolbar>
          <AdminPanelSettings sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            VitaCare Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {admin?.name || 'Administrator'}
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            🇮🇳 National Healthcare Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive overview of healthcare personnel across the country
          </Typography>
        </Box>

      {/* Overview Statistics */}
      {stats && (
        <>
          {/* Main Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <LocalHospital sx={{ fontSize: 48 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.doctors?.total || 0}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>Total Doctors</Typography>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="caption">Verified</Typography>
                      <Typography variant="h6">{stats.doctors?.verified || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">Pending</Typography>
                      <Typography variant="h6">{stats.doctors?.pending || 0}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Business sx={{ fontSize: 48 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.stateOfficers?.total || 0}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>State Health Officers</Typography>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="caption">Active</Typography>
                      <Typography variant="h6">{stats.stateOfficers?.total || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">States</Typography>
                      <Typography variant="h6">28+</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Public sx={{ fontSize: 48 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.regionalOfficers?.total || 0}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>Regional Officers</Typography>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="caption">Active</Typography>
                      <Typography variant="h6">{stats.regionalOfficers?.total || 0}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">Regions</Typography>
                      <Typography variant="h6">5+</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Badge badgeContent={pendingDoctors.length + pendingSHO.length + pendingRHO.length} color="error">
                      <PendingActions sx={{ fontSize: 48 }} />
                    </Badge>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {pendingDoctors.length + pendingSHO.length + pendingRHO.length}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>Pending Requests</Typography>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="caption">Doctors</Typography>
                      <Typography variant="h6">{pendingDoctors.length}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">Officers</Typography>
                      <Typography variant="h6">{pendingSHO.length + pendingRHO.length}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Country-wide Summary Report */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Country-wide Healthcare Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive analytics and insights
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Healthcare Coverage */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Map sx={{ mr: 1, color: 'success.main' }} />
                      Geographic Coverage
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">States Covered</Typography>
                        <Typography variant="body2" fontWeight={600}>28 / 28</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Union Territories</Typography>
                        <Typography variant="body2" fontWeight={600}>8 / 8</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Regional Offices</Typography>
                        <Typography variant="body2" fontWeight={600}>{stats.regionalOfficers?.total || 0}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.regionalOfficers?.total / 5) * 100} 
                        sx={{ height: 8, borderRadius: 4 }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Personnel Distribution */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                      Personnel Distribution
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Doctors</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {stats.doctors?.total || 0} ({Math.round((stats.doctors?.verified / stats.doctors?.total) * 100) || 0}% Verified)
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.doctors?.verified / stats.doctors?.total) * 100 || 0} 
                        sx={{ height: 8, borderRadius: 4 }} 
                        color="success"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">State Health Officers</Typography>
                        <Typography variant="body2" fontWeight={600}>{stats.stateOfficers?.total || 0}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((stats.stateOfficers?.total / 28) * 100, 100)} 
                        sx={{ height: 8, borderRadius: 4 }} 
                        color="info"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Regional Officers</Typography>
                        <Typography variant="body2" fontWeight={600}>{stats.regionalOfficers?.total || 0}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((stats.regionalOfficers?.total / 5) * 100, 100)} 
                        sx={{ height: 8, borderRadius: 4 }} 
                        color="warning"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab 
            label="Pending Requests" 
            icon={
              <Badge badgeContent={pendingDoctors.length + pendingSHO.length + pendingRHO.length} color="error">
                <PendingActions />
              </Badge>
            }
            iconPosition="start"
          />
          <Tab label="Doctors" />
          <Tab label="State Health Officers" />
          <Tab label="Regional Health Officers" />
        </Tabs>
      </Paper>

      {/* Pending Requests Tab */}
      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <PendingActions sx={{ mr: 2, color: 'warning.main' }} />
            New Registration Requests
          </Typography>

          {/* Pending Doctors */}
          {pendingDoctors.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Pending Doctor Registrations ({pendingDoctors.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Registration No.</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingDoctors.map((doctor) => (
                      <TableRow key={doctor._id}>
                        <TableCell>{doctor.name}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.registrationNumber}</TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>{doctor.hospitalName || 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="success" onClick={() => handleApprove('doctor', doctor._id)}>
                            <CheckCircle />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleReject('doctor', doctor._id)}>
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Pending State Officers */}
          {pendingSHO.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                Pending State Health Officer Registrations ({pendingSHO.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingSHO.map((officer) => (
                      <TableRow key={officer._id}>
                        <TableCell>{officer.name}</TableCell>
                        <TableCell>{officer.email}</TableCell>
                        <TableCell>{officer.employeeId}</TableCell>
                        <TableCell>{officer.state}</TableCell>
                        <TableCell>{officer.department || 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="success" onClick={() => handleApprove('state-officer', officer._id)}>
                            <CheckCircle />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleReject('state-officer', officer._id)}>
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Pending Regional Officers */}
          {pendingRHO.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                Pending Regional Health Officer Registrations ({pendingRHO.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRHO.map((officer) => (
                      <TableRow key={officer._id}>
                        <TableCell>{officer.name}</TableCell>
                        <TableCell>{officer.email}</TableCell>
                        <TableCell>{officer.employeeId}</TableCell>
                        <TableCell>{officer.region}</TableCell>
                        <TableCell>{officer.department || 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="success" onClick={() => handleApprove('regional-officer', officer._id)}>
                            <CheckCircle />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleReject('regional-officer', officer._id)}>
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* No Pending Requests */}
          {pendingDoctors.length === 0 && pendingSHO.length === 0 && pendingRHO.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No pending registration requests at the moment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All new joinee requests have been processed
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Doctors Tab */}
      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">Manage Doctors</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleOpenDialog('doctor')}
            >
              Add Doctor
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registration No.</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.registrationNumber}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>
                      <Chip 
                        label={doctor.verificationStatus} 
                        color={doctor.verificationStatus === 'verified' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleDelete('doctor', doctor._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* State Officers Tab */}
      {tab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">Manage State Health Officers</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleOpenDialog('state-officer')}
            >
              Add State Officer
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateOfficers.map((officer) => (
                  <TableRow key={officer._id}>
                    <TableCell>{officer.name}</TableCell>
                    <TableCell>{officer.email}</TableCell>
                    <TableCell>{officer.employeeId}</TableCell>
                    <TableCell>{officer.state}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleDelete('state-officer', officer._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Regional Officers Tab */}
      {tab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">Manage Regional Health Officers</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleOpenDialog('regional-officer')}
            >
              Add Regional Officer
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {regionalOfficers.map((officer) => (
                  <TableRow key={officer._id}>
                    <TableCell>{officer.name}</TableCell>
                    <TableCell>{officer.email}</TableCell>
                    <TableCell>{officer.employeeId}</TableCell>
                    <TableCell>{officer.region}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleDelete('regional-officer', officer._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add {currentType.replace('-', ' ').toUpperCase()}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          
          {currentType === 'doctor' && (
            <>
              <TextField
                fullWidth
                label="Registration Number"
                margin="normal"
                value={formData.registrationNumber || ''}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />
              <TextField
                fullWidth
                select
                label="Specialization"
                margin="normal"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              >
                <MenuItem value="General Physician">General Physician</MenuItem>
                <MenuItem value="Cardiologist">Cardiologist</MenuItem>
                <MenuItem value="Pediatrician">Pediatrician</MenuItem>
                <MenuItem value="Dermatologist">Dermatologist</MenuItem>
              </TextField>
            </>
          )}
          
          {currentType === 'state-officer' && (
            <>
              <TextField
                fullWidth
                label="Employee ID"
                margin="normal"
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
              <TextField
                fullWidth
                label="State"
                margin="normal"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </>
          )}
          
          {currentType === 'regional-officer' && (
            <>
              <TextField
                fullWidth
                label="Employee ID"
                margin="normal"
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
              <TextField
                fullWidth
                label="Region"
                margin="normal"
                value={formData.region || ''}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Box>
  );
};

export default AdminDashboard;
