'use client';

/**
 * LoadingState Component
 * 
 * Purpose: Provides a consistent loading indicator across the application
 * Location: /app/components/LoadingState.tsx
 * Used by: Any component that needs to display a loading state
 */

import React from 'react';

interface LoadingStateProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export default function LoadingState({ 
  size = 'md', 
  fullScreen = false,
  message = 'Loading...',
  className = ''
}: LoadingStateProps) {
  
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };
  
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-50' 
    : 'flex flex-col items-center justify-center py-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></span>
        {message && (
          <p className="text-base-content text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
} 