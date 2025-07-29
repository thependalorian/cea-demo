'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Location: /app/components/ErrorBoundary.tsx
 * Usage: Wrap components that might throw errors during rendering
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Example: Send to analytics or monitoring service
    // logErrorToService(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-6 mt-4 border border-error rounded-lg bg-error/10 text-error">
            <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
            <p className="mb-4">
              We're sorry, but there was an error rendering this component.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-base-200 rounded overflow-auto max-h-64 mb-4 text-sm">
                <p className="font-bold mb-2">Error Details (only visible in development):</p>
                <pre className="whitespace-pre-wrap">{this.state.error?.message}</pre>
                <pre className="whitespace-pre-wrap mt-2 text-xs opacity-80">{this.state.error?.stack}</pre>
              </div>
            )}
        </div>
      );
    }

    return this.props.children;
  }
} 