# Django Backend Startup Script for PowerShell
# Run this from the project root: .\start_backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Django HRMS Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend/hrms directory
Set-Location backend/hrms

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
& "..\..\venv\Scripts\Activate.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host ""

# Start Django server
Write-Host "Starting Django server at http://127.0.0.1:8000" -ForegroundColor Green
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor Cyan
Write-Host "  http://127.0.0.1:8000/api/employees/" -ForegroundColor White
Write-Host "  http://127.0.0.1:8000/api/attendance/" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python manage.py runserver 127.0.0.1:8000
