# Patient Registration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PATIENT REGISTRATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Patient    │
│  Navigates   │
│  to Register │
│     Page     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Frontend: Check Current Time            │
│  • Get hours and minutes                 │
│  • Convert to minutes since midnight     │
│  • Check: 5:30 PM (1050) - 7:30 PM (1170)│
└──────┬───────────────────────────────────┘
       │
       ├─────────────┬────────────────┐
       │             │                │
   ⏰ Outside    ⏰ Within        ⏰ Outside
    Hours         Hours            Hours
   (Before)      (During)          (After)
       │             │                │
       ▼             ▼                ▼
┌──────────┐  ┌─────────────┐  ┌──────────┐
│  Show    │  │   Enable    │  │  Show    │
│  Error   │  │    Form     │  │  Error   │
│  Alert   │  │             │  │  Alert   │
│          │  │   Show      │  │          │
│ Disable  │  │   Info      │  │ Disable  │
│  Form    │  │   Banner    │  │  Form    │
└──────────┘  └─────┬───────┘  └──────────┘
                    │
                    ▼
              ┌─────────────────────────────────┐
              │  Patient Fills Registration     │
              │  Form with:                     │
              │  ✓ Aadhaar Number               │
              │  ✓ Name (First, Last)           │
              │  ✓ Mobile Number                │
              │  ✓ Blood Group                  │
              │  ✓ Email (optional)             │
              │  ✓ Password                     │
              │  ✓ Complete Address             │
              │  ✓ Emergency Contact            │
              └─────┬───────────────────────────┘
                    │
                    ▼
              ┌─────────────────────────────────┐
              │  Frontend Validation            │
              │  • Check required fields        │
              │  • Validate Aadhaar (12 digits) │
              │  • Validate Mobile (10 digits)  │
              │  • Validate Pincode (6 digits)  │
              │  • Check blood group selection  │
              │  • Verify email format          │
              └─────┬───────────────────────────┘
                    │
                ✓ Valid
                    │
                    ▼
              ┌─────────────────────────────────┐
              │  Submit to Backend              │
              │  POST /api/v1/auth/register     │
              └─────┬───────────────────────────┘
                    │
                    ▼
              ┌─────────────────────────────────┐
              │  Backend: Time Check            │
              │  • Get server current time      │
              │  • Verify 5:30 PM - 7:30 PM     │
              └─────┬───────────────────────────┘
                    │
                    ├─────────────┬───────────────┐
                    │             │               │
              ❌ Outside      ✓ Within       (Continue)
                 Hours         Hours
                    │             │
                    ▼             ▼
              ┌──────────┐  ┌─────────────────────────────┐
              │  Return  │  │  Backend: Validation Rules  │
              │  403     │  │  • Aadhaar: 12 digits       │
              │  Error   │  │  • Mobile: 10 digits (6-9)  │
              └──────────┘  │  • Password strength        │
                           │  • Blood group valid         │
                           │  • Address complete          │
                           │  • Emergency contact valid   │
                           └─────┬───────────────────────┘
                                 │
                             ✓ Valid
                                 │
                                 ▼
                           ┌─────────────────────────────┐
                           │  Check for Duplicates       │
                           │  Query DB for:              │
                           │  • Same Aadhaar OR          │
                           │  • Same Mobile OR           │
                           │  • Same Email               │
                           └─────┬───────────────────────┘
                                 │
                                 ├──────────┬──────────┐
                                 │          │          │
                           ❌ Duplicate  ✓ Unique  (Continue)
                                 │          │
                                 ▼          ▼
                           ┌──────────┐  ┌──────────────────────┐
                           │  Return  │  │  Generate Health ID  │
                           │  400     │  │  Format: VH{ts}{rnd} │
                           │  Error   │  │  Example: VH3k8x9A2F │
                           └──────────┘  └──────┬───────────────┘
                                                │
                                                ▼
                                          ┌──────────────────────┐
                                          │  Hash Password       │
                                          │  • bcrypt            │
                                          │  • 12 salt rounds    │
                                          └──────┬───────────────┘
                                                │
                                                ▼
                                          ┌──────────────────────┐
                                          │  Create User Record  │
                                          │  • Save to MongoDB   │
                                          │  • Store all fields  │
                                          └──────┬───────────────┘
                                                │
                                                ▼
                                          ┌──────────────────────┐
                                          │  Generate Tokens     │
                                          │  • JWT Access Token  │
                                          │  • Refresh Token     │
                                          └──────┬───────────────┘
                                                │
                                                ▼
                                          ┌──────────────────────┐
                                          │  Return Success 201  │
                                          │  {                   │
                                          │    user: {...},      │
                                          │    token: "...",     │
                                          │    refreshToken: ... │
                                          │  }                   │
                                          └──────┬───────────────┘
                                                │
                                                ▼
                                          ┌──────────────────────┐
                                          │  Frontend: Success   │
                                          │  • Store tokens      │
                                          │  • Update Redux      │
                                          │  • Show toast        │
                                          └──────┬───────────────┘
                                                │
                                                ▼
                                          ┌──────────────────────┐
                                          │  Redirect to         │
                                          │  Dashboard           │
                                          │  (/dashboard)        │
                                          └──────────────────────┘


