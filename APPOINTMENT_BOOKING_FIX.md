# Appointment Booking System - Complete Fix

## API Endpoints Verified ✅

### Backend Routes (Correct)
```javascript
// In app.js
app.use('/api/v1/appointments', appointmentRoutes);

// appointmentRoutes handles:
GET    /api/v1/appointments          -> getAppointments (fetch all)
POST   /api/v1/appointments          -> bookAppointment (create new)
GET    /api/v1/appointments/:id      -> getAppointment (fetch one)
PUT    /api/v1/appointments/:id      -> updateAppointment
DELETE /api/v1/appointments/:id      -> cancelAppointment
```

### Frontend API Calls (Correct)
```javascript
// In appointmentsSlice.js
GET  /appointments  -> http://localhost:5000/api/v1/appointments
POST /appointments  -> http://localhost:5000/api/v1/appointments
```

### API Configuration
- ✅ Backend running on: `http://localhost:5000`
- ✅ Frontend running on: `http://localhost:5173`
- ✅ API Base URL: `http://localhost:5000/api/v1`
- ✅ CORS configured for both ports 3000 and 5173

## Issues Fixed

### 1. **Appointment Not Storing in Database**
- ✅ Fixed time conversion logic in `BookAppointment.jsx` - now properly converts 12-hour format (e.g., "09:00 AM") to 24-hour format (e.g., "09:00")
- ✅ Enhanced backend validation in `appointmentController.js` with detailed logging
- ✅ Added proper error handling for missing or invalid timeSlot structure
- ✅ Made doctorId and hospitalId optional to allow booking without selecting specific doctors/hospitals

### 2. **Appointments Not Displaying After Booking**
- ✅ Added `getAppointments()` dispatch after successful booking to refresh the appointments list
- ✅ Changed redirect from `/dashboard` to `/appointments` so users see their booked appointments immediately
- ✅ Added proper loading states and error handling in Redux slice
- ✅ Enhanced Redux action logging for better debugging

### 3. **Enhanced Logging and Debugging**
- ✅ Added comprehensive logging in `getAppointments` controller
- ✅ Added logging in Redux actions for booking and fetching
- ✅ Added CORS origin logging to track cross-origin requests
- ✅ Shows MongoDB query being executed
- ✅ Shows number of appointments found

### 4. **CORS Configuration Improvement**
- ✅ Updated CORS to accept multiple origins (port 3000 and 5173)
- ✅ Added CORS logging to track blocked/allowed requests
- ✅ Allow requests with no origin (for testing with Postman/curl)

## Files Modified

### Frontend
1. **src/pages/BookAppointment.jsx**
   - Fixed time conversion function (convertTo24Hour)
   - Added getAppointments import and dispatch after booking
   - Changed redirect to /appointments page
   - Added loading state from Redux
   - Added disabled state to submit button

2. **src/redux/slices/appointmentsSlice.js**
   - Added console logging to track booking flow
   - Added logging to getAppointments to track fetch requests
   - Added proper loading and error states for bookAppointment
   - Improved error state management
   - Logs total appointments count

### Backend
3. **src/controllers/appointmentController.js**
   - Enhanced logging with structured output in getAppointments
   - Added MongoDB query logging to see what's being searched
   - Added count of appointments found
   - Enhanced logging in bookAppointment with JSON output
   - Added timeSlot structure validation
   - Added error stack trace logging
   - Improved error messages

4. **src/app.js**
   - Updated CORS configuration to support multiple origins
   - Added CORS origin logging (shows allowed/blocked origins)
   - Supports both port 3000 and 5173 for frontend

## Testing Instructions

### 1. Restart Backend Server
```bash
cd vitacare-backend
# Press Ctrl+C to stop current server
npm start
```

### 2. Test Appointment Booking Flow

#### Step 1: Login
- Navigate to `http://localhost:3000/login`
- Login with your patient credentials (UHI or mobile number)

#### Step 2: Book Appointment
- Click "Book Appointment" from Dashboard or navigate to `/book-appointment`
- Follow the 4-step process:
  1. **Select Type**: Choose Video Consultation or In-Person Visit, select Specialization
  2. **Choose Date & Time**: Pick a future date and a time slot
  3. **Add Details**: Enter reason and symptoms (optional)
  4. **Confirm**: Review and click "Book Appointment"

#### Step 3: Verify Appointment
- After booking, you should be redirected to `/appointments`
- Your new appointment should appear at the top of the "Upcoming" tab
- Check the details: date, time, type, reason, status should be "scheduled"

### 3. Check Database (Optional)

#### Using MongoDB Compass or mongosh:
```javascript
use vitacare

// Check latest appointments
db.appointments.find().sort({ createdAt: -1 }).limit(5).pretty()

// Check your specific appointment
db.appointments.find({ 
  patientId: ObjectId("YOUR_USER_ID")
}).pretty()
```

### 4. Check Console Logs

#### Backend Console Should Show:
```
=== BOOKING APPOINTMENT ===
Request body: {
  "appointmentDate": "2025-10-25",
  "timeSlot": {
    "start": "09:00",
    "end": "10:00"
  },
  "type": "telemedicine",
  "reason": "General Physician consultation",
  "symptoms": [],
  "consultationFee": 500
}
User ID: 6xxxxxxxxxxxxx
Processed appointment data: { ... }
Appointment created successfully: { ... }
```

#### Frontend Console Should Show:
```
Booking appointment with data: { ... }
Redux: Booking appointment with data: { ... }
Redux: Appointment booked successfully: { ... }
```

## Expected Results

✅ Appointment saves to MongoDB with all fields
✅ Appointment appears in the appointments list immediately
✅ User redirected to /appointments page
✅ Success toast notification appears
✅ Loading state shows during booking process
✅ No duplicate submissions possible

## Troubleshooting

### Issue: "Appointment date and time slot are required"
**Solution**: Check that date field has a value in format "YYYY-MM-DD" and timeSlot is selected

### Issue: "Time slot must have start and end times"
**Solution**: Verify the time conversion is working - check console logs for timeSlot structure

### Issue: Appointment not appearing in list
**Solution**: 
1. Check if user is logged in (JWT token present)
2. Open browser DevTools → Network tab → check GET /api/v1/appointments response
3. Verify appointment's patientId matches your user._id

### Issue: 401 Unauthorized
**Solution**: 
1. Check if token exists in localStorage
2. Try logging out and logging back in
3. Check backend auth middleware

## Database Schema Reference

```javascript
{
  appointmentId: "APTXXXXXXXX",  // Auto-generated
  patientId: ObjectId,            // Required - from req.user._id
  doctorId: ObjectId,             // Optional
  hospitalId: ObjectId,           // Optional
  appointmentDate: Date,          // Required - "YYYY-MM-DD"
  timeSlot: {
    start: String,                // Required - "HH:MM" (24-hour)
    end: String                   // Required - "HH:MM" (24-hour)
  },
  type: String,                   // "in-person" or "telemedicine"
  status: String,                 // Default: "scheduled"
  reason: String,
  symptoms: [String],
  consultationFee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. ✅ **Immediate**: Restart backend and test appointment booking
2. 🔄 **Short-term**: Add actual Doctor and Hospital selection from database
3. 🔄 **Medium-term**: Implement payment integration
4. 🔄 **Long-term**: Add appointment reminders and notifications

## Support

If appointments are still not saving or displaying:
1. Check backend console for detailed error logs
2. Check browser console for Redux action logs
3. Verify MongoDB connection is active
4. Check network requests in DevTools → Network tab
5. Verify user is authenticated (token in localStorage)
