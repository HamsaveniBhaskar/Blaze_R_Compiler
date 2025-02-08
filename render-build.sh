#!/bin/bash

# Install dependencies for R and Node.js
echo "Installing dependencies..."

# Install R
apt-get update
apt-get install -y r-base build-essential

# Install Node.js dependencies
npm install

echo "Dependencies installed successfully."

# Run the server
echo "Starting the server..."
npm start
