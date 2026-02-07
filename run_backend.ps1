# One-Click Django Backend Startup Script for PowerShell
# This script starts the Django server with proper virtual environment activation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Django HRMS Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory and navigate to it
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check if virtual environment exists
if (-Not (Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
        Write-Host "Make sure Python is installed and added to PATH" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Virtual environment created successfully!" -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
& "venv\Scripts\Activate.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host ""

# Check if Django is installed
Write-Host "Checking Django installation..." -ForegroundColor Green
$djangoCheck = python -c "import django" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Django not found. Installing dependencies..." -ForegroundColor Yellow
    Write-Host ""
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Verify all required packages
Write-Host "Verifying required packages..." -ForegroundColor Green
$verifyResult = python -c "import django; import rest_framework; import pymongo; import dns; print('All packages verified!')" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Some packages are missing. Installing..." -ForegroundColor Yellow
    pip install django djangorestframework pymongo dnspython
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install required packages" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host $verifyResult -ForegroundColor Green
}

Write-Host ""

# Navigate to Django project
Set-Location "backend\hrms"

if (-Not (Test-Path "manage.py")) {
    Write-Host "ERROR: manage.py not found in backend\hrms" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Run Django system check
Write-Host "Running Django system check..." -ForegroundColor Green
python manage.py check

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Django system check failed" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Django Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor Green
Write-Host "  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor Green
Write-Host "  http://127.0.0.1:8000/api/employees/" -ForegroundColor White
Write-Host "  http://127.0.0.1:8000/api/attendance/" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start Django server
python manage.py runserver

# If server stops, pause to see any error messages
Read-Host "Press Enter to exit"
