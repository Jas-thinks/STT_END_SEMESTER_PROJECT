# 🔧 PROFILE FIX - RESTART INSTRUCTIONS

## The Problem
Your backend server needs to be restarted to load the fixed routes. The error shows:
```
Cannot GET /api/users/profile
```

This is because the old code had a bug that prevented the routes from being registered properly.

## What Was Fixed
✅ Fixed authentication middleware in `/server/src/routes/userRoutes.js`
✅ Fixed streak field access in `/server/src/controllers/userController.js`
✅ Enhanced error handling in `/frontend/src/pages/Profile.jsx`

## 🚀 How to Restart (Choose One Method)

### Method 1: Using Terminal (Recommended)

#### Terminal 1 - Backend:
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/frontend
npm run dev
```

### Method 2: Using Script
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform
chmod +x restart-servers.sh
./restart-servers.sh
```

### Method 3: Kill and Restart
```bash
# Kill existing processes
lsof -ti:5000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start backend (in one terminal)
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
npm run dev

# Start frontend (in another terminal)
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/frontend
npm run dev
```

## ✅ Verify the Fix

### 1. Check Backend Console
You should see:
```
Server running on port 5000
MongoDB Connected
```

### 2. Check Frontend Console
You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### 3. Test in Browser

1. **Open** http://localhost:5173
2. **Login** with your credentials
3. **Click** "Profile" in the navbar
4. **Check Browser Console** (F12) - You should see:
   ```
   Profile API Response: {success: true, data: {...}}
   ```
5. **Verify** No 404 error in Network tab

### 4. If Profile Page Still Doesn't Load

Check browser console for error messages. Common issues:

#### "Not authorized, no token"
**Solution**: Logout and login again to get a fresh token

#### Still getting 404
**Solution**: 
1. Make sure backend server restarted successfully
2. Check backend console for route registration
3. Verify MongoDB is running: `docker ps` or `systemctl status mongod`

#### "Failed to load profile"
**Solution**: Check backend logs for specific error message

## 🧪 Test API Directly (Optional)

```bash
# After logging in, get your token from browser console:
# localStorage.getItem('token')

# Then test:
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Your Name",
      "email": "your@email.com",
      ...
    },
    "statistics": {
      "totalQuizzes": 0,
      "averageScore": 0,
      "rank": "Beginner",
      "level": 1,
      "xp": 0,
      "streak": 0
    },
    "categoryPerformance": [],
    "recentBadges": []
  }
}
```

## 📋 Checklist After Restart

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors  
- [ ] Can login successfully
- [ ] Can navigate to /profile
- [ ] Profile page loads (no 404)
- [ ] Can see profile data
- [ ] Can switch between tabs (Overview, History, Settings)
- [ ] No errors in browser console

## 🆘 If Still Not Working

1. **Check MongoDB**: Make sure MongoDB is running
   ```bash
   docker ps | grep mongo
   # OR
   systemctl status mongod
   ```

2. **Check Environment Variables**: 
   ```bash
   cat /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server/.env
   ```
   Should have:
   - MONGODB_URI
   - JWT_SECRET
   - PORT=5000

3. **Clear Browser Cache**: 
   - Press Ctrl+Shift+Delete
   - Clear cached files
   - Restart browser

4. **Check Node Version**:
   ```bash
   node --version  # Should be v14 or higher
   npm --version
   ```

5. **Reinstall Dependencies** (if all else fails):
   ```bash
   cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
   rm -rf node_modules package-lock.json
   npm install
   
   cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Debug Information

If you need help, provide these details:

1. **Backend Console Output**: First 20 lines after starting server
2. **Frontend Console Output**: Any error messages
3. **Browser Console**: Network tab showing the failed request
4. **cURL Test Result**: Output of the curl command above

## 🎉 Success Indicators

When everything works, you'll see:

✅ Profile page loads instantly
✅ Your name and email displayed
✅ Statistics cards showing your data (or 0 for new users)
✅ Three tabs working: Overview, History, Settings
✅ Edit button functional
✅ No console errors

---

**Need More Help?**
Check the detailed fix documentation: `PROFILE_FIX.md`
