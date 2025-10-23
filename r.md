# VitaCare DHRMS - Digital Health Record Management System for Migrant Workers

## 🎯 Project Overview

VitaCare DHRMS (Digital Health Record Management System) is a comprehensive multi-tenant web application designed to address healthcare challenges faced by migrant workers in India, India. The system connects four key stakeholders: **Migrant Workers (Patients)**, **Doctors/Clinics**, **Employers**, and **Government Health Authorities** through unified, role-specific dashboards powered by Universal Health Identity (UHI).

---

## 🏗️ System Architecture

### Multi-Tenant Portal Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        VitaCare DHRMS                            │
│                   (React.js Web Application)                     │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Patient    │      │   Doctor/    │      │   Employer   │
│   Portal     │      │   Clinic     │      │   Portal     │
│              │      │   Portal     │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
                      ┌──────────────┐
                      │  Government  │
                      │    Admin     │
                      │   Portal     │
                      └──────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
        ┌──────────────┐            ┌──────────────┐
        │  Node.js API │            │   MongoDB    │
        │   Backend    │────────────│    Atlas     │
        └──────────────┘            └──────────────┘
```

---

## 💻 Core Technology Stack

### Frontend Technologies
- **Framework**: React.js 18+ with Hooks
- **Language**: JavaScript/TypeScript (TypeScript recommended)
- **Routing**: React Router DOM v6
- **State Management**: 
  - Redux Toolkit (global state, auth, user data)
  - React Context API (theme, localization)
- **UI Library**: Material-UI (MUI) v5 or Ant Design v5
- **HTTP Client**: Axios with interceptors
- **Form Management**: React Hook Form + Yup validation
- **Data Visualization**: 
  - Chart.js with react-chartjs-2
  - Recharts (optional alternative)
  - Leaflet or Mapbox GL JS (for heatmaps)
- **Real-time Communication**: Socket.io-client
- **Video Conferencing**: 
  - Agora.io SDK
  - Twilio Video API
  - WebRTC with Simple-peer
- **AI Chatbot Integration**: 
  - Dialogflow (Google)
  - Custom REST API integration
- **Geolocation**: Browser Geolocation API
- **Date/Time**: date-fns or Day.js
- **Icons**: Material Icons or Ant Design Icons
- **Notifications**: react-toastify or notistack

### Backend Technologies
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken), Passport.js
- **Validation**: Joi or express-validator
- **File Upload**: Multer with AWS S3/Cloudinary
- **Email**: Nodemailer
- **SMS**: Twilio, MSG91
- **Security**: Helmet.js, CORS, bcrypt
- **Logging**: Winston, Morgan
- **Real-time**: Socket.io
- **Task Queue**: Bull (Redis-based)

### Database & Storage
- **Primary Database**: MongoDB Atlas
- **Caching**: Redis (session, real-time data)
- **File Storage**: AWS S3 / Cloudinary
- **Search**: MongoDB Text Search or Elasticsearch

### External Integrations
- **Health Data**: Google Fit API, Apple HealthKit (web)
- **Maps**: Google Maps API / Mapbox
- **AI/ML**: Disease prediction models (Python/TensorFlow served via REST API)

### DevOps
- **Version Control**: Git + GitHub
- **Package Manager**: npm or yarn
- **Build Tool**: Vite or Create React App
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel/Netlify (frontend), AWS/Heroku (backend)

---

## 🎭 User Roles & Portals

### 1. Migrant Worker (Patient) Portal

**Purpose**: Enable migrant workers to access their health records, book appointments, and receive health alerts.

#### Key Features

##### 1.1 Authentication & UHI System
- **Universal Health Identity (UHI)**: Unique identifier format
  - Example: `JOHN1234` (First name/Short name + Last 4 digits of Aadhaar)
- **Login**: UHI + Password/OTP
- **Registration**: Mobile number, Aadhaar (last 4 digits), Basic profile
- **Multi-factor Authentication**: OTP via SMS
- **Session Management**: JWT tokens with refresh mechanism

##### 1.2 Patient Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Welcome, John Kumar (UHI: JOHN1234)                     │
├─────────────────────────────────────────────────────────┤
│  📊 Health Score: 85/100        🏆 Points: 450           │
│  📅 Next Appointment: Jan 15, 2PM with Dr. Sharma       │
│  🚨 Alerts: 2 New Notifications                          │
├─────────────────────────────────────────────────────────┤
│  Quick Actions:                                          │
│  [ Book Appointment ]  [ View Records ]  [ SOS ]         │
└─────────────────────────────────────────────────────────┘
```

**Dashboard Components**:
- Health score widget (based on checkups completed)
- Upcoming appointments card
- Recent alerts notification panel
- Gamification stats (badges, points)
- Quick action buttons
- Recent medical activity timeline

##### 1.3 My Health Records
- **View Complete Medical History**:
  - Prescriptions (with medicine details)
  - Lab test results (blood reports, X-rays, etc.)
  - Diagnosis history
  - Vaccination records
  - Doctor consultation notes
  - Hospital admission records
- **Filters**: By date range, record type, provider
- **Search**: Search across all records
- **Download**: Export records as PDF
- **Share**: Generate secure shareable link for doctors
- **Timeline View**: Chronological medical history

##### 1.4 Telemedicine Section
- **Browse Doctors**: 
  - Filter by specialization, language, rating, availability
  - View doctor profiles (qualifications, experience, fees)
- **Book Video Consultation**:
  - Select doctor and available time slot
  - Payment integration
  - Add symptoms/reason for consultation
- **My Consultations**:
  - Upcoming appointments with countdown timer
  - Join video call button (active 10 mins before appointment)
  - Past consultation history
- **Video Call Interface**:
  - WebRTC-based video/audio
  - Chat functionality
  - Screen sharing (for sharing reports)
  - Call recording (with consent)
  - Post-consultation prescription download

##### 1.5 AI Health Chatbot
- **Persistent Widget**: Bottom-right floating chat icon
- **Features**:
  - Symptom checker with guided questions
  - Book appointments through conversation
  - Health information queries
  - Medication reminders setup
  - Emergency guidance
  - Multilingual support (English, Hindi, Malayalam, Tamil)
- **Chat History**: Previous conversations saved
- **Smart Suggestions**: Quick reply buttons
- **Voice Input**: Speech-to-text capability

##### 1.6 Health Alerts & Notifications
- **Notification Inbox**:
  - Proximity infection alerts (from admin)
  - Appointment reminders
  - Medication reminders
  - Test result availability
  - Health tips and seasonal alerts
- **Real-time Push Notifications**
- **Alert Types**:
  - 🔴 Critical (outbreak in your area)
  - 🟡 Warning (appointment reminder)
  - 🟢 Info (health tips)
- **Geofencing Alerts**: Warnings when entering high-risk zones

##### 1.7 Emergency SOS
- **Prominent SOS Button**: Red emergency button on all pages
- **Functionality**:
  - One-click activation
  - Auto-capture location using Geolocation API
  - Send location to:
    - Registered emergency contacts
    - Nearest hospital
    - Central emergency dispatch
  - Display emergency medical info (blood group, allergies, chronic conditions)
  - Call ambulance (auto-dial feature)
- **Emergency Profile**: Pre-configured emergency contacts and medical conditions

##### 1.8 Gamification System
- **Points System**:
  - +50 points: Complete annual checkup
  - +20 points: Complete health quiz
  - +30 points: Update medical records
  - +10 points: Daily symptom check via chatbot
- **Badges**:
  - 🏅 Health Warrior (5 checkups completed)
  - 🎯 Quiz Master (10 quizzes completed)
  - 💪 Fitness Champion (maintain health score >80 for 3 months)
- **Leaderboard**: Monthly rankings (optional, anonymous)
- **Rewards**: Discount coupons for checkups, free consultations

---

### 2. Doctor / Clinic Portal (Provider)

**Purpose**: Enable healthcare providers to manage patient records, conduct telemedicine, and leverage AI insights.

#### Key Features

##### 2.1 Doctor Authentication
- **Registration**: Medical registration number, qualifications, specialization
- **Verification**: Admin approval required
- **Profile Management**: Update consultation fees, working hours, specializations

##### 2.2 Doctor Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  Dr. Sharma's Dashboard                                  │
├─────────────────────────────────────────────────────────┤
│  Today's Schedule:                                       │
│  ├─ 10:00 AM - John Kumar (UHI: JOHN1234) - Video       │
│  ├─ 11:30 AM - Sarah Ali (UHI: SARA5678) - In-person    │
│  └─ 2:00 PM - David Raj (UHI: DAVI9012) - Video         │
├─────────────────────────────────────────────────────────┤
│  📊 Today's Stats:                                       │
│  Patients Seen: 8  |  Pending: 3  |  Cancelled: 1       │
└─────────────────────────────────────────────────────────┘
```

**Dashboard Components**:
- Today's appointment schedule
- Pending consultations queue
- Recent patient records updated
- Alerts from admin (outbreak notifications)
- Quick statistics

##### 2.3 Patient Management
- **Search Patients**: 
  - By UHI (Universal Health Identity)
  - By name, mobile number
  - Advanced filters
- **Patient List**:
  - All patients consulted by doctor
  - Recent patients
  - Flagged/high-risk patients
- **Patient Details View**:
  - Complete medical history
  - All records from all providers (aggregated)
  - Current medications
  - Allergies and chronic conditions
  - Insurance information

##### 2.4 Health Record Management
**Create New Records**:
- **Diagnosis Entry**:
  - Patient UHI selection
  - Diagnosis (ICD-10 codes)
  - Symptoms recorded
  - Clinical observations
  - Treatment plan
- **Prescription Module**:
  - Search medicines from database
  - Dosage, frequency, duration
  - Instructions and precautions
  - E-prescription generation with digital signature
- **Lab Orders**:
  - Order lab tests
  - Link to diagnostic centers
  - Track test status
- **Upload Documents**:
  - Scan and upload physical reports
  - X-rays, MRI, CT scan images
  - Tag and categorize uploads

**Update Records**:
- Edit existing diagnoses
- Add follow-up notes
- Update treatment plans
- Mark conditions as resolved

**Record Access**:
- View complete patient history across all healthcare providers
- Filter by record type, date range
- Search within records

##### 2.5 AI Disease Prediction - Risk-O-Meter
**AI-Powered Risk Assessment Widget**

```
┌─────────────────────────────────────────────────────┐
│  AI Risk-O-Meter for Patient: JOHN1234              │
├─────────────────────────────────────────────────────┤
│  🔴 Tuberculosis (TB)        Risk: 72% (High)        │
│  🟡 Malaria                  Risk: 38% (Medium)      │
│  🟢 Dengue                   Risk: 15% (Low)         │
│  🟡 Diabetes                 Risk: 45% (Medium)      │
│  🟢 Hypertension             Risk: 20% (Low)         │
├─────────────────────────────────────────────────────┤
│  Based on: Medical history, symptoms, demographics,  │
│  seasonal patterns, and regional outbreak data       │
│                                                      │
│  [ View Detailed Analysis ] [ Recommend Tests ]     │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Real-time risk calculation when viewing patient record
- Visual risk meter (color-coded)
- Risk factors explanation
- Recommendation engine (suggest preventive tests/medicines)
- Historical risk tracking
- Prediction models for:
  - Tuberculosis (TB)
  - Malaria
  - Dengue
  - Diabetes
  - Hypertension
  - COVID-19 variants
  - Seasonal diseases

**Integration**:
- ML model API endpoint: `POST /api/ai/predict-disease-risk`
- Input: Patient medical history, demographics, current symptoms
- Output: Risk scores with confidence levels

##### 2.6 Telemedicine Queue Management
- **Scheduled Consultations**:
  - Today's video appointments
  - Waiting room (patients who joined early)
  - Consultation history
- **Start Consultation**:
  - One-click to join video call
  - Access patient records during call
  - Real-time note-taking
  - Prescription creation during consultation
