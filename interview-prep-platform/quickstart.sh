#!/bin/bash

# 🚀 TheTrueTest - Quick Start Script

echo "🎯 Starting TheTrueTest Interview Prep Platform..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install Backend Dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd interview-prep-platform/server
npm install

# Step 2: Install Frontend Dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd ../client
npm install
cd ../..

# Step 3: Check MongoDB
echo -e "${BLUE}🗄️  Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null
then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is not running${NC}"
    echo -e "${BLUE}Starting MongoDB...${NC}"
    mongod --fork --logpath /var/log/mongodb.log --dbpath /var/lib/mongodb
fi

# Step 4: Seed Database (Optional)
echo -e "${BLUE}🌱 Do you want to seed the database with questions? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo -e "${BLUE}Seeding database...${NC}"
    cd interview-prep-platform/server
    node src/utils/seedDatabase.js
    cd ../..
fi

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo -e "1️⃣  Start the backend server:"
echo -e "   ${GREEN}cd interview-prep-platform/server && npm run dev${NC}"
echo ""
echo -e "2️⃣  In a new terminal, start the frontend:"
echo -e "   ${GREEN}cd interview-prep-platform/client && npm run dev${NC}"
echo ""
echo -e "3️⃣  Open your browser:"
echo -e "   ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}🎉 Happy Coding!${NC}"
