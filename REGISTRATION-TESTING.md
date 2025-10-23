# Patient Registration Testing Guide

## Manual Testing Steps

### Test 1: Successful Registration (During Valid Hours)
**Prerequisites**: Current time is between 5:30 PM - 7:30 PM

1. Navigate to registration page: `http://localhost:3000/register`
2. Verify the info alert shows: "Registration is open (5:30 PM - 7:30 PM)"
3. Fill in the following details:

   **Personal Information:**
   - Aadhaar Number: 123456789012
   - First Name: Rahul
   - Last Name: Sharma
   - Mobile Number: 9876543210
   - Blood Group: B+ (select from dropdown)
   - Email: rahul.sharma@example.com
   - Password: SecurePass123

   **Address Information:**
   - Address Line 1: Plot 45, Sector 12
   - Address Line 2: Near Metro Station
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 400012

   **Emergency Contact:**
   - Contact Name: Priya Sharma
   - Relationship: Wife
   - Contact Mobile: 9876543211

4. Click "Register Patient" button
5. **Expected Result**: 
   - Success toast notification
   - Redirect to dashboard
   - User is logged in automatically

### Test 2: Registration Outside Valid Hours
**Prerequisites**: Current time is NOT between 5:30 PM - 7:30 PM

1. Navigate to registration page: `http://localhost:3000/register`
2. **Expected Result**:
   - Red error alert appears
   - Message shows registration hours
   - All form fields are disabled
   - Submit button is disabled and shows "Registration Closed"

### Test 3: Validation Errors

#### 3.1 Invalid Aadhaar Number
- Enter Aadhaar: 12345 (less than 12 digits)
- Try to submit
- **Expected**: Validation error

#### 3.2 Invalid Mobile Number
- Enter Mobile: 123456789 (9 digits)
- Try to submit
- **Expected**: Validation error

#### 3.3 Invalid Pincode
- Enter Pincode: 12345 (5 digits)
- Try to submit
- **Expected**: Validation error

#### 3.4 Missing Required Fields
- Leave blood group empty
- Try to submit
- **Expected**: Validation error

### Test 4: Duplicate Registration
1. Register successfully with Aadhaar: 111222333444
2. Try to register again with same Aadhaar
3. **Expected Result**: Error message "User already exists with provided mobile, email or Aadhaar"

### Test 5: Language Switching
1. On registration page, switch language to Hindi
2. Verify all labels are in Hindi
3. Switch back to English
4. Verify all labels are in English

---

## API Testing with cURL

### Test 1: Registration During Valid Hours

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "987654321012",
    "firstName": "Amit",
    "lastName": "Patel",
    "mobileNumber": "9123456789",
    "email": "amit.patel@example.com",
    "password": "SecurePass123",
    "bloodGroup": "A+",
    "address": {
      "line1": "123 MG Road",
      "line2": "Opposite Park",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001"
    },
    "emergencyContact": {
      "name": "Neha Patel",
      "relationship": "Sister",
      "mobile": "9123456790"
    }
  }'
```

**Expected Response (201)**:
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "user": {
      "id": "...",
      "healthId": "VH...",
      "mobileNumber": "9123456789",
      "email": "amit.patel@example.com",
      "role": "citizen",
      "profile": {
        "firstName": "Amit",
        "lastName": "Patel",
        "bloodGroup": "A+",
        "address": {...}
      },
      "emergencyContacts": [...]
    },
    "token": "...",
    "refreshToken": "..."
  }
}
```

### Test 2: Registration Outside Valid Hours

Same curl command as above, but run outside 5:30 PM - 7:30 PM.

**Expected Response (403)**:
```json
{
  "success": false,
  "message": "Patient registration is only allowed between 5:30 PM and 7:30 PM",
  "registrationHours": "5:30 PM - 7:30 PM"
}
```

### Test 3: Missing Required Fields

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "987654321012",
    "firstName": "Test",
    "mobileNumber": "9123456789"
  }'
```

**Expected Response (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "lastName",
      "message": "Last name is required"
    },
    {
      "field": "password",
      "message": "Password is required"
    },
    ...
  ]
}
```

### Test 4: Invalid Data Format

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "12345",
    "firstName": "Test",
    "lastName": "User",
    "mobileNumber": "123",
    "password": "weak",
    "bloodGroup": "XYZ",
    "address": {
      "line1": "123",
      "city": "X",
      "state": "Y",
      "pincode": "123"
    },
    "emergencyContact": {
      "name": "E",
      "relationship": "R",
      "mobile": "123"
    }
  }'
