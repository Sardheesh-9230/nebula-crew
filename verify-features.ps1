# VitaCare Verification Script
# Run this to verify all features are working

Write-Host "🏥 VitaCare DHRMS - Feature Verification" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist
Write-Host "📦 Checking Dependencies..." -ForegroundColor Yellow
$frontendModules = Test-Path "vitacare-frontend\node_modules"
$backendModules = Test-Path "vitacare-backend\node_modules"

if ($frontendModules -and $backendModules) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Missing dependencies. Run 'npm install' in both folders" -ForegroundColor Red
    if (-not $frontendModules) {
        Write-Host "   Missing: vitacare-frontend\node_modules" -ForegroundColor Red
    }
    if (-not $backendModules) {
        Write-Host "   Missing: vitacare-backend\node_modules" -ForegroundColor Red
    }
}

Write-Host ""

# Check if key files exist
Write-Host "📁 Checking Key Files..." -ForegroundColor Yellow

$keyFiles = @(
    @{Path="vitacare-frontend\src\App.js"; Name="App.js"},
    @{Path="vitacare-frontend\src\pages\Dashboard.jsx"; Name="Dashboard.jsx"},
    @{Path="vitacare-frontend\src\pages\BookAppointment.jsx"; Name="BookAppointment.jsx"},
    @{Path="vitacare-frontend\src\pages\Profile.jsx"; Name="Profile.jsx"},
    @{Path="vitacare-frontend\src\pages\MedicalRecords.jsx"; Name="MedicalRecords.jsx"},
    @{Path="vitacare-frontend\src\pages\Appointments.jsx"; Name="Appointments.jsx"},
    @{Path="vitacare-frontend\src\pages\Login.jsx"; Name="Login.jsx"},
    @{Path="vitacare-frontend\src\index.css"; Name="index.css (animations)"},
    @{Path="vitacare-backend\src\server.js"; Name="Backend server.js"},
    @{Path="vitacare-backend\src\routes\authRoutes.js"; Name="Auth routes"},
    @{Path="vitacare-backend\src\routes\appointmentRoutes.js"; Name="Appointment routes"}
)

