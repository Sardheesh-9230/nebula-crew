Write-Host "Starting VitaCare Frontend Server..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Set-Location -Path "S:\Hack_it_on\nebula-crew\vitacare-frontend"

# Set environment variables
$env:BROWSER = "none"
$env:PORT = "5173"

Write-Host "Starting React development server on port 5173..." -ForegroundColor Yellow

# Start the frontend server
npm start
