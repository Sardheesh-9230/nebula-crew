import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import recordsReducer from './slices/recordsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    records: recordsReducer,
    appointments: appointmentsReducer,
    admin: adminReducer,
  },
});

export default store;
