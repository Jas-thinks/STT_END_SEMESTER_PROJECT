# 🚀 QUICK START COMMANDS

## One-Time Setup

```bash
# 1. Navigate to project
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Install frontend dependencies
cd client && npm install && cd ..

# 4. Make quickstart script executable
chmod +x quickstart.sh
```

## Daily Development Workflow

### Terminal 1 - Backend Server
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
npm run dev
```
**Expected Output:**
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: localhost
📊 Database: interview-prep-platform
```

### Terminal 2 - Frontend Server
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/client
npm run dev
```
**Expected Output:**
```
VITE v4.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Terminal 3 - MongoDB (if needed)
```bash
sudo systemctl start mongod
# Or
mongod
```

## Testing the System

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"OK","message":"TheTrueTest Server is running"}`

### 2. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 4. Open Frontend
```bash
# In browser, go to:
http://localhost:5173
```

## Database Operations

### Seed Questions (First Time Only)
```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
node src/utils/seedDatabase.js
```

### View Database (MongoDB Compass)
```
Connection String: mongodb://localhost:27017
Database: interview-prep-platform
Collections: users, questions, quizattempts, performances
```

### Clear Database (Reset)
```bash
mongosh interview-prep-platform --eval "db.dropDatabase()"
```

## Common Issues & Fixes

### ❌ "Port 5000 already in use"
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

### ❌ "MongoDB connection failed"
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### ❌ "Cannot find module"
```bash
# Reinstall dependencies
cd server && rm -rf node_modules package-lock.json && npm install
cd ../client && rm -rf node_modules package-lock.json && npm install
```

### ❌ Frontend can't connect to backend
```bash
# Check CORS settings in server/src/config/env.js
# Make sure CLIENT_URL = http://localhost:5173
```

## Development Tips

### Watch Backend Logs
```bash
cd server
npm run dev | grep -E "Error|Success|✅|❌|🚀"
```

### Check API Calls in Browser
- Open DevTools (F12)
- Go to Network tab
- Filter: XHR
- Start quiz and watch API calls

### Quick Test Flow
1. Register new user
2. Login
3. Go to /quiz
4. Select subject & difficulty
5. Start quiz
6. Answer questions
7. Submit
8. Check score saved in database

## File Locations

### Backend
```
server/
├── .env                    # Environment variables
├── server.js               # Main entry point
├── src/
│   ├── config/database.js  # MongoDB connection
│   ├── models/User.js      # User model
│   ├── controllers/authController.js
│   └── routes/authRoutes.js
```

### Frontend
```
client/
├── src/
│   ├── App.jsx                      # Main app
│   ├── pages/QuizPage.jsx           # Quiz page
│   ├── services/api.js              # Axios config
│   └── context/AuthContext.jsx     # Auth state
```

## Package.json Scripts

### Backend (server/package.json)
```json
{
  "start": "node server.js",        // Production
  "dev": "nodemon server.js",       // Development
  "seed": "node src/utils/seedDatabase.js"  // Seed DB
}
```

### Frontend (client/package.json)
```json
{
  "dev": "vite",                    // Development
  "build": "vite build",            // Production build
  "preview": "vite preview"         // Preview build
}
```

## URLs to Bookmark

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **MongoDB Compass**: mongodb://localhost:27017

## Git Commands (For Pushing Changes)

```bash
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT

# Check status
git status

# Add all changes
git add interview-prep-platform/

# Commit
git commit -m "feat: Complete Express + React migration"

# Push
git push origin main
```

---

## 🎯 Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] MongoDB connects successfully
- [ ] Can register new user
- [ ] Can login and receive JWT token
- [ ] Can start a quiz
- [ ] Can submit quiz
- [ ] Score appears in results
- [ ] Can view quiz history
- [ ] Can see leaderboard

---

**Need Help?** Check these files:
- `MIGRATION_COMPLETE.md` - Full migration summary
- `COMPLETE_IMPLEMENTATION_GUIDE.md` - Code examples
- `README-NEW.md` - Project documentation

**Happy Coding! 🚀**
