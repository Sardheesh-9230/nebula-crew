# Patient Registration - Quick Reference

## 🕐 Registration Hours
**ONLY: 5:30 PM - 7:30 PM (IST)**

## 📋 Required Fields

### Personal Info
- ✅ Aadhaar (12 digits)
- ✅ First Name
- ✅ Last Name  
- ✅ Mobile (10 digits)
- ✅ Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- ✅ Password
- ⚪ Email (optional)

### Address
- ✅ Line 1
- ⚪ Line 2 (optional)
- ✅ City
- ✅ State
- ✅ Pincode (6 digits)

### Emergency Contact
- ✅ Name
- ✅ Relationship
- ✅ Mobile (10 digits)

## 🔗 Endpoints

### Register Patient
```
POST /api/v1/auth/register
Content-Type: application/json
```

**Request:**
```json
{
  "aadhaarNumber": "123456789012",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "password": "SecurePass123",
  "bloodGroup": "O+",
  "address": {
    "line1": "123 Street",
    "line2": "Landmark",
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

**Success (201):**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Time Error (403):**
```json
{
  "success": false,
  "message": "Patient registration is only allowed between 5:30 PM and 7:30 PM"
}
```

**Duplicate (400):**
```json
{
  "success": false,
  "message": "User already exists with provided mobile, email or Aadhaar"
}
```

## 📁 Files Changed

### Frontend
- `src/pages/Register.jsx` - Registration form
- `src/i18n/locales/en.json` - English labels
- `src/i18n/locales/hi.json` - Hindi labels

### Backend
- `src/controllers/authController.js` - Registration logic
- `src/routes/authRoutes.js` - Routes
- `src/middleware/registrationValidation.js` - Validation rules

## 🧪 Quick Test

```bash
# Valid registration (during hours)
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d @test-patient.json

# Where test-patient.json contains valid patient data
```

## 🚀 Run Servers

```powershell
# Backend
cd vitacare-backend
npm start

# Frontend  
cd vitacare-frontend
npm start

# Or both
.\start-all.ps1
```

## 🔍 Debug Checklist

- ✅ Backend running on port 5000?
- ✅ Frontend running on port 3000?
- ✅ MongoDB connected?
- ✅ Current time between 5:30 PM - 7:30 PM?
- ✅ All required fields filled?
- ✅ Valid data formats?
- ✅ No duplicate Aadhaar/mobile/email?

## 📝 Validation Rules

| Field | Rule |
|-------|------|
| Aadhaar | Exactly 12 digits |
| Mobile | Exactly 10 digits, starts with 6-9 |
| Email | Valid format (optional) |
| Password | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| Blood Group | One of: A+, A-, B+, B-, AB+, AB-, O+, O- |
| Pincode | Exactly 6 digits |
| City/State | 2-100 characters |
| Address Line 1 | 5-200 characters |

## 🌍 Languages

- English (en)
- हिन्दी (hi)

## 📚 Documentation

- **Full Guide**: `PATIENT-REGISTRATION.md`
- **Implementation**: `REGISTRATION-IMPLEMENTATION.md`  
- **Testing**: `REGISTRATION-TESTING.md`

---
**Version**: 1.0 | **Date**: Oct 23, 2025
