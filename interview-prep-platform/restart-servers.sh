#!/bin/bash

# Profile Fix - Server Restart Script
# This script restarts both backend and frontend servers

echo "🔧 Profile Fix - Restarting Servers"
echo "===================================="
echo ""

# Kill existing processes
echo "📛 Stopping existing servers..."
lsof -ti:5000 | xargs kill -9 2>/dev/null && echo "   ✓ Backend server stopped" || echo "   ℹ Backend server was not running"
lsof -ti:5173 | xargs kill -9 2>/dev/null && echo "   ✓ Frontend server stopped" || echo "   ℹ Frontend server was not running"
echo ""

# Wait a moment
sleep 2

# Start backend server
echo "🚀 Starting Backend Server (port 5000)..."
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
npm run dev > /tmp/backend-server.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if lsof -i:5000 > /dev/null 2>&1; then
    echo "   ✅ Backend server is running on port 5000"
else
    echo "   ❌ Backend server failed to start!"
    echo "   Check logs: tail -f /tmp/backend-server.log"
    exit 1
fi
echo ""

# Start frontend server
echo "🚀 Starting Frontend Server (port 5173)..."
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/frontend
npm run dev > /tmp/frontend-server.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo ""

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 3

# Check if frontend is running
if lsof -i:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend server is running on port 5173"
else
    echo "   ❌ Frontend server failed to start!"
    echo "   Check logs: tail -f /tmp/frontend-server.log"
    exit 1
fi
echo ""

echo "===================================="
echo "✨ Both servers are running!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend-server.log"
echo "   Frontend: tail -f /tmp/frontend-server.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: lsof -ti:5000,5173 | xargs kill -9"
echo ""
echo "🧪 Test Profile API:"
echo "   After logging in, copy your token from localStorage"
echo "   curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:5000/api/users/profile"
echo ""
echo "===================================="
