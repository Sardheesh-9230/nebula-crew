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
  IconButton,
  Tooltip,
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
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  Emergency as EmergencyIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sho-tabpanel-${index}`}
      aria-labelledby={`sho-tab-${index}`}
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

export default function SHODashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [rhos, setRhos] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [createRHODialog, setCreateRHODialog] = useState(false);
  const [createZoneDialog, setCreateZoneDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [newRHO, setNewRHO] = useState({
    name: '',
    qualification: '',
    experience_years: '',
    zone_assignment: {
      district: '',
      zone_type: 'district',
      total_population: '',
      area_sq_km: '',
      geographic_boundaries: {}
    },
    contact_info: {
      phone: '',
      email: ''
    }
  });

  const [multiZoneData, setMultiZoneData] = useState({
    district: '',
    district_id: '',
    zones: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Parallel API calls for better performance
      const [dashboardRes, rhosRes, analyticsRes] = await Promise.all([
        fetch('/api/v1/sho/dashboard', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/sho/rhos', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/analytics/sho/comprehensive', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (dashboardRes.ok) {
        const dashboard = await dashboardRes.json();
        setDashboardData(dashboard.data);
      }

      if (rhosRes.ok) {
        const rhosData = await rhosRes.json();
        setRhos(rhosData.data);
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

  const handleCreateRHO = async () => {
    try {
      const response = await fetch('/api/v1/sho/rho/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRHO)
      });

      if (response.ok) {
        const result = await response.json();
        setCreateRHODialog(false);
        setNewRHO({
          name: '',
          qualification: '',
          experience_years: '',
          zone_assignment: {
            district: '',
            zone_type: 'district',
            total_population: '',
            area_sq_km: '',
            geographic_boundaries: {}
          },
          contact_info: { phone: '', email: '' }
        });
        fetchDashboardData(); // Refresh data
        alert(`RHO created successfully! Zone type: ${result.data.recommended_zone_type}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating RHO:', error);
      alert('Failed to create RHO');
    }
  };

  const handleCreateMultiZone = async () => {
    try {
      const response = await fetch('/api/v1/sho/rho/create-multi-zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(multiZoneData)
      });

      if (response.ok) {
        setCreateZoneDialog(false);
        setMultiZoneData({ district: '', district_id: '', zones: [] });
        fetchDashboardData();
        alert('Multiple zones created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating multi-zone:', error);
      alert('Failed to create zones');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading SHO Dashboard...
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
          SHO Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          State Health Officer - Regional Management & Analytics
        </Typography>
      </Box>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3}>
            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.total_rhos || 0}
            </Typography>
            <Typography variant="body2">
              Regional Health Officers
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3}>
            <LocationIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.total_zones || 0}
            </Typography>
            <Typography variant="body2">
              Health Zones
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3}>
            <HospitalIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.total_hospitals_managed || 0}
            </Typography>
            <Typography variant="body2">
              Hospitals Managed
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard elevation={3}>
            <CampaignIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">
              {dashboardData?.summary?.active_camps || 0}
            </Typography>
            <Typography variant="body2">
              Active Medical Camps
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Critical Alerts */}
      {dashboardData?.alerts && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">Critical Alerts</Typography>
                </Box>
                
                {dashboardData.alerts.hospital_alerts?.map((alert, index) => (
                  <AlertCard key={index} severity="critical">
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2">
                        <strong>Hospital Alert:</strong> {alert.hospital_name} - {alert.alerts_notifications?.[0]?.message}
                      </Typography>
                    </CardContent>
                  </AlertCard>
                ))}
                
                {dashboardData.alerts.outbreak_alerts?.map((alert, index) => (
                  <AlertCard key={index} severity="high">
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2">
                        <strong>Outbreak Alert:</strong> {alert.disease_info?.disease_name} in {alert.location_info?.district}
                      </Typography>
                    </CardContent>
                  </AlertCard>
                ))}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )}

      {/* Tabs for Different Views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="SHO dashboard tabs">
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<PeopleIcon />} label="RHO Management" />
          <Tab icon={<LocationIcon />} label="Zone Creation" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<EmergencyIcon />} label="Outbreaks" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Overview Tab */}
        <Grid container spacing={3}>
          {/* Population Coverage Chart */}
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Population Coverage by Zone Type
                </Typography>
                {analytics?.population_coverage && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.population_coverage).map(([key, value]) => ({
                          name: key,
                          value: value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(analytics.population_coverage).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
          
          {/* Performance Trends */}
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Trends (Last 6 Months)
                </Typography>
                {dashboardData?.performance_trends && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.performance_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id.month" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avg_satisfaction" stroke="#8884d8" name="Satisfaction" />
                      <Line type="monotone" dataKey="avg_attendance" stroke="#82ca9d" name="Attendance" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Recent RHO Creations</Typography>
                    {dashboardData?.recent_activities?.recent_rho_creations?.map((rho, index) => (
                      <Chip 
                        key={index} 
                        label={`${rho.name} - ${rho.zone_type}`} 
                        variant="outlined" 
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Recent Camp Approvals</Typography>
                    {dashboardData?.recent_activities?.recent_camp_approvals?.map((camp, index) => (
                      <Chip 
                        key={index} 
                        label={`${camp.camp_name} - ${camp.camp_type}`} 
                        variant="outlined" 
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* RHO Management Tab */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateRHODialog(true)}
            sx={{ mr: 2 }}
          >
            Create New RHO
          </Button>
        </Box>

        <Grid container spacing={3}>
          {rhos.map((rho) => (
            <Grid item xs={12} md={6} lg={4} key={rho.rho_id}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{rho.name}</Typography>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Zone Type: <Chip label={rho.zone_type} size="small" />
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Population Coverage: {rho.population_covered?.toLocaleString() || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Hospitals Managed: {rho.performance_metrics?.hospitals_managed_count || 0}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Patient Satisfaction: {rho.performance_metrics?.patient_satisfaction_score || 'N/A'}/10
                  </Typography>

                  {rho.statistics && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" gutterBottom>
                        Camps Organized: {rho.statistics.camps_organized}
                      </Typography>
                      <Typography variant="body2">
                        Outbreaks Managed: {rho.statistics.outbreaks_managed}
                      </Typography>
                    </>
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

      <TabPanel value={tabValue} index={2}>
        {/* Zone Creation Tab */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateZoneDialog(true)}
            sx={{ mr: 2 }}
          >
            Create Multiple Zones for Dense District
          </Button>
        </Box>

        {dashboardData?.zone_statistics && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Zone Distribution Statistics
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dashboardData.zone_statistics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone_type" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Zones" />
                      <Bar dataKey="total_population" fill="#82ca9d" name="Total Population" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Analytics Tab */}
        {analytics && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hospital Performance Analytics
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Average Completion Rate: {analytics.hospital_performance?.avg_completion_rate || 'N/A'}%
                  </Typography>
                  <Typography variant="body1">
                    Average Patient Rating: {analytics.hospital_performance?.avg_patient_rating || 'N/A'}/5
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Camp Effectiveness
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Total Camps: {analytics.camp_effectiveness?.total_camps || 0}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Total Beneficiaries: {analytics.camp_effectiveness?.total_beneficiaries?.toLocaleString() || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Average Satisfaction: {analytics.camp_effectiveness?.avg_satisfaction || 'N/A'}/10
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        {/* Outbreaks Tab */}
        <Typography variant="h6" gutterBottom>
          Active Outbreak Management
        </Typography>
        <Typography variant="body1">
          Outbreak management interface will be displayed here.
        </Typography>
      </TabPanel>

      {/* Create RHO Dialog */}
      <Dialog open={createRHODialog} onClose={() => setCreateRHODialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Regional Health Officer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RHO Name"
                value={newRHO.name}
                onChange={(e) => setNewRHO({ ...newRHO, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={newRHO.qualification}
                onChange={(e) => setNewRHO({ ...newRHO, qualification: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Experience Years"
                value={newRHO.experience_years}
                onChange={(e) => setNewRHO({ ...newRHO, experience_years: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Zone Type</InputLabel>
                <Select
                  value={newRHO.zone_assignment.zone_type}
                  onChange={(e) => setNewRHO({
                    ...newRHO,
                    zone_assignment: { ...newRHO.zone_assignment, zone_type: e.target.value }
                  })}
                >
                  <MenuItem value="district">District</MenuItem>
                  <MenuItem value="urban">Urban</MenuItem>
                  <MenuItem value="rural">Rural</MenuItem>
                  <MenuItem value="tribal">Tribal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="District"
                value={newRHO.zone_assignment.district}
                onChange={(e) => setNewRHO({
                  ...newRHO,
                  zone_assignment: { ...newRHO.zone_assignment, district: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Total Population"
                value={newRHO.zone_assignment.total_population}
                onChange={(e) => setNewRHO({
                  ...newRHO,
                  zone_assignment: { ...newRHO.zone_assignment, total_population: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Area (sq km)"
                value={newRHO.zone_assignment.area_sq_km}
                onChange={(e) => setNewRHO({
                  ...newRHO,
                  zone_assignment: { ...newRHO.zone_assignment, area_sq_km: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newRHO.contact_info.phone}
                onChange={(e) => setNewRHO({
                  ...newRHO,
                  contact_info: { ...newRHO.contact_info, phone: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={newRHO.contact_info.email}
                onChange={(e) => setNewRHO({
                  ...newRHO,
                  contact_info: { ...newRHO.contact_info, email: e.target.value }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRHODialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRHO} variant="contained">Create RHO</Button>
        </DialogActions>
      </Dialog>

      {/* Create Multi-Zone Dialog */}
      <Dialog open={createZoneDialog} onClose={() => setCreateZoneDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Create Multiple Zones for Dense District</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            For districts with population {'>'} 1,000,000, create multiple zones with dedicated RHOs
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="District Name"
                value={multiZoneData.district}
                onChange={(e) => setMultiZoneData({ ...multiZoneData, district: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="District ID"
                value={multiZoneData.district_id}
                onChange={(e) => setMultiZoneData({ ...multiZoneData, district_id: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => {
                  const newZone = {
                    zone_name: '',
                    zone_type: 'urban',
                    rho_name: '',
                    rho_qualification: '',
                    experience_years: '',
                    population: '',
                    area_sq_km: '',
                    contact_info: { phone: '', email: '' },
                    geographic_boundaries: {}
                  };
                  setMultiZoneData({
                    ...multiZoneData,
                    zones: [...multiZoneData.zones, newZone]
                  });
                }}
              >
                Add Zone
              </Button>
            </Grid>
          </Grid>
          
          {multiZoneData.zones.map((zone, index) => (
            <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Zone {index + 1}</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Zone Name"
                    value={zone.zone_name}
                    onChange={(e) => {
                      const updatedZones = [...multiZoneData.zones];
                      updatedZones[index].zone_name = e.target.value;
                      setMultiZoneData({ ...multiZoneData, zones: updatedZones });
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="RHO Name"
                    value={zone.rho_name}
                    onChange={(e) => {
                      const updatedZones = [...multiZoneData.zones];
                      updatedZones[index].rho_name = e.target.value;
                      setMultiZoneData({ ...multiZoneData, zones: updatedZones });
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateZoneDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateMultiZone} variant="contained">Create Zones</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}