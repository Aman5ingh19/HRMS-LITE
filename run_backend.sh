#!/bin/bash
# One-Click Django Backend Startup Script for Git Bash
# This script starts the Django server with proper virtual environment activation

echo "========================================"
echo "Django HRMS Backend Startup"
echo "========================================"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Current Directory: $(pwd)"
echo ""

# Check if virtual environment exists
if [ ! -f "venv/Scripts/activate" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Creating virtual environment..."
    python -m venv venv
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        echo "Make sure Python is installed and added to PATH"
        read -p "Press Enter to exit"
        exit 1
    fi
    
    echo "Virtual environment created successfully!"
    echo ""
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/Scripts/activate

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    read -p "Press Enter to exit"
    exit 1
fi

echo "Virtual environment activated!"
echo ""

# Check if Django is installed
echo "Checking Django installation..."
python -c "import django" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "Django not found. Installing dependencies..."
    echo ""
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        read -p "Press Enter to exit"
        exit 1
    fi
    
    echo "Dependencies installed successfully!"
    echo ""
fi

# Verify all required packages
echo "Verifying required packages..."
python -c "import django; import rest_framework; import pymongo; import dns; print('All packages verified!')"

if [ $? -ne 0 ]; then
    echo "ERROR: Some packages are missing. Installing..."
    pip install django djangorestframework pymongo dnspython
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install required packages"
        read -p "Press Enter to exit"
        exit 1
    fi
fi

echo ""

# Navigate to Django project
cd backend/hrms

if [ $? -ne 0 ]; then
    echo "ERROR: backend/hrms directory not found"
    read -p "Press Enter to exit"
    exit 1
fi

echo "Current Directory: $(pwd)"
echo ""

# Run Django system check
echo "Running Django system check..."
python manage.py check

if [ $? -ne 0 ]; then
    echo "ERROR: Django system check failed"
    echo "Please check the error messages above"
    read -p "Press Enter to exit"
    exit 1
fi

echo ""
echo "========================================"
echo "Starting Django Development Server"
echo "========================================"
echo ""
echo "Server will be available at:"
echo "  http://127.0.0.1:8000"
echo "  http://localhost:8000"
echo ""
echo "API Endpoints:"
echo "  http://127.0.0.1:8000/api/employees/"
echo "  http://127.0.0.1:8000/api/attendance/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Django server
python manage.py runserver

# If server stops, pause to see any error messages
read -p "Press Enter to exit"
