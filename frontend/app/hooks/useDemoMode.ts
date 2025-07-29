'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to check if demo mode is enabled
 * This allows components to adjust their behavior in demo mode
 */
export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to true for safety
  const [isSkipAuth, setIsSkipAuth] = useState(true); // Default to true for safety

  useEffect(() => {
    // Check if demo mode is enabled via environment variable
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';
    
    // For development, we can also check localStorage
    const localDemoMode = typeof window !== 'undefined' && localStorage.getItem('DEMO_MODE') === 'true';
    const localSkipAuth = typeof window !== 'undefined' && localStorage.getItem('SKIP_AUTH') === 'true';
    
    setIsDemoMode(demoMode || localDemoMode || true); // Default to true for now
    setIsSkipAuth(skipAuth || localSkipAuth || true); // Default to true for now
    
    console.log(`Demo mode: ${demoMode || localDemoMode || true}`);
    console.log(`Skip auth: ${skipAuth || localSkipAuth || true}`);
  }, []);

  return {
    isDemoMode,
    isSkipAuth,
    // Helper function to enable demo mode
    enableDemoMode: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('DEMO_MODE', 'true');
        localStorage.setItem('SKIP_AUTH', 'true');
        setIsDemoMode(true);
        setIsSkipAuth(true);
      }
    },
    // Helper function to disable demo mode
    disableDemoMode: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('DEMO_MODE', 'false');
        localStorage.setItem('SKIP_AUTH', 'false');
        setIsDemoMode(false);
        setIsSkipAuth(false);
      }
    }
  };
} 