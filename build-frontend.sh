#!/bin/bash

# Script to build and run the frontend Docker container
# Usage: ./build-frontend.sh [--build-only]

set -e

echo "🚀 Building and running frontend Docker container"
echo "================================================="

# Check if .env file exists, create if not
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating a basic one for demo purposes."
  cat > .env << EOL
# Basic environment variables for demo
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_AGENT_ENDPOINT=http://localhost:8001/api/pendo-agent
NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT=http://localhost:8000
NEXT_PUBLIC_ENABLE_STREAMING=true
BACKEND_API_URL=http://localhost:8000
AGENT_API_URL=http://localhost:8001/api/pendo-agent
RAG_API_URL=http://localhost:8000/resume/upload
EOL
  echo "✅ Created .env file with placeholder values. Please update with real values if needed."
fi

# Build the frontend Docker image
echo "🔨 Building frontend Docker image..."
docker build -t pendo-frontend ./frontend

# Check if --build-only flag is provided
if [ "$1" == "--build-only" ]; then
  echo "✅ Frontend Docker image built successfully. Exiting as requested."
  exit 0
fi

# Check if container is already running
if docker ps | grep -q pendo-frontend; then
  echo "🔄 Stopping existing pendo-frontend container..."
  docker stop pendo-frontend
  docker rm pendo-frontend
fi

# Run the frontend container
echo "🚀 Starting frontend container..."
docker run -d \
  --name pendo-frontend \
  -p 3000:3000 \
  --env-file .env \
  pendo-frontend

echo "✅ Frontend container is running!"
echo "📊 Dashboard is available at http://localhost:3000/dashboard"
echo "👨‍💼 Partner dashboard is available at http://localhost:3000/partner/dashboard"
echo "👨‍💻 Admin dashboard is available at http://localhost:3000/admin" 