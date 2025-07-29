#!/bin/bash

# Script to run the frontend in demo mode with authentication disabled

echo "🚀 Starting Climate Economy Assistant in DEMO MODE"
echo "=================================================="

# Kill any processes running on port 3000
echo "🔄 Stopping any existing processes on port 3000..."
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || echo "No processes found on port 3000"

# Set environment variables for demo mode
export NEXT_PUBLIC_DEMO_MODE=true
export NEXT_PUBLIC_SKIP_AUTH=true

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Create or update .env.local with demo mode settings
cat > .env.local << EOL
# Demo Mode Configuration
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SKIP_AUTH=true

# Supabase Configuration (placeholders for demo)
NEXT_PUBLIC_SUPABASE_URL=https://demo-mode-disabled.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-mode-disabled

# API Endpoints (local defaults)
NEXT_PUBLIC_AGENT_ENDPOINT=http://localhost:8001/api/pendo-agent
NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT=http://localhost:8000
BACKEND_API_URL=http://localhost:8000
AGENT_API_URL=http://localhost:8001/api/pendo-agent
RAG_API_URL=http://localhost:8000/resume/upload

# Feature Flags
NEXT_PUBLIC_ENABLE_STREAMING=true
EOL

echo "✅ Created demo environment configuration"
echo "📊 Starting frontend in demo mode..."
echo "🔗 Dashboard will be available at http://localhost:3000/dashboard"
echo "🔗 Partner dashboard at http://localhost:3000/partner/dashboard"
echo "🔗 Admin dashboard at http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev 