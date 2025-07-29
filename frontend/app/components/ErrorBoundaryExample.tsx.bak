'use client';

import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * ErrorBoundaryExample Component
 * 
 * A component demonstrating how to use the ErrorBoundary component
 * with a button that intentionally triggers an error when clicked.
 * 
 * Usage: Include this component in your page or component tree
 * 
 * Example: <ErrorBoundaryExample />
 */
export default function ErrorBoundaryExample() {
  return (
    <div className="p-6 border border-base-300 rounded-lg mb-8">
      <h3 className="text-lg font-bold mb-4">Error Boundary Example</h3>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h4 className="font-medium mb-2">Without Error Boundary</h4>
          <div className="p-4 border border-base-200 rounded-md">
            <BuggyCounter />
          </div>
          <p className="text-sm text-base-content/70 mt-2">
            Warning: Clicking the button above will crash the entire application
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">With Error Boundary</h4>
          <ErrorBoundary>
            <div className="p-4 border border-base-200 rounded-md">
              <BuggyCounter />
            </div>
          </ErrorBoundary>
          <p className="text-sm text-base-content/70 mt-2">
            Success: Clicking the button above only crashes the component inside the error boundary
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-base-200 rounded-md">
        <h4 className="font-medium mb-2">Implementation Example</h4>
        <pre className="text-xs overflow-auto p-2 bg-base-300 rounded">
          {`
// Import the ErrorBoundary
import ErrorBoundary from '@/components/ErrorBoundary';

// In your component:
export default function MyComponent() {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
          `.trim()}
        </pre>
      </div>
    </div>
  );
}

/**
 * BuggyCounter Component
 * 
 * A component that throws an error when counter exceeds 5
 */
function BuggyCounter() {
  const [counter, setCounter] = useState(0);
  
  const handleClick = () => {
    setCounter(prevCounter => {
      // This will cause an error when counter exceeds 5
      if (prevCounter >= 5) {
        throw new Error('Counter exceeded 5!');
      }
      return prevCounter + 1;
    });
  };
  
  return (
    <div>
      <p className="mb-4">Counter: {counter}</p>
      <button 
        className="btn btn-primary btn-sm"
        onClick={handleClick}
      >
        Increment Counter{counter >= 4 ? ' (Danger Zone!)' : ''}
      </button>
      
      {counter >= 4 && (
        <p className="mt-2 text-xs text-warning">
          ⚠️ Warning: Next click will cause an error!
        </p>
      )}
    </div>
  );
} 