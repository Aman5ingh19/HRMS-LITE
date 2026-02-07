# Backend Verification Script
# This script checks if the backend is running and tests all endpoints

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Verification Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test if server is running
Write-Host "Testing if backend server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/employees/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend server is running!" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend server is NOT running!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the backend server:" -ForegroundColor Yellow
    Write-Host "   .\start_backend.ps1" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host ""

# Test attendance endpoint
Write-Host "Testing attendance endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/attendance/" -Method GET -TimeoutSec 5
    Write-Host "✅ Attendance endpoint is accessible!" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Attendance endpoint failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available Endpoints:" -ForegroundColor Green
Write-Host "  GET    http://127.0.0.1:8000/api/employees/" -ForegroundColor White
Write-Host "  POST   http://127.0.0.1:8000/api/employees/add/" -ForegroundColor White
Write-Host "  DELETE http://127.0.0.1:8000/api/employees/delete/<emp_id>/" -ForegroundColor White
Write-Host ""
Write-Host "  POST   http://127.0.0.1:8000/api/attendance/checkin/" -ForegroundColor White
Write-Host "  POST   http://127.0.0.1:8000/api/attendance/checkout/" -ForegroundColor White
Write-Host "  GET    http://127.0.0.1:8000/api/attendance/" -ForegroundColor White
Write-Host "  GET    http://127.0.0.1:8000/api/attendance/<employee_id>/" -ForegroundColor White
Write-Host ""
