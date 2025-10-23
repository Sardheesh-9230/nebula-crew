import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  MedicalServices,
  Event,
  Language,
  LocalHospital,
} from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';
import NotificationBell from './NotificationBell';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenu = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    handleLangClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ py: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              flexGrow: 1, 
              cursor: 'pointer' 
            }} 
            onClick={() => navigate('/dashboard')}
          >
            <LocalHospital sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                VitaCare
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.9 }}>
                Ministry of Health & Family Welfare
              </Typography>
            </Box>
          </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ 
              fontWeight: 600, 
              textTransform: 'none',
              '&:hover': { background: 'rgba(255,255,255,0.15)' }
            }}
          >
            {t('dashboard')}
          </Button>
          
          <Button
            color="inherit"
            startIcon={<MedicalServices />}
            onClick={() => navigate('/records')}
            sx={{ 
              fontWeight: 600, 
              textTransform: 'none',
              '&:hover': { background: 'rgba(255,255,255,0.15)' }
            }}
          >
            {t('medicalRecords')}
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Event />}
            onClick={() => navigate('/appointments')}
            sx={{ 
              fontWeight: 600, 
              textTransform: 'none',
              '&:hover': { background: 'rgba(255,255,255,0.15)' }
            }}
          >
            {t('appointments')}
          </Button>

          <IconButton
            color="inherit"
            onClick={handleLangMenu}
            sx={{ '&:hover': { background: 'rgba(255,255,255,0.15)' } }}
          >
            <Language />
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLangClose}
          >
            <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
            <MenuItem onClick={() => changeLanguage('hi')}>हिन्दी</MenuItem>
          </Menu>

          <NotificationBell />

          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
            sx={{ '&:hover': { background: 'rgba(255,255,255,0.15)' } }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              {t('profile')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
    {/* Government Tricolor Stripe */}
    <Box
      sx={{
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)',
        height: '4px',
      }}
    />
    </>
  );
};

export default Header;
