# 🏥 VitaCare Patient Registration System

## ✨ What's New

A comprehensive patient registration system has been implemented with **time-slot restrictions** and **complete patient information capture**.

## 🎯 Key Features

### ⏰ Time-Restricted Registration
- **Registration Window**: 5:30 PM - 7:30 PM ONLY
- Real-time validation on both frontend and backend
- Auto-disable/enable based on current time
- User-friendly alerts showing registration status

### 📝 Comprehensive Patient Data Collection

**Personal Information**
- Aadhaar Number (12-digit unique ID)
- Full Name (First & Last)
- Phone Number (10-digit)
- Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Email (optional)
- Password (secure)

**Address Details**
- Complete address with line 1, line 2, city, state, pincode
- 6-digit pincode validation

**Emergency Contact**
- Contact person name
- Relationship to patient
- Emergency mobile number (10-digit)

### 🔒 Security & Validation

**Frontend Validations**
- Required field checks
- Format validations (Aadhaar, mobile, pincode)
- Real-time form validation
- Blood group dropdown selection

**Backend Validations**
- Time slot enforcement (403 error if outside hours)
- Comprehensive field validation
- Duplicate prevention (Aadhaar, mobile, email)
- Password strength requirements
- Indian mobile number format validation

**Security Features**
- Password hashing (bcrypt with 12 rounds)
- JWT authentication
- Refresh token support
- Auto-generated unique Health ID

### 🌍 Multi-Language Support
- English
- Hindi (हिन्दी)
- Seamless language switching

## 📂 Implementation Details

### Files Created/Modified

**Frontend** (vitacare-frontend)
- ✏️ `src/pages/Register.jsx` - Enhanced registration form
- ✏️ `src/i18n/locales/en.json` - English translations
- ✏️ `src/i18n/locales/hi.json` - Hindi translations

**Backend** (vitacare-backend)
- ✏️ `src/controllers/authController.js` - Registration logic with time validation
- ✏️ `src/routes/authRoutes.js` - Updated routes
- ✨ `src/middleware/registrationValidation.js` - Comprehensive validation rules

**Documentation**
- ✨ `PATIENT-REGISTRATION.md` - Complete feature guide
- ✨ `REGISTRATION-IMPLEMENTATION.md` - Implementation summary
- ✨ `REGISTRATION-TESTING.md` - Testing guide
- ✨ `REGISTRATION-QUICK-REF.md` - Quick reference card

**Test Data**
- ✨ `test-data/sample-patient.json` - Sample test patient
- ✨ `test-data/test-patients.json` - Multiple test scenarios

## 🚀 How to Use

### For Patients

1. **Access Registration Page**
   - Open browser: `http://localhost:3000/register`
   - Can only register between 5:30 PM - 7:30 PM

2. **Fill Registration Form**
   - Enter all personal information
   - Provide complete address
   - Add emergency contact details
   - Create a strong password

3. **Submit & Login**
   - Click "Register Patient"
   - Automatically logged in on success
   - Redirected to dashboard

### For Developers

1. **Start Backend Server**
   ```powershell
   cd vitacare-backend
   npm install
   npm start
   ```

2. **Start Frontend Server**
   ```powershell
   cd vitacare-frontend
   npm install
   npm start
   ```

3. **Or Use Quick Start**
   ```powershell
   .\start-all.ps1
   ```

## 📊 API Reference

