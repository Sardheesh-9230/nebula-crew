# Multi-Role Authentication System

## Overview
VitaCare now supports **separate login credentials and dashboards** for four different user roles:

1. **Patient** - Citizens using the healthcare system
2. **Doctor** - Medical practitioners
3. **State Health Officer** - State-level health officials
4. **Regional Health Officer** - District/regional health officials

---

## Database Models

### 1. User (Patient) Model
**Collection**: `users`
- Authentication: Mobile Number OR UHI (Universal Health ID)
- Password: Bcrypt hashed
- Role: `citizen`

### 2. Doctor Model
**Collection**: `doctors`
- Authentication: Email OR User ID
- Password: Bcrypt hashed
- Role: `doctor`
- Unique Fields: `registrationNumber`, `userId`, `email`

### 3. State Health Officer Model
**Collection**: `statehealthofficers`
- Authentication: Email OR User ID
- Password: Bcrypt hashed
- Role: `state-officer`
- Unique Fields: `employeeId`, `userId`, `email`
- Jurisdiction: State + Districts

### 4. Regional Health Officer Model
**Collection**: `regionalhealthofficers`
- Authentication: Email OR User ID
- Password: Bcrypt hashed
- Role: `regional-officer`
- Unique Fields: `employeeId`, `userId`, `email`
- Jurisdiction: Region + Districts + State

---

## API Endpoints

### Patient Authentication
```
POST /api/v1/auth/register          - Register new patient
POST /api/v1/auth/login             - Login patient (mobile/UHI)
GET  /api/v1/auth/me                - Get patient profile
POST /api/v1/auth/logout            - Logout patient
POST /api/v1/auth/refresh-token     - Refresh access token
```

### Doctor Authentication
```
POST /api/v1/auth/doctor/register          - Register new doctor
POST /api/v1/auth/doctor/login             - Login doctor (email/userId)
GET  /api/v1/auth/doctor/me                - Get doctor profile
POST /api/v1/auth/doctor/logout            - Logout doctor
POST /api/v1/auth/doctor/refresh-token     - Refresh access token
```

### State Health Officer Authentication
```
POST /api/v1/auth/state-officer/register          - Register new state officer
POST /api/v1/auth/state-officer/login             - Login state officer (email/userId)
GET  /api/v1/auth/state-officer/me                - Get state officer profile
POST /api/v1/auth/state-officer/logout            - Logout state officer
POST /api/v1/auth/state-officer/refresh-token     - Refresh access token
```

### Regional Health Officer Authentication
```
POST /api/v1/auth/regional-officer/register          - Register new regional officer
POST /api/v1/auth/regional-officer/login             - Login regional officer (email/userId)
GET  /api/v1/auth/regional-officer/me                - Get regional officer profile
POST /api/v1/auth/regional-officer/logout            - Logout regional officer
POST /api/v1/auth/regional-officer/refresh-token     - Refresh access token
```

---

## Test Credentials

### Create Test Users

Use these scripts to create test accounts for each role:

#### 1. Create Test Patient
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "mobileNumber": "9876543210",
    "email": "john.doe@example.com",
    "password": "patient123",
    "aadhaarNumber": "123456789012",
    "bloodGroup": "O+",
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "mobile": "9876543211"
    }
  }'
```

**Login Credentials:**
- Mobile: `9876543210` OR UHI: `JOHN1234` (generated automatically)
- Password: `patient123`
- Dashboard: `/dashboard`

---

#### 2. Create Test Doctor
```bash
curl -X POST http://localhost:5000/api/v1/auth/doctor/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "DOC001",
    "email": "dr.smith@vitacare.com",
    "password": "doctor123",
    "firstName": "Sarah",
    "lastName": "Smith",
    "mobileNumber": "9876543220",
    "registrationNumber": "MED123456",
    "specialization": ["Cardiology", "Internal Medicine"],
    "qualifications": [
      {
        "degree": "MBBS",
        "institution": "AIIMS Delhi",
        "year": 2015
      },
      {
        "degree": "MD",
        "institution": "AIIMS Delhi",
        "year": 2018
      }
    ],
    "experience": 7
  }'
```

**Login Credentials:**
- Email: `dr.smith@vitacare.com` OR User ID: `DOC001`
- Password: `doctor123`
- Dashboard: `/doctor/dashboard`

---

#### 3. Create Test State Health Officer
```bash
curl -X POST http://localhost:5000/api/v1/auth/state-officer/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "SHO001",
    "email": "stateofficer@gov.in",
    "password": "state123",
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "mobileNumber": "9876543230",
    "employeeId": "EMP-SHO-001",
    "designation": "State Health Officer",
    "state": "Maharashtra",
    "districts": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"]
  }'