- **Post-Consultation**:
  - Mark consultation as complete
  - Generate consultation summary
  - Send prescription to patient automatically
  - Schedule follow-up

##### 2.7 Alert System
**Send Patient Alerts**:
- Custom health alerts to specific patients
- Medication reminders
- Follow-up appointment reminders
- Test result notifications

**Flag Infected Patients**:
- Mark patient as "infected" for specific disease
- Auto-notification to:
  - Patient (with care instructions)
  - Government health authority (admin portal)
  - Patient's employer (if linked)
- Trigger proximity alert system
- Add to disease surveillance system

**Receive Admin Alerts**:
- Outbreak notifications in region
- Resource allocation updates
- Government health advisories

##### 2.8 Analytics Dashboard (Doctor-Level)
- Patient demographics
- Most common diagnoses
- Prescription trends
- Consultation volume (daily/weekly/monthly)
- Revenue analytics

---

### 3. Employer Portal

**Purpose**: Enable employers (factories, construction firms) to monitor worker health compliance and manage workforce wellness.

#### Key Features

##### 3.1 Employer Authentication
- **Registration**: Company name, registration number, address
- **Verification**: Admin approval required
- **Company Profile**: Update company details, contact information

##### 3.2 Employer Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  ABC Construction Ltd. - Dashboard                       │
├─────────────────────────────────────────────────────────┤
│  Total Workers: 450  |  Active: 425  |  On Leave: 25    │
│  Health Compliance: 78%  (Target: 90%)                   │
├─────────────────────────────────────────────────────────┤
│  ⚠️ Health Alerts: 2 Outbreak Warnings in Facility Area  │
│  📊 Pending Checkups: 95 Workers                         │
│  ✅ Fully Compliant Workers: 355                         │
└─────────────────────────────────────────────────────────┘
```

**Dashboard Components**:
- Worker count statistics
- Health compliance percentage
- Outbreak alerts affecting facility
- Pending health checkups
- Recent health report uploads
- Compliance trends chart

##### 3.3 Worker Management
**Worker Registry**:
- Add new workers (with UHI)
- Import workers via CSV upload
- Link workers to company
- View worker list with health status
- Filter workers by:
  - Health compliance status
  - Department
  - Location
  - Risk level
- Search by UHI, name, employee ID

**Worker Profile View**:
- Basic information
- Health compliance status
- Last checkup date
- Pending health screenings
- Health alerts received
- Vaccination status

##### 3.4 Compliance Dashboard
**Health Check Tracking**:
```
Health Compliance Overview
─────────────────────────────
Annual Checkup:          ████████░░ 80% (360/450)
TB Screening:            ██████░░░░ 65% (292/450)
COVID Vaccination:       █████████░ 92% (414/450)
Malaria Prophylaxis:     ████░░░░░░ 45% (202/450)
```

**Features**:
- Visual compliance charts
- Department-wise breakdown
- Compliance trends over time
- Non-compliant worker list with reminders
- Target vs. actual metrics
- Generate compliance reports for government

**Checkup Categories**:
- Annual health screening
- Disease-specific screening (TB, malaria, etc.)
- Vaccination status
- Pre-employment medical examination
- Periodic health monitoring

##### 3.5 Bulk Report Upload
**Upload Health Reports**:
- Bulk CSV upload (worker UHI, checkup date, results)
- Individual report upload (PDF/images)
- Link reports to specific workers
- Auto-update worker compliance status
- Validation and error handling

**CSV Format Example**:
```csv
UHI,CheckupType,Date,Result,LabName,Remarks
JOHN1234,Annual,2025-01-15,Normal,City Lab,All clear
SARA5678,TB_Screening,2025-01-16,Negative,Metro Lab,No issues
```

**Upload Process**:
1. Select file (CSV or individual reports)
2. Map columns to required fields
3. Validate data format
4. Preview before submission
5. Confirm and upload
6. View upload summary with errors (if any)

##### 3.6 Outbreak Alerts
**Receive Notifications**:
- Real-time alerts from government portal
- Types of alerts:
  - 🔴 High-risk outbreak in facility area
  - 🟡 Medium-risk in nearby region
  - 🟢 General health advisory
- Alert details:
  - Disease name
  - Affected area/radius
  - Number of cases
  - Recommended actions
  - Resource links

**Alert History**:
- Past alerts received
- Actions taken by company
- Worker communication logs

**Response Actions**:
- Acknowledge alert receipt
- View affected workers (workers in alert zone)
- Send mass communication to workers
- Request health screening for affected workers
- Report compliance to government

##### 3.7 Worker Communication
- Broadcast health alerts to all workers
- Send reminders for pending checkups
- Share health education materials
- SMS/Email integration

##### 3.8 Reports & Analytics
- Monthly health compliance reports
- Worker health trends
- Cost analysis for health programs
- Export reports for audits

---

### 4. Government / Admin Portal (Health Authority)

**Purpose**: Enable government health authorities to monitor public health, detect outbreaks, and manage healthcare resources across India.

#### Key Features

##### 4.1 Admin Authentication
- **Multi-level Access**:
  - State-level administrator
  - District-level officer
  - Health inspector
- **Secure Login**: Multi-factor authentication mandatory
- **Role-based Permissions**: Granular access control

##### 4.2 Health Intelligence Dashboard
**Main Dashboard Overview**:
```
┌─────────────────────────────────────────────────────────┐
│  India Health Intelligence Dashboard                    │
│  Last Updated: 23 Oct 2025, 11:45 AM                    │
├─────────────────────────────────────────────────────────┤
│  Active Cases Today: 1,245   |   New Cases: +89         │
│  High-Risk Zones: 12 Districts                          │
├─────────────────────────────────────────────────────────┤
│  Disease Breakdown:                                      │
│  Dengue: 450   Malaria: 220   TB: 180   COVID: 125     │
├─────────────────────────────────────────────────────────┤
│  Critical Alerts: 3                                      │
│  └─ Dengue outbreak spike in Ernakulam (+35 cases)      │
└─────────────────────────────────────────────────────────┘
```

**Key Metrics**:
- Total registered users (patients, doctors, hospitals)
- Active disease cases (real-time)
- District-wise case distribution
- Healthcare facility utilization
- Vaccination coverage rates
- Resource allocation status

##### 4.3 Interactive Heatmap Visualization
**Disease Spread Heatmap**:

**Features**:
- Interactive map of India
- Color-coded districts by case density:
  - 🔴 Red: High risk (>100 cases/district)
  - 🟡 Orange: Medium risk (50-100 cases)
  - 🟢 Green: Low risk (<50 cases)
- Toggle between diseases:
  - Dengue
  - Malaria
  - Tuberculosis
  - COVID-19
  - Seasonal flu
  - Other communicable diseases
- Time-series animation (disease spread over weeks/months)
- Cluster identification
- Zoom into district/taluk level
- Click on district to view detailed breakdown

**Map Data Points**:
- Case count per district
- Growth rate (cases per day)
- Hotspot identification
- Hospital capacity in region
- Resource availability

**Technology**:
- Leaflet.js or Mapbox GL JS
- Heat layer plugin
- Real-time data updates via WebSocket
- Data source: Anonymized patient records flagged by doctors

##### 4.4 Predictive Analytics
**AI-Powered Forecasting**:

**Resource Allocation Predictions**:
```
┌─────────────────────────────────────────────────────────┐
│  Predictive Model: Next 14 Days                         │
├─────────────────────────────────────────────────────────┤
│  Ernakulam District:                                     │
│  ├─ Dengue Cases: ↑ +25% (Predicted: 120 cases)         │
│  ├─ Required Hospital Beds: 85                          │
│  ├─ Required Medicines: Paracetamol (2000 units)        │
│  └─ Recommended Action: Deploy 2 mobile medical units   │
└─────────────────────────────────────────────────────────┘
```

**Prediction Models**:
- Disease outbreak probability
- Hospital bed demand forecasting
- Medicine stock requirements
- Ambulance deployment optimization
- Healthcare worker allocation

**Seasonal Pattern Analysis**:
- Historical disease trends (monsoon, summer patterns)
- Vaccination impact assessment
- Migration pattern correlation with disease spread
- Environmental factor correlation (rainfall, temperature)

**Charts & Visualizations**:
- Line charts: Case trends over time
- Bar charts: District comparison
- Pie charts: Disease distribution
- Area charts: Cumulative cases
- Scatter plots: Correlation analysis

##### 4.5 Outbreak Management System
**New Infection Tracking**:
- Real-time feed of newly flagged cases from doctors
- Patient details (anonymized for privacy):
  - UHI (partial, last 2 digits hidden)
  - Age group, gender
  - Location (district/taluk)
  - Disease diagnosed
  - Date of diagnosis
  - Risk level
- Filter by disease, location, date range
- Bulk actions (approve, investigate, dismiss)

**Case Investigation**:
- Detailed case view with full patient history (authorized access)
- Contact tracing interface
- Link related cases (cluster identification)
- Assign investigation officer
- Track investigation status

**Proximity Infection Alerts**:

**Alert Creation Workflow**:
1. Identify outbreak cluster on heatmap
2. Define alert parameters:
   - Geographic area (district, taluk, radius)
   - Disease name
   - Severity level (Low/Medium/High/Critical)
   - Message content (in multiple languages)
   - Target audience (all users, specific demographics)
3. Preview affected users count
4. Schedule or send immediately
5. Track alert delivery status

**Alert Message Example**:
```
🔴 HEALTH ALERT - HIGH PRIORITY 🔴

Dengue Outbreak Alert - Ernakulam District

There has been a significant increase in dengue cases in your area. 
Please take precautionary measures:
- Eliminate standing water
- Use mosquito repellents
- Seek immediate medical attention if you have fever

