# Appointment Approval System - Testing Guide

## 🎯 Feature Overview

**New Feature**: Appointment requests now require doctor approval before being confirmed.

### **How It Works:**
1. **Patient books appointment** → Status: `pending` ⏳
2. **Doctor receives notification** → Can approve or reject 📱
3. **Doctor approves** → Status: `confirmed` ✅ → Patient notified
4. **Doctor rejects** → Status: `rejected` ❌ → Patient notified

---

## ✅ Changes Made

### **Backend Changes**

#### 1. **Appointment Model** (`models/Appointment.js`)
- ✅ Added new statuses: `pending` (default), `rejected`
- ✅ Changed default status from `scheduled` to `pending`

#### 2. **Appointment Controller** (`controllers/appointmentController.js`)
- ✅ Added notification to doctor when appointment is booked
- ✅ Added `approveAppointment()` function
- ✅ Added `rejectAppointment()` function
- ✅ Both functions send notifications back to patient
- ✅ Updated slot availability checks to include `pending` status

#### 3. **Appointment Routes** (`routes/appointmentRoutes.js`)
- ✅ Added `PUT /appointments/:id/approve` (Doctor only)
- ✅ Added `PUT /appointments/:id/reject` (Doctor only)

### **Frontend Changes**

#### 4. **Appointments Slice** (`redux/slices/appointmentsSlice.js`)
- ✅ Added `approveAppointment` async thunk
- ✅ Added `rejectAppointment` async thunk
- ✅ Updated reducers to handle approve/reject responses

#### 5. **Appointments Page** (`pages/Appointments.jsx`)
- ✅ Added `pending` and `rejected` status colors
- ✅ Added approve/reject buttons for doctors (pending appointments only)
- ✅ Added reject dialog with reason input
- ✅ Added "Waiting for doctor approval" message for patients
- ✅ Doctors can only see approve/reject for pending appointments
- ✅ Patients can't cancel pending appointments (must wait for doctor)

---

## 🧪 Testing Steps

### **Prerequisites**
1. Backend server running on `http://localhost:5000`
2. Frontend server running on `http://localhost:3000`
3. At least one patient account
4. At least one doctor account

---

### **Test Scenario 1: Patient Books Appointment**

#### Step 1: Login as Patient
```
1. Navigate to http://localhost:3000/role-selection
2. Click "Patient" card
3. Login with patient credentials
```

#### Step 2: Book Appointment
```
1. Go to "Book Appointment" page
2. Fill in:
   - Select a doctor
   - Choose date
   - Select time slot
   - Enter reason (e.g., "General checkup")
3. Click "Book Appointment"
```

#### Expected Results:
- ✅ Success message: "Appointment request sent successfully. Waiting for doctor approval."
- ✅ New appointment appears with status: `PENDING` (yellow/orange badge)
- ✅ Card shows: "⏳ Waiting for doctor approval"
- ✅ No "Cancel" button visible (patient must wait for doctor)

---

### **Test Scenario 2: Doctor Receives Notification**

#### Step 1: Check Doctor Notifications
```
1. Logout from patient account
2. Login as doctor
3. Navigate to Notifications page
```

#### Expected Results:
- ✅ Notification appears: "🩺 New Appointment Request"
- ✅ Message shows patient name, date, time, and reason
- ✅ Notification has high severity (red/orange)
- ✅ Action URL points to appointments page

---

### **Test Scenario 3: Doctor Approves Appointment**

#### Step 1: View Pending Appointments
```
1. While logged in as doctor
2. Go to "Appointments" page
3. Look for pending appointments (yellow badge)
```

#### Expected Results:
- ✅ Appointment card shows status: `PENDING`
- ✅ Two buttons visible: "Approve" (green) and "Reject" (red)

#### Step 2: Approve the Appointment
```
1. Click "Approve" button on pending appointment
```

#### Expected Results:
- ✅ Success toast: "Appointment approved successfully!"
- ✅ Appointment status changes to `CONFIRMED` (green badge)
- ✅ Approve/Reject buttons disappear
- ✅ Patient receives notification

---

### **Test Scenario 4: Patient Sees Approved Appointment**

#### Step 1: Check Patient Notifications
```
1. Logout from doctor account
2. Login as patient
3. Navigate to Notifications page
```

#### Expected Results:
- ✅ Notification appears: "✅ Appointment Confirmed"
- ✅ Message shows doctor name, date, and time
- ✅ Notification has high severity

#### Step 2: View Appointments
```
1. Go to "Appointments" page
```

#### Expected Results:
- ✅ Appointment status is now `CONFIRMED` (green badge)
- ✅ "Cancel" button is now visible
- ✅ No more "Waiting for approval" message

