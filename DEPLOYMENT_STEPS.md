# 🚀 HRMS Lite - Complete Deployment Guide

## ✅ Prerequisites Completed
- [x] Code pushed to GitHub: https://github.com/Aman5ingh19/HRMS-LITE
- [x] Environment variables configured
- [x] MongoDB Atlas database ready
- [x] Production build tested

---

## 📋 PHASE 1: DEPLOY BACKEND ON RENDER

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **HRMS-LITE**

### Step 3: Configure Backend Service

**Basic Settings:**
```
Name: hrms-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend/hrms
```

**Build & Deploy Settings:**
```
Runtime: Python 3
Build Command: pip install -r ../../requirements.txt
Start Command: gunicorn hrms.wsgi:application --bind 0.0.0.0:$PORT
```

**Instance Type:**
```
Free (or Starter if you want faster performance)
```

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these **EXACT** variables:

```
MONGO_URI
mongodb+srv://hrmsadmin:Hrms12345@cluster0.zw2j1tk.mongodb.net/?retryWrites=true&w=majority

SECRET_KEY
django-insecure-CHANGE-THIS-IN-PRODUCTION-xyz123abc456

DEBUG
False

ALLOWED_HOSTS
your-app-name.onrender.com

CORS_ALLOWED_ORIGINS
https://your-vercel-app.vercel.app

PYTHON_VERSION
3.11.0
```

**⚠️ IMPORTANT:**
- Replace `your-app-name` with your actual Render app name
- Replace `your-vercel-app` with your Vercel app name (you'll get this in Phase 2)
- For now, use a placeholder for CORS_ALLOWED_ORIGINS, we'll update it later

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll see: **"Your service is live 🎉"**

### Step 6: Get Backend URL
Your backend URL will be:
```
https://your-app-name.onrender.com
```

**Test it:**
```
https://your-app-name.onrender.com/api/employees/
```
Should return: `[]` (empty array) or your employee data

---

## 📋 PHASE 2: DEPLOY FRONTEND ON VERCEL

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find and select: **HRMS-LITE**
3. Click **"Import"**

### Step 3: Configure Frontend

**Framework Preset:**
```
Create React App (auto-detected)
```

**Root Directory:**
```
frontend
```

**Build Settings:**
```
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Step 4: Add Environment Variable

Click **"Environment Variables"** tab

Add this variable:

```
Name: REACT_APP_API_URL
Value: https://your-render-backend.onrender.com/api
```

**Replace** `your-render-backend` with your actual Render backend URL from Phase 1

### Step 5: Deploy Frontend
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once deployed, you'll get your live URL

Your frontend URL will be:
```
https://your-app-name.vercel.app
```

---

## 📋 PHASE 3: UPDATE CORS SETTINGS

### Step 1: Update Backend CORS
1. Go back to Render dashboard
2. Open your **hrms-backend** service
3. Go to **"Environment"** tab
4. Find **CORS_ALLOWED_ORIGINS**
5. Update to your actual Vercel URL:

```
CORS_ALLOWED_ORIGINS
https://your-actual-app.vercel.app,https://your-actual-app-git-main.vercel.app
```

**Note:** Include both URLs (main and git-main) for preview deployments

### Step 2: Redeploy Backend
1. Go to **"Manual Deploy"** tab
2. Click **"Deploy latest commit"**
3. Wait for redeployment (2-3 minutes)

---

## 📋 PHASE 4: PRODUCTION SMOKE TEST

### Test 1: Backend Health Check
```
https://your-backend.onrender.com/api/employees/
```
✅ Expected: JSON array (empty or with data)
❌ If error: Check Render logs

### Test 2: Frontend Loads
```
https://your-frontend.vercel.app
```
✅ Expected: Dashboard loads with dark theme
❌ If error: Check Vercel deployment logs

### Test 3: Add Employee
1. Go to Employees page
2. Fill form:
   - Employee ID: TEST001
   - Full Name: Test User
   - Email: test@example.com
   - Department: IT
3. Click "Add Employee"

✅ Expected: Success message, employee appears in table
❌ If error: Check browser console (F12)

### Test 4: Mark Attendance
1. Go to Attendance page
2. Select employee: TEST001
3. Click "Check In"
4. Wait 2 seconds
5. Click "Check Out"

✅ Expected: Success messages, attendance record appears
❌ If error: Check browser console

### Test 5: View Dashboard
1. Go to Dashboard
2. Check stats cards update
3. Check calendar shows attendance

✅ Expected: All data displays correctly
❌ If error: Check browser console

### Test 6: Browser Console Check
1. Press F12 (Developer Tools)
2. Go to Console tab
3. Check for errors

✅ Expected: No red errors
❌ Common issues:
- CORS error → Update CORS_ALLOWED_ORIGINS on Render
- API not found → Check REACT_APP_API_URL on Vercel
- 500 error → Check Render backend logs

---

## 🐛 TROUBLESHOOTING

### Issue: CORS Error in Browser Console
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
1. Go to Render → Environment
2. Update CORS_ALLOWED_ORIGINS with your Vercel URL
3. Redeploy backend

### Issue: API calls return 404
```
GET https://your-backend.onrender.com/api/employees/ 404
```
**Solution:**
1. Check Render logs for errors
2. Verify build command ran successfully
3. Check if gunicorn started properly

### Issue: Backend won't start
```
Error: No module named 'django'
```
**Solution:**
1. Check build command: `pip install -r ../../requirements.txt`
2. Verify requirements.txt path is correct
3. Check Render logs for specific error

### Issue: Frontend shows blank page
**Solution:**
1. Check Vercel deployment logs
2. Verify build completed successfully
3. Check browser console for errors
4. Verify REACT_APP_API_URL is set correctly

### Issue: Database connection failed
```
pymongo.errors.ServerSelectionTimeoutError
```
**Solution:**
1. Go to MongoDB Atlas
2. Network Access → Add IP: `0.0.0.0/0` (allow all)
3. Verify MONGO_URI is correct in Render environment variables

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend deployed on Render
- [ ] Backend URL accessible
- [ ] Frontend deployed on Vercel
- [ ] Frontend URL accessible
- [ ] CORS configured correctly
- [ ] Can add employees
- [ ] Can mark attendance
- [ ] Dashboard shows data
- [ ] Calendar displays attendance
- [ ] No console errors
- [ ] MongoDB Atlas connected

---

## 📝 FINAL URLS

**Backend API:**
```
https://your-backend.onrender.com/api/
```

**Frontend App:**
```
https://your-frontend.vercel.app
```

**GitHub Repository:**
```
https://github.com/Aman5ingh19/HRMS-LITE
```

---

## 🎉 DEPLOYMENT COMPLETE!

Your HRMS Lite application is now live and accessible worldwide!

**Next Steps:**
1. Share your live URLs
2. Add them to your README.md
3. Update your portfolio
4. Add to your resume

**Congratulations! 🚀**