Stay safe!
- India Health Department
```

**Broadcast to**:
- All patients in geographic area (via app notification, SMS, email)
- All employers with facilities in area
- All hospitals in area
- Community health workers

**Alert Types**:
- Outbreak warnings
- Vaccination reminders
- Seasonal health advisories
- Emergency alerts
- Resource availability updates

##### 4.6 Hospital Notification System
**Emergency Response Center**:
- Real-time SOS alerts from patients
- Display:
  - Patient UHI and basic info
  - Current location (map view)
  - Emergency medical information (blood group, allergies)
  - Nearest hospital suggestions
- Dispatch ambulance
- Notify hospital emergency department
- Track response time

**Hospital Alert Management**:
- Send resource requests to hospitals
- Notify hospitals of incoming high-risk patients
- Coordinate inter-hospital patient transfers
- Emergency equipment/medicine requests

**Hospital Dashboard Integration**:
- View all hospitals on map
- Hospital capacity (beds, ICU, ventilators)
- Real-time availability status
- Performance metrics

##### 4.7 Data-Driven Insights & Reports
**Analytics Modules**:

**Disease Surveillance**:
- Weekly/monthly disease reports
- Epidemic curve generation
- Reproductive number (R0) calculation
- Case fatality rate tracking

**Demographic Analysis**:
- Age-wise disease distribution
- Gender-based health patterns
- Occupation-based health risks (migrant workers, construction, etc.)
- Regional health disparities

**Healthcare Infrastructure**:
- Hospital utilization rates
- Doctor-patient ratio by district
- Healthcare accessibility index
- Resource gap analysis

**Vaccination Tracking**:
- Coverage rates by district
- Vaccine-preventable disease trends
- Campaign effectiveness
- Vaccine hesitancy mapping

**Migrant Worker Health**:
- Interstate migrant health status
- Occupational health trends
- Employer compliance rates
- Health screening coverage

**Report Generation**:
- Automated weekly/monthly reports
- Custom report builder
- Export to PDF, Excel
- Share with central government (Ministry of Health)

##### 4.8 Resource Management
**Inventory Tracking**:
- Medicine stock levels across districts
- Medical equipment availability
- PPE kits inventory
- Vaccine cold chain monitoring

**Allocation Dashboard**:
- Allocate resources to districts
- Track utilization
- Reorder alerts
- Wastage monitoring

##### 4.9 Healthcare Provider Management
**Registration & Verification**:
- Approve new doctor registrations
- Verify hospital licenses
- Manage healthcare facility database

**Performance Monitoring**:
- Doctor consultation volumes
- Hospital service quality metrics
- Patient feedback analysis
- Compliance audits

##### 4.10 Policy & Campaign Management
**Health Campaigns**:
- Create awareness campaigns
- Track campaign reach
- Schedule vaccination drives
- Monitor campaign effectiveness

**Policy Implementation**:
- Roll out new health policies
- Track implementation status
- Measure policy impact

---

## 🗂️ Component Structure

### Shared/Common Components

```javascript
// src/components/common/
├── Navbar.jsx                    // Top navigation with role-based menu
├── Sidebar.jsx                   // Collapsible side navigation
├── Footer.jsx                    // Footer with links and info
├── ProtectedRoute.jsx            // Route guard for authentication
├── RoleBasedRoute.jsx            // Route guard for role-based access
├── Loading.jsx                   // Loading spinner/skeleton
├── ErrorBoundary.jsx             // Error handling wrapper
├── NotificationBell.jsx          // Notification icon with count
├── ChatbotWidget.jsx             // Floating chatbot (patient portal)
├── ConfirmDialog.jsx             // Confirmation modal
├── FileUploader.jsx              // Drag-and-drop file upload
├── SearchBar.jsx                 // Reusable search input
├── FilterPanel.jsx               // Advanced filter component
├── Pagination.jsx                // Table pagination
├── EmptyState.jsx                // No data placeholder
└── Toast.jsx                     // Toast notification wrapper
```

### Patient Portal Components

```javascript
// src/components/patient/
├── auth/
│   ├── PatientLogin.jsx          // Patient login form
│   ├── PatientRegister.jsx       // Patient registration
│   └── UhiInput.jsx              // UHI input with validation
├── dashboard/
│   ├── PatientDashboard.jsx      // Main patient dashboard
│   ├── HealthScoreCard.jsx       // Health score widget
│   ├── UpcomingAppointments.jsx  // Next appointments card
│   ├── QuickActions.jsx          // Quick action buttons
│   ├── AlertsPanel.jsx           // Recent alerts display
│   └── GamificationStats.jsx     // Points and badges
├── records/
│   ├── HealthRecordsList.jsx     // List all records with filters
│   ├── RecordDetail.jsx          // Individual record view
│   ├── RecordTimeline.jsx        // Chronological record view
│   ├── RecordSearch.jsx          // Search within records
│   └── RecordDownload.jsx        // Export record as PDF
├── telemedicine/
│   ├── DoctorBrowser.jsx         // Browse and search doctors
│   ├── DoctorCard.jsx            // Doctor profile card
│   ├── BookingForm.jsx           // Appointment booking form
│   ├── BookingConfirmation.jsx   // Booking success page
│   ├── MyConsultations.jsx       // List of consultations
│   ├── VideoCallRoom.jsx         // Telemedicine video interface
│   └── ConsultationHistory.jsx   // Past consultations
├── chatbot/
│   ├── ChatbotInterface.jsx      // Chat window
│   ├── MessageBubble.jsx         // Chat message component
│   ├── SymptomChecker.jsx        // Guided symptom assessment
│   └── ChatHistory.jsx           // Previous conversations
├── alerts/
│   ├── AlertsInbox.jsx           // Notification center
│   ├── AlertCard.jsx             // Individual alert
│   └── AlertFilters.jsx          // Filter alerts by type
├── emergency/
│   ├── EmergencySOS.jsx          // SOS button component
│   ├── EmergencyProfile.jsx      // Emergency info setup
│   └── LocationSharing.jsx       // Geolocation component
└── gamification/
    ├── GamificationPage.jsx      // Badges and points page
    ├── BadgeDisplay.jsx          // Badge showcase
    ├── PointsHistory.jsx         // Points earned history
    └── Leaderboard.jsx           // Optional leaderboard
