import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookAppointment } from '../redux/slices/appointmentsSlice';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Fade,
  Zoom,
  Slide,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  LocalHospital,
  VideoCall,
  Description,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  MedicalServices,
} from '@mui/icons-material';

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.appointments);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type: 'video',
    specialization: '',
    date: '',
    timeSlot: '',
    reason: '',
    symptoms: '',
    preferredLanguage: '',
  });

  const steps = ['Select Type', 'Choose Date & Time', 'Add Details', 'Confirm'];

  const specializations = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Orthopedic',
    'Pediatrician',
    'Gynecologist',
    'ENT Specialist',
    'Neurologist',
    'Psychiatrist',
    'Dentist',
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
  ];

  const languages = ['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(bookAppointment(formData)).unwrap();
      navigate('/appointments');
    } catch (error) {
      console.error('Failed to book appointment:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={600}>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Select Consultation Type
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => setFormData({ ...formData, type: 'video' })}
                    sx={{
                      cursor: 'pointer',
                      border: formData.type === 'video' ? '3px solid' : '2px solid',
                      borderColor: formData.type === 'video' ? '#667eea' : 'rgba(0,0,0,0.1)',
                      background: formData.type === 'video' 
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                        : '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        <VideoCall sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Video Consultation
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Consult with doctors from the comfort of your home
                      </Typography>
                      <Chip 
                        label="Popular" 
                        size="small" 
                        sx={{ 
                          mt: 2,
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => setFormData({ ...formData, type: 'in-person' })}
                    sx={{
                      cursor: 'pointer',
                      border: formData.type === 'in-person' ? '3px solid' : '2px solid',
                      borderColor: formData.type === 'in-person' ? '#667eea' : 'rgba(0,0,0,0.1)',
                      background: formData.type === 'in-person' 
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                        : '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        }}
                      >
                        <LocalHospital sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        In-Person Visit
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Visit the clinic or hospital for physical examination
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={formData.specialization}
                    onChange={handleChange('specialization')}
                    label="Specialization"
                    startAdornment={
                      <InputAdornment position="start">
                        <MedicalServices sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                    }}
                  >
                    {specializations.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Fade>
        );
      
      case 1:
        return (
          <Slide direction="left" in timeout={600}>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Choose Date & Time
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Appointment Date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange('date')}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0],
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Preferred Language</InputLabel>
                    <Select
                      value={formData.preferredLanguage}
                      onChange={handleChange('preferredLanguage')}
                      label="Preferred Language"
                      startAdornment={
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                          {lang}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Select Time Slot
                </Typography>
                <Grid container spacing={2}>
                  {timeSlots.map((slot) => (
                    <Grid item xs={6} sm={4} md={3} key={slot}>
                      <Chip
                        label={slot}
                        onClick={() => setFormData({ ...formData, timeSlot: slot })}
                        icon={<AccessTime />}
                        sx={{
                          width: '100%',
                          height: 48,
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          background: formData.timeSlot === slot
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : '#fff',
                          color: formData.timeSlot === slot ? '#fff' : '#667eea',
                          border: `2px solid ${formData.timeSlot === slot ? '#667eea' : 'rgba(102, 126, 234, 0.3)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            background: formData.timeSlot === slot
                              ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                              : 'rgba(102, 126, 234, 0.1)',
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Slide>
        );
      
      case 2:
        return (
          <Fade in timeout={600}>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Add Consultation Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Visit"
                    value={formData.reason}
                    onChange={handleChange('reason')}
                    placeholder="e.g., Fever and headache"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Describe Your Symptoms"
                    value={formData.symptoms}
                    onChange={handleChange('symptoms')}
                    placeholder="Please describe your symptoms in detail..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Alert 
                severity="info" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  💡 Tip: Providing detailed information helps the doctor prepare better for your consultation.
                </Typography>
              </Alert>
            </Box>
          </Fade>
        );
      
      case 3:
        return (
          <Zoom in timeout={600}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Confirm Your Appointment
                </Typography>
              </Box>

              <Card sx={{ 
                borderRadius: 3,
                border: '2px solid rgba(102, 126, 234, 0.2)',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          mr: 2,
                        }}>
                          {formData.type === 'video' ? <VideoCall /> : <LocalHospital />}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Consultation Type
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {formData.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MedicalServices sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Specialization
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formData.specialization || 'Not selected'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Language
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formData.preferredLanguage || 'Not selected'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }) : 'Not selected'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Time Slot
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formData.timeSlot || 'Not selected'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: 'rgba(102, 126, 234, 0.05)',
                      }}>
                        <Typography variant="caption" color="textSecondary">
                          Reason for Visit
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {formData.reason || 'Not provided'}
                        </Typography>
                      </Box>
                    </Grid>

                    {formData.symptoms && (
                      <Grid item xs={12}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          background: 'rgba(102, 126, 234, 0.05)',
                        }}>
                          <Typography variant="caption" color="textSecondary">
                            Symptoms
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {formData.symptoms}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>

              <Alert 
                severity="success" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  ✅ Everything looks good! Click "Book Appointment" to confirm your booking.
                </Typography>
              </Alert>
            </Box>
          </Zoom>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/appointments')}
              sx={{
                mb: 2,
                color: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                },
              }}
            >
              Back to Appointments
            </Button>
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
              📅 Book Appointment
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Schedule your consultation in just a few steps
            </Typography>
          </Box>
        </Fade>

        {/* Stepper */}
        <Slide direction="down" in timeout={800}>
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: 600,
                        },
                        '& .Mui-active': {
                          color: '#667eea',
                        },
                        '& .Mui-completed': {
                          color: '#43e97b',
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Slide>

        {/* Step Content */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          mb: 4,
        }}>
          <CardContent sx={{ p: 4 }}>
            {getStepContent(activeStep)}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              borderRadius: 2,
              borderColor: '#667eea',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#764ba2',
                background: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              endIcon={<CheckCircle />}
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                px: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              endIcon={<ArrowForward />}
              variant="contained"
              size="large"
              disabled={
                (activeStep === 0 && !formData.specialization) ||
                (activeStep === 1 && (!formData.date || !formData.timeSlot))
              }
              sx={{
                px: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default BookAppointment;