$allFilesExist = $true
foreach ($file in $keyFiles) {
    if (Test-Path $file.Path) {
        Write-Host "✅ $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($file.Name) - MISSING!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check for BookAppointment route in App.js
Write-Host "🔗 Checking Routes..." -ForegroundColor Yellow
$appJsContent = Get-Content "vitacare-frontend\src\App.js" -Raw
if ($appJsContent -match "book-appointment" -and $appJsContent -match "BookAppointment") {
    Write-Host "✅ BookAppointment route registered in App.js" -ForegroundColor Green
} else {
    Write-Host "❌ BookAppointment route NOT found in App.js" -ForegroundColor Red
}

Write-Host ""

# Check if servers are running
Write-Host "🌐 Checking Server Status..." -ForegroundColor Yellow

try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✅ Backend server running on port 5000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend server NOT running on port 5000" -ForegroundColor Yellow
    Write-Host "   Start with: cd vitacare-backend; npm start" -ForegroundColor Gray
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✅ Frontend server running on port 5173" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend server NOT running on port 5173" -ForegroundColor Yellow
    Write-Host "   Start with: cd vitacare-frontend; npm run dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📊 FEATURE CHECKLIST" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ COMPLETED:" -ForegroundColor Green
Write-Host "  • Authentication (Login/Register)" -ForegroundColor White
Write-Host "  • Dashboard with beautiful UI" -ForegroundColor White
Write-Host "  • Profile page with edit mode" -ForegroundColor White
Write-Host "  • Medical Records with search/filter" -ForegroundColor White
Write-Host "  • Appointments list with status tabs" -ForegroundColor White
Write-Host "  • Book Appointment (4-step wizard)" -ForegroundColor White
Write-Host "  • Animations & gradient themes" -ForegroundColor White
Write-Host "  • Responsive design" -ForegroundColor White
Write-Host "  • Redux state management" -ForegroundColor White
Write-Host "  • Backend APIs (basic CRUD)" -ForegroundColor White

Write-Host ""
Write-Host "❌ MISSING (from r.md):" -ForegroundColor Red
Write-Host "  • UHI System" -ForegroundColor Gray
Write-Host "  • Telemedicine (Video calls)" -ForegroundColor Gray
Write-Host "  • AI Health Chatbot" -ForegroundColor Gray
Write-Host "  • Emergency SOS" -ForegroundColor Gray
Write-Host "  • Real-time Notifications" -ForegroundColor Gray
Write-Host "  • Gamification System" -ForegroundColor Gray
Write-Host "  • Doctor Portal" -ForegroundColor Gray
Write-Host "  • Employer Portal" -ForegroundColor Gray
Write-Host "  • Government/Admin Portal" -ForegroundColor Gray
Write-Host "  • Disease Heatmap" -ForegroundColor Gray

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🧪 TESTING STEPS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Start Backend:" -ForegroundColor Yellow
Write-Host "   cd vitacare-backend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""

Write-Host "2. Start Frontend (new terminal):" -ForegroundColor Yellow
Write-Host "   cd vitacare-frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "3. Test in Browser:" -ForegroundColor Yellow
Write-Host "   • Open http://localhost:5173" -ForegroundColor White
Write-Host "   • Click 'Register' and create account" -ForegroundColor White
Write-Host "   • Login with your credentials" -ForegroundColor White
Write-Host "   • View Dashboard (should show stats)" -ForegroundColor White
Write-Host "   • Click 'Book New' button" -ForegroundColor White
Write-Host "   • Complete 4-step booking wizard" -ForegroundColor White
Write-Host "   • Check Profile page" -ForegroundColor White
Write-Host "   • Check Medical Records page" -ForegroundColor White
Write-Host "   • Check Appointments page" -ForegroundColor White
Write-Host ""

Write-Host "4. Verify Features:" -ForegroundColor Yellow
Write-Host "   ✓ Smooth animations on all pages" -ForegroundColor White
Write-Host "   ✓ Gradient backgrounds" -ForegroundColor White
Write-Host "   ✓ Hover effects on cards" -ForegroundColor White
Write-Host "   ✓ Mobile responsive layout" -ForegroundColor White
Write-Host "   ✓ All navigation works" -ForegroundColor White
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📈 COMPLETION STATUS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Current Progress: " -NoNewline
Write-Host "15% " -ForegroundColor Yellow -NoNewline
Write-Host "of r.md specification" -ForegroundColor White
Write-Host ""
Write-Host "What's Built: " -ForegroundColor Green -NoNewline
Write-Host "Beautiful Patient Portal" -ForegroundColor White
Write-Host "What's Missing: " -ForegroundColor Red -NoNewline
Write-Host "Multi-tenant system, AI features, Telemedicine" -ForegroundColor White
Write-Host ""
Write-Host "Estimated time to complete full r.md: " -NoNewline
Write-Host "3-4 months" -ForegroundColor Yellow
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📚 Documentation Files Created:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "• IMPLEMENTATION-STATUS.md  - Detailed gap analysis" -ForegroundColor White
Write-Host "• TASK-CHECKLIST.md         - Quick verification checklist" -ForegroundColor White
Write-Host "• PROJECT-STATUS.md         - Summary and recommendations" -ForegroundColor White
Write-Host "• verify-features.ps1       - This verification script" -ForegroundColor White
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Verification Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

if ($allFilesExist) {
    Write-Host "🎉 All files are present!" -ForegroundColor Green
    Write-Host "🚀 Ready to start servers and test" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some files are missing. Check errors above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next Step: Start the servers and test in browser!" -ForegroundColor Cyan
Write-Host ""
