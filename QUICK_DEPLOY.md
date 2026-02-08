# ⚡ Quick Deployment Reference

## 🔴 RENDER (Backend)

**Settings:**
```
Root Directory: backend/hrms
Build: pip install -r ../../requirements.txt
Start: gunicorn hrms.wsgi:application --bind 0.0.0.0:$PORT
```

**Environment Variables:**
```
MONGO_URI=mongodb+srv://hrmsadmin:Hrms12345@cluster0.zw2j1tk.mongodb.net/?retryWrites=true&w=majority
SECRET_KEY=django-insecure-CHANGE-THIS
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
PYTHON_VERSION=3.11.0
```

---

## 🔵 VERCEL (Frontend)

**Settings:**
```
Root Directory: frontend
Build: npm run build
Output: build
```

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## ✅ Test URLs

**Backend:**
```
https://your-backend.onrender.com/api/employees/
```

**Frontend:**
```
https://your-frontend.vercel.app
```

---

## 🐛 Quick Fixes

**CORS Error?**
→ Update CORS_ALLOWED_ORIGINS on Render with Vercel URL

**API 404?**
→ Check Render logs, verify build command

**Blank Page?**
→ Check REACT_APP_API_URL on Vercel

**Database Error?**
→ MongoDB Atlas → Network Access → Add 0.0.0.0/0

