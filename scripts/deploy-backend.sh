#!/bin/bash
set -e

echo "Deploying backend..."
cd backend
npm install
npm test
npm run build

# The actual deployment commands would be here
echo "Backend built successfully!"