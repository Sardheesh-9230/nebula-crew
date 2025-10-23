# PowerShell script to start frontend with optimizations
Write-Host "🚀 Starting VitaCare Frontend..." -ForegroundColor Cyan
Write-Host "⏳ This may take 2-3 minutes on first run..." -ForegroundColor Yellow
Write-Host ""

# Set environment variables for faster startup
$env:GENERATE_SOURCEMAP = "false"
$env:BROWSER = "none"
$env:FAST_REFRESH = "true"

# Start the server
npm start
