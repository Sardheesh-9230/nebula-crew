import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';
import socketService from '../../services/socketService';

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Sending registration data:', userData);
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      
      // Connect socket with user ID and token
      socketService.connect(response.data.data.user._id, response.data.data.token);
      
      toast.success('Registration successful!');
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      const message = error.response?.data?.message || 'Registration failed';
      
      // Display validation errors if present
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(message);
      }
      
      return rejectWithValue(error.response?.data || message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Determine the endpoint based on role
      const { endpoint, role, ...loginData } = credentials;
      const apiEndpoint = endpoint || '/auth/login';
      
      const response = await api.post(apiEndpoint, loginData);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('userRole', response.data.data.user.role);
      
      // Connect socket with user ID and token
      socketService.connect(response.data.data.user.id || response.data.data.user._id, response.data.data.token);
      
      toast.success('Login successful!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      // Determine the endpoint based on stored role
      const userRole = localStorage.getItem('userRole');
      let endpoint = '/auth/me';
      
      if (userRole === 'doctor') {
        endpoint = '/auth/doctor/me';
      } else if (userRole === 'state-officer') {
        endpoint = '/auth/state-officer/me';
      } else if (userRole === 'regional-officer') {
        endpoint = '/auth/regional-officer/me';
      }
      
      const token = localStorage.getItem('token');
      
      // Only make API call if token exists
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await api.get(endpoint);
      
      // Connect socket if user is loaded successfully
      if (response.data.data && token) {
        const userId = response.data.data.id || response.data.data._id;
        if (userId) {
          socketService.connect(userId, token);
        }
      }
      
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Determine the endpoint based on stored role
      const userRole = localStorage.getItem('userRole');
      let endpoint = '/auth/logout';
      
      if (userRole === 'doctor') {
        endpoint = '/auth/doctor/logout';
      } else if (userRole === 'state-officer') {
        endpoint = '/auth/state-officer/logout';
      } else if (userRole === 'regional-officer') {
        endpoint = '/auth/regional-officer/logout';
      }
      
      await api.post(endpoint);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      
      // Disconnect socket on logout
      socketService.disconnect();
      
      toast.success('Logged out successfully');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      
      // Disconnect socket even if logout API fails
      socketService.disconnect();
      
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: !!localStorage.getItem('token'), // Only loading if there's a token to verify
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
