#!/bin/bash
# Django Backend Startup Script for Git Bash
# Run this from the project root: ./start_backend.sh

echo "========================================"
echo "Starting Django HRMS Backend"
echo "========================================"
echo ""

# Navigate to backend/hrms directory
cd backend/hrms

# Activate virtual environment
echo "Activating virtual environment..."
source ../../venv/Scripts/activate

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    read -p "Press Enter to exit"
    exit 1
fi

echo "Virtual environment activated!"
echo ""

# Start Django server
echo "Starting Django server at http://127.0.0.1:8000"
echo ""
echo "API Endpoints:"
echo "  http://127.0.0.1:8000/api/employees/"
echo "  http://127.0.0.1:8000/api/attendance/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver 127.0.0.1:8000
