#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}Installing Internal Marks Calculator...${NC}"

# Check if Node.js is installed
echo -e "\n${YELLOW}Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}Node.js $NODE_VERSION found!${NC}"
else
    echo -e "${RED}Node.js not found! Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install backend dependencies!${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd client
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install frontend dependencies!${NC}"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
PORT=5000
DB_PATH=./database/internal_marks.db
NODE_ENV=development
EOF
    echo -e "${GREEN}.env file created!${NC}"
else
    echo -e "\n${CYAN}.env file already exists!${NC}"
fi

echo -e "\n${CYAN}========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo -e "\n${YELLOW}To start the application, run:${NC}"
echo -e "  ${NC}npm run dev${NC}"
echo -e "\n${YELLOW}The application will be available at:${NC}"
echo -e "  ${NC}Frontend: http://localhost:3000${NC}"
echo -e "  ${NC}Backend:  http://localhost:5000${NC}"
echo -e "\n${CYAN}========================================${NC}\n"
