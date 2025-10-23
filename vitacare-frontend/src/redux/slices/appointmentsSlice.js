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
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.appointments.unshift(action.payload);
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (apt) => apt._id !== action.payload
        );
      });
  },
});

export default appointmentsSlice.reducer;
