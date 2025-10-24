# VitaCare Backend Restart Script
# This script will restart the backend server to load the latest admin routes

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  VitaCare Backend Restart Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Stop any existing node processes running on port 5000
Write-Host "Step 1: Stopping existing backend server..." -ForegroundColor Yellow
$processesOnPort5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($processesOnPort5000) {
    foreach ($pid in $processesOnPort5000) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Stopped process $pid" -ForegroundColor Green
    }
} else {
    Write-Host "  No processes found on port 5000" -ForegroundColor Gray
}

Start-Sleep -Seconds 2

# Navigate to backend directory
Write-Host ""
Write-Host "Step 2: Navigating to backend directory..." -ForegroundColor Yellow
Set-Location "c:\Users\subas\Desktop\Nebula\vitacare-backend"
Write-Host "  ✓ Current directory: $(Get-Location)" -ForegroundColor Green

# Check if node_modules exists
Write-Host ""
Write-Host "Step 3: Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "  ✓ Dependencies already installed" -ForegroundColor Green
}

# Check if .env file exists
Write-Host ""
Write-Host "Step 4: Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "  ⚠ WARNING: .env file not found!" -ForegroundColor Red
    Write-Host "  Please create a .env file with the following variables:" -ForegroundColor Yellow
    Write-Host "    - MONGODB_URI" -ForegroundColor Gray
    Write-Host "    - JWT_SECRET" -ForegroundColor Gray
    Write-Host "    - JWT_REFRESH_SECRET" -ForegroundColor Gray
    Write-Host "    - PORT=5000" -ForegroundColor Gray
}

# Start the backend server
Write-Host ""
Write-Host "Step 5: Starting backend server..." -ForegroundColor Yellow
Write-Host "  Server will start on http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Start the server
npm start
