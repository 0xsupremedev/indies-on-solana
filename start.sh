#!/bin/bash

echo "Starting Coin Wars 3D..."
echo

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install root dependencies"
    exit 1
fi

echo
echo "Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install client dependencies"
    exit 1
fi
cd ..

echo
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install server dependencies"
    exit 1
fi
cd ..

echo
echo "Starting development servers..."
echo "Client will be available at: http://localhost:3000"
echo "Server will be available at: http://localhost:3001"
echo "Overlay will be available at: http://localhost:3001/overlay"
echo
echo "Press Ctrl+C to stop all servers"
echo

npm run dev
