#!/bin/bash

# 🐳 Docker Startup Script for TheTrueTest

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      TheTrueTest - Docker Environment Setup              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="/home/jas/Desktop/STT_END_SEMESTER_PROJECT/interview-prep-platform"

cd "$PROJECT_DIR"

# Function to check Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        echo "Please install Docker from https://www.docker.com/get-started"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker is not running${NC}"
        echo "Please start Docker Desktop"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to clean up old containers
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up old containers...${NC}"
    docker-compose down -v 2>/dev/null
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    echo ""
}

# Function to build images
build_images() {
    echo -e "${BLUE}🏗️  Building Docker images...${NC}"
    docker-compose build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Images built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build images${NC}"
        exit 1
    fi
    echo ""
}

# Function to start services
start_services() {
    echo -e "${CYAN}🚀 Starting all services...${NC}"
    echo ""
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ All services started successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to start services${NC}"
        exit 1
    fi
    echo ""
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    echo ""
    docker-compose ps
    echo ""
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📝 Recent Logs:${NC}"
    echo ""
    echo -e "${CYAN}━━━ MongoDB ━━━${NC}"
    docker-compose logs --tail=5 mongo
    echo ""
    echo -e "${CYAN}━━━ Backend Server ━━━${NC}"
    docker-compose logs --tail=5 server
    echo ""
    echo -e "${CYAN}━━━ Frontend Client ━━━${NC}"
    docker-compose logs --tail=5 client
    echo ""
}

# Function to wait for services
wait_for_services() {
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    echo ""
    
    # Wait for MongoDB
    echo -n "MongoDB: "
    for i in {1..30}; do
        if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            echo -e "${GREEN}✅ Ready${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
    
    # Wait for Backend
    echo -n "Backend: "
    for i in {1..60}; do
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Ready${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
    
    # Wait for Frontend
    echo -n "Frontend: "
    for i in {1..60}; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Ready${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
    
    echo ""
}

# Function to test backend
test_backend() {
    echo -e "${BLUE}🧪 Testing Backend API...${NC}"
    HEALTH_CHECK=$(curl -s http://localhost:5000/api/health 2>/dev/null)
    
    if [ ! -z "$HEALTH_CHECK" ]; then
        echo -e "${GREEN}✅ Backend API is responding${NC}"
        echo "   Response: $HEALTH_CHECK"
    else
        echo -e "${RED}❌ Backend API is not responding${NC}"
    fi
    echo ""
}

# Main execution
echo -e "${BLUE}Starting TheTrueTest Platform with Docker...${NC}"
echo ""

# Check Docker
check_docker
echo ""

# Ask for cleanup
echo -e "${YELLOW}Do you want to clean up old containers? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    cleanup
fi

# Build images
build_images

# Start services
start_services

# Show status
show_status

# Wait for services
wait_for_services

# Test backend
test_backend

# Show logs
show_logs

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              🎉 All Services Are Running!                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🌐 Access Your Application:${NC}"
echo ""
echo -e "  ${CYAN}Frontend:${NC}  http://localhost:5173"
echo -e "  ${CYAN}Backend:${NC}   http://localhost:5000/api"
echo -e "  ${CYAN}MongoDB:${NC}   mongodb://localhost:27017"
echo ""
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo ""
echo "  View logs:           docker-compose logs -f"
echo "  View specific logs:  docker-compose logs -f server"
echo "  Stop services:       docker-compose down"
echo "  Restart services:    docker-compose restart"
echo "  Shell into server:   docker-compose exec server sh"
echo "  Test API routes:     ./test-api.sh"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • The backend auto-reloads on code changes (nodemon)"
echo "  • The frontend auto-reloads on code changes (Vite HMR)"
echo "  • Database data persists in Docker volume 'mongo-data'"
echo ""
echo -e "${GREEN}Happy Coding! 🚀${NC}"