```

Doctor Portal Components
javascript// src/components/doctor/
├── auth/
│   ├── DoctorLogin.jsx           // Doctor login form
│   ├── DoctorRegister.jsx        // Doctor registration
│   └── VerificationPending.jsx   // Pending admin approval page
├── dashboard/
│   ├── DoctorDashboard.jsx       // Main doctor dashboard
│   ├── TodaysSchedule.jsx        // Today's appointments
│   ├── PatientQueue.jsx          // Waiting patients
│   ├── DoctorStats.jsx           // Consultation statistics
│   └── QuickAccess.jsx           // Quick navigation
├── patients/
│   ├── PatientSearch.jsx         // Search patients by UHI
│   ├── PatientList.jsx           // All patients table
│   ├── PatientProfile.jsx        // Individual patient view
│   ├── PatientHistory.jsx        // Complete medical history
│   └── FlaggedPatients.jsx       // High-risk patient list
├── records/
│   ├── CreateRecord.jsx          // New record form
│   ├── DiagnosisForm.jsx         // Diagnosis entry
│   ├── PrescriptionForm.jsx      // E-prescription creator
│   ├── LabOrderForm.jsx          // Lab test order
│   ├── UploadDocument.jsx        // Upload reports/images
│   └── RecordEditor.jsx          // Edit existing record
├── ai-prediction/
│   ├── RiskOMeter.jsx            // AI risk assessment widget
│   ├── RiskChart.jsx             // Visual risk display
│   ├── RiskFactors.jsx           // Risk factors explanation
│   └── RecommendationPanel.jsx   // AI recommendations
├── telemedicine/
│   ├── ConsultationQueue.jsx     // Telemedicine appointments
│   ├── WaitingRoom.jsx           // Patients waiting to join
│   ├── VideoConsultation.jsx     // Video call interface
│   ├── ConsultationNotes.jsx     // Note-taking during call
│   └── PostConsultation.jsx      // Summary and prescription
├── alerts/
│   ├── SendAlert.jsx             // Send alert to patient
│   ├── FlagInfection.jsx         // Mark patient as infected
│   ├── AlertHistory.jsx          // Alerts sent by doctor
│   └── AdminAlerts.jsx           // Alerts from government
└── analytics/
    ├── DoctorAnalytics.jsx       // Doctor-level analytics
    ├── ConsultationChart.jsx     // Consultation trends
    └── RevenueChart.jsx          // Revenue analytics
Employer Portal Components
javascript// src/components/employer/
├── auth/
│   ├── EmployerLogin.jsx         // Employer login
│   ├── EmployerRegister.jsx      // Company registration
│   └── CompanyVerification.jsx   // Verification status
├── dashboard/
│   ├── EmployerDashboard.jsx     // Main employer dashboard
│   ├── WorkerStats.jsx           // Worker statistics
│   ├── ComplianceOverview.jsx    // Compliance percentage
│   ├── OutbreakAlerts.jsx        // Active outbreak alerts
│   └── PendingActions.jsx        // Pending checkups/reports
├── workers/
│   ├── WorkerList.jsx            // All workers table
│   ├── WorkerCard.jsx            // Worker info card
│   ├── AddWorker.jsx             // Add new worker form
│   ├── ImportWorkers.jsx         // Bulk CSV import
│   ├── WorkerProfile.jsx         // Individual worker details
│   └── WorkerFilters.jsx         // Filter and search workers
├── compliance/
│   ├── ComplianceDashboard.jsx   // Detailed compliance view
│   ├── ComplianceChart.jsx       // Visual compliance metrics
│   ├── CheckupTracker.jsx        // Track checkup types
│   ├── NonCompliantList.jsx      // Workers needing checkups
│   └── ComplianceReport.jsx      // Generate compliance reports
├── reports/
│   ├── BulkUpload.jsx            // Bulk report upload
│   ├── CSVUploader.jsx           // CSV upload interface
│   ├── ReportMapper.jsx          // Map CSV columns
│   ├── UploadPreview.jsx         // Preview before upload
│   ├── IndividualUpload.jsx      // Single report upload
│   └── UploadHistory.jsx         // Past uploads log
├── alerts/
│   ├── AlertsReceived.jsx        // Government alerts inbox
│   ├── AlertDetail.jsx           // Alert details view
│   ├── AffectedWorkers.jsx       // Workers in alert zone
│   ├── AlertResponse.jsx         // Actions taken on alert
│   └── AlertHistory.jsx          // Past alerts
├── communication/
│   ├── BroadcastMessage.jsx      // Send message to all workers
│   ├── SendReminders.jsx         // Checkup reminders
│   └── MessageHistory.jsx        // Communication log
└── analytics/
    ├── EmployerAnalytics.jsx     // Reports and trends
    ├── HealthTrends.jsx          // Worker health trends
    └── CostAnalysis.jsx          // Health program costs
Admin/Government Portal Components
javascript// src/components/admin/
├── auth/
│   ├── AdminLogin.jsx            // Admin login with MFA
│   └── RoleSelector.jsx          // Select admin level
├── dashboard/
│   ├── AdminDashboard.jsx        // Main health intelligence dashboard
│   ├── OverviewMetrics.jsx       // Key state-level metrics
│   ├── CriticalAlerts.jsx        // Critical outbreak alerts
│   └── QuickStats.jsx            // Real-time statistics
├── heatmap/
│   ├── DiseaseHeatmap.jsx        // Interactive map component
│   ├── MapControls.jsx           // Disease toggle, zoom controls
│   ├── DistrictPopup.jsx         // District details popup
│   ├── LegendPanel.jsx           // Map legend
│   ├── TimeSeriesPlayer.jsx      // Animation controls
│   └── ClusterMarkers.jsx        // Hotspot markers
├── analytics/
│   ├── PredictiveAnalytics.jsx   // AI forecasting dashboard
│   ├── ForecastChart.jsx         // Prediction charts
│   ├── ResourceAllocation.jsx    // Resource prediction
│   ├── SeasonalPatterns.jsx      // Seasonal disease analysis
│   ├── TrendsAnalysis.jsx        // Historical trends
│   └── CorrelationMatrix.jsx     // Factor correlations
├── outbreak/
│   ├── OutbreakManagement.jsx    // Outbreak management center
│   ├── NewCasesFeed.jsx          // Real-time case feed
│   ├── CaseDetail.jsx            // Individual case details
│   ├── CaseInvestigation.jsx     // Investigation interface
│   ├── ContactTracing.jsx        // Contact tracing tool
│   └── ClusterAnalysis.jsx       // Cluster identification
├── alerts/
│   ├── CreateAlert.jsx           // Create proximity alert
│   ├── AlertBuilder.jsx          // Alert configuration form
│   ├── AlertPreview.jsx          // Preview alert
│   ├── AlertScheduler.jsx        // Schedule alert delivery
│   ├── AlertTracking.jsx         // Track alert delivery status
│   └── AlertHistory.jsx          // Past alerts sent
├── hospitals/
│   ├── HospitalManagement.jsx    // Hospital management center
│   ├── EmergencyResponse.jsx     // SOS alert center
│   ├── HospitalMap.jsx           // Hospitals on map
│   ├── HospitalCapacity.jsx      // Bed/resource availability
│   ├── HospitalAlerts.jsx        // Send alerts to hospitals
│   └── PerformanceMetrics.jsx    // Hospital performance
├── reports/
│   ├── ReportCenter.jsx          // Report generation center
│   ├── DiseaseReport.jsx         // Disease surveillance reports
│   ├── DemographicReport.jsx     // Demographic analysis
│   ├── VaccinationReport.jsx     // Vaccination coverage
│   ├── MigrantReport.jsx         // Migrant worker health
│   ├── CustomReport.jsx          // Custom report builder
│   └── ReportExport.jsx          // Export functionality
├── resources/
│   ├── ResourceManagement.jsx    // Inventory management
│   ├── InventoryDashboard.jsx    // Stock levels
│   ├── AllocationPanel.jsx       // Allocate resources
│   └── UtilizationTracker.jsx    // Track utilization
├── providers/
│   ├── ProviderManagement.jsx    // Healthcare provider management
│   ├── ApprovalQueue.jsx         // Pending verifications
│   ├── ProviderList.jsx          // All providers table
│   └── PerformanceReview.jsx     // Provider performance
└── campaigns/
    ├── CampaignManagement.jsx    // Health campaigns
    ├── CreateCampaign.jsx        // New campaign form
    ├── CampaignTracker.jsx       // Track campaign progress
    └── PolicyManagement.jsx      // Policy implementation

🛣️ Routing Structure
React Router Configuration
javascript// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import EmployerLayout from './layouts/EmployerLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpCenter />} />
        </Route>

        {/* ===== AUTHENTICATION ROUTES ===== */}
        <Route path="/login" element={<LoginRouter />} /> {/* Routes to role-specific login */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/register" element={<EmployerRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ===== PATIENT PORTAL ===== */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          
          {/* Health Records */}
          <Route path="records" element={<HealthRecordsList />} />
          <Route path="records/:recordId" element={<RecordDetail />} />
          <Route path="records/timeline" element={<RecordTimeline />} />
          
          {/* Telemedicine */}
          <Route path="telemedicine" element={<DoctorBrowser />} />
          <Route path="telemedicine/doctors/:doctorId" element={<DoctorProfile />} />
          <Route path="telemedicine/book/:doctorId" element={<BookingForm />} />
          <Route path="telemedicine/consultations" element={<MyConsultations />} />
          <Route path="telemedicine/video/:sessionId" element={<VideoCallRoom />} />
          
          {/* Chatbot */}
          <Route path="chatbot" element={<ChatbotInterface />} />
          <Route path="chatbot/symptom-check" element={<SymptomChecker />} />
          
          {/* Alerts */}
          <Route path="alerts" element={<AlertsInbox />} />
          
          {/* Emergency */}
          <Route path="emergency" element={<EmergencyProfile />} />
          
          {/* Gamification */}
          <Route path="gamification" element={<GamificationPage />} />
          
          {/* Profile */}
          <Route path="profile" element={<PatientProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          
          {/* Settings */}
          <Route path="settings" element={<PatientSettings />} />
          
          {/* Redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== DOCTOR PORTAL ===== */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['doctor']}>
                <DoctorLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          
          {/* Patient Management */}
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/search" element={<PatientSearch />} />
          <Route path="patients/:uhi" element={<PatientProfile />} />
          <Route path="patients/:uhi/history" element={<PatientHistory />} />
          
          {/* Medical Records */}
          <Route path="records/create" element={<CreateRecord />} />
          <Route path="records/:recordId/edit" element={<RecordEditor />} />
          <Route path="prescription/create" element={<PrescriptionForm />} />
          
          {/* Telemedicine */}
          <Route path="telemedicine/queue" element={<ConsultationQueue />} />
          <Route path="telemedicine/video/:sessionId" element={<VideoConsultation />} />
          <Route path="telemedicine/history" element={<ConsultationHistory />} />
          
          {/* Appointments */}
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="appointments/schedule" element={<ManageSchedule />} />
          
          {/* Alerts */}
          <Route path="alerts/send" element={<SendAlert />} />
          <Route path="alerts/flag-infection" element={<FlagInfection />} />
          <Route path="alerts/history" element={<AlertHistory />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<DoctorAnalytics />} />
          
          {/* Profile */}
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="profile/edit" element={<EditDoctorProfile />} />
          
          {/* Settings */}
          <Route path="settings" element={<DoctorSettings />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== EMPLOYER PORTAL ===== */}
        <Route
          path="/employer/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['employer']}>
                <EmployerLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployerDashboard />} />
          
          {/* Worker Management */}
          <Route path="workers" element={<WorkerList />} />
          <Route path="workers/add" element={<AddWorker />} />
          <Route path="workers/import" element={<ImportWorkers />} />
          <Route path="workers/:uhi" element={<WorkerProfile />} />
          
          {/* Compliance */}
          <Route path="compliance" element={<ComplianceDashboard />} />
          <Route path="compliance/report" element={<ComplianceReport />} />
          
          {/* Reports */}
          <Route path="reports/upload" element={<BulkUpload />} />
          <Route path="reports/history" element={<UploadHistory />} />
          
          {/* Alerts */}
          <Route path="alerts" element={<AlertsReceived />} />
          <Route path="alerts/:alertId" element={<AlertDetail />} />
          
          {/* Communication */}
          <Route path="communication/broadcast" element={<BroadcastMessage />} />
          <Route path="communication/reminders" element={<SendReminders />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<EmployerAnalytics />} />
          
          {/* Settings */}
          <Route path="settings" element={<EmployerSettings />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== ADMIN/GOVERNMENT PORTAL ===== */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['admin', 'govt_official']}>
                <AdminLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Heatmap */}
          <Route path="heatmap" element={<DiseaseHeatmap />} />
          
          {/* Analytics */}
          <Route path="analytics/predictive" element={<PredictiveAnalytics />} />
          <Route path="analytics/seasonal" element={<SeasonalPatterns />} />
          <Route path="analytics/trends" element={<TrendsAnalysis />} />
          
          {/* Outbreak Management */}
          <Route path="outbreak" element={<OutbreakManagement />} />
          <Route path="outbreak/cases" element={<NewCasesFeed />} />
          <Route path="outbreak/cases/:caseId" element={<CaseDetail />} />
          <Route path="outbreak/contact-tracing" element={<ContactTracing />} />
          
          {/* Alerts */}
          <Route path="alerts/create" element={<CreateAlert />} />
          <Route path="alerts/tracking" element={<AlertTracking />} />
          <Route path="alerts/history" element={<AlertHistory />} />
          
          {/* Hospitals */}
          <Route path="hospitals" element={<HospitalManagement />} />
          <Route path="hospitals/emergency" element={<EmergencyResponse />} />
          <Route path="hospitals/capacity" element={<HospitalCapacity />} />
          
          {/* Reports */}
          <Route path="reports" element={<ReportCenter />} />
          <Route path="reports/disease" element={<DiseaseReport />} />
          <Route path="reports/vaccination" element={<VaccinationReport />} />
          <Route path="reports/custom" element={<CustomReport />} />
          
          {/* Resources */}
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="resources/inventory" element={<InventoryDashboard />} />
          <Route path="resources/allocation" element={<AllocationPanel />} />
          
          {/* Provider Management */}
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="providers/approvals" element={<ApprovalQueue />} />
          
          {/* Campaigns */}
          <Route path="campaigns" element={<CampaignManagement />} />
          <Route path="campaigns/create" element={<CreateCampaign />} />
          <Route path="campaigns/policies" element={<PolicyManagement />} />
          
          {/* Settings */}
          <Route path="settings" element={<AdminSettings />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== ERROR ROUTES ===== */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

🗄️ State Management Strategy
Redux Toolkit Store Structure
javascript// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import recordsReducer from './slices/recordsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import alertsReducer from './slices/alertsSlice';
import chatbotReducer from './slices/chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    records: recordsReducer,
    appointments: appointmentsReducer,
    alerts: alertsReducer,
    chatbot: chatbotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling dates and file objects
    }),
});
Global State (Redux)
What to store in Redux:

Authentication State (authSlice.js)

javascript{
  isAuthenticated: boolean,
  token: string,
  refreshToken: string,
  role: 'patient' | 'doctor' | 'employer' | 'admin',
  loading: boolean,
  error: string | null
}

User Profile (userSlice.js)

javascript{
  uhi: string,
  profile: {
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    avatar: string,
    // role-specific fields
  },
  preferences: {
    language: string,
    theme: 'light' | 'dark',
    notifications: boolean
  }
}

Medical Records (recordsSlice.js)

javascript{
  records: Array<Record>,
  filters: {
    type: string,
    dateRange: [Date, Date],
    provider: string
  },
  loading: boolean,
  error: string | null
}

Appointments (appointmentsSlice.js)

javascript{
  appointments: Array<Appointment>,
  upcomingAppointments: Array<Appointment>,
  pastAppointments: Array<Appointment>,
  loading: boolean
}

Alerts & Notifications (alertsSlice.js)

javascript{
  alerts: Array<Alert>,
  unreadCount: number,
  filters: {
    type: string,
    priority: string
  }
}

Chatbot (chatbotSlice.js)

javascript{
  isOpen: boolean,
  messages: Array<Message>,
  isTyping: boolean,
  sessionId: string
}
Local Component State (useState)
What to keep in component state:

Form Inputs: Temporary form data before submission

javascript   const [formData, setFormData] = useState({ name: '', email: '' });

UI State: Modals, drawers, tabs, tooltips

javascript   const [isModalOpen, setIsModalOpen] = useState(false);
   const [activeTab, setActiveTab] = useState(0);

Temporary Selections: Selected items in a list

javascript   const [selectedRecords, setSelectedRecords] = useState([]);

Loading States: Component-specific loading

javascript   const [isUploading, setIsUploading] = useState(false);

Validation Errors: Form-specific errors

javascript   const [errors, setErrors] = useState({});
Context API Usage
Use Context for:

Theme Context (ThemeContext.js)

Light/dark mode
Color preferences


Language Context (LanguageContext.js)

Current language
Translation functions


Notification Context (NotificationContext.js)

Toast notifications
Snackbar messages




🔌 API Endpoint Design
Base URL
Development: http://localhost:5000/api/v1
Production: https://api.vitacare.in/api/v1
Authentication Endpoints
httpPOST   /auth/register/patient          # Patient registration
POST   /auth/register/doctor           # Doctor registration
POST   /auth/register/employer         # Employer registration
POST   /auth/login                     # Universal login
POST   /auth/logout                    # Logout
POST   /auth/refresh-token             # Refresh JWT token
POST   /auth/verify-otp                # Verify OTP
POST   /auth/forgot-password           # Request password reset
POST   /auth/reset-password            # Reset password with token
GET    /auth/verify-uhi/:uhi           # Check if UHI exists
Patient Portal Endpoints
http# Profile
GET    /patient/profile                # Get patient profile
PUT    /patient/profile                # Update profile
POST   /patient/profile/avatar         # Upload avatar

# Medical Records
GET    /patient/:uhi/records           # Get all records
GET    /patient/:uhi/records/:id       # Get specific record
GET    /patient/:uhi/records/search    # Search records
GET    /patient/:uhi/records/download/:id  # Download record PDF
GET    /patient/:uhi/records/timeline  # Timeline view
POST   /patient/:uhi/records/share     # Share record with doctor

# Telemedicine
GET    /telemedicine/doctors           # Search doctors
GET    /telemedicine/doctors/:id       # Doctor details
GET    /telemedicine/doctors/:id/slots # Available slots
POST   /telemedicine/book              # Book appointment
GET    /telemedicine/consultations     # My consultations
GET    /telemedicine/consultations/:id # Consultation details
POST   /telemedicine/join/:sessionId   # Join video call
GET    /telemedicine/history           # Past consultations

# Chatbot
POST   /chatbot/query                  # Send message to chatbot
GET    /chatbot/history                # Chat history
POST   /chatbot/symptom-check          # Symptom checker
POST   /chatbot/feedback               # Feedback on response

# Alerts
GET    /patient/alerts                 # Get all alerts
GET    /patient/alerts/unread          # Unread alerts count
PUT    /patient/alerts/:id/read        # Mark as read
DELETE /patient/alerts/:id             # Delete alert

# Emergency
POST   /emergency/sos                  # Trigger SOS
GET    /emergency/contacts             # Get emergency contacts
POST   /emergency/contacts             # Add emergency contact
PUT    /emergency/contacts/:id         # Update contact
DELETE /emergency/contacts/:id         # Delete contact

# Gamification
GET    /gamification/profile           # Get points and badges
GET    /gamification/leaderboard       # Leaderboard
POST   /gamification/quiz              # Submit quiz answers
Doctor Portal Endpoints
http# Dashboard
GET    /doctor/dashboard               # Dashboard data
GET    /doctor/schedule/today          # Today's schedule
GET    /doctor/stats                   # Doctor statistics

# Patient Management
GET    /doctor/patients                # All patients
GET    /doctor/patients/search         # Search by UHI
GET    /doctor/patients/:uhi           # Patient details
GET    /doctor/patients/:uhi/history   # Complete medical history
GET    /doctor/patients/:uhi/records   # Patient records

# Medical Records
POST   /doctor/records                 # Create new record
PUT    /doctor/records/:id             # Update record
DELETE /doctor/records/:id             # Delete record
POST   /doctor/records/upload          # Upload documents

# Prescriptions
POST   /doctor/prescription            # Create prescription
GET    /doctor/prescription/:id        # Get prescription
PUT    /doctor/prescription/:id        # Update prescription
POST   /doctor/prescription/:id/send   # Send to patient

# Lab Orders
POST   /doctor/lab-order               # Create lab order
GET    /doctor/lab-orders              # All lab orders
GET    /doctor/lab-orders/:id/results  # Lab results

# AI Prediction
POST   /ai/predict-disease-risk        # Get AI risk assessment
  Body: { uhi, symptoms, history }
  Response: { risks: [{disease, risk, confidence}] }

# Telemedicine
GET    /doctor/telemedicine/queue      # Consultation queue
POST   /doctor/telemedicine/start/:id  # Start consultation
POST   /doctor/telemedicine/end/:id    # End consultation
POST   /doctor/telemedicine/notes      # Add consultation notes

# Appointments
GET    /doctor/appointments            # All appointments
PUT    /doctor/appointments/:id        # Update appointment
GET    /doctor/schedule                # Doctor schedule
PUT    /doctor/schedule                # Update schedule

# Alerts
POST   /doctor/alerts/patient          # Send alert to patient
POST   /doctor/alerts/flag-infection   # Flag infected patient
  Body: { uhi, disease, severity, notes }
GET    /doctor/alerts/history          # Alerts sent
GET    /doctor/alerts/admin            # Alerts from admin

# Analytics
GET    /doctor/analytics               # Doctor analytics
GET    /doctor/analytics/consultations # Consultation trends
GET    /doctor/analytics/revenue       # Revenue data
Employer Portal Endpoints
http# Dashboard
GET    /employer/dashboard             # Dashboard data
GET    /employer/stats                 # Company statistics

# Workers
GET    /employer/workers               # All workers
POST   /employer/workers               # Add new worker
POST   /employer/workers/import        # Bulk CSV import
GET    /employer/workers/:uhi          # Worker details
PUT    /employer/workers/:uhi          # Update worker
DELETE /employer/workers/:uhi          # Remove worker
GET    /employer/workers/search        # Search workers
GET    /employer/workers/filters       # Filter workers

# Compliance
GET    /employer/compliance            # Compliance dashboard
GET    /employer/compliance/report     # Generate report
GET    /employer/compliance/checkups   # Checkup status
GET    /employer/compliance/non-compliant # Non-compliant workers

# Reports Upload
POST   /employer/reports/bulk          # Bulk upload reports
POST   /employer/reports/individual    # Single report upload
GET    /employer/reports/history       # Upload history
GET    /employer/reports/template      # Download CSV template

# Alerts
GET    /employer/alerts                # Get all alerts
GET    /employer/alerts/:id            # Alert details
GET    /employer/alerts/:id/affected   # Affected workers
POST   /employer/alerts/:id/acknowledge # Acknowledge alert
POST   /employer/alerts/:id/response   # Submit response

# Communication
POST   /employer/communication/broadcast # Broadcast message
POST   /employer/communication/reminders #
**Broadcast to**:
- All patients in geographic area (via app notification, SMS, email)
- All employers with facilities in area
- All hospitals in area
- Community health workers

**Alert Types**:
- Outbreak warnings
- Vaccination reminders
- Seasonal health advisories
- Emergency alerts
- Resource availability updates

##### 4.6 Hospital Notification System
**Emergency Response Center**:
- Real-time SOS alerts from patients
- Display:
  - Patient UHI and basic info
  - Current location (map view)
  - Emergency medical information (blood group, allergies)
  - Nearest hospital suggestions
- Dispatch ambulance
- Notify hospital emergency department
- Track response time

**Hospital Alert Management**:
- Send resource requests to hospitals
- Notify hospitals of incoming high-risk patients
- Coordinate inter-hospital patient transfers
- Emergency equipment/medicine requests

**Hospital Dashboard Integration**:
- View all hospitals on map
- Hospital capacity (beds, ICU, ventilators)
- Real-time availability status
- Performance metrics

##### 4.7 Data-Driven Insights & Reports
**Analytics Modules**:

**Disease Surveillance**:
- Weekly/monthly disease reports
- Epidemic curve generation
- Reproductive number (R0) calculation
- Case fatality rate tracking

**Demographic Analysis**:
- Age-wise disease distribution
- Gender-based health patterns
- Occupation-based health risks (migrant workers, construction, etc.)
- Regional health disparities

**Healthcare Infrastructure**:
- Hospital utilization rates
- Doctor-patient ratio by district
- Healthcare accessibility index
- Resource gap analysis

**Vaccination Tracking**:
- Coverage rates by district
- Vaccine-preventable disease trends
- Campaign effectiveness
- Vaccine hesitancy mapping

**Migrant Worker Health**:
- Interstate migrant health status
- Occupational health trends
- Employer compliance rates
- Health screening coverage

**Report Generation**:
- Automated weekly/monthly reports
- Custom report builder
- Export to PDF, Excel
- Share with central government (Ministry of Health)

##### 4.8 Resource Management
**Inventory Tracking**:
- Medicine stock levels across districts
- Medical equipment availability
- PPE kits inventory
- Vaccine cold chain monitoring

**Allocation Dashboard**:
- Allocate resources to districts
- Track utilization
- Reorder alerts
- Wastage monitoring

##### 4.9 Healthcare Provider Management
**Registration & Verification**:
- Approve new doctor registrations
- Verify hospital licenses
- Manage healthcare facility database

**Performance Monitoring**:
- Doctor consultation volumes
- Hospital service quality metrics
- Patient feedback analysis
- Compliance audits

##### 4.10 Policy & Campaign Management
**Health Campaigns**:
- Create awareness campaigns
- Track campaign reach
- Schedule vaccination drives
- Monitor campaign effectiveness

**Policy Implementation**:
- Roll out new health policies
- Track implementation status
- Measure policy impact

---

## 🗂️ Component Structure

### Shared/Common Components
```javascript
// src/components/common/
├── Navbar.jsx                    // Top navigation with role-based menu
├── Sidebar.jsx                   // Collapsible side navigation
├── Footer.jsx                    // Footer with links and info
├── ProtectedRoute.jsx            // Route guard for authentication
├── RoleBasedRoute.jsx            // Route guard for role-based access
├── Loading.jsx                   // Loading spinner/skeleton
├── ErrorBoundary.jsx             // Error handling wrapper
├── NotificationBell.jsx          // Notification icon with count
├── ChatbotWidget.jsx             // Floating chatbot (patient portal)
├── ConfirmDialog.jsx             // Confirmation modal
├── FileUploader.jsx              // Drag-and-drop file upload
├── SearchBar.jsx                 // Reusable search input
├── FilterPanel.jsx               // Advanced filter component
├── Pagination.jsx                // Table pagination
├── EmptyState.jsx                // No data placeholder
└── Toast.jsx                     // Toast notification wrapper
```

### Patient Portal Components
```javascript
// src/components/patient/
├── auth/
│   ├── PatientLogin.jsx          // Patient login form
│   ├── PatientRegister.jsx       // Patient registration
│   └── UhiInput.jsx              // UHI input with validation
├── dashboard/
│   ├── PatientDashboard.jsx      // Main patient dashboard
│   ├── HealthScoreCard.jsx       // Health score widget
│   ├── UpcomingAppointments.jsx  // Next appointments card
│   ├── QuickActions.jsx          // Quick action buttons
│   ├── AlertsPanel.jsx           // Recent alerts display
│   └── GamificationStats.jsx     // Points and badges
├── records/
│   ├── HealthRecordsList.jsx     // List all records with filters
│   ├── RecordDetail.jsx          // Individual record view
│   ├── RecordTimeline.jsx        // Chronological record view
│   ├── RecordSearch.jsx          // Search within records
│   └── RecordDownload.jsx        // Export record as PDF
├── telemedicine/
│   ├── DoctorBrowser.jsx         // Browse and search doctors
│   ├── DoctorCard.jsx            // Doctor profile card
│   ├── BookingForm.jsx           // Appointment booking form
│   ├── BookingConfirmation.jsx   // Booking success page
│   ├── MyConsultations.jsx       // List of consultations
│   ├── VideoCallRoom.jsx         // Telemedicine video interface
│   └── ConsultationHistory.jsx   // Past consultations
├── chatbot/
│   ├── ChatbotInterface.jsx      // Chat window
│   ├── MessageBubble.jsx         // Chat message component
│   ├── SymptomChecker.jsx        // Guided symptom assessment
│   └── ChatHistory.jsx           // Previous conversations
├── alerts/
│   ├── AlertsInbox.jsx           // Notification center
│   ├── AlertCard.jsx             // Individual alert
│   └── AlertFilters.jsx          // Filter alerts by type
├── emergency/
│   ├── EmergencySOS.jsx          // SOS button component
│   ├── EmergencyProfile.jsx      // Emergency info setup
│   └── LocationSharing.jsx       // Geolocation component
└── gamification/
    ├── GamificationPage.jsx      // Badges and points page
    ├── BadgeDisplay.jsx          // Badge showcase
    ├── PointsHistory.jsx         // Points earned history
    └── Leaderboard.jsx           // Optional leaderboard
