# VitaCare - Start All Servers Script
# This script starts MongoDB, Backend, and Frontend servers

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║            🏥 VitaCare - Starting All Servers              ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "   ✅ MongoDB is already running" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB is not running" -ForegroundColor Yellow
    Write-Host "   💡 Please start MongoDB manually or it will start automatically if installed as service" -ForegroundColor Cyan
    Write-Host ""
}

# Start Backend Server
Write-Host "🚀 Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "vitacare-backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🏥 VitaCare Backend Server' -ForegroundColor Cyan; npm start"
Write-Host "   ✅ Backend server starting in new window" -ForegroundColor Green
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "🚀 Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "vitacare-frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🏥 VitaCare Frontend Server' -ForegroundColor Cyan; npm start"
Write-Host "   ✅ Frontend server starting in new window" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║                    🎉 All Servers Started!                 ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  Backend:  http://localhost:5000                           ║" -ForegroundColor Green
Write-Host "║  Frontend: http://localhost:5173                           ║" -ForegroundColor Green
Write-Host "║  MongoDB:  mongodb://localhost:27017                       ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  Wait 30-60 seconds for servers to fully start...         ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Waiting 10 seconds before opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Open browser
Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✨ Done! Check the other PowerShell windows for server logs." -ForegroundColor Green
Write-Host "📚 Press Ctrl+C in each window to stop the servers." -ForegroundColor Yellow
