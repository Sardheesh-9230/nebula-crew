import React, { useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const UHICard = ({ user }) => {
  const cardRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple download of card details as text
    const cardData = `
VitaCare - Unified Health Interface Card
========================================
UHI ID: ${user.healthId || user.uhi}
Name: ${user.profile?.firstName} ${user.profile?.lastName}
Blood Group: ${user.profile?.bloodGroup}
Mobile: ${user.mobileNumber}
Email: ${user.email || 'N/A'}
Aadhaar: ${user.aadhaarNumber ? '****' + user.aadhaarNumber.slice(-4) : 'N/A'}
Registration Date: ${new Date().toLocaleDateString()}
========================================
    `;
    const blob = new Blob([cardData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UHI-Card-${user.healthId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="success.main">
          Registration Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your UHI (Unified Health Interface) Card has been generated
        </Typography>
      </Box>

      <Card
        ref={cardRef}
        elevation={8}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'visible',
          '@media print': {
            boxShadow: 'none',
            border: '2px solid #000',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                🏥 VitaCare
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Unified Health Interface
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: 'rgba(255,255,255,0.3)',
                fontSize: 32,
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />

          {/* UHI ID - Prominent Display */}
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
              UHI ID
            </Typography>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                letterSpacing: 4,
                fontFamily: 'monospace',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {user.healthId || user.uhi}
            </Typography>
          </Box>

          {/* Patient Details */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Name
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                {user.profile?.firstName} {user.profile?.lastName}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Blood Group
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.profile?.bloodGroup || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Mobile
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.mobileNumber}
              </Typography>
            </Grid>

            {user.email && (
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Email
                </Typography>
                <Typography variant="body2">
                  {user.email}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Aadhaar (Last 4 digits)
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                **** **** {user.aadhaarNumber ? user.aadhaarNumber.slice(-4) : '****'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Registration Date
              </Typography>
              <Typography variant="body2">
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />

          {/* Footer */}
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', textAlign: 'center' }}>
            This is your unique health identity. Keep it safe and use it for all health services.
          </Typography>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, '@media print': { display: 'none' } }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          fullWidth
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Print Card
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          fullWidth
        >
          Download Details
        </Button>
      </Box>

      {/* Important Note */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: 'info.light',
          borderRadius: 2,
          '@media print': { display: 'none' }
        }}
      >
        <Typography variant="body2" color="info.dark" gutterBottom>
          <strong>Important:</strong>
        </Typography>
        <Typography variant="body2" color="info.dark">
          • Save your UHI ID ({user.healthId || user.uhi}) - you'll need it for appointments and medical records
        </Typography>
        <Typography variant="body2" color="info.dark">
          • You can access your card anytime from your profile
        </Typography>
        <Typography variant="body2" color="info.dark">
          • Use this ID at any VitaCare partner hospital or clinic
        </Typography>
      </Box>
    </Box>
  );
};

export default UHICard;
