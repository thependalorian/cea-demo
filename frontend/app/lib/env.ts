/**
 * Environment variable validation utilities
 * This ensures required environment variables are present at runtime
 */

export function validateEnvironmentVariables(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_AGENT_ENDPOINT',
    'NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT',
    'NEXT_PUBLIC_BASE_URL'
  ];

  const missingVars = requiredVars.filter(
    varName => {
      const value = process.env[varName];
      return typeof value === 'undefined' || value === '';
    }
  );

  return {
    isValid: missingVars.length === 0,
    missingVars
  };
}

export function logEnvironmentStatus(): void {
  const { isValid, missingVars } = validateEnvironmentVariables();

  if (!isValid) {
    console.warn(
      `⚠️ Environment validation failed - missing variables: ${missingVars.join(
        ', '
      )}. Using fallback values from next.config.js.`
    );
  } else {
    console.log('✅ Environment validation passed - all required variables are present.');
  }

  // Log the current environment
  console.log(`🌍 Running in ${process.env.NODE_ENV || 'development'} environment`);
  
  // Log demo mode status
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  console.log(`🎭 Demo mode: ${demoMode ? 'enabled' : 'disabled'}`);
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(`Required environment variable ${name} is missing, using fallback`);
    // Return fallback values for critical variables
    switch (name) {
      case 'NEXT_PUBLIC_SUPABASE_URL':
        return 'https://zugdojmdktxalqflxbbh.supabase.co';
      case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2Rvam1ka3R4YWxxZmx4YmJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MzU4NSwiZXhwIjoyMDY0MTY5NTg1fQ.-tp3_RUU1FF1TEw2wAGwr3phBSCiElPGQqAiorZJHFc';
      case 'NEXT_PUBLIC_AGENT_ENDPOINT':
        return 'https://agent-api.georgenekwaya.com/api/pendo-agent';
      case 'NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT':
        return 'https://rag-api.georgenekwaya.com';
      case 'NEXT_PUBLIC_BASE_URL':
        return 'https://cea.georgenekwaya.com';
      default:
        return '';
    }
  }
  return value;
}

export function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
} 