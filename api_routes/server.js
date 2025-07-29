const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Simple HTTP server to serve API routes
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
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
  console.log(`Server running on port ${PORT}`);
  console.log('Available API routes:');
  console.log('- /api/chat');
  console.log('- /api/resume/analyze');
  console.log('- /api/resume/check/[userId]');
  console.log('- /api/resume/search');
});
