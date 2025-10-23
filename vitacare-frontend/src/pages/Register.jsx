import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  AlertTitle,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Zoom,
  LinearProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  CreditCard,
  Lock,
  Visibility,
  VisibilityOff,
  LocalHospital,
  ArrowForward,
  CheckCircle,
  FiberManualRecord,
} from '@mui/icons-material';
import { register } from '../redux/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
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

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.mobileNumber,
      formData.email,
      formData.aadhaarNumber,
      formData.password,
      formData.bloodGroup,
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const progress = calculateProgress();

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 20% 50%, rgba(240, 147, 251, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(79, 172, 254, 0.3) 0%, transparent 50%)',
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '33%': {
            transform: 'translate(30px, -30px) rotate(120deg)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) rotate(240deg)',
          },
        },
      }}
    >
      {/* Floating decorative shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          animation: 'float1 15s ease-in-out infinite',
          '@keyframes float1': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(50px, -50px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          animation: 'float2 18s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(-40px, 40px) rotate(-180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '3%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          animation: 'float3 12s ease-in-out infinite',
          '@keyframes float3': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-60px)' },
          },
        }}
      />

      <Container component="main" maxWidth="md">
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Logo Section */}
            <Slide direction="down" in={true} timeout={600}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
                      },
                    },
                  }}
                >
                  <LocalHospital sx={{ fontSize: 45, color: '#fff' }} />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#fff',
                    textShadow: '2px 4px 8px rgba(0,0,0,0.2)',
                    letterSpacing: '1px',
                    mb: 1,
                  }}
                >
                  VitaCare
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 400,
                    textShadow: '1px 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Join India's Leading Healthcare Platform
                </Typography>
              </Box>
            </Slide>

            {/* Registration Form Card */}
            <Slide direction="up" in={true} timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  p: 5,
                  width: '100%',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 35px 110px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.6)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                  },
                }}
              >
                {/* Progress Bar */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                      Registration Progress
                    </Typography>
                    <Chip 
                      label={`${progress}%`}
                      size="small"
                      sx={{ 
                        fontWeight: 700,
                        background: progress === 100 
                          ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: '#fff',
                      }}
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: progress === 100 
                          ? 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
                          : 'linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                        transition: 'all 0.5s ease',
                      },
                    }}
                  />
                </Box>

                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 1,
                  }}
                >
                  Create Account
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    color: '#666',
                    mb: 3,
                  }}
                >
                  Get started with your Universal Health Identity
                </Typography>

                {/* UHI Information Alert */}
                <Alert
                  severity="info"
                  icon={<CheckCircle />}
                  sx={{
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
                    border: '2px solid #03a9f4',
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 700, color: '#01579b' }}>
                    Universal Health Identity (UHI) 🏥
                  </AlertTitle>
                  <Typography variant="body2" sx={{ color: '#0277bd', mb: 1 }}>
                    Your UHI will be automatically generated in format: <strong>FIRSTNAME1234</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0288d1', display: 'block' }}>
                    <strong>Example:</strong> If your name is "Rahul" and Aadhaar ends in 5678, your UHI will be{' '}
                    <strong style={{ color: '#01579b' }}>RAHUL5678</strong>
                  </Typography>
                </Alert>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Personal Information Section */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Divider sx={{ flex: 1, borderColor: '#f5576c', borderWidth: 1 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Person /> Personal Information
                        </Typography>
                        <Divider sx={{ flex: 1, borderColor: '#f5576c', borderWidth: 1 }} />
                      </Box>
                    </Grid>

                    {/* Name Fields */}
                    <Grid item xs={12} sm={6}>
                      <Zoom in={true} timeout={600}>
                        <TextField
                          required
                          fullWidth
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: '#f5576c' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#f5576c',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f5576c',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#f5576c',
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Zoom in={true} timeout={700}>
                        <TextField
                          required
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: '#f5576c' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#f5576c',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f5576c',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#f5576c',
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Zoom>
                    </Grid>

                    {/* Mobile Number */}
                    <Grid item xs={12} sm={6}>
                      <Zoom in={true} timeout={800}>
                        <TextField
                          required
                          fullWidth
                          id="mobileNumber"
                          label="Mobile Number"
                          name="mobileNumber"
                          autoComplete="tel"
                          placeholder="9876543210"
                          helperText="10-digit Indian mobile number (starting with 6-9)"
                          inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: '#4facfe' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(79, 172, 254, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#4facfe',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(79, 172, 254, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#4facfe',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#4facfe',
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Zoom>
                    </Grid>

                    {/* Blood Group */}
                    <Grid item xs={12} sm={6}>
                      <Zoom in={true} timeout={900}>
                        <TextField
                          required
                          fullWidth
                          select
                          id="bloodGroup"
                          label="Blood Group"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalHospital sx={{ color: '#f5576c' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#f5576c',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f5576c',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#f5576c',
                              fontWeight: 600,
                            },
                          }}
                        >
                          {bloodGroups.map((group) => (
                            <MenuItem key={group} value={group}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FiberManualRecord sx={{ fontSize: 12, color: '#f5576c' }} />
                                {group}
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Zoom>
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
                      <Zoom in={true} timeout={1000}>
                        <TextField
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: '#f093fb' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(240, 147, 251, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#f093fb',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(240, 147, 251, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f093fb',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#f093fb',
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Zoom>
                    </Grid>

                    {/* Aadhaar Number */}
                    <Grid item xs={12}>
                      <Zoom in={true} timeout={1100}>
                        <TextField
                          required
                          fullWidth
                          id="aadhaarNumber"
                          label="Aadhaar Number"
                          name="aadhaarNumber"
                          placeholder="123456789012"
                          helperText="12-digit Aadhaar number (used for UHI generation)"
                          inputProps={{ maxLength: 12 }}
                          value={formData.aadhaarNumber}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CreditCard sx={{ color: '#4facfe' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(79, 172, 254, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#4facfe',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(79, 172, 254, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#4facfe',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#4facfe',
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Zoom>
                    </Grid>

                    {/* Password */}
                    <Grid item xs={12}>
                      <Zoom in={true} timeout={1200}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          autoComplete="new-password"
                          helperText="Minimum 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: '#f5576c' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{
                                    '&:hover': {
                                      background: 'rgba(245, 87, 108, 0.1)',
                                    },
                                  }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: '#f5576c',
                              },
                              '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f5576c',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#f5576c',
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Zoom>
                    </Grid>
                  </Grid>

                  <Zoom in={true} timeout={1300}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading || progress < 100}
                      endIcon={!loading && <ArrowForward />}
                      sx={{
                        mt: 4,
                        mb: 2,
                        py: 1.8,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        background: progress === 100 
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          : 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                        boxShadow: progress === 100 
                          ? '0 10px 30px rgba(245, 87, 108, 0.4)'
                          : '0 5px 15px rgba(0,0,0,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                          transform: 'translate(-50%, -50%)',
                          opacity: 0,
                          transition: 'opacity 0.5s ease',
                        },
                        '&:hover::before': {
                          opacity: progress === 100 ? 1 : 0,
                        },
                        '&:hover': {
                          background: progress === 100 
                            ? 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)'
                            : 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                          boxShadow: progress === 100 
                            ? '0 15px 40px rgba(245, 87, 108, 0.5)'
                            : '0 5px 15px rgba(0,0,0,0.2)',
                          transform: progress === 100 ? 'translateY(-2px) scale(1.02)' : 'none',
                        },
                        '&:active': {
                          transform: 'translateY(0) scale(1)',
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                          color: '#999',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={26} sx={{ color: '#fff' }} />
                          <Typography>Creating Account...</Typography>
                        </Box>
                      ) : progress === 100 ? (
                        'Create Account ✨'
                      ) : (
                        `Complete Form (${progress}%)`
                      )}
                    </Button>
                  </Zoom>

                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                      Already have an account?
                    </Typography>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#f5576c',
                          color: '#f5576c',
                          fontWeight: 600,
                          textTransform: 'none',
                          px: 4,
                          py: 1,
                          borderRadius: 3,
                          borderWidth: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#f5576c',
                            background: 'rgba(245, 87, 108, 0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(245, 87, 108, 0.2)',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Paper>
            </Slide>

            {/* Footer */}
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              © 2025 VitaCare. All rights reserved.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
