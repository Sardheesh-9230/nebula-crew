import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
  Fade,
  Zoom,
  IconButton,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Cake,
  Wc,
  Bloodtype,
  Edit,
  Save,
  Cancel,
  Shield,
  VerifiedUser,
  CreditCard,
  Close,
} from '@mui/icons-material';
import { getProfile, updateProfile } from '../redux/slices/userSlice';
import UHICard from '../components/common/UHICard';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [showUHICard, setShowUHICard] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.profile?.firstName || '',
        lastName: profile.profile?.lastName || '',
        email: profile.email || '',
        dateOfBirth: profile.profile?.dateOfBirth ? profile.profile.dateOfBirth.split('T')[0] : '',
        gender: profile.profile?.gender || '',
        bloodGroup: profile.profile?.bloodGroup || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.profile?.firstName || '',
        lastName: profile.profile?.lastName || '',
        email: profile.email || '',
        dateOfBirth: profile.profile?.dateOfBirth ? profile.profile.dateOfBirth.split('T')[0] : '',
        gender: profile.profile?.gender || '',
        bloodGroup: profile.profile?.bloodGroup || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section with Avatar */}
        <Fade in timeout={800}>
          <Card sx={{
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Zoom in timeout={1000}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '3rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                      border: '4px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    }}
                  >
                    {formData.firstName.charAt(0).toUpperCase()}
                    {formData.lastName.charAt(0).toUpperCase()}
                  </Avatar>
                </Zoom>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {formData.firstName} {formData.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      icon={<Shield sx={{ color: '#fff !important' }} />}
                      label={`UHI: ${user?.healthId || 'Not Available'}`}
                      sx={{ 
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.3) 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        px: 2,
                        py: 3,
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,215,0,0.5)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    />
                    <Chip 
                      icon={<VerifiedUser sx={{ color: '#fff !important' }} />}
                      label="Universal Health Identity"
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                    <Chip 
                      icon={<Phone sx={{ color: '#fff !important' }} />}
                      label={user?.mobileNumber}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                    <Chip 
                      icon={<VerifiedUser sx={{ color: '#43e97b !important' }} />}
                      label="Verified"
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                  </Box>
                </Box>
                {!isEditing && (
                  <IconButton
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#fff',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Edit />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Profile Information Card */}
        <Zoom in timeout={1000}>
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
            },
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Personal Information
                </Typography>
                {isEditing && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{
                        borderColor: '#f5576c',
                        color: '#f5576c',
                        '&:hover': {
                          borderColor: '#f093fb',
                          background: 'rgba(245, 87, 108, 0.1)',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Cake sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gender"
                      name="gender"
                      select
                      SelectProps={{ native: true }}
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Wc sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          },
                        },
                      }}
                    >
                      <option value=""></option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Group"
                      name="bloodGroup"
                      select
                      SelectProps={{ native: true }}
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Bloodtype sx={{ color: '#f5576c' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: isEditing ? '0 4px 12px rgba(245, 87, 108, 0.2)' : 'none',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)',
                          },
                        },
                      }}
                    >
                      <option value=""></option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {/* Emergency Contacts Section */}
        {user?.emergencyContacts && user.emergencyContacts.length > 0 && (
          <Zoom in timeout={1100}>
            <Card sx={{
              mt: 3,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              },
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3,
                  }}
                >
                  Emergency Contacts
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {user.emergencyContacts.map((contact, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card 
                        sx={{ 
                          p: 3, 
                          background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)',
                          border: '2px solid rgba(245, 87, 108, 0.2)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(245, 87, 108, 0.2)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                              width: 56,
                              height: 56,
                            }}
                          >
                            <Person sx={{ fontSize: 32 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="700" color="text.primary">
                              {contact.name}
                            </Typography>
                            <Chip 
                              label={contact.relationship}
                              size="small"
                              sx={{ 
                                background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                                color: '#fff',
                                fontWeight: 600,
                                mt: 0.5,
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ color: '#667eea', fontSize: 20 }} />
                          <Typography variant="body1" fontWeight="600" color="text.secondary">
                            {contact.mobile}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Zoom>
        )}

        {/* View UHI Card Button */}
        <Zoom in timeout={1200}>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CreditCard />}
              onClick={() => setShowUHICard(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View My UHI Card
            </Button>
          </Box>
        </Zoom>

        {/* UHI Card Dialog */}
        <Dialog
          open={showUHICard}
          onClose={() => setShowUHICard(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 1 
          }}>
            <Typography variant="h6" fontWeight="bold">
              Your UHI Card
            </Typography>
            <IconButton onClick={() => setShowUHICard(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <UHICard user={user} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Profile;
