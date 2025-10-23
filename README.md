# 🏥 VitaCare - Unified National Healthcare Platform

A comprehensive healthcare platform designed for India, connecting citizens, healthcare providers, government officials, and insurance providers under one secure, interoperable digital ecosystem.

## 🎯 Project Overview

VitaCare addresses India's fragmented healthcare system by providing:
- ✅ Unified medical records with blockchain security
- ✅ Seamless appointment booking and management
- ✅ Multi-stakeholder dashboards (Citizen, Doctor, Hospital, Government, Insurance)
- ✅ Multilingual support (Hindi, English, and more)
- ✅ AI-powered health assistance
- ✅ Telemedicine capabilities
- ✅ Analytics and disease surveillance

## 📦 Project Structure

```
Nebula/
├── Project.md                 # Comprehensive project documentation
├── vitacare-backend/          # Node.js/Express backend API
│   ├── src/
│   │   ├── config/           # Database and service configurations
│   │   ├── models/           # MongoDB models
│   │   ├── controllers/      # Route controllers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Authentication, validation, error handling
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── README.md
│
└── vitacare-frontend/         # React frontend application
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── pages/            # Page components
    │   ├── redux/            # Redux state management
    │   ├── services/         # API services
    │   ├── i18n/             # Internationalization
    │   └── utils/            # Utility functions
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

```bash
cd vitacare-backend
npm install
cp .env.example .env
# Configure your .env file with MongoDB URI and other settings
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend Setup

```bash
cd vitacare-frontend
npm install
cp .env.example .env
# Configure your .env file with backend API URL
npm start
```

Frontend runs on: http://localhost:3000

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, CORS, rate limiting
- **Validation**: express-validator, Joi

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalization**: react-i18next
- **Notifications**: React Toastify

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### Medical Records
- `GET /records` - Get all medical records
- `GET /records/:id` - Get single record
- `POST /records` - Create medical record (Doctor/Hospital)
- `PUT /records/:id` - Update medical record
- `POST /records/consent` - Grant access
- `DELETE /records/consent/:userId` - Revoke access

### Appointments
- `GET /appointments` - Get appointments
- `POST /appointments` - Book appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `GET /appointments/doctor/:doctorId/slots` - Get available slots

### User Profile
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/emergency-contact` - Add emergency contact
- `DELETE /users/emergency-contact/:id` - Remove emergency contact

## 🌍 Features

### Core Features
- ✅ User authentication and authorization
- ✅ Role-based access control (Citizen, Doctor, Hospital Admin, Government, Insurance)
- ✅ Medical records management with blockchain security
- ✅ Appointment booking and management
- ✅ User profile management
- ✅ Emergency contact management
- ✅ Multilingual support (English, Hindi)

### Planned Features
- [ ] Telemedicine video consultation
- [ ] AI chatbot for health queries
- [ ] Disease surveillance and analytics
- [ ] Insurance claim management
- [ ] Hospital finder with geolocation
- [ ] Prescription management
- [ ] Lab report integration
- [ ] Health analytics dashboard
- [ ] Push notifications
- [ ] SMS/Email alerts

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Token refresh mechanism

## 🗄️ Database Models

- **User** - User accounts and profiles
- **Doctor** - Doctor information and specializations
- **Hospital** - Hospital details and facilities
- **MedicalRecord** - Patient medical records
- **Appointment** - Appointment bookings
- **Insurance** - Insurance policies and claims

## 🧪 Testing

### Backend Tests
```bash
cd vitacare-backend
npm test
```

### Frontend Tests
```bash
cd vitacare-frontend
npm test
```

## 📱 User Roles

1. **Citizen** - View medical records, book appointments, manage profile
2. **Doctor** - Access patient records (with consent), manage appointments, write prescriptions
3. **Hospital Admin** - Manage hospital resources, staff, and appointments
4. **Government Official** - View analytics, disease surveillance, policy implementation
5. **Insurance Officer** - Manage policies, process claims
6. **Health Worker** - Track field visits, patient outreach

## 🌐 Internationalization

Supported languages:
- English (en)
- Hindi (hi)

More languages can be added by creating translation files in `vitacare-frontend/src/i18n/locales/`

## 📊 Project Status

**Current Phase**: Phase 7 - Frontend Development  
**Completion**: ~60%  
**Next Milestone**: Complete UI components and API integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License

## 👥 Team

VitaCare Development Team

## 📞 Support

For support and queries:
- Email: support@vitacare.gov.in
- Documentation: See individual README files in backend and frontend folders

---

**Built with ❤️ for India's Healthcare System**