```

### Doctor Portal Components
```javascript
// src/components/doctor/
├── auth/
│   ├── DoctorLogin.jsx           // Doctor login form
│   ├── DoctorRegister.jsx        // Doctor registration
│   └── VerificationPending.jsx   // Pending admin approval page
├── dashboard/
│   ├── DoctorDashboard.jsx       // Main doctor dashboard
│   ├── TodaysSchedule.jsx        // Today's appointments
│   ├── PatientQueue.jsx          // Waiting patients
│   ├── DoctorStats.jsx           // Consultation statistics
│   └── QuickAccess.jsx           // Quick navigation
├── patients/
│   ├── PatientSearch.jsx         // Search patients by UHI
│   ├── PatientList.jsx           // All patients table
│   ├── PatientProfile.jsx        // Individual patient view
│   ├── PatientHistory.jsx        // Complete medical history
│   └── FlaggedPatients.jsx       // High-risk patient list
├── records/
│   ├── CreateRecord.jsx          // New record form
│   ├── DiagnosisForm.jsx         // Diagnosis entry
│   ├── PrescriptionForm.jsx      // E-prescription creator
│   ├── LabOrderForm.jsx          // Lab test order
│   ├── UploadDocument.jsx        // Upload reports/images
│   └── RecordEditor.jsx          // Edit existing record
├── ai-prediction/
│   ├── RiskOMeter.jsx            // AI risk assessment widget
│   ├── RiskChart.jsx             // Visual risk display
│   ├── RiskFactors.jsx           // Risk factors explanation
│   └── RecommendationPanel.jsx   // AI recommendations
├── telemedicine/
│   ├── ConsultationQueue.jsx     // Telemedicine appointments
│   ├── WaitingRoom.jsx           // Patients waiting to join
│   ├── VideoConsultation.jsx     // Video call interface
│   ├── ConsultationNotes.jsx     // Note-taking during call
│   └── PostConsultation.jsx      // Summary and prescription
├── alerts/
│   ├── SendAlert.jsx             // Send alert to patient
│   ├── FlagInfection.jsx         // Mark patient as infected
│   ├── AlertHistory.jsx          // Alerts sent by doctor
│   └── AdminAlerts.jsx           // Alerts from government
└── analytics/
    ├── DoctorAnalytics.jsx       // Doctor-level analytics
    ├── ConsultationChart.jsx     // Consultation trends
    └── RevenueChart.jsx          // Revenue analytics
