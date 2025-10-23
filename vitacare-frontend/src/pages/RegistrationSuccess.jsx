import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Button } from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import UHICard from '../components/common/UHICard';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  // Redirect to register if no user data
  React.useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <UHICard user={user} />
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ px: 4 }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationSuccess;
