import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';
import socketService from '../../services/socketService';

// Admin login
export const adminLogin = createAsyncThunk(
  'admin/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      const { admin, token, refreshToken } = response.data.data;
      
      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', 'admin');
      
      // Connect socket
      if (admin._id || admin.id) {
        socketService.connect(admin._id || admin.id, token);
      }
      
      toast.success('Login successful!');
      return admin;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Load admin
export const loadAdmin = createAsyncThunk(
  'admin/loadAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await api.get('/auth/admin/me');
      
      // Connect socket if admin is loaded successfully
      if (response.data.data && token) {
        const adminId = response.data.data.id || response.data.data._id;
        if (adminId) {
          socketService.connect(adminId, token);
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

// Admin logout
export const adminLogout = createAsyncThunk(
  'admin/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/admin/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      socketService.disconnect();
      toast.success('Logged out successfully');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Load admin
      .addCase(loadAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
