import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { register } from '../redux/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    aadhaarNumber: '',
    password: '',
    bloodGroup: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      mobile: '',
    },
  });

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [timeMessage, setTimeMessage] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Check if current time is within registration hours (5:30 PM - 7:30 PM)
  useEffect(() => {
    const checkRegistrationTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes; // Convert to minutes
      
      const startTime = 17 * 60 + 30; // 5:30 PM in minutes (1050)
      const endTime = 19 * 60 + 30;   // 7:30 PM in minutes (1170)
      
      const isOpen = currentTime >= startTime && currentTime <= endTime;
      setIsRegistrationOpen(isOpen);
      
      if (!isOpen) {
        if (currentTime < startTime) {
          setTimeMessage('Registration is only available between 5:30 PM and 7:30 PM. Please come back during registration hours.');
        } else {
          setTimeMessage('Registration hours have ended for today. Registration is available between 5:30 PM and 7:30 PM.');
        }
      } else {
        setTimeMessage('');
      }
    };

    checkRegistrationTime();
    // Check every minute
    const interval = setInterval(checkRegistrationTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects for address and emergency contact
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });
    } else if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isRegistrationOpen) {
      alert('Registration is only allowed between 5:30 PM and 7:30 PM');
      return;
    }
    
    try {
      const result = await dispatch(register(formData));
      if (register.fulfilled.match(result)) {
        // Navigate to registration success page with user data
        navigate('/registration-success', { 
          state: { user: result.payload.user } 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            🏥 VitaCare
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            {t('patientRegistration')}
          </Typography>
          
          {!isRegistrationOpen && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {timeMessage}
            </Alert>
          )}
          
          {isRegistrationOpen && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('registrationOpen')} (5:30 PM - 7:30 PM)
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {t('personalInformation')}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="aadhaarNumber"
                  label={t('aadhaarNumber')}
                  name="aadhaarNumber"
                  placeholder="123456789012"
                  inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
                  helperText="12-digit Aadhaar number"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label={t('firstName')}
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label={t('lastName')}
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="mobileNumber"
                  label={t('mobileNumber')}
                  name="mobileNumber"
                  autoComplete="tel"
                  placeholder="9876543210"
                  helperText="10-digit Indian mobile number (starting with 6-9)"
                  inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  id="bloodGroup"
                  label={t('bloodGroup')}
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                >
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label={t('email')}
                  name="email"
                  autoComplete="email"
                  type="email"
                  helperText={t('optional')}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={t('password')}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText="Min 8 characters, 1 uppercase, 1 lowercase, 1 number"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              {/* Address Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                  {t('addressInformation')}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address.line1"
                  label={t('addressLine1')}
                  name="address.line1"
                  value={formData.address.line1}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address.line2"
                  label={t('addressLine2')}
                  name="address.line2"
                  helperText={t('optional')}
                  value={formData.address.line2}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address.city"
                  label={t('city')}
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address.state"
                  label={t('state')}
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address.pincode"
                  label={t('pincode')}
                  name="address.pincode"
                  inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                  value={formData.address.pincode}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              {/* Emergency Contact Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                  {t('emergencyContact')}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="emergencyContact.name"
                  label={t('contactName')}
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="emergencyContact.relationship"
                  label={t('relationship')}
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="emergencyContact.mobile"
                  label={t('contactMobile')}
                  name="emergencyContact.mobile"
                  inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
                  value={formData.emergencyContact.mobile}
                  onChange={handleChange}
                  disabled={!isRegistrationOpen}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !isRegistrationOpen}
            >
              {loading ? <CircularProgress size={24} /> : t('registerPatient')}
            </Button>
            
            {!isRegistrationOpen && (
              <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
                {t('registrationClosed')}
              </Typography>
            )}
            
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {t('alreadyHaveAccount')} {t('login')}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
