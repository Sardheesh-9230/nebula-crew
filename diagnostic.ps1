# VitaCare Diagnostic Script
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   VitaCare System Diagnostic Check" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found!" -ForegroundColor Red
}

# Check npm
Write-Host "✓ Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm not found!" -ForegroundColor Red
}

# Check MongoDB connection
Write-Host "✓ Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet
    if ($mongoTest) {
        Write-Host "  MongoDB: Connected on port 27017" -ForegroundColor Green
    } else {
        Write-Host "  ✗ MongoDB not running on port 27017" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Cannot check MongoDB" -ForegroundColor Red
}

# Check Backend server
Write-Host "✓ Checking Backend Server..." -ForegroundColor Yellow
try {
    $backendTest = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet
    if ($backendTest) {
        Write-Host "  Backend: Running on port 5000" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Backend not running on port 5000" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Cannot check backend" -ForegroundColor Red
}

# Check Frontend server
Write-Host "✓ Checking Frontend Server..." -ForegroundColor Yellow
try {
    $frontendTest = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
    if ($frontendTest) {
        Write-Host "  Frontend: Running on port 3000" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Frontend not running on port 3000" -ForegroundColor Yellow
        Write-Host "    Run: cd vitacare-frontend; npm start" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ✗ Cannot check frontend" -ForegroundColor Red
}

# Check if node_modules exist
Write-Host "✓ Checking Dependencies..." -ForegroundColor Yellow
$backendModules = Test-Path "C:\Users\subas\Desktop\Nebula\vitacare-backend\node_modules"
$frontendModules = Test-Path "C:\Users\subas\Desktop\Nebula\vitacare-frontend\node_modules"

if ($backendModules) {
    Write-Host "  Backend node_modules: ✓" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend node_modules missing - run: cd vitacare-backend; npm install" -ForegroundColor Red
}

if ($frontendModules) {
    Write-Host "  Frontend node_modules: ✓" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend node_modules missing - run: cd vitacare-frontend; npm install" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Diagnostic Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
