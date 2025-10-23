# VitaCare API Endpoints Reference

## Base Configuration

```
Backend:  http://localhost:5000
Frontend: http://localhost:5173
API Base: http://localhost:5000/api/v1
```

## Appointments API

### 1. Get All Appointments
```http
GET /api/v1/appointments
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (scheduled, confirmed, completed, cancelled, no-show)
- `startDate` (optional): Filter appointments from this date
- `endDate` (optional): Filter appointments until this date

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "appointmentId": "APTXXXXXXXX",
      "patientId": { ... },
      "doctorId": { ... },
      "hospitalId": { ... },
      "appointmentDate": "2025-10-25T00:00:00.000Z",
      "timeSlot": {
        "start": "09:00",
        "end": "10:00"
      },
      "type": "telemedicine",
      "status": "scheduled",
      "reason": "General consultation",
      "symptoms": [],
      "consultationFee": 500,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### 2. Book Appointment
```http
POST /api/v1/appointments
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "appointmentDate": "2025-10-25",
  "timeSlot": {
    "start": "09:00",
    "end": "10:00"
  },
  "type": "telemedicine",
  "reason": "General Physician consultation",
  "symptoms": ["fever", "headache"],
  "consultationFee": 500,
  "doctorId": "optional_doctor_id",
  "hospitalId": "optional_hospital_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "...",
    "appointmentId": "APTXXXXXXXX",
    "patientId": "...",
    "appointmentDate": "2025-10-25T00:00:00.000Z",
    "timeSlot": {
      "start": "09:00",
      "end": "10:00"
    },
    "type": "telemedicine",
    "status": "scheduled",
    "reason": "General Physician consultation",
    "symptoms": ["fever", "headache"],
    "consultationFee": 500,
    "paymentStatus": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 3. Get Single Appointment
```http
GET /api/v1/appointments/:id
Authorization: Bearer {token}
```

**Response:** Same as single appointment object in "Book Appointment"

### 4. Update Appointment
```http
PUT /api/v1/appointments/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (Any fields to update)
```json
{
  "status": "confirmed",
  "notes": "Updated notes"
}
```

### 5. Cancel Appointment
```http
DELETE /api/v1/appointments/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Patient cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    ...appointment object with status: "cancelled"
  }
}
```

## Frontend Redux Actions

### Import
```javascript
import { getAppointments, bookAppointment, cancelAppointment } from '../redux/slices/appointmentsSlice';
```

### Get Appointments
```javascript
const dispatch = useDispatch();
const { appointments, loading, error } = useSelector((state) => state.appointments);

// Fetch all appointments
dispatch(getAppointments());

// Fetch with filters
dispatch(getAppointments({ status: 'scheduled' }));
```

### Book Appointment
```javascript
const appointmentData = {
  appointmentDate: "2025-10-25",
  timeSlot: {
    start: "09:00",
    end: "10:00"
  },
  type: "telemedicine",
  reason: "General consultation",
  symptoms: ["fever"],
  consultationFee: 500
};

const result = await dispatch(bookAppointment(appointmentData));

if (bookAppointment.fulfilled.match(result)) {
  console.log('Booking successful:', result.payload);
  // Refresh appointments list
  await dispatch(getAppointments());
}
```

### Cancel Appointment
```javascript
dispatch(cancelAppointment({
  id: appointmentId,
  reason: 'Patient cancelled'
}));
```

## Console Logs for Debugging

### When Fetching Appointments:

**Backend Console:**
```
=== GET APPOINTMENTS ===
User: 6xxxxxxxxxxxxx Role: citizen
Query params: {}
MongoDB query: {
  "patientId": "6xxxxxxxxxxxxx"
}
Found appointments: 2
Appointments: [ ... ]
```

**Frontend Console:**
```
Redux: Fetching appointments with filters: undefined
Redux: Appointments fetched successfully: { success: true, count: 2, data: [...] }
Redux: Total appointments: 2
```

### When Booking Appointment:

**Frontend Console:**
```
Booking appointment with data: { appointmentDate: "2025-10-25", ... }
Redux: Booking appointment with data: { ... }
Redux: Appointment booked successfully: { success: true, data: {...} }
```

**Backend Console:**
```
=== BOOKING APPOINTMENT ===
Request body: {
  "appointmentDate": "2025-10-25",
  "timeSlot": {
    "start": "09:00",
    "end": "10:00"
  },
  ...
}
User ID: 6xxxxxxxxxxxxx
Processed appointment data: { ... }
Appointment created successfully: { ... }
```

### CORS Logs:
```
CORS: Allowed origin: http://localhost:5173
```

## Common Issues & Solutions

### Issue: No appointments showing
**Check:**
1. User is logged in (check localStorage for 'token')
2. Backend console shows appointments found
3. Frontend console shows appointments received
4. User role is 'citizen' (not 'doctor' or other)

### Issue: CORS error
**Check:**
1. Frontend is running on port 5173 or 3000
2. Backend app.js CORS is configured correctly
3. Backend console shows "CORS: Allowed origin"

### Issue: 401 Unauthorized
**Check:**
1. Token exists in localStorage
2. Token is not expired (15 min expiry)
3. Try logging out and logging back in

### Issue: Appointment not saving
**Check:**
1. Backend console for error messages
2. timeSlot has both start and end
3. appointmentDate is in YYYY-MM-DD format
4. User is authenticated

## Testing with cURL

### Get Appointments
```bash
curl -X GET http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Book Appointment
```bash
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentDate": "2025-10-25",
    "timeSlot": {
      "start": "09:00",
      "end": "10:00"
    },
    "type": "telemedicine",
    "reason": "Test appointment",
    "consultationFee": 500
  }'
```

## Response Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error
