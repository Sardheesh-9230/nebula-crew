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
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
} from '@mui/material';
import { 
  Phone, 
  Badge, 
  Lock, 
  Visibility, 
  VisibilityOff,
  LocalHospital,
  ArrowForward,
} from '@mui/icons-material';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.auth);

  const [loginType, setLoginType] = useState('mobile'); // 'mobile' or 'uhi'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
  });

  const handleLoginTypeChange = (event, newType) => {
    if (newType !== null) {
      setLoginType(newType);
      setFormData({
        mobileNumber: '',
        password: '',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
      <Container component="main" maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Logo and Welcome Section */}
            <Slide direction="down" in={true} timeout={600}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
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
                  <LocalHospital sx={{ fontSize: 50, color: '#fff' }} />
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
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 300,
                    textShadow: '1px 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Your Health, Our Priority
                </Typography>
              </Box>
            </Slide>

            {/* Login Form Card */}
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
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    color: '#666',
                    mb: 4,
                  }}
                >
                  Sign in to continue to your account
                </Typography>

                {/* Login Type Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <ToggleButtonGroup
                    value={loginType}
                    exclusive
                    onChange={handleLoginTypeChange}
                    aria-label="login type"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 4,
                        py: 1.5,
                        border: '2px solid #667eea',
                        color: '#667eea',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                          },
                        },
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.1)',
                        },
                      },
                    }}
                  >
                    <ToggleButton value="mobile" aria-label="mobile login">
                      <Phone sx={{ mr: 1 }} />
                      Mobile
                    </ToggleButton>
                    <ToggleButton value="uhi" aria-label="uhi login">
                      <Badge sx={{ mr: 1 }} />
                      UHI
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {loginType === 'uhi' && (
                  <Fade in={true}>
                    <Alert
                      severity="info"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        border: '1px solid #2196f3',
                      }}
                    >
                      Enter your Universal Health Identity (UHI) - Format: <strong>FIRSTNAME1234</strong>
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="mobileNumber"
                    label={loginType === 'mobile' ? t('mobileNumber') : 'UHI (Health ID)'}
                    name="mobileNumber"
                    autoComplete={loginType === 'mobile' ? 'tel' : 'off'}
                    autoFocus
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder={loginType === 'mobile' ? '9876543210' : 'JOHN1234'}
                    helperText={loginType === 'mobile' ? 'Enter 10-digit mobile number' : 'Enter your UHI (e.g., JOHN1234)'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {loginType === 'mobile' ? (
                            <Phone sx={{ color: '#667eea' }} />
                          ) : (
                            <Badge sx={{ color: '#667eea' }} />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea',
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
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
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea',
                      },
                    }}
                  />
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
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
                      'Sign In'
                    )}
                  </Button>
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      Don't have an account?
                    </Typography>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          fontWeight: 600,
                          textTransform: 'none',
                          px: 4,
                          py: 1,
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#667eea',
                            background: 'rgba(102, 126, 234, 0.05)',
                          },
                        }}
                      >
                        Create Account
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
                mt: 4,
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

export default Login;
