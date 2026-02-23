# Windows Setup Script
Write-Host "Installing Internal Marks Calculator..." -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`nChecking Node.js installation..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "Node.js $nodeVersion found!" -ForegroundColor Green
} else {
    Write-Host "Node.js not found! Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install backend dependencies!" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location client
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install frontend dependencies!" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "`nCreating .env file..." -ForegroundColor Yellow
    @"
PORT=5000
DB_PATH=./database/internal_marks.db
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host ".env file created!" -ForegroundColor Green
} else {
    Write-Host "`n.env file already exists!" -ForegroundColor Cyan
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nTo start the application, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nThe application will be available at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "`n========================================`n" -ForegroundColor Cyan
