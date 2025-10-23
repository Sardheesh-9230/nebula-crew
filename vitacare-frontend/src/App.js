import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, ThemeProvider } from '@mui/material';
import { loadUser } from './redux/slices/authSlice';
import governmentTheme from './theme/governmentTheme';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import NotificationInbox from './pages/NotificationInbox';
import Gamification from './pages/Gamification';
import DoctorDashboard from './pages/DoctorDashboard';
import Telemedicine from './pages/Telemedicine';

// SHO Dashboard Pages
import SHODashboard from './pages/sho/SHODashboard';
import RHODashboard from './pages/sho/RHODashboard';

// Patient Pages
import PatientDiscovery from './pages/patient/PatientDiscovery';

// Components
import Header from './components/common/Header';
import Loader from './components/common/Loader';
import SOSButton from './components/common/SOSButton';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  if (loading) {
    return <Loader />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Role-based Route Component
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  
  if (loading) {
    return <Loader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Try to load user from token on app start
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    } else {
      // If no token, set loading to false immediately
      // This is handled by the authSlice reducer, but we need to ensure it happens
    }
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={governmentTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {isAuthenticated && <Header />}
        {isAuthenticated && <SOSButton />}
        
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: isAuthenticated ? 3 : 0 }}>
        <Routes>
          {/* Landing Page - Public Route */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
          />

          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/registration-success" 
            element={<RegistrationSuccess />} 
          />

          {/* Private Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/records" 
            element={
              <PrivateRoute>
                <MedicalRecords />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/book-appointment" 
            element={
              <PrivateRoute>
                <BookAppointment />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <PrivateRoute>
                <NotificationInbox />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/gamification" 
            element={
              <PrivateRoute>
                <Gamification />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/doctor/dashboard" 
            element={
              <PrivateRoute>
                <DoctorDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/telemedicine" 
            element={
              <PrivateRoute>
                <Telemedicine />
              </PrivateRoute>
            } 
          />
          
          {/* SHO Dashboard Route */}
          <Route 
            path="/sho/dashboard" 
            element={
              <RoleBasedRoute allowedRoles={['sho']}>
                <SHODashboard />
              </RoleBasedRoute>
            } 
          />
          
          {/* RHO Dashboard Route */}
          <Route 
            path="/rho/dashboard" 
            element={
              <RoleBasedRoute allowedRoles={['rho']}>
                <RHODashboard />
              </RoleBasedRoute>
            } 
          />
          
          {/* Patient Discovery Route - Public Access */}
          <Route 
            path="/patient/discover" 
            element={<PatientDiscovery />} 
          />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </Box>
    </Box>
    </ThemeProvider>
  );
}

export default App;
