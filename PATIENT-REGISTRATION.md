# Patient Registration Guide

## Overview
The VitaCare patient registration system allows new patients to register with comprehensive details during specified time slots only.

## Registration Time Window
**Registration is ONLY available between 5:30 PM - 7:30 PM (IST)**

- If a user tries to register outside this time window, they will see an error message
- The registration form will be disabled outside these hours
- Both frontend and backend enforce this time restriction

## Required Information

### 1. Personal Information
- **Aadhaar Number** (12 digits) - Unique identification
- **First Name** - Patient's first name
- **Last Name** - Patient's last name
- **Mobile Number** (10 digits) - Primary contact
- **Blood Group** - Select from: A+, A-, B+, B-, AB+, AB-, O+, O-
- **Email** (Optional) - Email address
- **Password** - Account password

### 2. Address Information
- **Address Line 1** - House/Building number, Street name
- **Address Line 2** (Optional) - Locality, Landmark
- **City** - City name
- **State** - State name
- **Pincode** (6 digits) - Postal code

### 3. Emergency Contact
- **Contact Name** - Full name of emergency contact
- **Relationship** - Relationship to patient (e.g., Father, Mother, Spouse, Sibling)
- **Contact Mobile** (10 digits) - Emergency contact phone number

## Features

### Time-Based Access Control
- Real-time validation of registration hours
- Automatic form disable/enable based on current time
- Visual alerts showing registration status
- Time check updates every minute

### Frontend Validations
- Aadhaar number: Exactly 12 digits
- Mobile numbers: Exactly 10 digits
- Pincode: Exactly 6 digits
- Email: Valid email format
- Blood group: Dropdown selection
- All required fields must be filled

### Backend Validations
- Time window enforcement (5:30 PM - 7:30 PM)
- Duplicate check for Aadhaar, mobile, and email
- All required fields validation
- Automatic Health ID generation

### Security
- Password hashing with bcrypt (12 salt rounds)
- JWT token generation for authentication
- Refresh token support
- Secure session management

## Generated Data

Upon successful registration, the system automatically creates:
1. **Health ID** - Unique identifier in format: `VH{timestamp}{random}`
2. **JWT Token** - For authentication
3. **Refresh Token** - For session renewal

## User Experience

### During Registration Hours (5:30 PM - 7:30 PM)
- Form is fully accessible
- Blue info alert shows: "Registration is open (5:30 PM - 7:30 PM)"
- Submit button is enabled
- All fields can be filled

### Outside Registration Hours
- Form is disabled
- Red error alert shows time restriction message
- Submit button is disabled
- Message guides user to return during valid hours

## API Endpoint

### Register Patient
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "aadhaarNumber": "123456789012",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNumber": "9876543210",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "bloodGroup": "O+",
  "address": {
    "line1": "123 Main Street",
    "line2": "Near City Hospital",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "mobile": "9876543211"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "user": {
      "id": "...",
      "healthId": "VH...",
      "mobileNumber": "9876543210",
      "email": "john.doe@example.com",
      "role": "citizen",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "bloodGroup": "O+",
        "address": {...}
      },
      "emergencyContacts": [...]
    },
    "token": "...",
    "refreshToken": "..."
  }
}
```

**Error Response (403) - Outside Registration Hours:**
```json
{
  "success": false,
  "message": "Patient registration is only allowed between 5:30 PM and 7:30 PM",
  "registrationHours": "5:30 PM - 7:30 PM"
}
```

**Error Response (400) - Duplicate User:**
```json
{
  "success": false,
  "message": "User already exists with provided mobile, email or Aadhaar"
}
```

## Database Schema

The patient data is stored in the User model with the following structure:

```javascript
{
  healthId: String,           // Auto-generated unique ID
  aadhaarNumber: String,      // 12-digit Aadhaar
  mobileNumber: String,       // 10-digit mobile
  email: String,              // Email (optional)
  password: String,           // Hashed password
  role: String,               // Default: 'citizen'
  profile: {
    firstName: String,
    lastName: String,
    bloodGroup: String,       // A+, A-, B+, B-, AB+, AB-, O+, O-
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: String         // Default: 'India'
    }
  },
  emergencyContacts: [{
    name: String,
    relationship: String,
    mobile: String
  }],
  isActive: Boolean,          // Default: true
  isVerified: Boolean,        // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

## Multi-language Support

The registration form supports both English and Hindi languages:
- All labels and messages are translated
- Language can be switched using the language selector
- Translations maintained in `en.json` and `hi.json`

## Testing the Feature

### Test Scenario 1: Registration During Valid Hours
1. Access the registration page between 5:30 PM - 7:30 PM
2. Fill all required fields with valid data
3. Submit the form
4. Verify successful registration and redirect to dashboard

### Test Scenario 2: Registration Outside Valid Hours
1. Access the registration page outside 5:30 PM - 7:30 PM
2. Observe that form fields are disabled
3. Note the error alert message
4. Verify submit button is disabled

### Test Scenario 3: Validation Errors
1. Try submitting with missing required fields
2. Try invalid Aadhaar number (not 12 digits)
3. Try invalid mobile number (not 10 digits)
4. Try invalid pincode (not 6 digits)
5. Verify appropriate validation messages

### Test Scenario 4: Duplicate Registration
1. Register with a unique Aadhaar, mobile, and email
2. Try registering again with the same details
3. Verify duplicate user error message

## Notes

- The time window is based on server time for backend validation
- Frontend time check uses local browser time
- Ensure server and client times are synchronized for consistent behavior
- All phone numbers are Indian format (10 digits)
- Aadhaar validation is basic length check; additional verification can be added
- Email is optional to accommodate users without email addresses
