#!/bin/bash

# Interview Prep Platform - Quick Start Script
# This script starts MongoDB, Backend Server, and Frontend Client

echo "🚀 Starting Interview Prep Platform..."
echo ""

# Check if MongoDB container is running
echo "📦 Checking MongoDB..."
if docker ps | grep -q interview-prep-mongo; then
    echo "✅ MongoDB is already running"
else
    echo "🔄 Starting MongoDB..."
    docker run -d --name interview-prep-mongo -p 27017:27017 mongo:7.0
    sleep 3
    echo "✅ MongoDB started"
fi
echo ""

# Start Backend Server
echo "🖥️  Starting Backend Server..."
cd server
npm start &
SERVER_PID=$!
sleep 2
echo "✅ Backend server starting on http://localhost:5000"
echo ""

# Start Frontend Client
echo "🌐 Starting Frontend Client..."
cd ../client
npm start &
CLIENT_PID=$!
sleep 2
echo "✅ Frontend client starting (will auto-select available port)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All services are starting!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 Access Points:"
echo "   Frontend:  Check terminal output for port (likely 3000, 3001, or 3002)"
echo "   Backend:   http://localhost:5000"
echo "   MongoDB:   mongodb://localhost:27017"
echo ""
echo "📝 Note: Frontend will automatically find an available port"
echo ""
echo "⏹️  To stop all services:"
echo "   - Press Ctrl+C in this terminal"
echo "   - Or run: docker stop interview-prep-mongo"
echo ""

# Keep script running
wait
