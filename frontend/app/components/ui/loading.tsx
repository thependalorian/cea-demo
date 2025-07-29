/**
 * Loading Components - ACT Climate Economy Assistant
 * 
 * Purpose: Loading states, spinners, and skeleton screens with ACT branding
 * Location: /app/components/ui/loading.tsx
 * Used by: All components requiring loading states throughout the application
 * 
 * Features:
 * - ACT brand spinner animations
 * - Skeleton loading screens
 * - Eco-themed loading messages
 * - Multiple sizes and variants
 * - Accessibility support
 * 
 * @example
 * <Spinner size="lg" />
 * <LoadingScreen message="Finding your perfect clean energy job..." />
 * <SkeletonCard />
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Spinner Component
const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-transparent',
  {
    variants: {
      variant: {
        default: 'border-l-spring-green border-b-spring-green',
        secondary: 'border-l-moss-green border-b-moss-green',
        accent: 'border-l-midnight-forest border-b-midnight-forest',
        gradient: 'border-l-spring-green border-b-moss-green',
      },
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
        '2xl': 'h-16 w-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ variant, size, className }) => (
  <div
    className={cn(spinnerVariants({ variant, size }), className)}
    role="status"
    aria-label="Loading"
  />
);

// Eco-themed Pulse Loader
export interface EcoPulseProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const EcoPulse: React.FC<EcoPulseProps> = ({ size = 'default', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-spring-green/30 animate-ping" />
        {/* Middle ring */}
        <div className="absolute inset-1 rounded-full border-2 border-moss-green/50 animate-pulse" />
        {/* Inner core */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-spring-green to-moss-green animate-pulse" />
        {/* Center dot */}
        <div className="absolute inset-4 rounded-full bg-white animate-pulse" />
      </div>
    </div>
  );
};

// Loading Screen Component
export interface LoadingScreenProps {
  message?: string;
  subtitle?: string;
  variant?: 'spinner' | 'pulse' | 'minimal';
  fullScreen?: boolean;
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  subtitle,
  variant = 'pulse',
  fullScreen = false,
  className,
}) => {
  const ecoMessages = [
    'Powering up clean energy opportunities...',
    'Connecting you to Massachusetts green jobs...',
    'Building a sustainable future...',
    'Analyzing clean energy pathways...',
    'Growing green career opportunities...',
  ];

  const randomMessage = React.useMemo(
    () => ecoMessages[Math.floor(Math.random() * ecoMessages.length)],
    []
  );

  const displayMessage = message === 'Loading...' ? randomMessage : message;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        fullScreen && 'fixed inset-0 bg-white z-50',
        className
      )}
    >
      {/* Logo or Icon */}
      <div className="mb-6">
        {variant === 'pulse' && <EcoPulse size="lg" />}
        {variant === 'spinner' && <Spinner variant="gradient" size="2xl" />}
        {variant === 'minimal' && <Spinner variant="default" size="lg" />}
      </div>

      {/* Loading text */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-medium text-midnight-forest">
          {displayMessage}
        </h3>
        {subtitle && (
          <p className="text-sm text-base-content/60">{subtitle}</p>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1 mt-6">
        <div className="w-2 h-2 bg-spring-green rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-moss-green rounded-full animate-pulse delay-75" />
        <div className="w-2 h-2 bg-midnight-forest rounded-full animate-pulse delay-150" />
      </div>
    </div>
  );
};

// Skeleton Components
export interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'rounded' | 'circular';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'default' 
}) => (
  <div
    className={cn(
      'animate-pulse bg-sand-gray/50',
      {
        'rounded': variant === 'rounded',
        'rounded-full': variant === 'circular',
        'rounded-md': variant === 'default',
      },
      className
    )}
  />
);

// Skeleton Card for Job Listings
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4 bg-white rounded-xl border border-sand-gray', className)}>
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton variant="circular" className="h-10 w-10" />
    </div>
    
    {/* Content */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    
    {/* Tags */}
    <div className="flex gap-2">
      <Skeleton variant="rounded" className="h-6 w-16" />
      <Skeleton variant="rounded" className="h-6 w-20" />
      <Skeleton variant="rounded" className="h-6 w-14" />
    </div>
    
    {/* Footer */}
    <div className="flex items-center justify-between pt-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

// Skeleton Table Row
const SkeletonTableRow: React.FC<{ columns: number; className?: string }> = ({ 
  columns, 
  className 
}) => (
  <tr className={cn('border-b border-sand-gray/20', className)}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Loading Button State
export interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  loadingText,
  className,
  disabled,
  onClick,
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={cn(
      'btn bg-spring-green text-midnight-forest hover:bg-spring-green/90 disabled:opacity-50',
      className
    )}
  >
    {loading && <Spinner size="sm" className="mr-2" />}
    {loading && loadingText ? loadingText : children}
  </button>
);

// Inline Loading Text
export interface LoadingTextProps {
  text?: string;
  dots?: boolean;
  className?: string;
}

const LoadingText: React.FC<LoadingTextProps> = ({ 
  text = 'Loading', 
  dots = true, 
  className 
}) => {
  const [dotCount, setDotCount] = React.useState(0);

  React.useEffect(() => {
    if (!dots) return;

    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [dots]);

  return (
    <span className={cn('text-base-content/60', className)}>
      {text}
      {dots && '.'.repeat(dotCount)}
    </span>
  );
};

export {
  Spinner,
  EcoPulse,
  LoadingScreen,
  Skeleton,
  SkeletonCard,
  SkeletonTableRow,
  LoadingButton,
  LoadingText,
  spinnerVariants,
}; 