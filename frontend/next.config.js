/** @type {import('next').NextConfig} */
const nextConfig = {
    // Output configuration for Docker deployment
    output: 'standalone',
    
    // Disable ESLint during build
    eslint: {
      ignoreDuringBuilds: true,
    },
    
    // Disable TypeScript checking during build
    typescript: {
      ignoreBuildErrors: true,
    },
    
    // Enable experimental features
    experimental: {
      serverComponentsExternalPackages: ['@supabase/supabase-js']
    },
    
    // Environment variables validation with fallbacks
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zugdojmdktxalqflxbbh.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2Rvam1ka3R4YWxxZmx4YmJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MzU4NSwiZXhwIjoyMDY0MTY5NTg1fQ.-tp3_RUU1FF1TEw2wAGwr3phBSCiElPGQqAiorZJHFc',
      NEXT_PUBLIC_AGENT_ENDPOINT: process.env.NEXT_PUBLIC_AGENT_ENDPOINT || 'https://agent-api.georgenekwaya.com/api/pendo-agent',
      NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT: process.env.NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT || 'https://rag-api.georgenekwaya.com',
      NEXT_PUBLIC_ENABLE_STREAMING: process.env.NEXT_PUBLIC_ENABLE_STREAMING || 'true',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://cea.georgenekwaya.com',
      NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || 'false',
      NEXT_PUBLIC_SKIP_AUTH: process.env.NEXT_PUBLIC_SKIP_AUTH || 'false',
      BACKEND_API_URL: process.env.BACKEND_API_URL
    },
    
    // Headers configuration
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          ],
        },
      ];
    },
    
    // Redirects
    async redirects() {
      return [
        // Removed home page redirect to allow landing on the homepage
        // {
        //   source: '/',
        //   destination: '/chat',
        //   permanent: false
        // }
      ];
    },
    
    // Health check endpoint
    async rewrites() {
      return [
        {
          source: '/health',
          destination: '/api/health'
        }
      ];
    }
  };
  
  module.exports = nextConfig;