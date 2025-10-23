import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ReportProblem,
  LocationOn,
  Phone,
  LocalHospital,
  Person,
  Check,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const EmergencySOS = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [sosResponse, setSosResponse] = useState(null);

  const activateSOS = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };
            setLocation(userLocation);

            try {
              // Send SOS to backend
              const response = await api.post('/emergency/sos', {
                location: userLocation,
                emergency_type: 'general'
              });

              setSosResponse(response.data.data);
              setSosActivated(true);
              toast.success('Emergency SOS activated! Help is on the way.');
              setLoading(false);
            } catch (apiError) {
              setError('Failed to send emergency alert. Please call 108 directly.');
              toast.error('Failed to activate SOS');
              setLoading(false);
            }
          },
          (error) => {
            setError('Unable to get your location. Please enable location services.');
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to activate SOS. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSosActivated(false);
      setLocation(null);
      setError(null);
      setSosResponse(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: sosActivated
            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <ReportProblem sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            {sosActivated ? 'SOS Activated!' : 'Emergency SOS'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!sosActivated && !loading && (
          <>
            <Alert
              severity="warning"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '& .MuiAlert-icon': {
                  color: '#f5576c',
                },
              }}
            >
              <Typography variant="body2" color="text.primary">
                <strong>Warning:</strong> This will send your location to emergency contacts and
                nearest hospital. Only use in real emergencies.
              </Typography>
            </Alert>

            <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
              When you activate SOS, we will:
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationOn sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Capture your current location"
                  sx={{ color: 'white' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Person sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Alert your emergency contacts"
                  sx={{ color: 'white' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalHospital sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Notify nearest hospital"
                  sx={{ color: 'white' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Prepare to call ambulance (108)"
                  sx={{ color: 'white' }}
                />
              </ListItem>
            </List>
          </>
        )}

        {loading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              Activating Emergency SOS...
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              Getting your location...
            </Typography>
          </Box>
        )}

        {sosActivated && location && (
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={3}
            >
              <Check
                sx={{
                  fontSize: 80,
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                Help is on the way!
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                Your location has been shared with emergency contacts and nearby hospitals.
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                Your Location:
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Latitude: {location.latitude.toFixed(6)}
                <br />
                Longitude: {location.longitude.toFixed(6)}
                <br />
                Accuracy: ±{location.accuracy.toFixed(0)}m
              </Typography>
            </Box>

            <Alert
              severity="info"
              sx={{
                mt: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Typography variant="body2" color="text.primary">
                <strong>Next steps:</strong> Stay calm. Medical help has been notified. If needed,
                call 108 for ambulance.
              </Typography>
            </Alert>
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {!sosActivated && !loading && (
          <>
            <Button
              onClick={handleClose}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={activateSOS}
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#f5576c',
                fontWeight: 'bold',
                px: 4,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
              startIcon={<ReportProblem />}
            >
              Activate SOS
            </Button>
          </>
        )}

        {sosActivated && (
          <>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#43e97b',
                fontWeight: 'bold',
                px: 4,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Close
            </Button>
            <Button
              href="tel:108"
              variant="contained"
              sx={{
                backgroundColor: '#f5576c',
                color: 'white',
                fontWeight: 'bold',
                px: 4,
                '&:hover': {
                  backgroundColor: '#d94560',
                },
              }}
              startIcon={<Phone />}
            >
              Call 108
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmergencySOS;
