const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const doctorAuthRoutes = require('./routes/doctorAuthRoutes');
const stateOfficerAuthRoutes = require('./routes/stateOfficerAuthRoutes');
const regionalOfficerAuthRoutes = require('./routes/regionalOfficerAuthRoutes');
const userRoutes = require('./routes/userRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

// SHO Dashboard Routes
const shoRoutes = require('./routes/shoRoutes');
const rhoRoutes = require('./routes/rhoRoutes');
const patientRoutes = require('./routes/patientRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS: Blocked origin:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    console.log('CORS: Allowed origin:', origin);
    return callback(null, true);
  },
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (more lenient in development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests in dev, 100 in production
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VitaCare API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/doctor', doctorAuthRoutes);
app.use('/api/v1/auth/state-officer', stateOfficerAuthRoutes);
app.use('/api/v1/auth/regional-officer', regionalOfficerAuthRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/records', medicalRecordRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/emergency', emergencyRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/doctors', doctorRoutes);

// SHO Dashboard Routes
app.use('/api/v1/sho', shoRoutes);
app.use('/api/v1/rho', rhoRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to VitaCare API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      doctorAuth: '/api/v1/auth/doctor',
      stateOfficerAuth: '/api/v1/auth/state-officer',
      regionalOfficerAuth: '/api/v1/auth/regional-officer',
      users: '/api/v1/users',
      records: '/api/v1/records',
      appointments: '/api/v1/appointments',
      notifications: '/api/v1/notifications',
      emergency: '/api/v1/emergency',
      gamification: '/api/v1/gamification',
      doctors: '/api/v1/doctors',
      sho: '/api/v1/sho',
      rho: '/api/v1/rho',
      patient: '/api/v1/patient',
      analytics: '/api/v1/analytics',
      health: '/health'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
