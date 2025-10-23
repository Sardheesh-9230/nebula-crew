# 🚀 VitaCare Setup Guide

Complete setup instructions for running the VitaCare healthcare platform locally.

## ✅ Prerequisites Installed

- ✅ Node.js dependencies installed for backend
- ✅ Node.js dependencies installed for frontend
- ⚠️ MongoDB required (install separately)

## 📋 Step-by-Step Setup

### 1. Install MongoDB (if not already installed)

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install and run MongoDB as a service
3. Default connection: `mongodb://localhost:27017`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Alternative: Use MongoDB Atlas (Cloud)**
1. Create free account at: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file in backend with Atlas connection string

### 2. Start Backend Server

```bash
cd vitacare-backend
npm run dev
```

**Backend should start on:** http://localhost:5000

**Check health:** http://localhost:5000/health

### 3. Start Frontend Application

Open a new terminal:

```bash
cd vitacare-frontend
npm start
```

**Frontend should open on:** http://localhost:3000

## 🧪 Testing the Application

### 1. Register a New User

1. Open http://localhost:3000
2. Click "Register"
3. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Mobile: 9876543210
   - Email: test@example.com
   - Aadhaar: 123456789012
   - Password: password123
4. Click "Register"

### 2. Login

1. Use the registered mobile number and password
2. You'll be redirected to the dashboard

### 3. Explore Features

- **Dashboard**: View health statistics and quick actions
- **Profile**: Update your profile information
- **Medical Records**: View your medical records (initially empty)
- **Appointments**: Book and manage appointments

## 🔧 Configuration Files

### Backend (.env)
Location: `vitacare-backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitacare
JWT_SECRET=vitacare_super_secret_jwt_key_2025_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=vitacare_super_secret_refresh_key_2025_change_in_production
JWT_REFRESH_EXPIRE=7d
```

### Frontend (.env)
Location: `vitacare-frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_APP_NAME=VitaCare
```

## 📊 Database Structure

The application will automatically create these collections:
- `users` - User accounts and profiles
- `doctors` - Doctor information
- `hospitals` - Hospital details
- `medicalrecords` - Patient medical records
- `appointments` - Appointment bookings
- `insurances` - Insurance policies

## 🔍 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Test with cURL or Postman:

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "mobileNumber": "9876543210",
    "email": "test@example.com",
    "aadhaarNumber": "123456789012",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "9876543210",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check if MongoDB is running
- ✅ Check if port 5000 is available
- ✅ Verify `.env` file exists and is configured correctly

### Frontend won't start
- ✅ Check if backend is running
- ✅ Check if port 3000 is available
- ✅ Verify `.env` file has correct API URL

### Cannot register user
- ✅ Check MongoDB connection
- ✅ Check backend console for errors
- ✅ Ensure all required fields are filled

### CORS errors
- ✅ Backend should allow requests from http://localhost:3000
- ✅ Check CORS configuration in `vitacare-backend/src/app.js`

## 📱 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🌍 Language Support

Change language in the app:
1. Click the language icon (🌐) in the header
2. Select English or हिन्दी (Hindi)

## 📚 Next Steps

1. ✅ Complete user registration and login
2. ✅ Update your profile with health information
3. ✅ Explore the dashboard
4. 📝 Add medical records (requires doctor/hospital role)
5. 📅 Book appointments
6. 🔐 Test multilingual support

## 🚀 Production Deployment

For production deployment:

1. **Backend:**
   - Use MongoDB Atlas for database
   - Set strong JWT secrets
   - Enable HTTPS
   - Use environment variables
   - Deploy to services like AWS, Azure, Heroku, etc.

2. **Frontend:**
   - Run `npm build`
   - Deploy build folder to Netlify, Vercel, or AWS S3
   - Update API URL to production backend

## 📞 Support

If you encounter issues:
1. Check the console logs (browser and terminal)
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables

## 🎯 Development Checklist

- [x] Backend server initialized
- [x] Frontend React app initialized
- [x] MongoDB models created
- [x] Authentication system implemented
- [x] API endpoints created
- [x] Redux state management configured
- [x] UI components built
- [x] Multilingual support added
- [x] Dependencies installed
- [ ] Database seeded with test data
- [ ] Production deployment
- [ ] Additional features (telemedicine, AI chatbot, etc.)

---

**Ready to revolutionize healthcare in India! 🏥🇮🇳**
