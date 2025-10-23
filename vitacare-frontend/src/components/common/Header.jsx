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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          🏥 VitaCare
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
          >
            {t('dashboard')}
          </Button>
          
          <Button
            color="inherit"
            startIcon={<MedicalServices />}
            onClick={() => navigate('/records')}
          >
            {t('medicalRecords')}
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Event />}
            onClick={() => navigate('/appointments')}
          >
            {t('appointments')}
          </Button>

          <IconButton
            color="inherit"
            onClick={handleLangMenu}
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
  );
};

export default Header;
