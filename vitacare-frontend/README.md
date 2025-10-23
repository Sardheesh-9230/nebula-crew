# VitaCare Frontend

React-based frontend for VitaCare - Unified National Healthcare Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_APP_NAME=VitaCare
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Header, Loader)
│   └── dashboard/       # Dashboard-specific components
├── pages/               # Page components (Login, Dashboard, etc.)
├── redux/
│   ├── slices/         # Redux slices (auth, user, records)
│   └── store.js        # Redux store configuration
├── services/
│   └── api.js          # Axios API service with interceptors
├── i18n/
│   ├── config.js       # i18n configuration
│   └── locales/        # Translation files (en.json, hi.json)
├── utils/              # Utility functions
├── App.js              # Main app component with routing
└── index.js            # Application entry point
```

## 🎨 Features

- ✅ User authentication (login/register)
- ✅ Dashboard with health statistics
- ✅ Medical records management
- ✅ Appointments booking and management
- ✅ User profile management
- ✅ Multilingual support (English, Hindi)
- ✅ Responsive design (Material-UI)
- ✅ Redux state management
- ✅ JWT token authentication with auto-refresh
- ✅ Toast notifications

## 🌍 Internationalization (i18n)

The app supports multiple languages:
- English (en)
- Hindi (hi)

Add more languages by creating new JSON files in `src/i18n/locales/`

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Access token (15 min expiry)
- Refresh token (7 days expiry)
- Auto token refresh on 401 errors

## 📱 Pages

- `/login` - User login
- `/register` - New user registration
- `/dashboard` - Main dashboard with health overview
- `/profile` - User profile management
- `/records` - Medical records viewer
- `/appointments` - Appointments management

## 🎨 Theming

The app uses Material-UI with a custom theme. Modify the theme in `src/index.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📦 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (⚠️ one-way operation)

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |
| `REACT_APP_APP_NAME` | Application name | `VitaCare` |

## 🛠️ Tech Stack

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalization**: react-i18next
- **Notifications**: React Toastify
- **Form Handling**: React Hook Form

## 📝 API Integration

The app connects to the VitaCare backend API. Make sure the backend is running on the configured `REACT_APP_API_URL`.

API service includes:
- Automatic JWT token attachment
- Token refresh on expiry
- Error handling
- Request/response interceptors

## 🎯 Future Enhancements

- [ ] Telemedicine video consultation
- [ ] AI chatbot integration
- [ ] Document upload and viewer
- [ ] Appointment reminders
- [ ] Push notifications
- [ ] Offline support (PWA)
- [ ] More language support
- [ ] Dark mode theme

## 📄 License

MIT License

## 👥 Contributors

VitaCare Development Team

---

Made with ❤️ for India's Healthcare System
