import React, { useState } from 'react';
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
  Alert,
  AlertTitle,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Stepper,
  Step,
  StepLabel,
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
} from '@mui/icons-material';
import { register } from '../redux/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    aadhaarNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
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
      }}
    >
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
                  boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
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
                    {/* Name Fields */}
                    <Grid item xs={12} sm={6}>
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
                            '&:hover fieldset': {
                              borderColor: '#f5576c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f5576c',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f5576c',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                            '&:hover fieldset': {
                              borderColor: '#f5576c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f5576c',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f5576c',
                          },
                        }}
                      />
                    </Grid>

                    {/* Mobile Number */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="mobileNumber"
                        label="Mobile Number"
                        name="mobileNumber"
                        autoComplete="tel"
                        placeholder="9876543210"
                        helperText="10-digit Indian mobile number (starting with 6-9)"
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
                            '&:hover fieldset': {
                              borderColor: '#4facfe',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4facfe',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4facfe',
                          },
                        }}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
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
                            '&:hover fieldset': {
                              borderColor: '#f093fb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f093fb',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f093fb',
                          },
                        }}
                      />
                    </Grid>

                    {/* Aadhaar Number */}
                    <Grid item xs={12}>
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
                            '&:hover fieldset': {
                              borderColor: '#4facfe',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4facfe',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4facfe',
                          },
                        }}
                      />
                    </Grid>

                    {/* Password */}
                    <Grid item xs={12}>
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
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#f5576c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f5576c',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f5576c',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    endIcon={!loading && <ArrowForward />}
                    sx={{
                      mt: 4,
                      mb: 2,
                      py: 1.8,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                        boxShadow: '0 15px 40px rgba(245, 87, 108, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={26} sx={{ color: '#fff' }} />
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
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
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#f5576c',
                            background: 'rgba(245, 87, 108, 0.05)',
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
