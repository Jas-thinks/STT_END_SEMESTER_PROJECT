#!/bin/bash

echo "======================================"
echo "   QUIZ PLATFORM - QUICK START"
echo "======================================"
echo ""

# Kill any existing processes on port 5000 and 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

echo "✅ Cleanup complete"
echo ""

# Start backend
echo "🚀 Starting Backend Server..."
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/server
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3

# Check if backend started
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "✅ Backend running on http://localhost:5000"
else
    echo "❌ Backend failed to start. Check /tmp/backend.log"
    tail -20 /tmp/backend.log
    exit 1
fi

echo ""

# Start frontend
echo "🎨 Starting Frontend..."
cd /home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform/frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 3

# Check if frontend started
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Frontend running on http://localhost:3000"
else
    echo "❌ Frontend failed to start. Check /tmp/frontend.log"
    tail -20 /tmp/frontend.log
    exit 1
fi

echo ""
echo "======================================"
echo "   ✨ APPLICATION IS READY! ✨"
echo "======================================"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "Process IDs:"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "To view logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  OR run: lsof -ti:5000,3000 | xargs kill -9"
echo ""
echo "======================================"
echo "   TESTING CHECKLIST"
echo "======================================"
echo ""
echo "1. Login/Register at http://localhost:3000"
echo "2. Go to Practice page"
echo "3. Select SQL/DSA/any category"
echo "4. Choose difficulty (easy/medium/hard)"
echo "5. Start quiz (20 questions)"
echo "6. Answer some, leave some blank"
echo "7. Submit quiz"
echo "8. Check Results Page:"
echo "   ✓ Score is NOT 0"
echo "   ✓ Correct/Incorrect/Unattempted counts"
echo "   ✓ Percentage calculated"
echo "   ✓ Performance tab shows topic breakdown"
echo "   ✓ Review tab - click questions to expand"
echo "   ✓ See correct answers in GREEN"
echo "   ✓ See wrong answers in RED"
echo "   ✓ See explanations (if added to JSON)"
echo ""
echo "======================================"
