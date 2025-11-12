#!/bin/bash

# 🎯 TheTrueTest - Complete Installation & Verification Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       TheTrueTest - Installation & Verification           ║"
echo "║              Built by Jaswinder Singh, IIT Bhilai         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js installed: $NODE_VERSION"
else
    print_status 1 "Node.js not found. Please install Node.js v16+"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm installed: $NPM_VERSION"
else
    print_status 1 "npm not found"
    exit 1
fi

# Check MongoDB
if command_exists mongod; then
    print_status 0 "MongoDB installed"
else
    print_status 1 "MongoDB not found. Please install MongoDB"
    exit 1
fi

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    print_status 0 "MongoDB is running"
else
    echo -e "${YELLOW}⚠️  MongoDB is not running. Starting MongoDB...${NC}"
    sudo systemctl start mongod 2>/dev/null || mongod --fork --logpath /tmp/mongodb.log --dbpath /data/db 2>/dev/null
    sleep 2
    if pgrep -x "mongod" > /dev/null; then
        print_status 0 "MongoDB started successfully"
    else
        print_status 1 "Failed to start MongoDB. Please start it manually"
    fi
fi

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo ""

# Backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd "$PROJECT_DIR/server"
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status 0 "Backend dependencies installed"
else
    print_status 1 "Failed to install backend dependencies"
    exit 1
fi

# Frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd "$PROJECT_DIR/client"
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status 0 "Frontend dependencies installed"
else
    print_status 1 "Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Verifying file structure...${NC}"
echo ""

# Check critical backend files
BACKEND_FILES=(
    "server/.env"
    "server/server.js"
    "server/src/config/database.js"
    "server/src/models/User.js"
    "server/src/controllers/authController.js"
    "server/src/routes/authRoutes.js"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$PROJECT_DIR/$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file missing"
    fi
done

echo ""
echo -e "${BLUE}🗄️  Database setup...${NC}"
echo ""

echo -e "${YELLOW}Do you want to seed the database with questions? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    cd "$PROJECT_DIR/server"
    
    # Check if seed script exists
    if [ -f "src/utils/seedDatabase.js" ]; then
        echo -e "${YELLOW}Seeding database...${NC}"
        node src/utils/seedDatabase.js
        if [ $? -eq 0 ]; then
            print_status 0 "Database seeded successfully"
        else
            print_status 1 "Failed to seed database"
        fi
    else
        echo -e "${RED}Seed script not found. You'll need to create it manually.${NC}"
        echo -e "${YELLOW}See COMPLETE_IMPLEMENTATION_GUIDE.md for details${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🧪 Testing backend server...${NC}"
echo ""

# Start backend temporarily to test
cd "$PROJECT_DIR/server"
timeout 5 npm start > /tmp/backend-test.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Test health endpoint
HEALTH_CHECK=$(curl -s http://localhost:5000/api/health 2>/dev/null)
if [ ! -z "$HEALTH_CHECK" ]; then
    print_status 0 "Backend server responds correctly"
else
    print_status 1 "Backend server not responding"
fi

# Kill test server
kill $BACKEND_PID 2>/dev/null

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ Installation Complete!                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🎉 Your TheTrueTest platform is ready!${NC}"
echo ""
echo -e "${BLUE}📝 To start developing:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend Server:${NC}"
echo "  cd $PROJECT_DIR/server"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend Server:${NC}"
echo "  cd $PROJECT_DIR/client"
echo "  npm run dev"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  • QUICK_REFERENCE.md - Quick commands"
echo "  • PROJECT_SUMMARY.md - Project overview"
echo "  • MIGRATION_COMPLETE.md - Migration details"
echo "  • COMPLETE_IMPLEMENTATION_GUIDE.md - Code examples"
echo ""
echo -e "${GREEN}🌐 URLs:${NC}"
echo "  • Frontend: http://localhost:5173"
echo "  • Backend:  http://localhost:5000/api"
echo "  • Health:   http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}Good luck with your project! 🚀${NC}"
