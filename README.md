# HRMS Lite – Full Stack HR Management System

A lightweight Human Resource Management System that allows an admin to manage employee records and track daily attendance. Built with React, Django REST Framework, and MongoDB Atlas.



##  Project Overview

HRMS Lite is a modern, full-stack web application designed for small to medium businesses to manage their HR operations efficiently. The system provides a clean, professional interface for managing employees and tracking attendance.



##  Features

### Employee Management
- ✅ Add new employees with complete details
- ✅ View comprehensive employee list
- ✅ Delete employee records
- ✅ Real-time data updates

### Attendance Tracking
- ✅ Employee check-in functionality
- ✅ Employee check-out functionality
- ✅ View attendance records
- ✅ Employee-specific attendance history

### Dashboard & Analytics
- ✅ Dashboard with summary statistics
- ✅ Total employees count
- ✅ Present today count
- ✅ Total attendance records



##  Tech Stack

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **Axios** - Promise-based HTTP client for API calls
- **React Router** - Declarative routing for React applications
- **CSS3** - Custom styling with modern design principles

### Backend
- **Django** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **PyMongo** - Python driver for MongoDB
- **CORS Headers** - Cross-Origin Resource Sharing support

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB database

### Deployment
- **Vercel** - Frontend deployment platform
- **Render** - Backend deployment platform

---

##  Project Structure

```
hrms-lite/
├── backend/
│   └── hrms/
│       ├── hrms/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── mongo.py
│       ├── employees/
│       │   ├── views.py
│       │   └── urls.py
│       ├── attendance/
│       │   ├── views.py
│       │   └── urls.py
│       └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── venv/
├── requirements.txt
└── README.md
```

---

##  How to Run Locally

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
# Navigate to project root
cd hrms-lite

# Start backend server
.\start_backend.ps1
```

**Backend will run at:** http://127.0.0.1:8000

### Frontend Setup

```bash
# Open new terminal and navigate to frontend
cd hrms-lite/frontend

# Install dependencies (first time only)
npm install

# Start React development server
npm start
```

**Frontend will run at:** http://localhost:3000

---

##  API Endpoints

### Employee APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | Get all employees |
| POST | `/api/employees/add/` | Add new employee |
| DELETE | `/api/employees/delete/{id}/` | Delete employee |

### Attendance APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/checkin/` | Employee check-in |
| POST | `/api/attendance/checkout/` | Employee check-out |
| GET | `/api/attendance/` | Get all attendance records |
| GET | `/api/attendance/{employee_id}/` | Get employee attendance |

---

##  Deployment Links

- **Frontend URL:** Coming Soon (Vercel)
- **Backend URL:** Coming Soon (Render)

---

##  Assumptions / Limitations

- **Single Admin System:** Designed for single admin user
- **No Authentication:** Basic system without user authentication
- **Core HR Operations:** Focuses on essential employee and attendance management
- **Development Environment:** Optimized for local development and testing

---

##  Author

**Aman Singh**


*HRMS Lite - Simplifying HR Management for Modern Businesses*
