Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "          VitaCare - Server Status Check                  " -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Backend (Port 5000)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 5
    Write-Host "  Backend: RUNNING" -ForegroundColor Green
    Write-Host "  Message: $($backendResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "  Backend: NOT RUNNING" -ForegroundColor Red
    Write-Host "  Run: cd vitacare-backend; npm start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking Frontend (Port 5173)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing
    Write-Host "  Frontend: RUNNING" -ForegroundColor Green
    Write-Host "  Status: $($frontendResponse.StatusCode) OK" -ForegroundColor Gray
} catch {
    Write-Host "  Frontend: NOT RUNNING" -ForegroundColor Red
    Write-Host "  Run: cd vitacare-frontend; npm start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking MongoDB (Port 27017)..." -ForegroundColor Yellow
$mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($mongoTest) {
    Write-Host "  MongoDB: RUNNING" -ForegroundColor Green
} else {
    Write-Host "  MongoDB: NOT RUNNING" -ForegroundColor Red
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Green
Write-Host "                   Quick Access URLs                       " -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Green
Write-Host "  Frontend:     http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Health Check: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Green
Write-Host ""