```

**Expected Response (400)**: Multiple validation errors

---

## API Testing with Postman

### Setup
1. Create new collection: "VitaCare Patient Registration"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:5000/api/v1`

### Test Case 1: Valid Registration

**Request:**
- Method: POST
- URL: `{{baseUrl}}/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "aadhaarNumber": "555666777888",
  "firstName": "Priya",
  "lastName": "Verma",
  "mobileNumber": "9988776655",
  "email": "priya.verma@example.com",
  "password": "MyPass@2024",
  "bloodGroup": "O-",
  "address": {
    "line1": "456 Lake View Apartments",
    "line2": "Sector 18",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "emergencyContact": {
    "name": "Rajesh Verma",
    "relationship": "Father",
    "mobile": "9988776656"
  }
}
```

**Tests (Postman Scripts):**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Health ID is generated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.user.healthId).to.exist;
    pm.expect(jsonData.data.user.healthId).to.match(/^VH/);
});

pm.test("Token is returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
    pm.environment.set("authToken", jsonData.data.token);
});

pm.test("User profile contains all fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.user.profile.firstName).to.eql("Priya");
    pm.expect(jsonData.data.user.profile.bloodGroup).to.eql("O-");
    pm.expect(jsonData.data.user.emergencyContacts).to.be.an('array');
    pm.expect(jsonData.data.user.emergencyContacts).to.have.lengthOf(1);
});
```

### Test Case 2: Time Restriction

**Pre-request Script:**
```javascript
// Check if current time is outside registration hours
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const currentTime = hours * 60 + minutes;
const startTime = 17 * 60 + 30;
const endTime = 19 * 60 + 30;

pm.environment.set("isRegistrationTime", currentTime >= startTime && currentTime <= endTime);
```

**Tests:**
```javascript
const isRegistrationTime = pm.environment.get("isRegistrationTime");

if (!isRegistrationTime) {
    pm.test("Status code is 403 when outside registration hours", function () {
        pm.response.to.have.status(403);
    });
    
    pm.test("Error message mentions time restriction", function () {
        var jsonData = pm.response.json();
        pm.expect(jsonData.message).to.include("5:30 PM and 7:30 PM");
    });
}
```

---

## Automated Testing Scenarios

### Jest Test Example (Frontend)

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Register from '../pages/Register';
import store from '../redux/store';

describe('Patient Registration', () => {
  test('renders registration form with all fields', () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
    
    expect(screen.getByLabelText(/aadhaar number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/blood group/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/emergency contact/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
```

---

## Database Verification

After successful registration, verify in MongoDB:

```javascript
// Connect to MongoDB
use vitacare;

// Find the registered user
db.users.findOne({ aadhaarNumber: "123456789012" });

// Verify all fields are saved
// Check:
// - healthId is generated
// - password is hashed
// - profile.bloodGroup exists
// - profile.address exists
// - emergencyContacts array has data
```

---

## Performance Testing

### Load Test with Artillery

Create `artillery-test.yml`:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 5
scenarios:
  - name: "Patient Registration"
    flow:
      - post:
          url: "/api/v1/auth/register"
          json:
            aadhaarNumber: "{{ $randomString() }}"
            firstName: "Test"
            lastName: "User"
            mobileNumber: "9{{ $randomNumber() }}"
            password: "TestPass123"
            bloodGroup: "O+"
            address:
              line1: "Test Address"
              city: "Mumbai"
              state: "Maharashtra"
              pincode: "400001"
            emergencyContact:
              name: "Emergency"
              relationship: "Friend"
              mobile: "9123456789"
```

Run: `artillery run artillery-test.yml`

---

## Checklist for QA Team

- [ ] Registration works during valid hours (5:30 PM - 7:30 PM)
- [ ] Registration blocked outside valid hours
- [ ] All required fields are validated
- [ ] Aadhaar validation (12 digits)
- [ ] Mobile validation (10 digits, starts with 6-9)
- [ ] Pincode validation (6 digits)
- [ ] Blood group dropdown works
- [ ] Password strength validation
- [ ] Duplicate Aadhaar detection
- [ ] Duplicate mobile detection
- [ ] Duplicate email detection
- [ ] Emergency contact saved correctly
- [ ] Address saved correctly
- [ ] Health ID auto-generated
- [ ] JWT token returned
- [ ] User redirected to dashboard
- [ ] English translations correct
- [ ] Hindi translations correct
- [ ] Responsive on mobile devices
- [ ] Form fields disabled when registration closed
- [ ] Error messages are user-friendly
- [ ] Success messages displayed

---

**Note**: Make sure both backend and frontend servers are running before testing.