```

### Employer Portal Components
```javascript
// src/components/employer/
├── auth/
│   ├── EmployerLogin.jsx         // Employer login
│   ├── EmployerRegister.jsx      // Company registration
│   └── CompanyVerification.jsx   // Verification status
├── dashboard/
│   ├── EmployerDashboard.jsx     // Main employer dashboard
│   ├── WorkerStats.jsx           // Worker statistics
│   ├── ComplianceOverview.jsx    // Compliance percentage
│   ├── OutbreakAlerts.jsx        // Active outbreak alerts
│   └── PendingActions.jsx        // Pending checkups/reports
├── workers/
│   ├── WorkerList.jsx            // All workers table
│   ├── WorkerCard.jsx            // Worker info card
│   ├── AddWorker.jsx             // Add new worker form
│   ├── ImportWorkers.jsx         // Bulk CSV import
│   ├── WorkerProfile.jsx         // Individual worker details
│   └── WorkerFilters.jsx         // Filter and search workers
├── compliance/
│   ├── ComplianceDashboard.jsx   // Detailed compliance view
│   ├── ComplianceChart.jsx       // Visual compliance metrics
│   ├── CheckupTracker.jsx        // Track checkup types
│   ├── NonCompliantList.jsx      // Workers needing checkups
│   └── ComplianceReport.jsx      // Generate compliance reports
├── reports/
│   ├── BulkUpload.jsx            // Bulk report upload
│   ├── CSVUploader.jsx           // CSV upload interface
│   ├── ReportMapper.jsx          // Map CSV columns
│   ├── UploadPreview.jsx         // Preview before upload
│   ├── IndividualUpload.jsx      // Single report upload
│   └── UploadHistory.jsx         // Past uploads log
├── alerts/
│   ├── AlertsReceived.jsx        // Government alerts inbox
│   ├── AlertDetail.jsx           // Alert details view
│   ├── AffectedWorkers.jsx       // Workers in alert zone
│   ├── AlertResponse.jsx         // Actions taken on alert
│   └── AlertHistory.jsx          // Past alerts
├── communication/
│   ├── BroadcastMessage.jsx      // Send message to all workers
│   ├── SendReminders.jsx         // Checkup reminders
│   └── MessageHistory.jsx        // Communication log
└── analytics/
    ├── EmployerAnalytics.jsx     // Reports and trends
    ├── HealthTrends.jsx          // Worker health trends
    └── CostAnalysis.jsx          // Health program costs
```

### Admin/Government Portal Components
```javascript
// src/components/admin/
├── auth/
│   ├── AdminLogin.jsx            // Admin login with MFA
│   └── RoleSelector.jsx          // Select admin level
├── dashboard/
│   ├── AdminDashboard.jsx        // Main health intelligence dashboard
│   ├── OverviewMetrics.jsx       // Key state-level metrics
│   ├── CriticalAlerts.jsx        // Critical outbreak alerts
│   └── QuickStats.jsx            // Real-time statistics
├── heatmap/
│   ├── DiseaseHeatmap.jsx        // Interactive map component
│   ├── MapControls.jsx           // Disease toggle, zoom controls
│   ├── DistrictPopup.jsx         // District details popup
│   ├── LegendPanel.jsx           // Map legend
│   ├── TimeSeriesPlayer.jsx      // Animation controls
│   └── ClusterMarkers.jsx        // Hotspot markers
├── analytics/
│   ├── PredictiveAnalytics.jsx   // AI forecasting dashboard
│   ├── ForecastChart.jsx         // Prediction charts
│   ├── ResourceAllocation.jsx    // Resource prediction
│   ├── SeasonalPatterns.jsx      // Seasonal disease analysis
│   ├── TrendsAnalysis.jsx        // Historical trends
│   └── CorrelationMatrix.jsx     // Factor correlations
├── outbreak/
│   ├── OutbreakManagement.jsx    // Outbreak management center
│   ├── NewCasesFeed.jsx          // Real-time case feed
│   ├── CaseDetail.jsx            // Individual case details
│   ├── CaseInvestigation.jsx     // Investigation interface
│   ├── ContactTracing.jsx        // Contact tracing tool
│   └── ClusterAnalysis.jsx       // Cluster identification
├── alerts/
│   ├── CreateAlert.jsx           // Create proximity alert
│   ├── AlertBuilder.jsx          // Alert configuration form
│   ├── AlertPreview.jsx          // Preview alert
│   ├── AlertScheduler.jsx        // Schedule alert delivery
│   ├── AlertTracking.jsx         // Track alert delivery status
│   └── AlertHistory.jsx          // Past alerts sent
├── hospitals/
│   ├── HospitalManagement.jsx    // Hospital management center
│   ├── EmergencyResponse.jsx     // SOS alert center
│   ├── HospitalMap.jsx           // Hospitals on map
│   ├── HospitalCapacity.jsx      // Bed/resource availability
│   ├── HospitalAlerts.jsx        // Send alerts to hospitals
│   └── PerformanceMetrics.jsx    // Hospital performance
├── reports/
│   ├── ReportCenter.jsx          // Report generation center
│   ├── DiseaseReport.jsx         // Disease surveillance reports
│   ├── DemographicReport.jsx     // Demographic analysis
│   ├── VaccinationReport.jsx     // Vaccination coverage
│   ├── MigrantReport.jsx         // Migrant worker health
│   ├── CustomReport.jsx          // Custom report builder
│   └── ReportExport.jsx          // Export functionality
├── resources/
│   ├── ResourceManagement.jsx    // Inventory management
│   ├── InventoryDashboard.jsx    // Stock levels
│   ├── AllocationPanel.jsx       // Allocate resources
│   └── UtilizationTracker.jsx    // Track utilization
├── providers/
│   ├── ProviderManagement.jsx    // Healthcare provider management
│   ├── ApprovalQueue.jsx         // Pending verifications
│   ├── ProviderList.jsx          // All providers table
│   └── PerformanceReview.jsx     // Provider performance
└── campaigns/
    ├── CampaignManagement.jsx    // Health campaigns
    ├── CreateCampaign.jsx        // New campaign form
    ├── CampaignTracker.jsx       // Track campaign progress
    └── PolicyManagement.jsx      // Policy implementation
```

---

## 🛣️ Routing Structure

### React Router Configuration
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import EmployerLayout from './layouts/EmployerLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpCenter />} />
        </Route>

        {/* ===== AUTHENTICATION ROUTES ===== */}
        <Route path="/login" element={<LoginRouter />} /> {/* Routes to role-specific login */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/register" element={<EmployerRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ===== PATIENT PORTAL ===== */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          
          {/* Health Records */}
          <Route path="records" element={<HealthRecordsList />} />
          <Route path="records/:recordId" element={<RecordDetail />} />
          <Route path="records/timeline" element={<RecordTimeline />} />
          
          {/* Telemedicine */}
          <Route path="telemedicine" element={<DoctorBrowser />} />
          <Route path="telemedicine/doctors/:doctorId" element={<DoctorProfile />} />
          <Route path="telemedicine/book/:doctorId" element={<BookingForm />} />
          <Route path="telemedicine/consultations" element={<MyConsultations />} />
          <Route path="telemedicine/video/:sessionId" element={<VideoCallRoom />} />
          
          {/* Chatbot */}
          <Route path="chatbot" element={<ChatbotInterface />} />
          <Route path="chatbot/symptom-check" element={<SymptomChecker />} />
          
          {/* Alerts */}
          <Route path="alerts" element={<AlertsInbox />} />
          
          {/* Emergency */}
          <Route path="emergency" element={<EmergencyProfile />} />
          
          {/* Gamification */}
          <Route path="gamification" element={<GamificationPage />} />
          
          {/* Profile */}
          <Route path="profile" element={<PatientProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          
          {/* Settings */}
          <Route path="settings" element={<PatientSettings />} />
          
          {/* Redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== DOCTOR PORTAL ===== */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['doctor']}>
                <DoctorLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          
          {/* Patient Management */}
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/search" element={<PatientSearch />} />
          <Route path="patients/:uhi" element={<PatientProfile />} />
          <Route path="patients/:uhi/history" element={<PatientHistory />} />
          
          {/* Medical Records */}
          <Route path="records/create" element={<CreateRecord />} />
          <Route path="records/:recordId/edit" element={<RecordEditor />} />
          <Route path="prescription/create" element={<PrescriptionForm />} />
          
          {/* Telemedicine */}
          <Route path="telemedicine/queue" element={<ConsultationQueue />} />
          <Route path="telemedicine/video/:sessionId" element={<VideoConsultation />} />
          <Route path="telemedicine/history" element={<ConsultationHistory />} />
          
          {/* Appointments */}
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="appointments/schedule" element={<ManageSchedule />} />
          
          {/* Alerts */}
          <Route path="alerts/send" element={<SendAlert />} />
          <Route path="alerts/flag-infection" element={<FlagInfection />} />
          <Route path="alerts/history" element={<AlertHistory />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<DoctorAnalytics />} />
          
          {/* Profile */}
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="profile/edit" element={<EditDoctorProfile />} />
          
          {/* Settings */}
          <Route path="settings" element={<DoctorSettings />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== EMPLOYER PORTAL ===== */}
        <Route
          path="/employer/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['employer']}>
                <EmployerLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployerDashboard />} />
          
          {/* Worker Management */}
          <Route path="workers" element={<WorkerList />} />
          <Route path="workers/add" element={<AddWorker />} />
          <Route path="workers/import" element={<ImportWorkers />} />
          <Route path="workers/:uhi" element={<WorkerProfile />} />
          
          {/* Compliance */}
          <Route path="compliance" element={<ComplianceDashboard />} />
          <Route path="compliance/report" element={<ComplianceReport />} />
          
          {/* Reports */}
          <Route path="reports/upload" element={<BulkUpload />} />
          <Route path="reports/history" element={<UploadHistory />} />
          
          {/* Alerts */}
          <Route path="alerts" element={<AlertsReceived />} />
          <Route path="alerts/:alertId" element={<AlertDetail />} />
          
          {/* Communication */}
          <Route path="communication/broadcast" element={<BroadcastMessage />} />
          <Route path="communication/reminders" element={<SendReminders />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<EmployerAnalytics />} />
          
          {/* Settings */}
          <Route path="settings" element={<EmployerSettings />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== ADMIN/GOVERNMENT PORTAL ===== */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['admin', 'govt_official']}>
                <AdminLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Heatmap */}
          <Route path="heatmap" element={<DiseaseHeatmap />} />
          
          {/* Analytics */}
          <Route path="analytics/predictive" element={<PredictiveAnalytics />} />
          <Route path="analytics/seasonal" element={<SeasonalPatterns />} />
          <Route path="analytics/trends" element={<TrendsAnalysis />} />
          
          {/* Outbreak Management */}
          <Route path="outbreak" element={<OutbreakManagement />} />
          <Route path="outbreak/cases" element={<NewCasesFeed />} />
          <Route path="outbreak/cases/:caseId" element={<CaseDetail />} />
          <Route path="outbreak/contact-tracing" element={<ContactTracing />} />
          
          {/* Alerts */}
          <Route path="alerts/create" element={<CreateAlert />} />
          <Route path="alerts/tracking" element={<AlertTracking />} />
          <Route path="alerts/history" element={<AlertHistory />} />
          
          {/* Hospitals */}
          <Route path="hospitals" element={<HospitalManagement />} />
          <Route path="hospitals/emergency" element={<EmergencyResponse />} />
          <Route path="hospitals/capacity" element={<HospitalCapacity />} />
          
          {/* Reports */}
          <Route path="reports" element={<ReportCenter />} />
          <Route path="reports/disease" element={<DiseaseReport />} />
          <Route path="reports/vaccination" element={<VaccinationReport />} />
          <Route path="reports/custom" element={<CustomReport />} />
          
          {/* Resources */}
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="resources/inventory" element={<InventoryDashboard />} />
          <Route path="resources/allocation" element={<AllocationPanel />} />
          
          {/* Provider Management */}
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="providers/approvals" element={<ApprovalQueue />} />
          
          {/* Campaigns */}
          <Route path="campaigns" element={<CampaignManagement />} />
          <Route path="campaigns/create" element={<CreateCampaign />} />
          <Route path="campaigns/policies" element={<PolicyManagement />} />
          
          {/* Settings */}
          <Route path="settings" element={<AdminSettings />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ===== ERROR ROUTES ===== */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🗄️ State Management Strategy

### Redux Toolkit Store Structure
```javascript
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import recordsReducer from './slices/recordsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import alertsReducer from './slices/alertsSlice';
import chatbotReducer from './slices/chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    records: recordsReducer,
    appointments: appointmentsReducer,
    alerts: alertsReducer,
    chatbot: chatbotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling dates and file objects
    }),
});
```

### Global State (Redux)

**What to store in Redux:**

1. **Authentication State** (`authSlice.js`)
```javascript
{
  isAuthenticated: boolean,
  token: string,
  refreshToken: string,
  role: 'patient' | 'doctor' | 'employer' | 'admin',
  loading: boolean,
  error: string | null
}
```

2. **User Profile** (`userSlice.js`)
```javascript
{
  uhi: string,
  profile: {
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    avatar: string,
    // role-specific fields
  },
  preferences: {
    language: string,
    theme: 'light' | 'dark',
    notifications: boolean
  }
}
```

3. **Medical Records** (`recordsSlice.js`)
```javascript
{
  records: Array<Record>,
  filters: {
    type: string,
    dateRange: [Date, Date],
    provider: string
  },
  loading: boolean,
  error: string | null
}
```

4. **Appointments** (`appointmentsSlice.js`)
```javascript
{
  appointments: Array<Appointment>,
  upcomingAppointments: Array<Appointment>,
  pastAppointments: Array<Appointment>,
  loading: boolean
}
```

5. **Alerts & Notifications** (`alertsSlice.js`)
```javascript
{
  alerts: Array<Alert>,
  unreadCount: number,
  filters: {
    type: string,
    priority: string
  }
}
```

6. **Chatbot** (`chatbotSlice.js`)
```javascript
{
  isOpen: boolean,
  messages: Array<Message>,
  isTyping: boolean,
  sessionId: string
}
```

### Local Component State (useState)

**What to keep in component state:**

1. **Form Inputs**: Temporary form data before submission
```javascript
   const [formData, setFormData] = useState({ name: '', email: '' });
