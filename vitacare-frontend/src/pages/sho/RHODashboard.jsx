import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Badge,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalHospital as HospitalIcon,
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  LocalPharmacy as PharmacyIcon,
  Emergency as EmergencyIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
}));

const MetricCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
}));

const AlertCard = styled(Card)(({ severity, theme }) => {
  const colors = {
    critical: '#f44336',
    high: '#ff9800',
    medium: '#2196f3',
    low: '#4caf50'
  };
  
  return {
    borderLeft: `4px solid ${colors[severity] || colors.medium}`,
    marginBottom: theme.spacing(1),
  };
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rho-tabpanel-${index}`}
      aria-labelledby={`rho-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function RHODashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [camps, setCamps] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [createCampDialog, setCreateCampDialog] = useState(false);
  const [reportOutbreakDialog, setReportOutbreakDialog] = useState(false);
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [newCamp, setNewCamp] = useState({
    camp_name: '',
    camp_type: 'general_health',
    target_demographics: {
      primary_beneficiaries: ['general_public']
    },
    camp_logistics: {
      dates: {
        start_date: '',
        end_date: ''
      },
      location: {
        address: '',
        district: '',
        taluk: ''
      }
    },
    services_offered: [],
    expected_beneficiaries: 0,
    budget_allocated: 0
  });

  const [outbreakReport, setOutbreakReport] = useState({
    disease_info: {
      disease_name: '',
      disease_type: 'infectious'
    },
    location_info: {
      district: '',
      taluk: '',
      village: ''
    },
    case_details: {
      total_cases: 0,
      confirmed_cases: 0,
      suspected_cases: 0,
      deaths: 0
    },
    initial_response: {
      immediate_actions_taken: '',
      resources_deployed: []
    }
  });

  const [hospitalStatus, setHospitalStatus] = useState({
    bed_status: {
      total_beds: 0,
      available_beds: 0,
      occupied_beds: 0,
      general_beds: { total: 0, available: 0 },
      icu_beds: { total: 0, available: 0 },
      emergency_beds: { total: 0, available: 0 }
    },
    staff_status: {
      doctors_on_duty: 0,
      nurses_on_duty: 0,
      support_staff_on_duty: 0
    },
    equipment_status: {
      functional_equipment: [],
      under_maintenance: [],
      critical_shortages: []
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [dashboardRes, hospitalsRes, campsRes, analyticsRes] = await Promise.all([
        fetch('/api/v1/rho/dashboard', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/rho/hospitals', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/rho/camps', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/rho/analytics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (dashboardRes.ok) {
        const dashboard = await dashboardRes.json();
        setDashboardData(dashboard.data);
      }

      if (hospitalsRes.ok) {
        const hospitalsData = await hospitalsRes.json();
        setHospitals(hospitalsData.data);
      }

      if (campsRes.ok) {
        const campsData = await campsRes.json();
        setCamps(campsData.data);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCamp = async () => {
    try {
      const response = await fetch('/api/v1/rho/camp/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCamp)
      });

      if (response.ok) {
        setCreateCampDialog(false);
        setNewCamp({
          camp_name: '',
          camp_type: 'general_health',
          target_demographics: { primary_beneficiaries: ['general_public'] },
          camp_logistics: {
            dates: { start_date: '', end_date: '' },
            location: { address: '', district: '', taluk: '' }
          },
          services_offered: [],
          expected_beneficiaries: 0,
          budget_allocated: 0
        });
        fetchDashboardData();
        alert('Medical camp created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating camp:', error);
      alert('Failed to create medical camp');
    }
  };

  const handleReportOutbreak = async () => {
    try {
      const response = await fetch('/api/v1/rho/outbreak/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(outbreakReport)
      });

      if (response.ok) {
        setReportOutbreakDialog(false);
        setOutbreakReport({
          disease_info: { disease_name: '', disease_type: 'infectious' },
          location_info: { district: '', taluk: '', village: '' },
          case_details: { total_cases: 0, confirmed_cases: 0, suspected_cases: 0, deaths: 0 },
          initial_response: { immediate_actions_taken: '', resources_deployed: [] }
        });
        fetchDashboardData();
        alert('Outbreak reported successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error reporting outbreak:', error);
      alert('Failed to report outbreak');
    }
  };

  const handleUpdateHospitalStatus = async () => {
    try {
      const response = await fetch(`/api/v1/rho/hospital/${selectedHospital}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(hospitalStatus)
      });

      if (response.ok) {
        setUpdateStatusDialog(false);
        setSelectedHospital(null);
        fetchDashboardData();
        alert('Hospital status updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating hospital status:', error);
      alert('Failed to update hospital status');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getOccupancyColor = (occupancyRate) => {
    if (occupancyRate >= 90) return 'error';
    if (occupancyRate >= 75) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading RHO Dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          RHO Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {dashboardData?.rho_info?.name} - {dashboardData?.rho_info?.zone_type} Zone
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Population Coverage: {dashboardData?.rho_info?.population_covered?.toLocaleString()} | 
          Authority Level: {dashboardData?.rho_info?.authority_level}
        </Typography>
      </Box>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3} bgcolor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <HospitalIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.hospitals_managed || 0}
            </Typography>
            <Typography variant="body2">
              Hospitals Managed
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3} bgcolor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.total_beds || 0}
            </Typography>
            <Typography variant="body2">
              Total Beds
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3} bgcolor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <CampaignIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.active_camps || 0}
            </Typography>
            <Typography variant="body2">
              Active Camps
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            elevation={3} 
            bgcolor={dashboardData?.summary?.active_outbreaks > 0 ? 
              "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" : 
              "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
            }
          >
            <EmergencyIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.active_outbreaks || 0}
            </Typography>
            <Typography variant="body2">
              Active Outbreaks
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Bed Occupancy Status */}
      {dashboardData?.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bed Occupancy Overview
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Available: ${dashboardData.summary.available_beds}`}
                    color="success" 
                    variant="filled"
                  />
                  <Chip 
                    label={`Occupancy: ${dashboardData.summary.bed_occupancy_rate}%`}
                    color={getOccupancyColor(parseFloat(dashboardData.summary.bed_occupancy_rate))}
                    variant="filled"
                  />
                  <Chip 
                    label={`Pending Approvals: ${dashboardData.summary.pending_approvals}`}
                    color="warning" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )}

      {/* Critical Alerts */}
      {dashboardData?.critical_alerts && dashboardData.critical_alerts.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge badgeContent={dashboardData.critical_alerts.length} color="error">
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                  </Badge>
                  <Typography variant="h6">Critical Alerts</Typography>
                </Box>
                
                {dashboardData.critical_alerts.map((alert, index) => (
                  <AlertCard key={index} severity="critical">
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2">
                        <strong>{alert.hospital_name}:</strong> {alert.alerts_notifications?.[0]?.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(alert.last_updated).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </AlertCard>
                ))}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateCampDialog(true)}
        >
          Create Medical Camp
        </Button>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<ReportIcon />}
          onClick={() => setReportOutbreakDialog(true)}
        >
          Report Outbreak
        </Button>
      </Box>

      {/* Tabs for Different Views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="RHO dashboard tabs">
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<HospitalIcon />} label="Hospitals" />
          <Tab icon={<CampaignIcon />} label="Medical Camps" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<EmergencyIcon />} label="Outbreaks" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Overview Tab */}
        <Grid container spacing={3}>
          {/* Hospital Status Summary */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hospital Status Summary
                </Typography>
                {dashboardData?.hospital_statuses?.map((hospital, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {hospital.hospital_name}
                    </Typography>
                    
                    {hospital.status && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            Total Beds: {hospital.status.bed_status?.total_beds || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            Available: {hospital.status.bed_status?.available_beds || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            Doctors: {hospital.status.staff_status?.doctors_on_duty || 'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setSelectedHospital(hospital.hospital_id);
                          setUpdateStatusDialog(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                
                {dashboardData?.performance_metrics && (
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Hospital Performance" 
                        secondary={`${dashboardData.performance_metrics.hospital_performance?.completion_rate || 'N/A'}% completion rate`}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <CampaignIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Camp Performance" 
                        secondary={`${dashboardData.performance_metrics.camp_performance?.avg_satisfaction || 'N/A'} avg satisfaction`}
                      />
                    </ListItem>
                  </List>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Hospitals Tab */}
        <Grid container spacing={3}>
          {hospitals.map((hospital, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HospitalIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{hospital.mapping?.hospital_name}</Typography>
                  </Box>
                  
                  {hospital.realtime_status && (
                    <>
                      <Typography variant="body2" gutterBottom>
                        <strong>Beds:</strong> {hospital.realtime_status.bed_status?.available_beds || 0}/
                        {hospital.realtime_status.bed_status?.total_beds || 0} available
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Staff:</strong> {hospital.realtime_status.staff_status?.doctors_on_duty || 0} doctors, 
                        {hospital.realtime_status.staff_status?.nurses_on_duty || 0} nurses
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Last Updated:</strong> {new Date(hospital.realtime_status.last_updated).toLocaleString()}
                      </Typography>
                    </>
                  )}
                  
                  {hospital.info && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" gutterBottom>
                        <strong>Type:</strong> {hospital.info.hospital_type}
                      </Typography>
                      
                      <Typography variant="body2">
                        <strong>Emergency Services:</strong> {hospital.info.services?.emergency_care ? 'Yes' : 'No'}
                      </Typography>
                    </>
                  )}
                </CardContent>
                
                <CardActions>
                  <Button size="small" color="primary">View Details</Button>
                  <Button 
                    size="small" 
                    color="secondary"
                    onClick={() => {
                      setSelectedHospital(hospital.mapping?.hospital_id);
                      setUpdateStatusDialog(true);
                    }}
                  >
                    Update Status
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Medical Camps Tab */}
        <Grid container spacing={3}>
          {camps.map((camp, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CampaignIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{camp.camp_name}</Typography>
                  </Box>
                  
                  <Chip 
                    label={camp.camp_status?.status} 
                    color={camp.camp_status?.status === 'approved' ? 'success' : 
                           camp.camp_status?.status === 'ongoing' ? 'primary' : 'default'}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Type:</strong> {camp.camp_type}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Expected Beneficiaries:</strong> {camp.expected_beneficiaries}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Budget:</strong> ₹{camp.budget_allocated?.toLocaleString()}
                  </Typography>
                  
                  {camp.camp_logistics?.dates && (
                    <Typography variant="body2">
                      <strong>Start Date:</strong> {new Date(camp.camp_logistics.dates.start_date).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions>
                  <Button size="small" color="primary">View Details</Button>
                  <Button size="small" color="secondary">Edit</Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Analytics Tab */}
        {analytics && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Summary
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Total Camps:</strong> {analytics.summary?.total_camps || 0}
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Average Satisfaction:</strong> {analytics.summary?.avg_satisfaction || 'N/A'}/10
                  </Typography>
                  
                  <Typography variant="body1">
                    <strong>Total Beneficiaries:</strong> {analytics.summary?.total_beneficiaries?.toLocaleString() || 'N/A'}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hospital Performance
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Hospitals Managed:</strong> {analytics.hospital_performance?.hospitals_managed || 0}
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    <strong>Completion Rate:</strong> {analytics.hospital_performance?.completion_rate || 'N/A'}%
                  </Typography>
                  
                  <Typography variant="body1">
                    <strong>Patient Satisfaction:</strong> {analytics.hospital_performance?.patient_satisfaction || 'N/A'}/5
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            {analytics.camp_analytics && analytics.camp_analytics.length > 0 && (
              <Grid item xs={12}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Camp Performance Trends
                    </Typography>
                    
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={analytics.camp_analytics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="analytics_date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="performance_metrics.beneficiaries_served" 
                          stroke="#8884d8" 
                          name="Beneficiaries"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="quality_metrics.satisfaction_score" 
                          stroke="#82ca9d" 
                          name="Satisfaction Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
            )}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        {/* Outbreaks Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Outbreak Management
                </Typography>
                
                {dashboardData?.active_outbreaks && dashboardData.active_outbreaks.length > 0 ? (
                  dashboardData.active_outbreaks.map((outbreak, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="error">
                        {outbreak.disease_info?.disease_name}
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Location:</strong> {outbreak.location_info?.district}, {outbreak.location_info?.taluk}
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Total Cases:</strong> {outbreak.case_details?.total_cases || 0}
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> 
                        <Chip 
                          label={outbreak.containment_measures?.containment_status} 
                          color="error" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No active outbreaks in your jurisdiction.
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Create Camp Dialog */}
      <Dialog open={createCampDialog} onClose={() => setCreateCampDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Medical Camp</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Camp Name"
                value={newCamp.camp_name}
                onChange={(e) => setNewCamp({ ...newCamp, camp_name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Camp Type</InputLabel>
                <Select
                  value={newCamp.camp_type}
                  onChange={(e) => setNewCamp({ ...newCamp, camp_type: e.target.value })}
                >
                  <MenuItem value="general_health">General Health</MenuItem>
                  <MenuItem value="eye_care">Eye Care</MenuItem>
                  <MenuItem value="dental_care">Dental Care</MenuItem>
                  <MenuItem value="women_health">Women's Health</MenuItem>
                  <MenuItem value="child_health">Child Health</MenuItem>
                  <MenuItem value="vaccination">Vaccination</MenuItem>
                  <MenuItem value="health_screening">Health Screening</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Expected Beneficiaries"
                value={newCamp.expected_beneficiaries}
                onChange={(e) => setNewCamp({ ...newCamp, expected_beneficiaries: parseInt(e.target.value) })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={newCamp.camp_logistics.dates.start_date}
                onChange={(e) => setNewCamp({
                  ...newCamp,
                  camp_logistics: {
                    ...newCamp.camp_logistics,
                    dates: { ...newCamp.camp_logistics.dates, start_date: e.target.value }
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={newCamp.camp_logistics.dates.end_date}
                onChange={(e) => setNewCamp({
                  ...newCamp,
                  camp_logistics: {
                    ...newCamp.camp_logistics,
                    dates: { ...newCamp.camp_logistics.dates, end_date: e.target.value }
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location Address"
                value={newCamp.camp_logistics.location.address}
                onChange={(e) => setNewCamp({
                  ...newCamp,
                  camp_logistics: {
                    ...newCamp.camp_logistics,
                    location: { ...newCamp.camp_logistics.location, address: e.target.value }
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="District"
                value={newCamp.camp_logistics.location.district}
                onChange={(e) => setNewCamp({
                  ...newCamp,
                  camp_logistics: {
                    ...newCamp.camp_logistics,
                    location: { ...newCamp.camp_logistics.location, district: e.target.value }
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taluk"
                value={newCamp.camp_logistics.location.taluk}
                onChange={(e) => setNewCamp({
                  ...newCamp,
                  camp_logistics: {
                    ...newCamp.camp_logistics,
                    location: { ...newCamp.camp_logistics.location, taluk: e.target.value }
                  }
                })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Budget Allocated (₹)"
                value={newCamp.budget_allocated}
                onChange={(e) => setNewCamp({ ...newCamp, budget_allocated: parseFloat(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCampDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCamp} variant="contained">Create Camp</Button>
        </DialogActions>
      </Dialog>

      {/* Report Outbreak Dialog */}
      <Dialog open={reportOutbreakDialog} onClose={() => setReportOutbreakDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Report Disease Outbreak</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Disease Name"
                value={outbreakReport.disease_info.disease_name}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  disease_info: { ...outbreakReport.disease_info, disease_name: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Disease Type</InputLabel>
                <Select
                  value={outbreakReport.disease_info.disease_type}
                  onChange={(e) => setOutbreakReport({
                    ...outbreakReport,
                    disease_info: { ...outbreakReport.disease_info, disease_type: e.target.value }
                  })}
                >
                  <MenuItem value="infectious">Infectious</MenuItem>
                  <MenuItem value="waterborne">Waterborne</MenuItem>
                  <MenuItem value="foodborne">Foodborne</MenuItem>
                  <MenuItem value="airborne">Airborne</MenuItem>
                  <MenuItem value="vector_borne">Vector Borne</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="District"
                value={outbreakReport.location_info.district}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  location_info: { ...outbreakReport.location_info, district: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Taluk"
                value={outbreakReport.location_info.taluk}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  location_info: { ...outbreakReport.location_info, taluk: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Village"
                value={outbreakReport.location_info.village}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  location_info: { ...outbreakReport.location_info, village: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Total Cases"
                value={outbreakReport.case_details.total_cases}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  case_details: { ...outbreakReport.case_details, total_cases: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Confirmed Cases"
                value={outbreakReport.case_details.confirmed_cases}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  case_details: { ...outbreakReport.case_details, confirmed_cases: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Suspected Cases"
                value={outbreakReport.case_details.suspected_cases}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  case_details: { ...outbreakReport.case_details, suspected_cases: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Deaths"
                value={outbreakReport.case_details.deaths}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  case_details: { ...outbreakReport.case_details, deaths: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Immediate Actions Taken"
                value={outbreakReport.initial_response.immediate_actions_taken}
                onChange={(e) => setOutbreakReport({
                  ...outbreakReport,
                  initial_response: { ...outbreakReport.initial_response, immediate_actions_taken: e.target.value }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportOutbreakDialog(false)}>Cancel</Button>
          <Button onClick={handleReportOutbreak} variant="contained" color="error">Report Outbreak</Button>
        </DialogActions>
      </Dialog>

      {/* Update Hospital Status Dialog */}
      <Dialog open={updateStatusDialog} onClose={() => setUpdateStatusDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Update Hospital Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Beds"
                value={hospitalStatus.bed_status.total_beds}
                onChange={(e) => setHospitalStatus({
                  ...hospitalStatus,
                  bed_status: { ...hospitalStatus.bed_status, total_beds: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Available Beds"
                value={hospitalStatus.bed_status.available_beds}
                onChange={(e) => setHospitalStatus({
                  ...hospitalStatus,
                  bed_status: { ...hospitalStatus.bed_status, available_beds: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Occupied Beds"
                value={hospitalStatus.bed_status.occupied_beds}
                onChange={(e) => setHospitalStatus({
                  ...hospitalStatus,
                  bed_status: { ...hospitalStatus.bed_status, occupied_beds: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Doctors on Duty"
                value={hospitalStatus.staff_status.doctors_on_duty}
                onChange={(e) => setHospitalStatus({
                  ...hospitalStatus,
                  staff_status: { ...hospitalStatus.staff_status, doctors_on_duty: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Nurses on Duty"
                value={hospitalStatus.staff_status.nurses_on_duty}
                onChange={(e) => setHospitalStatus({
                  ...hospitalStatus,
                  staff_status: { ...hospitalStatus.staff_status, nurses_on_duty: parseInt(e.target.value) }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Support Staff on Duty"
                value={hospitalStatus.staff_status.support_staff_on_duty}
                onChange={(e) => setHospitalStatus({
                  ...hospitalStatus,
                  staff_status: { ...hospitalStatus.staff_status, support_staff_on_duty: parseInt(e.target.value) }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateHospitalStatus} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}