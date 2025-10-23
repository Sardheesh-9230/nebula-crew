import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Avatar,
  Divider,
} from '@mui/material';
import { 
  Phone, 
  Lock, 
  Visibility, 
  VisibilityOff,
  PersonOutline,
  LocalHospital,
  AccountBalance,
  Business,
  ArrowBack,
  ArrowForward,
  Badge,
} from '@mui/icons-material';
import { login } from '../redux/slices/authSlice';

const RoleLogin = () => {
  const { role } = useParams(); // patient, doctor, state-officer, regional-officer
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    userId: '',
    password: '',
    role: role,
  });

  const roleConfig = {
    patient: {
      title: 'Patient Login',
      icon: <PersonOutline sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Login with your mobile number',
      registerRoute: '/register',
    },
    doctor: {
      title: 'Doctor Login',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Login with your doctor user ID',
      registerRoute: '/register/doctor',
    },
    'state-officer': {
      title: 'State Health Officer',
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Login with your officer user ID',
      registerRoute: null,
    },
    'regional-officer': {
      title: 'Regional Health Officer',
      icon: <Business sx={{ fontSize: 40 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Login with your officer user ID',
      registerRoute: null,
    },
  };

  const config = roleConfig[role] || roleConfig.patient;

  useEffect(() => {
    setFormData(prev => ({ ...prev, role }));
  }, [role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare credentials based on role
      const credentials = {
        password: formData.password,
        role: formData.role,
      };

      // Add mobileNumber for patients, userId for others
      if (role === 'patient') {
        credentials.mobileNumber = formData.mobileNumber;
      } else {
        credentials.userId = formData.userId;
      }

      await dispatch(login(credentials)).unwrap();
      
      // Navigate based on role
      switch (role) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'state-officer':
          navigate('/state-officer/dashboard');
          break;
        case 'regional-officer':
          navigate('/regional-officer/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: config.gradient,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'drift 20s linear infinite',
          pointerEvents: 'none',
        },
        '@keyframes drift': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Container maxWidth="sm">
        <Slide direction="down" in timeout={600}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate('/role-selection')}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Back to Role Selection
            </Typography>
          </Box>
        </Slide>

        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: config.gradient,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                }}
              >
                {config.icon}
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: config.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {config.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {config.description}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Conditional field: Mobile Number for patients, User ID for others */}
              {role === 'patient' ? (
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your 10-digit mobile number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="User ID"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your user ID"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />
              )}

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: config.gradient,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Register Link */}
            {config.registerRoute && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Don't have an account?{' '}
                    <Link
                      to={config.registerRoute}
                      style={{
                        color: '#667eea',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Register Now
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Fade>

        {/* Footer */}
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Unified National Healthcare Platform
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default RoleLogin;
