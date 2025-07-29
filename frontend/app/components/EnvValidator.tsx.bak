'use client';

import { useEffect } from 'react';
import { logEnvironmentStatus } from '@/lib/env';

/**
 * Environment Validator Component
 * 
 * This is a client component that validates environment variables
 * and logs any issues to the console during development.
 * It has no visual output - only side effects.
 */
export default function EnvValidator() {
  useEffect(() => {
    // Only validate in development or when debug mode is enabled
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_ENV === 'true') {
      try {
        logEnvironmentStatus();
      } catch (e) {
        console.error('Environment validation failed:', e);
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
} 