```

2. **UI State**: Modals, drawers, tabs, tooltips
```javascript
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [activeTab, setActiveTab] = useState(0);
```

3. **Temporary Selections**: Selected items in a list
```javascript
   const [selectedRecords, setSelectedRecords] = useState([]);
```

4. **Loading States**: Component-specific loading
```javascript
   const [isUploading, setIsUploading] = useState(false);
```

5. **Validation Errors**: Form-specific errors
```javascript
   const [errors, setErrors] = useState({});
```

### Context API Usage

**Use Context for:**

1. **Theme Context** (`ThemeContext.js`)
   - Light/dark mode
   - Color preferences

2. **Language Context** (`LanguageContext.js`)
   - Current language
   - Translation functions

3. **Notification Context** (`NotificationContext.js`)
   - Toast notifications
   - Snackbar messages

---

## 🔌 API Endpoint Design

### Base URL
Development: http://localhost:5000/api/v1
Production: https://api.vitacare.in/api/v1

### Authentication Endpoints
```http
POST   /auth/register/patient          # Patient registration
POST   /auth/register/doctor           # Doctor registration
POST   /auth/register/employer         # Employer registration
POST   /auth/login                     # Universal login
POST   /auth/logout                    # Logout
POST   /auth/refresh-token             # Refresh JWT token
POST   /auth/verify-otp                # Verify OTP
POST   /auth/forgot-password           # Request password reset
POST   /auth/reset-password            # Reset password with token
GET    /auth/verify-uhi/:uhi           # Check if UHI exists
```

### Patient Portal Endpoints
```http
# Profile
GET    /patient/profile                # Get patient profile
PUT    /patient/profile                # Update profile
POST   /patient/profile/avatar         # Upload avatar

# Medical Records
GET    /patient/:uhi/records           # Get all records
GET    /patient/:uhi/records/:id       # Get specific record
GET    /patient/:uhi/records/search    # Search records
GET    /patient/:uhi/records/download/:id  # Download record PDF
GET    /patient/:uhi/records/timeline  # Timeline view
POST   /patient/:uhi/records/share     # Share record with doctor

# Telemedicine
GET    /telemedicine/doctors           # Search doctors
GET    /telemedicine/doctors/:id       # Doctor details
GET    /telemedicine/doctors/:id/slots # Available slots
POST   /telemedicine/book              # Book appointment
GET    /telemedicine/consultations     # My consultations
GET    /telemedicine/consultations/:id # Consultation details
POST   /telemedicine/join/:sessionId   # Join video call
GET    /telemedicine/history           # Past consultations

# Chatbot
POST   /chatbot/query                  # Send message to chatbot
GET    /chatbot/history                # Chat history
POST   /chatbot/symptom-check          # Symptom checker
POST   /chatbot/feedback               # Feedback on response

# Alerts
GET    /patient/alerts                 # Get all alerts
GET    /patient/alerts/unread          # Unread alerts count
PUT    /patient/alerts/:id/read        # Mark as read
DELETE /patient/alerts/:id             # Delete alert

# Emergency
POST   /emergency/sos                  # Trigger SOS
GET    /emergency/contacts             # Get emergency contacts
POST   /emergency/contacts             # Add emergency contact
PUT    /emergency/contacts/:id         # Update contact
DELETE /emergency/contacts/:id         # Delete contact

# Gamification
GET    /gamification/profile           # Get points and badges
GET    /gamification/leaderboard       # Leaderboard
POST   /gamification/quiz              # Submit quiz answers
```

### Doctor Portal Endpoints
```http
# Dashboard
GET    /doctor/dashboard               # Dashboard data
GET    /doctor/schedule/today          # Today's schedule
GET    /doctor/stats                   # Doctor statistics

# Patient Management
GET    /doctor/patients                # All patients
GET    /doctor/patients/search         # Search by UHI
GET    /doctor/patients/:uhi           # Patient details
GET    /doctor/patients/:uhi/history   # Complete medical history
GET    /doctor/patients/:uhi/records   # Patient records

# Medical Records
POST   /doctor/records                 # Create new record
PUT    /doctor/records/:id             # Update record
DELETE /doctor/records/:id             # Delete record
POST   /doctor/records/upload          # Upload documents

# Prescriptions
POST   /doctor/prescription            # Create prescription
GET    /doctor/prescription/:id        # Get prescription
PUT    /doctor/prescription/:id        # Update prescription
POST   /doctor/prescription/:id/send   # Send to patient

# Lab Orders
POST   /doctor/lab-order               # Create lab order
GET    /doctor/lab-orders              # All lab orders
GET    /doctor/lab-orders/:id/results  # Lab results

# AI Prediction
POST   /ai/predict-disease-risk        # Get AI risk assessment
  Body: { uhi, symptoms, history }
  Response: { risks: [{disease, risk, confidence}] }

# Telemedicine
GET    /doctor/telemedicine/queue      # Consultation queue
POST   /doctor/telemedicine/start/:id  # Start consultation
POST   /doctor/telemedicine/end/:id    # End consultation
POST   /doctor/telemedicine/notes      # Add consultation notes

# Appointments
GET    /doctor/appointments            # All appointments
PUT    /doctor/appointments/:id        # Update appointment
GET    /doctor/schedule                # Doctor schedule
PUT    /doctor/schedule                # Update schedule

# Alerts
POST   /doctor/alerts/patient          # Send alert to patient
POST   /doctor/alerts/flag-infection   # Flag infected patient
  Body: { uhi, disease, severity, notes }
GET    /doctor/alerts/history          # Alerts sent
GET    /doctor/alerts/admin            # Alerts from admin

# Analytics
GET    /doctor/analytics               # Doctor analytics
GET    /doctor/analytics/consultations # Consultation trends
GET    /doctor/analytics/revenue       # Revenue data
```

### Employer Portal Endpoints
```http
# Dashboard
GET    /employer/dashboard             # Dashboard data
GET    /employer/stats                 # Company statistics

# Workers
GET    /employer/workers               # All workers
POST   /employer/workers               # Add new worker
POST   /employer/workers/import        # Bulk CSV import
GET    /employer/workers/:uhi          # Worker details
PUT    /employer/workers/:uhi          # Update worker
DELETE /employer/workers/:uhi          # Remove worker
GET    /employer/workers/search        # Search workers
GET    /employer/workers/filters       # Filter workers

# Compliance
GET    /employer/compliance            # Compliance dashboard
GET    /employer/compliance/report     # Generate report
GET    /employer/compliance/checkups   # Checkup status
GET    /employer/compliance/non-compliant # Non-compliant workers

# Reports Upload
POST   /employer/reports/bulk          # Bulk upload reports
POST   /employer/reports/individual    # Single report upload
GET    /employer/reports/history       # Upload history
GET    /employer/reports/template      # Download CSV template

# Alerts
GET    /employer/alerts                # Get all alerts
GET    /employer/alerts/:id            # Alert details
GET    /employer/alerts/:id/affected   # Affected workers
POST   /employer/alerts/:id/acknowledge # Acknowledge alert
POST   /employer/alerts/:id/response   # Submit response

# Communication
POST   /employer/communication/broadcast # Broadcast message
POST   /employer/communication/reminders # Send reminders
GET    /employer/communication/history  # Message history

# Analytics
GET    /employer/analytics             # Employer analytics
GET    /employer/analytics/trends      # Health trends
GET    /employer/analytics/costs       # Cost analysis
```

### Admin/Government Portal Endpoints
```http
# Dashboard
GET    /admin/dashboard                # Main dashboard data
GET    /admin/stats                    # State-level statistics
GET    /admin/critical-alerts          # Critical alerts

# Heatmap
GET    /admin/heatmap                  # Heatmap data
  Query: ?disease=dengue&date=2025-01-15
  Response: { districts: [{name, lat, lng, cases, risk}] }
GET    /admin/heatmap/timeseries       # Historical data for animation
GET    /admin/heatmap/clusters         # Hotspot clusters

# Predictive Analytics
GET    /admin/analytics/predictions    # AI predictions
  Query: ?district=ernakulam&days=14
POST   /admin/analytics/forecast       # Generate forecast
GET    /admin/analytics/seasonal       # Seasonal patterns
GET    /admin/analytics/trends         # Disease trends
GET    /admin/analytics/correlations   # Factor correlations

# Outbreak Management
GET    /admin/outbreak/cases           # New cases feed
GET    /admin/outbreak/cases/:id       # Case details
PUT    /admin/outbreak/cases/:id       # Update case
POST   /admin/outbreak/investigate     # Start investigation
GET    /admin/outbreak/contact-trace/:caseId # Contact tracing
GET    /admin/outbreak/clusters        # Cluster analysis

# Alerts
POST   /admin/alerts/create            # Create proximity alert
  Body: {
    disease, severity, area: {district, radius},
    message, targetAudience
  }
GET    /admin/alerts/tracking          # Track alert delivery
GET    /admin/alerts/history           # Past alerts
PUT    /admin/alerts/:id/cancel        # Cancel scheduled alert

