#!/bin/bash

# Build script for API routes only
echo "Building API routes for Climate Economy Assistant"

# Create directories for API routes
mkdir -p api_routes/api/chat
mkdir -p api_routes/api/resume/analyze
mkdir -p api_routes/api/resume/check/\[userId\]
mkdir -p api_routes/api/resume/search

# Copy API routes
echo "Copying API routes..."
cp frontend/app/api/chat/route.ts api_routes/api/chat/
cp frontend/app/api/resume/analyze/route.ts api_routes/api/resume/analyze/
cp frontend/app/api/resume/check/\[userId\]/route.ts api_routes/api/resume/check/\[userId\]/
cp frontend/app/api/resume/search/route.ts api_routes/api/resume/search/

# Create minimal package.json
cat > api_routes/package.json << EOL
{
  "name": "cea-api-routes",
  "version": "1.0.0",
  "description": "Climate Economy Assistant API Routes",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "next": "^14.0.0"
  }
}
EOL

# Create minimal server.js
cat > api_routes/server.js << EOL
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Simple HTTP server to serve API routes
const server = http.createServer((req, res) => {
  console.log(\`\${req.method} \${req.url}\`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  // Return success message for root path
  if (req.url === '/') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'Climate Economy Assistant API Routes',
      routes: [
        '/api/chat',
        '/api/resume/analyze',
        '/api/resume/check/[userId]',
        '/api/resume/search'
      ]
    }));
    return;
  }
  
  // Return 404 for all other paths
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log('Available API routes:');
  console.log('- /api/chat');
  console.log('- /api/resume/analyze');
  console.log('- /api/resume/check/[userId]');
  console.log('- /api/resume/search');
});
EOL

# Create minimal Dockerfile
cat > api_routes/Dockerfile << EOL
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
EOL

echo "API routes build complete!"
echo "To build Docker image: cd api_routes && docker build -t cea-api-routes ."
echo "To run Docker container: docker run -p 3000:3000 cea-api-routes" 