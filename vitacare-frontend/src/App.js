import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { loadUser } from './redux/slices/authSlice';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';

// Components
import Header from './components/common/Header';
import Loader from './components/common/Loader';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  if (loading) {
    return <Loader />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Header />}
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
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

          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
          
          {/* 404 Route */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