```

**Login Credentials:**
- Email: `stateofficer@gov.in` OR User ID: `SHO001`
- Password: `state123`
- Dashboard: `/state-officer/dashboard`

---

#### 4. Create Test Regional Health Officer
```bash
curl -X POST http://localhost:5000/api/v1/auth/regional-officer/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "RHO001",
    "email": "regionalofficer@gov.in",
    "password": "regional123",
    "firstName": "Priya",
    "lastName": "Sharma",
    "mobileNumber": "9876543240",
    "employeeId": "EMP-RHO-001",
    "designation": "Regional Health Officer",
    "region": "Western Maharashtra",
    "districts": ["Pune", "Satara", "Kolhapur"],
    "state": "Maharashtra"
  }'
```

**Login Credentials:**
- Email: `regionalofficer@gov.in` OR User ID: `RHO001`
- Password: `regional123`
- Dashboard: `/regional-officer/dashboard`

---

## Frontend Login Flow

### Role Selection
Users select their role on the login page:
- 👤 Patient
- 🩺 Doctor
- 🏛️ State Officer
- 📊 Regional Officer

### Login Input Fields by Role

#### Patient
- **Option 1**: Mobile Number (10 digits)
- **Option 2**: UHI (Universal Health ID) - Format: `FIRSTNAME1234`
- Password

#### Doctor
- Email (`dr.smith@vitacare.com`) OR User ID (`DOC001`)
- Password

#### State Health Officer
- Email (`stateofficer@gov.in`) OR User ID (`SHO001`)
- Password

#### Regional Health Officer
- Email (`regionalofficer@gov.in`) OR User ID (`RHO001`)
- Password

---

## Dashboard Routes

| Role | Dashboard Route | Component |
|------|----------------|-----------|
| Patient | `/dashboard` | `Dashboard.jsx` |
| Doctor | `/doctor/dashboard` | `EnhancedDoctorDashboard.jsx` |
| State Officer | `/state-officer/dashboard` | `StateOfficerDashboard.jsx` |
| Regional Officer | `/regional-officer/dashboard` | `RegionalOfficerDashboard.jsx` |

---

## Security Features

### Password Hashing
All passwords are hashed using **bcrypt** with salt rounds of 12 before storage.

### JWT Tokens
- **Access Token**: 30 days expiry (configurable via `JWT_EXPIRE`)
- **Refresh Token**: 90 days expiry (configurable via `JWT_REFRESH_EXPIRE`)
- Tokens include `role` claim for role-based authorization

### Role-Based Access Control
- Each model has `isActive` flag
- Separate authentication endpoints prevent role mixing
- JWT tokens include role information
- Frontend routes are protected based on user role

---

## Testing Checklist

- [ ] Register a patient account
- [ ] Login as patient using mobile number
- [ ] Login as patient using UHI
- [ ] Navigate to patient dashboard
- [ ] Register a doctor account
- [ ] Login as doctor using email
- [ ] Login as doctor using user ID
- [ ] Navigate to doctor dashboard
- [ ] Register a state health officer account
- [ ] Login as state officer using email
- [ ] Login as state officer using user ID
- [ ] Navigate to state officer dashboard
- [ ] Register a regional health officer account
- [ ] Login as regional officer using email
- [ ] Login as regional officer using user ID
- [ ] Navigate to regional officer dashboard
- [ ] Test logout functionality for all roles
- [ ] Test token refresh for all roles

---

## Quick Test Commands

### Patient Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber": "9876543210", "password": "patient123"}'
```

### Doctor Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/doctor/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.smith@vitacare.com", "password": "doctor123"}'
```

### State Officer Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/state-officer/login \
  -H "Content-Type: application/json" \
  -d '{"email": "stateofficer@gov.in", "password": "state123"}'
```

### Regional Officer Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/regional-officer/login \
  -H "Content-Type: application/json" \
  -d '{"email": "regionalofficer@gov.in", "password": "regional123"}'
```

---

## Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRE=90d
```

---

## Next Steps

1. **Start Backend Server**:
   ```bash
   cd vitacare-backend
   npm start
   ```

2. **Create Test Accounts** using the curl commands above

3. **Start Frontend Server**:
   ```bash
   cd vitacare-frontend
   npm run dev
   ```

4. **Test Login** at `http://localhost:5173/login`
   - Select role
   - Enter credentials
   - Verify correct dashboard loads

---

## Summary

✅ **Separate Authentication Routes** for each role
✅ **Separate Database Collections** for each role
✅ **Role-Based Dashboard Routing**
✅ **Secure Password Hashing** with bcrypt
✅ **JWT Token Authentication** with refresh tokens
✅ **Enhanced Login UI** with role selection
✅ **Test Credentials** for all roles

🎉 **Your multi-role authentication system is complete!**