### Register Patient
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "aadhaarNumber": "123456789012",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "bloodGroup": "O+",
  "address": {
    "line1": "123 Main Street",
    "line2": "Near Hospital",
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
      "email": "john@example.com",
      "role": "citizen",
      "profile": {...},
      "emergencyContacts": [...]
    },
    "token": "...",
    "refreshToken": "..."
  }
}
```

**Error Responses:**

*Time Restriction (403):*
```json
{
  "success": false,
  "message": "Patient registration is only allowed between 5:30 PM and 7:30 PM",
  "registrationHours": "5:30 PM - 7:30 PM"
}
```

*Duplicate User (400):*
```json
{
  "success": false,
  "message": "User already exists with provided mobile, email or Aadhaar"
}
```

*Validation Error (400):*
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

## 🧪 Testing

### Quick Test with Sample Data
```bash
# During registration hours (5:30 PM - 7:30 PM)
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d @test-data/sample-patient.json
```

### Test Scenarios
1. ✅ Valid registration during hours
2. ❌ Registration outside hours
3. ❌ Invalid Aadhaar (not 12 digits)
4. ❌ Invalid mobile (not 10 digits)
5. ❌ Missing required fields
6. ❌ Duplicate registration
7. ✅ Language switching
8. ✅ Responsive design

See `REGISTRATION-TESTING.md` for detailed test cases.

## 📋 Validation Rules

| Field | Rule |
|-------|------|
| Aadhaar | Exactly 12 digits, numeric |
| Mobile | Exactly 10 digits, starts with 6-9 |
| Email | Valid format (optional) |
| Password | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| Blood Group | A+, A-, B+, B-, AB+, AB-, O+, O- |
| Pincode | Exactly 6 digits |
| First/Last Name | 2-50 characters |
| Address Line 1 | 5-200 characters |
| City/State | 2-100 characters |

## 💡 User Experience

### During Registration Hours (5:30 PM - 7:30 PM)
✅ Form is fully enabled  
✅ Blue info banner: "Registration is open"  
✅ All fields can be edited  
✅ Submit button active  

### Outside Registration Hours
❌ Form is disabled  
❌ Red error banner with time message  
❌ All fields are read-only  
❌ Submit button disabled  

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Token Management**: JWT + Refresh tokens
- **Duplicate Prevention**: Checks Aadhaar, mobile, email
- **Input Validation**: Frontend + Backend
- **SQL Injection**: Prevented via Mongoose ODM
- **XSS Protection**: Input sanitization

## 📱 Responsive Design

- ✅ Mobile-friendly layout
- ✅ Material-UI components
- ✅ Touch-optimized controls
- ✅ Clear visual hierarchy
- ✅ Accessibility support

## 🌟 What Happens After Registration?

1. **Health ID Generated**: Unique ID in format `VH{timestamp}{random}`
2. **Password Hashed**: Securely stored with bcrypt
3. **Profile Created**: Complete patient profile in database
4. **Tokens Issued**: JWT access token + refresh token
5. **Auto Login**: User automatically logged in
6. **Dashboard Redirect**: Taken to personalized dashboard

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `PATIENT-REGISTRATION.md` | Complete feature documentation |
| `REGISTRATION-IMPLEMENTATION.md` | Technical implementation details |
| `REGISTRATION-TESTING.md` | Testing guide with examples |
| `REGISTRATION-QUICK-REF.md` | Quick reference card |

## 🎨 Screenshots Flow

1. **Registration Page** - Shows form with all fields
2. **Time Alert** - Red banner when outside hours
3. **Form Validation** - Inline validation messages
4. **Success** - Redirect to dashboard
5. **Language Toggle** - Hindi/English switch

## 🔧 Configuration

### Environment Variables
Ensure these are set in `vitacare-backend/.env`:
```env
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
MONGODB_URI=mongodb://localhost:27017/vitacare
```

### Registration Hours
Currently hardcoded as 5:30 PM - 7:30 PM.  
Location in code:
- Frontend: `Register.jsx` line ~60
- Backend: `authController.js` line ~30

## 🚦 Status

✅ **COMPLETE & READY FOR TESTING**

- All features implemented
- Frontend & backend integrated
- Validation rules in place
- Documentation complete
- Test data provided
- Multi-language support active

## 📞 Support

For issues or questions:
1. Check documentation in project root
2. Review test data in `test-data/` folder
3. Check server logs for errors
4. Verify MongoDB connection
5. Confirm time is within registration hours

## 🎯 Next Steps (Optional Enhancements)

1. OTP verification for mobile number
2. Email verification
3. Aadhaar API integration for verification
4. Geolocation-based address auto-fill
5. Profile photo upload during registration
6. Terms & conditions acceptance
7. Admin dashboard for registration management
8. Configurable registration time slots
9. SMS notifications
10. Registration analytics

---

**Version**: 1.0  
**Implementation Date**: October 23, 2025  
**Status**: ✅ Production Ready  
**Developer**: VitaCare Development Team  

---

## 📄 License
Part of VitaCare Healthcare Management System
