import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Get all appointments
export const getAppointments = createAsyncThunk(
  'appointments/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching appointments with filters:', filters);
      const response = await api.get('/appointments', { params: filters });
      console.log('Redux: Appointments fetched successfully:', response.data);
      console.log('Redux: Total appointments:', response.data.data?.length);
      return response.data.data;
    } catch (error) {
      console.error('Redux: Failed to fetch appointments:', error.response?.data);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Book appointment
export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (appointmentData, { rejectWithValue }) => {
    try {
      console.log('Redux: Booking appointment with data:', appointmentData);
      const response = await api.post('/appointments', appointmentData);
      console.log('Redux: Appointment booked successfully:', response.data);
      toast.success('Appointment booked successfully!');
      return response.data.data;
    } catch (error) {
      console.error('Redux: Booking failed:', error.response?.data);
      const message = error.response?.data?.message || 'Booking failed';
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
      });
  },
});

export default appointmentsSlice.reducer;
