import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Get all medical records
export const getMedicalRecords = createAsyncThunk(
  'records/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/records', { params: filters });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get single record
export const getMedicalRecord = createAsyncThunk(
  'records/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/records/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Upload medical record
export const uploadMedicalRecord = createAsyncThunk(
  'records/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Medical record uploaded successfully!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    records: [],
    currentRecord: null,
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMedicalRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMedicalRecord.fulfilled, (state, action) => {
        state.currentRecord = action.payload;
      })
      .addCase(uploadMedicalRecord.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadMedicalRecord.fulfilled, (state, action) => {
        state.uploading = false;
        state.records.unshift(action.payload);
      })
      .addCase(uploadMedicalRecord.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRecord } = recordsSlice.actions;
export default recordsSlice.reducer;