═══════════════════════════════════════════════════════════════════

                        DATABASE STRUCTURE

┌─────────────────────────────────────────────────────────────────┐
│  User Collection (MongoDB)                                      │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    _id: ObjectId("..."),                                        │
│    healthId: "VH3k8x9A2F",           ← Auto-generated           │
│    aadhaarNumber: "123456789012",    ← Unique, Required        │
│    mobileNumber: "9876543210",       ← Unique, Required        │
│    email: "user@example.com",        ← Unique, Optional        │
│    password: "$2a$12$hashed...",     ← Bcrypt hashed           │
│    role: "citizen",                  ← Default role            │
│    profile: {                                                   │
│      firstName: "John",              ← Required                │
│      lastName: "Doe",                ← Required                │
│      bloodGroup: "O+",               ← Required                │
│      address: {                                                 │
│        line1: "123 Main St",         ← Required                │
│        line2: "Near Hospital",       ← Optional                │
│        city: "Mumbai",               ← Required                │
│        state: "Maharashtra",         ← Required                │
│        pincode: "400001",            ← Required                │
│        country: "India"              ← Default                 │
│      }                                                          │
│    },                                                           │
│    emergencyContacts: [{                                        │
│      name: "Jane Doe",               ← Required                │
│      relationship: "Spouse",         ← Required                │
│      mobile: "9876543211"            ← Required                │
│    }],                                                          │
│    refreshToken: "...",              ← For session mgmt        │
│    isActive: true,                   ← Default                 │
│    isVerified: false,                ← Default                 │
│    createdAt: ISODate("..."),        ← Auto-generated          │
│    updatedAt: ISODate("...")         ← Auto-updated            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                      TIME VALIDATION LOGIC

┌─────────────────────────────────────────────────────────────────┐
│  Time Calculation                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  const now = new Date();                                        │
│  const hours = now.getHours();      // 0-23                     │
│  const minutes = now.getMinutes();  // 0-59                     │
│  const currentTime = hours * 60 + minutes;                      │
│                                                                 │
│  const startTime = 17 * 60 + 30;    // 5:30 PM = 1050 minutes   │
│  const endTime = 19 * 60 + 30;      // 7:30 PM = 1170 minutes   │
│                                                                 │
│  const isValid = currentTime >= startTime &&                    │
│                  currentTime <= endTime;                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Example Calculations:                                          │
│  • 3:00 PM  → 15 * 60 + 0  = 900  → ❌ Too early               │
│  • 5:30 PM  → 17 * 60 + 30 = 1050 → ✅ Valid                    │
│  • 6:45 PM  → 18 * 60 + 45 = 1125 → ✅ Valid                    │
│  • 7:30 PM  → 19 * 60 + 30 = 1170 → ✅ Valid                    │
│  • 8:00 PM  → 20 * 60 + 0  = 1200 → ❌ Too late                │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                      ERROR HANDLING FLOW

Frontend Error                   Backend Error
     │                                │
     ▼                                ▼
┌──────────┐                    ┌──────────┐
│ Display  │                    │  Return  │
│ Inline   │                    │  Error   │
│ Errors   │                    │  Object  │
└──────────┘                    └────┬─────┘
                                     │
                                     ▼
                               ┌───────────────┐
                               │ Redux Slice   │
                               │ Catches Error │
                               └───────┬───────┘
                                       │
                                       ▼
                               ┌───────────────┐
                               │ Toast Message │
                               │ Shows Error   │
                               └───────────────┘
```

## Error Response Examples

### Time Restriction Error (403)
```json
{
  "success": false,
  "message": "Patient registration is only allowed between 5:30 PM and 7:30 PM",
  "registrationHours": "5:30 PM - 7:30 PM"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "aadhaarNumber",
      "message": "Aadhaar number must be exactly 12 digits"
    },
    {
      "field": "mobileNumber",
      "message": "Mobile number must be exactly 10 digits"
    }
  ]
}
```

### Duplicate User Error (400)
```json
{
  "success": false,
  "message": "User already exists with provided mobile, email or Aadhaar"
}
```

## Success Response (201)
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "healthId": "VH3k8x9A2F",
      "mobileNumber": "9876543210",
      "email": "john@example.com",
      "role": "citizen",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "bloodGroup": "O+",
        "address": {...}
      },
      "emergencyContacts": [...]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
