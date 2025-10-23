# VitaCare Backend API

Backend API server for VitaCare - Unified National Healthcare Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
- Set your MongoDB URI
- Set JWT secrets
- Configure other API keys as needed

4. Start the server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📁 Project Structure

```
src/
├── config/         # Configuration files (database, etc.)
├── controllers/    # Route controllers
├── models/         # MongoDB models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── services/       # Business logic services
├── utils/          # Utility functions
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/emergency-contact` - Add emergency contact
- `DELETE /api/v1/users/emergency-contact/:id` - Remove emergency contact

### Medical Records
- `GET /api/v1/records` - Get all medical records
- `GET /api/v1/records/:id` - Get single record
- `POST /api/v1/records` - Create medical record (Doctor/Hospital)
- `PUT /api/v1/records/:id` - Update medical record (Doctor/Hospital)
- `POST /api/v1/records/consent` - Grant access to record
- `DELETE /api/v1/records/consent/:userId` - Revoke access

### Appointments
- `GET /api/v1/appointments` - Get user appointments
- `GET /api/v1/appointments/:id` - Get single appointment
- `POST /api/v1/appointments` - Book new appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment
- `GET /api/v1/appointments/doctor/:doctorId/slots` - Get available slots

## 🔒 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Environment Variables

Required environment variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d
ENCRYPTION_KEY=your_encryption_key
```

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation
- Error handling

## 📄 License

MIT License

## 👥 Team

VitaCare Development Team
