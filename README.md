# HRMS Lite — Cloud-Native Full-Stack HR Management System


A modern, production-grade Human Resource Management System (HRMS) designed for agile organizations. Features real-time employee management, live attendance logging with check-in/out duration tracking, interactive attendance calendar, cloud media storage via Cloudinary CDN, role-based access control with Clerk & Guest Mode, and seamless Dark/Light theme switching.

---

## 🌟 Key Features

### 👥 1. Employee Management
- **Full CRUD Operations**: Add, update, view, and delete employee records.
- **Cloudinary Photo Uploads**: Upload profile photos directly to Cloudinary with smart face-centering crop and global CDN distribution.
- **Dynamic Search & Filtering**: Instant search across employee names, IDs, emails, and departments with pagination.
- **Safe Validation**: End-to-end type safety using Zod resolvers on the frontend and Pydantic schemas on the backend.

### 📅 2. Attendance & Daily Tracking
- **One-Click Check-In & Check-Out**: Real-time timestamps with automatic duration calculations (`Xh Ym`).
- **Live Attendance Calendar**: Monthly interactive visual calendar showing daily attendance rates with color-coded density indicators.
- **Historical Logs & Date Filtering**: Filter and inspect historical logs by specific dates or individual employee IDs.
- **Timezone-Aware Calculations**: Robust local date formatting ensuring accurate day-boundary calculations across all timezones.

### 📊 3. Live Operational Dashboard
- **Real Database Metrics**: 100% live synchronization with MongoDB Atlas:
  - *Total Employees* (Active count in database)
  - *Present Today* (Real-time check-in count & attendance rate percentage)
  - *Absent / Pending* (Remaining workforce count yet to mark attendance)
  - *Total Logs Recorded* (Lifetime historical attendance logs count)
- **Dynamic Department Breakdown**: Donut chart and legend automatically computed from active personnel records.
- **Recent Personnel Roster**: Live preview with instant attendance status badges (● *Present Today* / ○ *Not Marked*).

### 🔍 4. Global Omni-Search
- **Instant Search Popover**: Search from anywhere in the top navigation bar.
- **Multi-Entity Search**: Live auto-complete matching employees (by name, ID, department, email) and quick-jump navigation routes (*Dashboard, Attendance, Profile, Settings, Guide, About*).

### 🔐 5. Role-Based Access & Security
- **Clerk Identity Authentication**: Enterprise OAuth2 authentication, multi-factor security, and JWT authorization headers.
- **Curated Guest Mode**: Safe, read-only exploration mode allowing stakeholders and reviewers to evaluate all screens without risk of data alteration.
- **Admin Profile & Password Management**: Dedicated security tab with password strength analyzer, live requirements validator, and profile customization.

### 🌓 6. Adaptive Responsive UI & Dark Mode
- **Zero-Flicker Dark / Light Theme**: Full CSS variable system with native browser controls synchronization (`color-scheme`).
- **Responsive & Viewport Adaptive**: Optimized for seamless viewing across mobile, tablet, laptop, and desktop viewports (baseline 80% browser zoom adaptive).

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend SPA** | React 18, React Router v6, Lucide Icons, React Hot Toast, Axios | Client-side reactive interface |
| **Styling** | Vanilla CSS3 (Custom Design System, CSS Variables) | Premium modern aesthetics, glassmorphism & dark mode |
| **Backend API** | Django 4, Django REST Framework, Pydantic, Gunicorn | Production RESTful API with schema validation |
| **Database** | MongoDB Atlas (Cloud NoSQL Cluster), PyMongo | High-availability cloud document store |
| **Media & CDN** | Cloudinary Storage API | Cloud image hosting, face-detection crop & WebP delivery |
| **Authentication** | Clerk Auth Provider | JWT authentication and identity management |
| **Caching** | Redis / In-Memory Cache | Query response acceleration and rate limiting |

---

## 📁 Repository Structure

```
HRMS-LITE/
├── backend/
│   └── hrms/
│       ├── hrms/
│       │   ├── settings.py       # Django configuration (CORS, Cloudinary, Mongo)
│       │   ├── urls.py           # Main URL routing
│       │   └── mongo.py          # MongoDB Atlas cloud connection pool
│       ├── employees/
│       │   ├── views.py          # Employee CRUD, photo upload & avatar APIs
│       │   ├── urls.py           # Employee routing endpoints
│       │   └── validators.py     # Pydantic schema validators
│       ├── attendance/
│       │   ├── views.py          # Check-in, check-out & attendance queries
│       │   └── urls.py           # Attendance routing endpoints
│       ├── manage.py
│       └── .env                  # Backend environment variables (Mongo, Cloudinary)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/           # TopBar, Sidebar, EmployeeForm, AttendanceControls
│   │   ├── context/              # AuthContext (Clerk + Guest), ThemeContext
│   │   ├── pages/                # Dashboard, Employees, Attendance, Profile, Settings, About, Help
│   │   ├── services/             # Axios client, caching & API services
│   │   ├── App.js                # Router configuration & dynamic page metadata
│   │   ├── App.css               # Global theme tokens & layout shell
│   │   └── index.js
│   ├── package.json
│   └── .env                      # Frontend environment variables (API URL, Clerk Key)
├── requirements.txt              # Python backend dependencies
└── README.md
```

---

## 🚀 Cloud Environment Configuration

### Backend Configuration (`backend/hrms/.env`):
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=*

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hrms_db?retryWrites=true&w=majority
MONGO_DB_NAME=hrms_db

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=hrms-lite/employees
```

### Frontend Configuration (`frontend/.env`):
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **MongoDB Atlas** cluster connection URI
- **Cloudinary** account credentials

### 2. Backend Installation & Run
```bash
# Navigate to the backend directory
cd backend/hrms

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r ../../requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend Installation & Run
```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Open your browser and navigate to `http://localhost:3000`.

---

## 📡 REST API Reference

### 👤 Employee Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/employees/` | List paginated employees with query filter (`?page=1&limit=10&search=`) | No |
| `POST` | `/api/employees/add/` | Create a new employee record (Validated with Pydantic) | Admin |
| `DELETE` | `/api/employees/delete/<emp_id>/` | Delete employee & clean up associated Cloudinary media | Admin |
| `POST` | `/api/employees/upload-photo/` | Upload employee photo to Cloudinary CDN | Admin |
| `POST` | `/api/profile/upload-avatar/` | Upload admin profile picture to Cloudinary CDN | Admin |

### ⏱️ Attendance Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/attendance/checkin/` | Record employee check-in timestamp (`status: Present`) | Admin |
| `POST` | `/api/attendance/checkout/` | Record employee check-out & compute work duration | Admin |
| `GET` | `/api/attendance/` | Fetch historical attendance records with date filters | No |
| `GET` | `/api/attendance/<emp_id>/` | Retrieve attendance log history for a specific employee | No |

---

## 🛡️ Security & Architecture Best Practices
- **Strict Input Validation**: Dual-layer verification with frontend Zod schemas and backend Pydantic models preventing malformed payloads.
- **Asset Lifecycle Management**: When an employee record is deleted, their remote Cloudinary image is automatically destroyed via the Cloudinary Admin API.
- **Cache Management**: Instant cache invalidation strategies across Redis and client-side localStorage when records are created or deleted.
- **Guest Protection**: Server and UI defense layers intercept write operations during guest demo sessions.

---

## 👨‍💻 Author & Maintainer

**Aman Singh**  
 

*Built with ❤️ — Engineered for modern, high-performance HR management.*
