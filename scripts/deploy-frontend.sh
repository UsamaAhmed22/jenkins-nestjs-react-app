#!/bin/bash
set -e

echo "Deploying frontend..."
cd frontend
npm install
npm test
npm run build

# The actual deployment commands would be here
echo "Frontend built successfully!"