# Admin System Documentation

## Overview
The VitaCare Admin System allows authorized administrators to manage Doctors, State Health Officers, and Regional Health Officers centrally.

## Backend API Endpoints

### Authentication
- **POST** `/api/v1/auth/admin/register` - Register new admin (super admin only)
- **POST** `/api/v1/auth/admin/login` - Admin login
- **GET** `/api/v1/auth/admin/me` - Get current admin details
- **POST** `/api/v1/auth/admin/logout` - Admin logout

### Doctor Management
- **GET** `/api/v1/admin/doctors` - Get all doctors
- **POST** `/api/v1/admin/doctors` - Register new doctor
- **PUT** `/api/v1/admin/doctors/:id` - Update doctor
- **DELETE** `/api/v1/admin/doctors/:id` - Delete doctor

### State Health Officer Management
- **GET** `/api/v1/admin/state-officers` - Get all state health officers
- **POST** `/api/v1/admin/state-officers` - Register new state officer
- **PUT** `/api/v1/admin/state-officers/:id` - Update state officer
- **DELETE** `/api/v1/admin/state-officers/:id` - Delete state officer

### Regional Health Officer Management
- **GET** `/api/v1/admin/regional-officers` - Get all regional health officers
- **POST** `/api/v1/admin/regional-officers` - Register new regional officer
- **PUT** `/api/v1/admin/regional-officers/:id` - Update regional officer
- **DELETE** `/api/v1/admin/regional-officers/:id` - Delete regional officer

### Statistics
- **GET** `/api/v1/admin/statistics` - Get dashboard statistics

## Frontend Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin management dashboard

## Creating the First Admin

Use this curl command to create the first admin:

```bash
curl -X POST http://localhost:5000/api/v1/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@vitacare.com",
    "password": "admin123",
    "role": "super_admin"
  }'
```

## Admin Dashboard Features

### 1. Statistics Cards
- Total Doctors (with verified/pending counts)
- Total State Health Officers
- Total Regional Health Officers

### 2. Doctor Management
- View all doctors
- Add new doctors with:
  - Name, Email, Password
  - Registration Number
  - Specialization
  - Hospital Name
- Delete doctors
- Auto-verified status for admin-created doctors

### 3. State Health Officer Management
- View all state health officers
- Add new officers with:
  - Name, Email, Password
  - Employee ID
  - State
  - Designation, Department
- Delete officers

### 4. Regional Health Officer Management
- View all regional health officers
- Add new officers with:
  - Name, Email, Password
  - Employee ID
  - Region
  - Designation, Department
- Delete officers

## User Roles Flow

```
Admin
  ├─> Registers Doctors → Doctor Dashboard
  ├─> Registers State Health Officers → SHO Dashboard
  └─> Registers Regional Health Officers → RHO Dashboard
```

## Security Features

- JWT authentication with 30-day expiration
- Bcrypt password hashing (12 salt rounds)
- Auto-verified status for admin-created users
- Protected routes with role-based access
- Separate authentication endpoints

## Usage Example

1. **Login as Admin**:
   - Go to `/admin/login`
   - Enter email: `admin@vitacare.com`
   - Enter password: `admin123`

2. **Add a Doctor**:
   - Click "Doctors" tab
   - Click "Add Doctor" button
   - Fill in details:
     - Name: Dr. John Smith
     - Email: john.smith@hospital.com
     - Password: doctor123
     - Registration No: MCI12345
     - Specialization: Cardiologist
   - Click "Add"

3. **Doctor can now login**:
   - Doctor goes to main login page
   - Selects "Doctor" role (if role selection exists)
   - Or uses doctor-specific login endpoint
   - Uses credentials: john.smith@hospital.com / doctor123
   - Redirected to Enhanced Doctor Dashboard

## Database Models

### Admin Model
- name, email, password (hashed)
- role: admin | super_admin
- permissions object
- isActive status
- lastLogin timestamp

### Doctor Model
- name, email, password, registrationNumber
- specialization, qualifications, experience
- hospitalName, contactNumber
- verificationStatus (auto-set to 'verified')

### StateHealthOfficer Model
- name, email, password, employeeId
- state, designation, department
- contactNumber
- verificationStatus (auto-set to 'verified')

### RegionalHealthOfficer Model
- name, email, password, employeeId
- region, designation, department
- contactNumber
- verificationStatus (auto-set to 'verified')

## Benefits

✅ Centralized user management
✅ Auto-verification of admin-created users
✅ Separate dashboards for each role
✅ Consistent API structure
✅ Role-based access control
✅ Easy to extend with more features
