import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fade,
  Slide,
  Zoom,
  AppBar,
  Toolbar,
  IconButton,
  useScrollTrigger,
} from '@mui/material';
import {
  LocalHospital,
  Event,
  MedicalServices,
  Security,
  Speed,
  People,
  ArrowForward,
  Login,
  PersonAdd,
  Phone,
  Email,
  LocationOn,
  KeyboardArrowDown,
  Menu as MenuIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for header background change
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add smooth scroll to html
    document.documentElement.style.scrollBehavior = 'smooth';

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Smooth scroll to stats section
  const scrollToStats = () => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: <LocalHospital sx={{ fontSize: 50 }} />,
      title: 'Unified Health Records',
      description: 'Access your complete medical history anytime, anywhere with secure cloud storage.',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <Event sx={{ fontSize: 50 }} />,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with doctors and hospitals across India in just a few clicks.',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <MedicalServices sx={{ fontSize: 50 }} />,
      title: 'Telemedicine Services',
      description: 'Consult with healthcare professionals from the comfort of your home.',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with government-grade security.',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: 'Fast & Efficient',
      description: 'Quick registration, instant access, and seamless healthcare delivery.',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      icon: <People sx={{ fontSize: 50 }} />,
      title: 'For Everyone',
      description: 'Healthcare services accessible to all citizens across the nation.',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
  ];

  const stats = [
    { value: '10M+', label: 'Registered Users' },
    { value: '50K+', label: 'Healthcare Providers' },
    { value: '5M+', label: 'Appointments Booked' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', scrollBehavior: 'smooth' }}>
      {/* Header / Navigation */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: scrolled 
            ? 'linear-gradient(90deg, rgba(22, 65, 148, 0.98) 0%, rgba(19, 84, 122, 0.98) 100%)'
            : 'linear-gradient(90deg, #164194 0%, #13547a 100%)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.2)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease-in-out',
          py: scrolled ? 0.3 : 0.5,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/150px-Emblem_of_India.svg.png"
              alt="Government of India"
              sx={{ 
                height: 50,
                filter: 'brightness(0) invert(1)',
              }}
            />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <LocalHospital sx={{ fontSize: 28, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                  VitaCare
                </Typography>
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 500,
                  opacity: 0.95,
                  display: 'block',
                  mt: -0.5,
                  letterSpacing: 0.3,
                }}
              >
                Ministry of Health & Family Welfare
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/role-selection')}
              startIcon={<Login />}
              sx={{ 
                mr: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate('/register')}
              startIcon={<PersonAdd />}
              sx={{ 
                background: 'linear-gradient(135deg, #FF9933 0%, #FF7722 100%)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                px: 4,
                py: 1.2,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(255,153,51,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF7722 0%, #FF5511 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(255,153,51,0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Register Now
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Government Emblem Banner */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)',
          height: '6px',
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: 10,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(22, 65, 148, 0.98) 0%, rgba(19, 84, 122, 0.98) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 2,
                      textShadow: '3px 3px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                      color: '#ffffff',
                      letterSpacing: '-0.5px',
                      lineHeight: 1.2,
                      animation: 'fadeInUp 1s ease-out',
                      '@keyframes fadeInUp': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(30px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    Welcome to <Box component="span" sx={{ color: '#FF9933', fontWeight: 900 }}>VitaCare</Box>
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 600,
                      color: '#FFD700',
                      textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                      letterSpacing: '0.5px',
                      animation: 'fadeInUp 1s ease-out 0.2s both',
                      '@keyframes fadeInUp': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(30px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    India's Unified National Healthcare Platform
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 3,
                      fontWeight: 500,
                      color: '#E0E0E0',
                      fontStyle: 'italic',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                      animation: 'fadeInUp 1s ease-out 0.3s both',
                    }}
                  >
                    भारत सरकार की पहल | Government of India Initiative
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 4,
                      animation: 'fadeInUp 1s ease-out 0.4s both',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                      backdropFilter: 'blur(15px)',
                      padding: 2.5,
                      borderRadius: 3,
                      border: '2px solid rgba(255,255,255,0.25)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Box
                      component="img"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/150px-Emblem_of_India.svg.png"
                      alt="Government of India"
                      sx={{ 
                        height: 55, 
                        filter: 'brightness(0) invert(1) drop-shadow(2px 2px 6px rgba(0,0,0,0.6))',
                      }}
                    />
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          mb: 0.3,
                          letterSpacing: '0.3px',
                        }}
                      >
                        Ministry of Health & Family Welfare
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: '#FFD700',
                          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                          display: 'block',
                        }}
                      >
                        स्वास्थ्य एवं परिवार कल्याण मंत्रालय
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 5,
                      fontSize: '1.15rem',
                      lineHeight: 1.9,
                      color: '#ffffff',
                      fontWeight: 400,
                      textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                      animation: 'fadeInUp 1s ease-out 0.5s both',
                    }}
                  >
                    Access your health records, book appointments, consult doctors, and manage your complete healthcare journey — all in one secure, government-verified platform.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', animation: 'fadeInUp 1s ease-out 0.6s both' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(135deg, #FF9933 0%, #FF7722 100%)',
                        color: '#fff',
                        px: 5,
                        py: 2,
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        boxShadow: '0 8px 24px rgba(255,153,51,0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF7722 0%, #FF5511 100%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 32px rgba(255,153,51,0.5)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Register Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/role-selection')}
                      startIcon={<Login />}
                      sx={{
                        borderColor: '#fff',
                        color: '#fff',
                        px: 5,
                        py: 2,
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        borderWidth: 2.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: '#fff',
                          background: 'rgba(255,255,255,0.25)',
                          borderWidth: 2.5,
                          transform: 'translateY(-3px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': {
                        transform: 'translateY(0px)',
                      },
                      '50%': {
                        transform: 'translateY(-20px)',
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                    alt="VitaCare Platform"
                    sx={{
                      width: '100%',
                      borderRadius: 4,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                      position: 'relative',
                      zIndex: 1,
                      border: '4px solid rgba(255,255,255,0.3)',
                    }}
                  />
                  {/* Glowing effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 4,
                      background: 'linear-gradient(45deg, rgba(255,153,51,0.3), rgba(19,84,122,0.3))',
                      filter: 'blur(20px)',
                      zIndex: 0,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          opacity: 0.5,
                        },
                        '50%': {
                          opacity: 0.8,
                        },
                      },
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>

        {/* Decorative shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,153,51,0.15)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'rotate 20s linear infinite',
            '@keyframes rotate': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(19,136,8,0.15)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'rotate 15s linear infinite reverse',
          }}
        />

        {/* Scroll Down Indicator */}
        <Box
          onClick={scrollToStats}
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateX(-50%) translateY(0)',
              },
              '40%': {
                transform: 'translateX(-50%) translateY(-10px)',
              },
              '60%': {
                transform: 'translateX(-50%) translateY(-5px)',
              },
            },
            '&:hover': {
              opacity: 0.8,
            },
            transition: 'opacity 0.3s ease',
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#fff',
              fontWeight: 600,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '1px',
            }}
          >
            EXPLORE
          </Typography>
          <KeyboardArrowDown 
            sx={{ 
              fontSize: 40,
              color: '#FF9933',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
            }} 
          />
        </Box>
      </Box>

      {/* Transition Wave */}
      <Box
        sx={{
          position: 'relative',
          height: '100px',
          overflow: 'hidden',
          mt: -6,
          background: 'linear-gradient(180deg, rgba(22, 65, 148, 1) 0%, rgba(253, 251, 251, 1) 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 120\'%3E%3Cpath fill=\'%23fdfbfb\' fill-opacity=\'1\' d=\'M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z\'%3E%3C/path%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            animation: 'wave 15s ease-in-out infinite',
            '@keyframes wave': {
              '0%, 100%': {
                transform: 'translateX(0)',
              },
              '50%': {
                transform: 'translateX(-25%)',
              },
            },
          }}
        />
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6, mt: -6 }} id="stats-section">
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Slide direction="up" in timeout={600 + index * 100}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    background: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    borderRadius: 3,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #FF9933 0%, #164194 50%, #138808 100%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.5s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 16px 56px rgba(22, 65, 148, 0.3)',
                      '&::before': {
                        transform: 'translateX(0)',
                      },
                    },
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #164194 0%, #13547a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #164194 0%, #13547a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Choose VitaCare?
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Comprehensive healthcare services at your fingertips
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Zoom in timeout={800 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '2px solid rgba(22, 65, 148, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(22, 65, 148, 0.1), transparent)',
                      transition: 'left 0.5s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 16px 56px rgba(22, 65, 148, 0.25)',
                      borderColor: '#164194',
                      '&::before': {
                        left: '100%',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: feature.color,
                        transition: 'all 0.3s ease',
                        '.MuiCard-root:hover &': {
                          transform: 'rotate(360deg) scale(1.1)',
                        },
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        color: '#333',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Transition Wave - Top */}
      <Box
        sx={{
          position: 'relative',
          height: '100px',
          overflow: 'hidden',
          mt: 8,
          background: 'linear-gradient(180deg, rgba(253, 251, 251, 1) 0%, rgba(22, 65, 148, 1) 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 120\'%3E%3Cpath fill=\'%23164194\' fill-opacity=\'1\' d=\'M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z\'%3E%3C/path%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            animation: 'wave 15s ease-in-out infinite reverse',
            '@keyframes wave': {
              '0%, 100%': {
                transform: 'translateX(0)',
              },
              '50%': {
                transform: 'translateX(25%)',
              },
            },
          }}
        />
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: 8,
          mt: 0,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(22, 65, 148, 0.98) 0%, rgba(19, 84, 122, 0.98) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: '#ffffff',
                  textShadow: '3px 3px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5,
                  color: '#ffffff',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                }}
              >
                Join millions of Indians managing their healthcare with VitaCare
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<PersonAdd />}
                  sx={{
                    background: '#FF9933',
                    color: '#fff',
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    '&:hover': {
                      background: '#e68a2e',
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Create Account
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/role-selection')}
                  startIcon={<Login />}
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: '#fff',
                      background: 'rgba(255,255,255,0.2)',
                      borderWidth: 2,
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #164194 0%, #0a1929 100%)',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospital sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  VitaCare
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                India's Unified National Healthcare Platform - Making healthcare accessible to all.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/role-selection')}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/register')}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Register
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  About Us
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Contact
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone />
                  <Typography variant="body2">1800-XXX-XXXX</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email />
                  <Typography variant="body2">support@vitacare.gov.in</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn />
                  <Typography variant="body2">New Delhi, India</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 VitaCare - Ministry of Health & Family Welfare, Government of India. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
