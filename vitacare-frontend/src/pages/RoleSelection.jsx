import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Fade,
  Zoom,
} from '@mui/material';
import {
  PersonOutline,
  LocalHospital,
  AccountBalance,
  Business,
} from '@mui/icons-material';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Access your medical records, book appointments, and manage your health',
      icon: <PersonOutline sx={{ fontSize: 60 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/login/patient',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage patient records, appointments, and provide consultations',
      icon: <LocalHospital sx={{ fontSize: 60 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/login/doctor',
    },
    {
      id: 'state-officer',
      title: 'State Health Officer',
      description: 'Monitor state-level health metrics and manage healthcare initiatives',
      icon: <AccountBalance sx={{ fontSize: 60 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/login/state-officer',
    },
    {
      id: 'regional-officer',
      title: 'Regional Health Officer',
      description: 'Oversee regional healthcare facilities and coordinate resources',
      icon: <Business sx={{ fontSize: 60 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/login/regional-officer',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
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
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: '#fff',
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              🏥 VitaCare Portal
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
              }}
            >
              Select Your Role to Continue
            </Typography>
          </Box>
        </Fade>

        {/* Role Cards */}
        <Grid container spacing={4}>
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={3} key={role.id}>
              <Zoom in timeout={600 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#fff',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: role.gradient,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(role.route)}
                    sx={{ height: '100%', p: 3 }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          mx: 'auto',
                          mb: 3,
                          background: role.gradient,
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        }}
                      >
                        {role.icon}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          background: role.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {role.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {role.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Unified National Healthcare Platform
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)' }}
            >
              © 2025 VitaCare. All rights reserved.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default RoleSelection;
