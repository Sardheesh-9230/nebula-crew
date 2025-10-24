import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { bookAppointment } from '../../redux/slices/appointmentsSlice';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Slider
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  Navigation as NavigationIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  EventAvailable as EventIcon,
  Campaign as CampaignIcon,
  DirectionsCar as DirectionsIcon,
  FilterList as FilterIcon,
  BookOnline as BookIcon,
  LocalHospital as EmergencyIcon,
  Accessible as AccessibleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

const SearchCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const HospitalCard = styled(Card)(({ theme, featured }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: featured ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[10],
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
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

export default function PatientDiscovery() {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [hospitals, setHospitals] = useState([]);
  const [camps, setCamps] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]); // Chennai coordinates

  // Search filters
  const [searchParams, setSearchParams] = useState({
    location: { latitude: null, longitude: null },
    radius_km: 10,
    service_type: '',
    hospital_type: '',
    insurance_accepted: '',
    emergency_services: false,
    availability_required: true
  });

  // Camp search filters
  const [campSearchParams, setCampSearchParams] = useState({
    location: { latitude: null, longitude: null },
    radius_km: 20,
    camp_type: '',
    target_demographic: '',
    date_range: { start: '', end: '' }
  });

  // Booking form
  const [bookingData, setBookingData] = useState({
    appointment_details: {
      date: '',
      time: '',
      service_type: 'consultation',
      notes: ''
    },
    patient_info: {
      patient_name: '',
      age: '',
      gender: '',
      phone: '',
      emergency_contact: ''
    },
    insurance_info: {
      has_insurance: false,
      scheme_name: '',
      policy_number: ''
    }
  });

  useEffect(() => {
    getUserLocation();
    searchHospitals();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter([location.latitude, location.longitude]);
          setSearchParams(prev => ({
            ...prev,
            location: location
          }));
          setCampSearchParams(prev => ({
            ...prev,
            location: location
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const searchHospitals = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/v1/patient/hospitals/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });

      if (response.ok) {
        const data = await response.json();
        setHospitals(data.data);
      } else {
        console.error('Failed to search hospitals');
      }
    } catch (error) {
      console.error('Error searching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCamps = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/v1/patient/camps/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campSearchParams)
      });

      if (response.ok) {
        const data = await response.json();
        setCamps(data.data);
      } else {
        console.error('Failed to search camps');
      }
    } catch (error) {
      console.error('Error searching camps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    try {
      // Parse the time slot
      const [startTime, endTime] = bookingData.appointment_details.time.split('-');
      
      // Create appointment data in the correct format for the API
      const appointmentData = {
        doctorId: selectedHospital.doctor_id || selectedHospital.doctorId,
        hospitalId: selectedHospital.hospital_id || selectedHospital._id,
        appointmentDate: bookingData.appointment_details.date,
        timeSlot: {
          start: startTime ? startTime.trim() : '09:00',
          end: endTime ? endTime.trim() : '10:00'
        },
        type: bookingData.appointment_details.service_type === 'telemedicine' ? 'telemedicine' : 'in-person',
        reason: bookingData.appointment_details.service_type,
        symptoms: bookingData.appointment_details.notes ? [bookingData.appointment_details.notes] : [],
        consultationFee: selectedHospital.consultation_fee || 500
      };

      // Dispatch the Redux action
      const result = await dispatch(bookAppointment(appointmentData));

      if (bookAppointment.fulfilled.match(result)) {
        setBookingDialog(false);
        setSelectedHospital(null);
        setBookingData({
          appointment_details: { date: '', time: '', service_type: 'consultation', notes: '' },
          patient_info: { patient_name: '', age: '', gender: '', phone: '', emergency_contact: '' },
          insurance_info: { has_insurance: false, scheme_name: '', policy_number: '' }
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1 && camps.length === 0) {
      searchCamps();
    }
  };

  const getDistanceText = (hospital) => {
    if (hospital.distance_km) {
      return `${hospital.distance_km} km away`;
    }
    return 'Distance unavailable';
  };

  const getBedAvailabilityColor = (available, total) => {
    if (!total) return 'default';
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warning';
    return 'error';
  };

  const getHospitalTypeIcon = (type) => {
    switch (type) {
      case 'government':
        return <HospitalIcon color="primary" />;
      case 'private':
        return <HospitalIcon color="secondary" />;
      default:
        return <HospitalIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Healthcare Discovery
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Find hospitals, book appointments, and discover medical camps near you
        </Typography>
      </Box>

      {/* Search Interface */}
      <SearchCard elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ mr: 2, fontSize: 30 }} />
          <Typography variant="h5">Find Healthcare Services</Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton 
              color="inherit" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="filled"
              label="Search Location"
              placeholder="Enter city, area, or hospital name"
              InputProps={{
                style: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' },
                endAdornment: (
                  <IconButton onClick={getUserLocation} sx={{ color: 'white' }}>
                    <LocationIcon />
                  </IconButton>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="filled">
              <InputLabel sx={{ color: 'white' }}>Service Type</InputLabel>
              <Select
                value={searchParams.service_type}
                onChange={(e) => setSearchParams({ ...searchParams, service_type: e.target.value })}
                sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
              >
                <MenuItem value="">All Services</MenuItem>
                <MenuItem value="cardiology">Cardiology</MenuItem>
                <MenuItem value="orthopedic">Orthopedic</MenuItem>
                <MenuItem value="neurology">Neurology</MenuItem>
                <MenuItem value="pediatrics">Pediatrics</MenuItem>
                <MenuItem value="gynecology">Gynecology</MenuItem>
                <MenuItem value="dermatology">Dermatology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography gutterBottom sx={{ color: 'white' }}>
              Radius: {searchParams.radius_km} km
            </Typography>
            <Slider
              value={searchParams.radius_km}
              onChange={(e, newValue) => setSearchParams({ ...searchParams, radius_km: newValue })}
              min={1}
              max={50}
              valueLabelDisplay="auto"
              sx={{ color: 'white' }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={searchHospitals}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: 'white' }}>Hospital Type</InputLabel>
                  <Select
                    value={searchParams.hospital_type}
                    onChange={(e) => setSearchParams({ ...searchParams, hospital_type: e.target.value })}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="government">Government</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="trust">Trust/NGO</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: 'white' }}>Insurance</InputLabel>
                  <Select
                    value={searchParams.insurance_accepted}
                    onChange={(e) => setSearchParams({ ...searchParams, insurance_accepted: e.target.value })}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    <MenuItem value="">Any Insurance</MenuItem>
                    <MenuItem value="cghs">CGHS</MenuItem>
                    <MenuItem value="esis">ESIS</MenuItem>
                    <MenuItem value="ayushman">Ayushman Bharat</MenuItem>
                    <MenuItem value="private">Private Insurance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchParams.emergency_services}
                      onChange={(e) => setSearchParams({ ...searchParams, emergency_services: e.target.checked })}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Emergency Services"
                  sx={{ color: 'white' }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchParams.availability_required}
                      onChange={(e) => setSearchParams({ ...searchParams, availability_required: e.target.checked })}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Show Real-time Availability"
                  sx={{ color: 'white' }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </SearchCard>

      {/* Tabs for Hospitals and Camps */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="healthcare discovery tabs">
          <Tab icon={<HospitalIcon />} label={`Hospitals (${hospitals.length})`} />
          <Tab icon={<CampaignIcon />} label={`Medical Camps (${camps.length})`} />
        </Tabs>
      </Box>

      {/* Hospital Search Results */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Typography>Searching hospitals...</Typography>
        ) : (
          <Grid container spacing={3}>
            {hospitals.map((hospital, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <HospitalCard 
                  featured={hospital.patient_ratings?.average_rating > 4}
                  elevation={3}
                >
                  <CardContent>
                    {/* Hospital Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getHospitalTypeIcon(hospital.hospital_type)}
                      <Box sx={{ ml: 1, flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {hospital.hospital_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={hospital.hospital_type} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          {hospital.services?.emergency_care && (
                            <Chip 
                              label="24/7 Emergency" 
                              size="small" 
                              color="error" 
                              icon={<EmergencyIcon />}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Rating */}
                    {hospital.patient_ratings && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating 
                          value={parseFloat(hospital.patient_ratings.average_rating)} 
                          readOnly 
                          precision={0.5}
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {hospital.patient_ratings.average_rating} ({hospital.patient_ratings.total_reviews} reviews)
                        </Typography>
                      </Box>
                    )}

                    {/* Location and Distance */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        {hospital.contact_info?.address?.district}, {hospital.contact_info?.address?.taluk}
                      </Typography>
                    </Box>
                    
                    {hospital.distance_km && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <NavigationIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="primary">
                          {getDistanceText(hospital)}
                        </Typography>
                      </Box>
                    )}

                    {/* Bed Availability */}
                    {hospital.real_time_availability && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Bed Availability
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Chip 
                              label={`General: ${hospital.real_time_availability.general_beds?.available || 0}/${hospital.real_time_availability.general_beds?.total || 0}`}
                              size="small"
                              color={getBedAvailabilityColor(
                                hospital.real_time_availability.general_beds?.available,
                                hospital.real_time_availability.general_beds?.total
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Chip 
                              label={`ICU: ${hospital.real_time_availability.icu_beds?.available || 0}/${hospital.real_time_availability.icu_beds?.total || 0}`}
                              size="small"
                              color={getBedAvailabilityColor(
                                hospital.real_time_availability.icu_beds?.available,
                                hospital.real_time_availability.icu_beds?.total
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Chip 
                              label={`Emergency: ${hospital.real_time_availability.emergency_beds?.available || 0}/${hospital.real_time_availability.emergency_beds?.total || 0}`}
                              size="small"
                              color={getBedAvailabilityColor(
                                hospital.real_time_availability.emergency_beds?.available,
                                hospital.real_time_availability.emergency_beds?.total
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Services */}
                    {hospital.services?.specialties && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Specialties Available
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.entries(hospital.services.specialties)
                            .filter(([key, value]) => value)
                            .slice(0, 3)
                            .map(([key]) => (
                              <Chip key={key} label={key} size="small" variant="outlined" />
                            ))}
                        </Box>
                      </Box>
                    )}

                    {/* RHO Information */}
                    {hospital.rho_info && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Regional Health Officer:</strong> {hospital.rho_info.rho_name}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ mt: 'auto', p: 2 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => {
                        // Open hospital details
                        console.log('View hospital details:', hospital.hospital_id);
                      }}
                    >
                      View Details
                    </Button>
                    
                    {hospital.booking_info?.online_booking_available && (
                      <Button 
                        size="small" 
                        variant="contained"
                        startIcon={<BookIcon />}
                        onClick={() => {
                          setSelectedHospital(hospital);
                          setBookingDialog(true);
                        }}
                      >
                        Book Appointment
                      </Button>
                    )}
                    
                    <Tooltip title="Get Directions">
                      <IconButton 
                        size="small"
                        onClick={() => {
                          if (hospital.contact_info?.coordinates?.coordinates) {
                            const [lon, lat] = hospital.contact_info.coordinates.coordinates;
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
                          }
                        }}
                      >
                        <DirectionsIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Call Hospital">
                      <IconButton 
                        size="small"
                        onClick={() => {
                          if (hospital.contact_info?.phone) {
                            window.open(`tel:${hospital.contact_info.phone}`);
                          }
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </HospitalCard>
              </Grid>
            ))}
          </Grid>
        )}

        {hospitals.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <HospitalIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No hospitals found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search filters or expanding the search radius
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Medical Camps Results */}
      <TabPanel value={tabValue} index={1}>
        {/* Camp Search Filters */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Search Medical Camps</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Camp Type</InputLabel>
                  <Select
                    value={campSearchParams.camp_type}
                    onChange={(e) => setCampSearchParams({ ...campSearchParams, camp_type: e.target.value })}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="general_health">General Health</MenuItem>
                    <MenuItem value="eye_care">Eye Care</MenuItem>
                    <MenuItem value="dental_care">Dental Care</MenuItem>
                    <MenuItem value="women_health">Women's Health</MenuItem>
                    <MenuItem value="child_health">Child Health</MenuItem>
                    <MenuItem value="vaccination">Vaccination</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  InputLabelProps={{ shrink: true }}
                  value={campSearchParams.date_range.start}
                  onChange={(e) => setCampSearchParams({
                    ...campSearchParams,
                    date_range: { ...campSearchParams.date_range, start: e.target.value }
                  })}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  InputLabelProps={{ shrink: true }}
                  value={campSearchParams.date_range.end}
                  onChange={(e) => setCampSearchParams({
                    ...campSearchParams,
                    date_range: { ...campSearchParams.date_range, end: e.target.value }
                  })}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Typography gutterBottom>
                  Radius: {campSearchParams.radius_km} km
                </Typography>
                <Slider
                  value={campSearchParams.radius_km}
                  onChange={(e, newValue) => setCampSearchParams({ ...campSearchParams, radius_km: newValue })}
                  min={5}
                  max={100}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={searchCamps}
                  sx={{ mt: 1 }}
                >
                  Search Camps
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Camps Grid */}
        <Grid container spacing={3}>
          {camps.map((camp, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CampaignIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{camp.camp_name}</Typography>
                  </Box>
                  
                  <Chip 
                    label={camp.camp_type.replace('_', ' ')} 
                    color="primary" 
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  {camp.camp_logistics?.dates && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimeIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(camp.camp_logistics.dates.start_date).toLocaleDateString()} - 
                          {new Date(camp.camp_logistics.dates.end_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {camp.camp_logistics?.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {camp.camp_logistics.location.address}, {camp.camp_logistics.location.district}
                      </Typography>
                    </Box>
                  )}
                  
                  {camp.distance_km && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <NavigationIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="primary">
                        {camp.distance_km} km away
                      </Typography>
                    </Box>
                  )}
                  
                  {camp.services_offered && camp.services_offered.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Services Offered
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {camp.services_offered.slice(0, 3).map((service, idx) => (
                          <Chip key={idx} label={service} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="textSecondary">
                    <strong>RHO:</strong> {camp.rho_name}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  {camp.patient_registration_open && (
                    <Button size="small" variant="outlined">
                      Register
                    </Button>
                  )}
                  <Tooltip title="Get Directions">
                    <IconButton 
                      size="small"
                      onClick={() => {
                        if (camp.camp_logistics?.location?.coordinates?.coordinates) {
                          const [lon, lat] = camp.camp_logistics.location.coordinates.coordinates;
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
                        }
                      }}
                    >
                      <DirectionsIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {camps.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CampaignIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No medical camps found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search filters or check back later for new camps
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Appointment Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Book Appointment - {selectedHospital?.hospital_name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Patient Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Patient Information</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Patient Name"
                value={bookingData.patient_info.patient_name}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  patient_info: { ...bookingData.patient_info, patient_name: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                value={bookingData.patient_info.age}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  patient_info: { ...bookingData.patient_info, age: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={bookingData.patient_info.gender}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    patient_info: { ...bookingData.patient_info, gender: e.target.value }
                  })}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={bookingData.patient_info.phone}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  patient_info: { ...bookingData.patient_info, phone: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                value={bookingData.patient_info.emergency_contact}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  patient_info: { ...bookingData.patient_info, emergency_contact: e.target.value }
                })}
              />
            </Grid>

            {/* Appointment Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Appointment Details</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Preferred Date"
                InputLabelProps={{ shrink: true }}
                value={bookingData.appointment_details.date}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  appointment_details: { ...bookingData.appointment_details, date: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Preferred Time"
                InputLabelProps={{ shrink: true }}
                value={bookingData.appointment_details.time}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  appointment_details: { ...bookingData.appointment_details, time: e.target.value }
                })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={bookingData.appointment_details.service_type}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    appointment_details: { ...bookingData.appointment_details, service_type: e.target.value }
                  })}
                >
                  <MenuItem value="consultation">General Consultation</MenuItem>
                  <MenuItem value="followup">Follow-up</MenuItem>
                  <MenuItem value="specialist">Specialist Consultation</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes"
                value={bookingData.appointment_details.notes}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  appointment_details: { ...bookingData.appointment_details, notes: e.target.value }
                })}
              />
            </Grid>

            {/* Insurance Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookingData.insurance_info.has_insurance}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      insurance_info: { ...bookingData.insurance_info, has_insurance: e.target.checked }
                    })}
                  />
                }
                label="I have health insurance"
              />
            </Grid>
            
            {bookingData.insurance_info.has_insurance && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Insurance Scheme"
                    value={bookingData.insurance_info.scheme_name}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      insurance_info: { ...bookingData.insurance_info, scheme_name: e.target.value }
                    })}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Policy Number"
                    value={bookingData.insurance_info.policy_number}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      insurance_info: { ...bookingData.insurance_info, policy_number: e.target.value }
                    })}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBookAppointment} variant="contained">
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}