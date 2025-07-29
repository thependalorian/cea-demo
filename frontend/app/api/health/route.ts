// Health check endpoint for frontend
import { NextResponse } from 'next/server';
import { validateEnvironmentVariables } from '@/lib/env';

export async function GET() {
  try {
    // Check environment variables
    const envValidation = validateEnvironmentVariables();

    // Get package version from package.json
    const version = process.env.npm_package_version || '1.0.0';

    // Perform additional health checks here if needed
    // E.g., database connectivity, external services status
    
    // Basic health check - could add more sophisticated checks
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'pendo-cea-frontend',
      version,
      environment: process.env.NODE_ENV || 'development',
      environmentValid: envValidation.isValid,
      ...(envValidation.missingVars.length > 0 && { 
        warnings: {
          missingEnvVars: envValidation.missingVars 
        }
      })
    };

    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'pendo-cea-frontend',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 