---

### **Test Scenario 5: Doctor Rejects Appointment**

#### Step 1: Book Another Appointment as Patient
```
1. Login as patient
2. Book another appointment (same steps as Test 1)
```

#### Step 2: Reject as Doctor
```
1. Logout and login as doctor
2. Go to Appointments page
3. Find the new pending appointment
4. Click "Reject" button
```

#### Expected Results:
- ✅ Reject dialog appears
- ✅ Shows patient name, date, time
- ✅ Text field for rejection reason

#### Step 3: Confirm Rejection
```
1. Enter reason: "Not available at this time"
2. Click "Reject Request"
```

#### Expected Results:
- ✅ Success toast: "Appointment rejected"
- ✅ Appointment status changes to `REJECTED` (red badge)
- ✅ Patient receives notification

---

### **Test Scenario 6: Patient Sees Rejected Appointment**

#### Step 1: Check Patient Notifications
```
1. Login as patient
2. Navigate to Notifications page
```

#### Expected Results:
- ✅ Notification appears: "❌ Appointment Not Approved"
- ✅ Message includes doctor name and rejection reason
- ✅ Notification severity is medium

#### Step 2: View Appointments
```
1. Go to Appointments page
2. Click "Cancelled" tab
```

#### Expected Results:
- ✅ Rejected appointment appears with `REJECTED` status (red badge)
- ✅ "View Details" button visible

---

## 🔍 Additional Test Cases

### **Test Case 7: Time Slot Blocking**
```
1. Book appointment with Doctor A at 10:00 AM (status: pending)
2. Try to book another appointment with Doctor A at 10:00 AM same day
```
**Expected**: Error message "This time slot is not available"

### **Test Case 8: Multiple Pending Requests**
```
1. Patient books 3 appointments with same doctor
2. Doctor should see all 3 with approve/reject buttons
3. Doctor approves 1, rejects 1, leaves 1 pending
4. Patient sees all 3 with different statuses
```

### **Test Case 9: Notification Count**
```
1. Book 5 appointments as patient
2. Login as doctor
3. Check notification badge/count
```
**Expected**: Shows 5 unread notifications

---

## 📊 Status Colors Reference

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| `pending` | Yellow/Orange | ⚠️ | Waiting for doctor approval |
| `confirmed` | Green | ✅ | Approved by doctor |
| `scheduled` | Blue | 🕐 | Scheduled (legacy) |
| `rejected` | Red | ❌ | Not approved by doctor |
| `cancelled` | Pink/Red | ❌ | Cancelled by patient/doctor |
| `completed` | Light Green | ✅ | Appointment finished |

---

## 🔐 Authorization Rules

| Action | Patient | Doctor |
|--------|---------|--------|
| Book appointment | ✅ | ❌ |
| View own appointments | ✅ | ✅ |
| Approve appointment | ❌ | ✅ (only their appointments) |
| Reject appointment | ❌ | ✅ (only their appointments) |
| Cancel pending appointment | ❌ | ✅ |
| Cancel confirmed appointment | ✅ | ✅ |
| Receive booking notification | ❌ | ✅ |
| Receive approval notification | ✅ | ❌ |

---

## 🚀 API Endpoints

### **Approve Appointment**
```http
PUT /api/v1/appointments/:id/approve
Authorization: Bearer <doctor_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment approved successfully",
  "data": { ...appointment }
}
```

### **Reject Appointment**
```http
PUT /api/v1/appointments/:id/reject
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "reason": "Not available at this time"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment rejected successfully",
  "data": { ...appointment }
}
```

---

## 🐛 Troubleshooting

### Issue: "Approve button not showing for doctor"
**Solution**: 
- Check if logged in as doctor (not patient)
- Check if appointment status is `pending`
- Check if appointment's doctorId matches logged-in doctor

### Issue: "Patient not receiving notifications"
**Solution**:
- Check backend logs for notification creation
- Verify Notification model exists
- Check patient's notifications page

### Issue: "Cannot book appointment - time slot unavailable"
**Solution**:
- Check if another pending/confirmed appointment exists at same time
- Try different time slot
- Check doctor's available slots

---

## 📝 Next Steps

After successful testing:
1. ✅ Create test accounts (1 patient, 2 doctors)
2. ✅ Book multiple appointments
3. ✅ Test notification system
4. ✅ Test approve/reject flows
5. ✅ Verify time slot blocking
6. ✅ Test edge cases (cancel after approve, etc.)

---

**Status**: ✅ READY FOR TESTING
**Files Modified**: 5 backend + 2 frontend = 7 files total
**New Endpoints**: 2 (approve, reject)
**Lines Added**: ~300+ lines
