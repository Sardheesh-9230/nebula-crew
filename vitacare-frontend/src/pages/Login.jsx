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
} from '@mui/material';
import { Phone, Badge } from '@mui/icons-material';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.auth);

  const [loginType, setLoginType] = useState('mobile'); // 'mobile' or 'uhi'
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            🏥 VitaCare
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            {t('login')}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={loginType}
              exclusive
              onChange={handleLoginTypeChange}
              aria-label="login type"
              color="primary"
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
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter your Universal Health Identity (UHI) - Format: FIRSTNAME1234
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('login')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? {t('register')}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
