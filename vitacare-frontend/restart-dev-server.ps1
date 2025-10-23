# VitaCare Frontend - Restart Development Server
Write-Host "=== VitaCare Frontend - Clean Restart ===" -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location $PSScriptRoot

Write-Host "`n1. Clearing webpack cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Write-Host "   ✓ Cache cleared" -ForegroundColor Green

Write-Host "`n2. Clearing browser cache..." -ForegroundColor Yellow
Write-Host "   → Please clear browser cache manually (Ctrl+Shift+Delete)" -ForegroundColor Cyan
Write-Host "   → Or use hard refresh (Ctrl+Shift+R)" -ForegroundColor Cyan

Write-Host "`n3. Starting development server..." -ForegroundColor Yellow
Write-Host "   → Server will start in a moment..." -ForegroundColor Cyan
Write-Host "   → Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Start the dev server
npm start
