import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Get all appointments
export const getAppointments = createAsyncThunk(
  'appointments/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/appointments', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch appointments:', error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Book appointment
export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      toast.success('Appointment booked successfully!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      console.error('Appointment booking failed:', message);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Cancel appointment
export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await api.delete(`/appointments/${id}`, { data: { reason } });
      toast.success('Appointment cancelled successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Cancellation failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Approve appointment (Doctor only)
export const approveAppointment = createAsyncThunk(
  'appointments/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/appointments/${id}/approve`);
      toast.success('Appointment approved successfully!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Approval failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reject appointment (Doctor only)
export const rejectAppointment = createAsyncThunk(
  'appointments/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/appointments/${id}/reject`, { reason });
      toast.success('Appointment rejected');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Rejection failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
        state.error = null;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (apt) => apt._id !== action.payload
        );
      })
      .addCase(approveAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(rejectAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export default appointmentsSlice.reducer;