# Hospitals
GET    /admin/hospitals                # All hospitals
GET    /admin/hospitals/:id            # Hospital details
GET    /admin/hospitals/capacity       # Bed availability
GET    /admin/hospitals/emergency      # SOS alerts feed
POST   /admin/hospitals/notify         # Send alert to hospital
GET    /admin/hospitals/performance    # Performance metrics

# Reports
POST   /admin/reports/generate         # Generate custom report
GET    /admin/reports/disease          # Disease surveillance
GET    /admin/reports/vaccination      # Vaccination coverage
GET    /admin/reports/demographic      # Demographic analysis
GET    /admin/reports/migrant          # Migrant worker health
GET    /admin/reports/download/:id     # Download report

# Resources
GET    /admin/resources/inventory      # Inventory status
POST   /admin/resources/allocate       # Allocate resources
GET    /admin/resources/utilization    # Utilization data
PUT    /admin/resources/update/:id     # Update inventory

# Provider Management
GET    /admin/providers/pending        # Pending approvals
POST   /admin/providers/approve/:id    # Approve provider
POST   /admin/providers/reject/:id     # Reject provider
GET    /admin/providers/all            # All providers
GET    /admin/providers/performance    # Performance review

# Campaigns
GET    /admin/campaigns                # All campaigns
POST   /admin/campaigns/create         # Create campaign
PUT    /admin/campaigns/:id            # Update campaign
GET    /admin/campaigns/:id/tracking   # Track progress
POST   /admin/campaigns/:id/close      # Close campaign

# Users
GET    /admin/users                    # All users (paginated)
GET    /admin/users/:id                # User details
PUT    /admin/users/:id/status         # Activate/deactivate
GET    /admin/users/statistics         # User statistics

# Audit Logs
GET    /admin/audit-logs               # System audit logs
```

### Common Endpoints (All Roles)
```http
# Notifications
GET    /notifications                  # Get notifications
PUT    /notifications/:id/read         # Mark as read
DELETE /notifications/:id              # Delete notification
PUT    /notifications/read-all         # Mark all as read

# File Upload
POST   /upload/image                   # Upload image
POST   /upload/document                # Upload document
POST   /upload/report                  # Upload medical report

# Health Data Integration
POST   /health-data/google-fit         # Sync Google Fit data
POST   /health-data/apple-health       # Sync Apple Health data

# Search
GET    /search                         # Global search
  Query: ?q=searchterm&type=doctors,hospitals,diseases

# Settings
GET    /settings                       # Get user settings
PUT    /settings                       # Update settings
PUT    /settings/password              # Change password
PUT    /settings/notifications         # Notification preferences
```

---

## 📦 MongoDB Schema Design

### User Schema
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  uhi: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'employer', 'admin', 'govt_official'],
    required: true
  },
  aadhaarLast4: {
    type: String,
    required: true,
    length: 4
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    bloodGroup: String,
    avatar: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    mobile: String
  }],
  allergies: [String],
  chronicConditions: [String],
  region: String,
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Indexes
userSchema.index({ uhi: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.address.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
```

### Doctor Schema
```javascript
// models/Doctor.js
const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  specialization: [{
    type: String,
    required: true
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: Number, // years
  consultationFee: {
    inPerson: Number,
    video: Number
  },
  hospitals: [{
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    department: String,
    designation: String
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    slots: [{
      startTime: String, // "09:00"
      endTime: String,   // "12:00"
      type: {
        type: String,
        enum: ['in-person', 'video', 'both']
      }
    }]
  }],
  languages: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  telemedicineEnabled: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
```

### Medical Record Schema
```javascript
// models/MedicalRecord.js
const medicalRecordSchema = new mongoose.Schema({
  patientUhi: {
    type: String,
    required: true,
    index: true
  },
  recordType: {
    type: String,
    enum: ['prescription', 'lab_report', 'imaging', 'diagnosis', 'vaccination', 'surgery', 'consultation'],
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  diagnosis: {
    icdCode: String,
    description: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    }
  },
  symptoms: [String],
  prescriptions: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'critical']
    }
  }],
  documents: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: Date
  }],
  notes: String,
  followUpDate: Date,
  isPrivate: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: Date,
    expiresAt: Date
  }],
  accessLog: [{
    accessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessedAt: Date,
    purpose: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Indexes
medicalRecordSchema.index({ patientUhi: 1, date: -1 });
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ recordType: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
```

### Appointment Schema
```javascript
// models/Appointment.js
const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  patientUhi: {
    type: String,
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  type: {
    type: String,
    enum: ['in-person', 'video'],
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true,
    index: true
  },
  timeSlot: {
    start: String,
    end: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  reason: String,
  symptoms: [String],
  consultationNotes: String,
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  videoSession: {
    sessionId: String,
    roomUrl: String,
    startedAt: Date,
    endedAt: Date,
    duration: Number // minutes
  },
  payment: {
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded']
    },
    transactionId: String,
    paidAt: Date
  },
  reminders: [{
    sentAt: Date,
    type: {
      type: String,
      enum: ['sms', 'email', 'push']
    }
  }],
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Indexes
appointmentSchema.index({ patientUhi: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
```

### Alert Schema
```javascript
// models/Alert.js
const alertSchema = new mongoose.Schema({
  alertType: {
    type: String,
    enum: ['outbreak', 'proximity', 'appointment', 'medication', 'health_tip', 'emergency'],
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  disease: String,
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  area: {
    district: String,
    state: String,
    radius: Number, // km
    center: {
      lat: Number,
      lng: Number
    }
  },
  targetAudience: {
    type: String,
    enum: ['all', 'patients', 'doctors', 'employers', 'specific'],
    default: 'all'
  },
  specificTargets: [{
    type: String // UHIs or user IDs
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledFor: Date,
  sentAt: Date,
  expiresAt: Date,
  delivery: {
    sms: Boolean,
    email: Boolean,
    push: Boolean
  },
  stats: {
    totalTargets: Number,
    delivered: Number,
    read: Number,
    failed: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
alertSchema.index({ alertType: 1, createdAt: -1 });
alertSchema.index({ 'area.center': '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);
```

### Employer Schema
```javascript
// models/Employer.js
const employerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  industry: String,
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contactPerson: {
    name: String,
    designation: String,
    mobile: String,
    email: String
  },
  workers: [{
    uhi: String,
    employeeId: String,
    department: String,
    designation: String,
    joinedAt: Date,
    isActive: Boolean
  }],
  compliance: {
    targetRate: {
      type: Number,
      default: 90 // 90% compliance target
    },
    lastAuditDate: Date,
    nextAuditDate: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
employerSchema.index({ userId: 1 });
employerSchema.index({ registrationNumber: 1 });
employerSchema.index({ 'workers.uhi': 1 });

module.exports = mongoose.model('Employer', employerSchema);
```

### Disease Surveillance Schema
```javascript
// models/DiseaseSurveillance.js
const diseaseSurveillanceSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: true,
    index: true
  },
  icdCode: String,
  district: {
    type: String,
    required: true,
    index: true
  },
  state: {
    type: String,
    default: 'India'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  weekNumber: Number,
  cases: {
    newCases: {
      type: Number,
      default: 0
    },
    activeCases: {
      type: Number,
      default: 0
    },
    recovered: {
      type: Number,
      default: 0
    },
    deaths: {
      type: Number,
      default: 0
    }
  },
  demographics: {
    ageGroups: [{
      range: String, // "0-10", "11-20", etc.
      cases: Number
    }],
    genderDistribution: {
      male: Number,
      female: Number,
      other: Number
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  predictedCases: {
    nextWeek: Number,
    next2Weeks: Number,
    confidence: Number // 0-1
  },
  environmentalFactors: {
    temperature: Number,
    humidity: Number,
    rainfall: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
diseaseSurveillanceSchema.index({ disease: 1, date: -1 });
diseaseSurveillanceSchema.index({ district: 1, date: -1 });
diseaseSurveillanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DiseaseSurveillance', diseaseSurveillanceSchema);
```

---

## 🎨 UI/UX Design Guidelines

### Color Scheme
```javascript
// Theme colors
const theme = {
  patient: {
    primary: '#2196F3', // Blue
    secondary: '#4CAF50', // Green
    accent: '#FF9800' // Orange
  },
  doctor: {
    primary: '#009688', // Teal
    secondary: '#00BCD4', // Cyan
    accent: '#FFC107' // Amber
  },
  employer: {
    primary: '#673AB7', // Deep Purple
    secondary: '#9C27B0', // Purple
    accent: '#E91E63' // Pink
  },
  admin: {
    primary: '#F44336', // Red
    secondary: '#FF5722', // Deep Orange
    accent: '#3F51B5' // Indigo
  },
  common: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  }
};
```

### Typography
```javascript
// Font hierarchy
const typography = {
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.4
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.4
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase'
  }
};
```

### Responsive Breakpoints
```javascript
const breakpoints = {
  xs: '0px',      // Mobile portrait
  sm: '600px',    // Mobile landscape
  md: '960px',    // Tablet
  lg: '1280px',   // Desktop
  xl: '1920px'    // Large desktop
};
```

---

## 🔒 Security Implementation

### JWT Authentication
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based middleware
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
```

### Password Hashing
```javascript
// utils/auth.js
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
```

### Data Encryption
```javascript
// utils/encryption.js
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (text) => {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
```

---

## 📱 Integration Guides

### Google Fit API Integration
```javascript
// services/googleFit.js
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

const syncGoogleFitData = async (accessToken, uhi) => {
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const endTime = Date.now();
  const startTime = endTime - (7 * 24 * 60 * 60 * 1000); // Last 7 days
  
  try {
    // Get step count
    const stepsResponse = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day
        startTimeMillis: startTime,
        endTimeMillis: endTime
      }
    });
    
    // Get heart rate
    const heartRateResponse = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startTime,
        endTimeMillis: endTime
      }
    });
    
    // Store in database
    await HealthData.create({
      uhi,
      source: 'google_fit',
      data: {
        steps: stepsResponse.data,
        heartRate: heartRateResponse.data
      },
      syncedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Google Fit sync error:', error);
    throw error;
  }
};

module.exports = { syncGoogleFitData };
```

### Dialogflow Chatbot Integration
```javascript
// services/chatbot.js
const dialogflow = require('@google-cloud/dialogflow');

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DIALOGFLOW_KEY_PATH
});

const detectIntent = async (sessionId, text, languageCode = 'en') => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: languageCode
      }
    }
  };
  
  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    
    return {
      response: result.fulfillmentText,
      intent: result.intent.displayName,
      confidence: result.intentDetectionConfidence,
      parameters: result.parameters
    };
  } catch (error) {
    console.error('Dialogflow error:', error);
    throw error;
  }
};

module.exports = { detectIntent };
```

### Agora Video SDK Integration (React)
```javascript
// components/telemedicine/VideoCall.jsx
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useState, useEffect } from 'react';

const VideoCall = ({ channelName, token, uid }) => {
  const [client] = useState(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  
  useEffect(() => {
    const init = async () => {
      // Join channel
      await client.join(
        process.env.REACT_APP_AGORA_APP_ID,
        channelName,
        token,
        uid
      );
      
      // Create local tracks
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalTracks({ audio: audioTrack, video: videoTrack });
      
      // Publish tracks
      await client.publish([audioTrack, videoTrack]);
      
      // Play local video
      videoTrack.play('local-video');
      
      // Handle remote users
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          remoteVideoTrack.play('remote-video');
        }
        
        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });
    };
    
    init();
    
    return () => {
      // Cleanup
      localTracks.audio?.close();
      localTracks.video?.close();
      client.leave();
    };
  }, [channelName, token, uid]);
  
  return (
    <div className="video-call-container">
      <div id="local-video" className="local-video"></div>
      <div id="remote-video" className="remote-video"></div>
    </div>
  );
};

export default VideoCall;
```

---

##