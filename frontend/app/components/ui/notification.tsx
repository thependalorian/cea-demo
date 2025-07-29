/**
 * Notification/Toast System - ACT Climate Economy Assistant
 * 
 * Purpose: Global notification system with ACT branding and eco-themed messaging
 * Location: /app/components/ui/notification.tsx
 * Used by: Success messages, errors, job applications, and user feedback
 * 
 * Features:
 * - ACT brand color variants for different notification types
 * - Auto-dismiss with custom timeouts
 * - Smooth slide-in animations
 * - Eco-friendly success messages
 * - Accessibility compliant
 * - Global notification context
 * 
 * @example
 * import { useNotification } from '@/components/ui/notification'
 * 
 * const { addNotification } = useNotification()
 * addNotification({
 *   type: 'success',
 *   title: 'Application Submitted!',
 *   message: 'Your clean energy career journey begins now!'
 * })
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Notification Variants
const notificationVariants = cva(
  'relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      type: {
        success: 'border-success/20 bg-success/10 text-success-content',
        error: 'border-error/20 bg-error/10 text-error-content',
        warning: 'border-warning/20 bg-warning/10 text-warning-content',
        info: 'border-spring-green/20 bg-spring-green/10 text-midnight-forest',
      },
      position: {
        'top-right': 'animate-slide-in-right',
        'top-left': 'animate-slide-in-left',
        'bottom-right': 'animate-slide-in-up-right',
        'bottom-left': 'animate-slide-in-up-left',
      }
    },
    defaultVariants: {
      type: 'info',
      position: 'top-right',
    },
  }
);

// Notification Icons
const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const iconClasses = "h-5 w-5 flex-shrink-0";
  
  switch (type) {
    case 'success':
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-error text-white">
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning text-white">
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    case 'info':
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-spring-green text-midnight-forest">
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
};

// Individual Notification Component
export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onDismiss, 
  position = 'top-right' 
}) => {
  const progressRef = React.useRef<HTMLDivElement>(null);

  // Auto-dismiss timer
  React.useEffect(() => {
    if (notification.duration === 0) return; // Manual dismiss only

    const duration = notification.duration || 5000;
    
    // Animate progress bar
    if (progressRef.current) {
      progressRef.current.style.animation = `progress ${duration}ms linear`;
    }

    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.duration, notification.id, onDismiss]);

  return (
    <div className={cn(notificationVariants({ type: notification.type, position }))}>
      {/* Progress bar */}
      {notification.duration !== 0 && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10 rounded-b-lg overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-current opacity-30 w-full origin-left scale-x-0"
            style={{ 
              animationFillMode: 'forwards',
              transformOrigin: 'left'
            }}
          />
        </div>
      )}

      {/* Icon */}
      <NotificationIcon type={notification.type} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm leading-5">
          {notification.title}
        </h4>
        {notification.message && (
          <p className="mt-1 text-sm opacity-90 leading-relaxed">
            {notification.message}
          </p>
        )}
        
        {/* Action Button */}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="mt-2 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded"
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      {notification.dismissible !== false && (
        <button
          onClick={() => onDismiss(notification.id)}
          className="flex-shrink-0 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
          aria-label="Dismiss notification"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Notification Context
interface NotificationState {
  notifications: Notification[];
}

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Provider
export interface NotificationProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  position = 'top-right',
  maxNotifications = 5 
}) => {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] });

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Remove oldest notification if at max capacity
    if (state.notifications.length >= maxNotifications) {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: state.notifications[0].id });
    }
    
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { ...notification, id } 
    });
  }, [state.notifications.length, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Position classes for container
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <NotificationContext.Provider value={{
      notifications: state.notifications,
      addNotification,
      removeNotification,
      clearAll,
    }}>
      {children}
      
      {/* Notification Container */}
      <div className={cn('fixed z-50 flex flex-col gap-2', positionClasses[position])}>
        {state.notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
            position={position}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Hook for using notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Eco-themed notification presets
export const ecoNotifications = {
  jobApplicationSuccess: () => ({
    type: 'success' as const,
    title: '🌱 Application Submitted!',
    message: 'Your clean energy career journey begins now. We\'ll be in touch soon!',
    duration: 6000,
  }),
  
  profileSaved: () => ({
    type: 'success' as const,
    title: '✅ Profile Updated',
    message: 'Your green career profile is looking great!',
    duration: 4000,
  }),
  
  jobSaved: (jobTitle: string) => ({
    type: 'info' as const,
    title: '🔖 Job Saved',
    message: `${jobTitle} has been added to your sustainable career collection.`,
    duration: 4000,
  }),
  
  connectionError: () => ({
    type: 'error' as const,
    title: '🔌 Connection Issue',
    message: 'Having trouble connecting to our green servers. Please try again.',
    duration: 8000,
  }),
  
  sustainabilityTip: () => ({
    type: 'info' as const,
    title: '💡 Green Career Tip',
    message: 'Did you know? Massachusetts leads the nation in clean energy job growth!',
    duration: 10000,
  }),
};

// CSS animations (add to globals.css)
export const notificationAnimations = `
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-up-right {
  from {
    transform: translate(100%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes slide-in-up-left {
  from {
    transform: translate(-100%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out;
}

.animate-slide-in-up-right {
  animation: slide-in-up-right 0.3s ease-out;
}

.animate-slide-in-up-left {
  animation: slide-in-up-left 0.3s ease-out;
}
`;

// Simple Notification component for direct usage (like in forms)
export interface SimpleNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  onDismiss?: () => void;
  duration?: number;
}

export const Notification: React.FC<SimpleNotificationProps> = ({
  type,
  message,
  title,
  onDismiss,
  duration = 5000
}) => {
  const notification: Notification = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    title: title || '',
    message,
    duration,
    dismissible: true
  };

  return (
    <NotificationItem
      notification={notification}
      onDismiss={() => onDismiss?.()}
      position="top-right"
    />
  );
};

export { NotificationItem, notificationVariants }; 