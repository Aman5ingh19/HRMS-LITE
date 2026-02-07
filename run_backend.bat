@echo off
REM One-Click Django Backend Startup Script
REM This script starts the Django server with proper virtual environment activation

echo ========================================
echo Django HRMS Backend Startup
echo ========================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo Current Directory: %CD%
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python is installed and added to PATH
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo Virtual environment activated!
echo.

REM Check if Django is installed
echo Checking Django installation...
python -c "import django" 2>nul

if errorlevel 1 (
    echo Django not found. Installing dependencies...
    echo.
    pip install --upgrade pip
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Verify all required packages
echo Verifying required packages...
python -c "import django; import rest_framework; import pymongo; import dns; print('All packages verified!')"

if errorlevel 1 (
    echo ERROR: Some packages are missing. Installing...
    pip install django djangorestframework pymongo dnspython
    if errorlevel 1 (
        echo ERROR: Failed to install required packages
        pause
        exit /b 1
    )
)

echo.

REM Navigate to Django project
cd backend\hrms

if errorlevel 1 (
    echo ERROR: backend\hrms directory not found
    pause
    exit /b 1
)

echo Current Directory: %CD%
echo.

REM Run Django system check
echo Running Django system check...
python manage.py check

if errorlevel 1 (
    echo ERROR: Django system check failed
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting Django Development Server
echo ========================================
echo.
echo Server will be available at:
echo   http://127.0.0.1:8000
echo   http://localhost:8000
echo.
echo API Endpoints:
echo   http://127.0.0.1:8000/api/employees/
echo   http://127.0.0.1:8000/api/attendance/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start Django server
python manage.py runserver

REM If server stops, pause to see any error messages
pause
