/**
 * Button Component - ACT Climate Economy Assistant
 * 
 * Purpose: Reusable button component with ACT branding and eco-gradient variants
 * Location: /app/components/ui/button.tsx
 * Used by: All components requiring buttons across the application
 * 
 * Features:
 * - ACT brand color variants (Spring Green, Moss Green, Midnight Forest)
 * - Eco-gradient effects and glass morphism
 * - Multiple sizes and states
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Loading states and animations
 * 
 * @example
 * <Button variant="primary" size="lg">Join ACT</Button>
 * <Button variant="eco-gradient" loading>Processing...</Button>
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base button styles - Apple-inspired clean design
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium relative overflow-hidden focus-visible:outline-none transition-all will-change-transform',
  {
    variants: {
      variant: {
        // Primary - Spring Green (Job Seekers)
        primary: 'bg-spring-green text-midnight-forest hover:bg-spring-green-600 shadow-button hover:shadow-hover active:shadow-button',
        
        // Secondary - Moss Green (Partners)
        secondary: 'bg-moss-green text-white hover:bg-moss-green-600 shadow-button hover:shadow-hover active:shadow-button',
        
        // Tertiary - Midnight Forest (Admin)
        tertiary: 'bg-midnight-forest text-spring-green hover:bg-midnight-forest-800 shadow-button hover:shadow-hover active:shadow-button',
        
        // Outline variants with refined hover states
        outline: 'border border-moss-green text-moss-green bg-transparent hover:bg-moss-green-50 active:bg-moss-green-100',
        'outline-primary': 'border border-spring-green text-spring-green bg-transparent hover:bg-spring-green-50 active:bg-spring-green-100',
        'outline-tertiary': 'border border-midnight-forest text-midnight-forest bg-transparent hover:bg-midnight-forest-50 active:bg-midnight-forest-100',
        
        // Ghost variants with subtle interactions
        ghost: 'bg-transparent text-moss-green hover:bg-moss-green-50 active:bg-moss-green-100',
        'ghost-primary': 'bg-transparent text-spring-green hover:bg-spring-green-50 active:bg-spring-green-100',
        'ghost-tertiary': 'bg-transparent text-midnight-forest hover:bg-midnight-forest-50 active:bg-midnight-forest-100',
        
        // Eco-gradient variants
        'eco-gradient': 'eco-gradient text-midnight-forest shadow-button hover:shadow-hover active:shadow-button',
        'eco-gradient-light': 'eco-gradient-light text-midnight-forest shadow-button hover:shadow-hover active:shadow-button',
        'eco-gradient-dark': 'eco-gradient-dark text-white shadow-button hover:shadow-hover active:shadow-button',
        
        // Glass morphism variant with Apple-level refinement
        glass: 'glass-button text-midnight-forest',
        'glass-dark': 'glass-button bg-midnight-forest/80 text-white border-midnight-forest-700/30',
        
        // Destructive with consistent styling
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-button hover:shadow-hover active:shadow-button',
        
        // Link style with spring-green underline
        link: 'bg-transparent text-spring-green underline-offset-4 hover:underline p-0 h-auto shadow-none hover:shadow-none',
      },
      size: {
        sm: 'h-8 px-3 py-1.5 text-sm rounded-md',
        default: 'h-10 px-4 py-2 text-base rounded-lg',
        lg: 'h-12 px-6 py-3 text-lg rounded-xl',
        xl: 'h-14 px-8 py-4 text-xl rounded-xl',
        icon: 'h-10 w-10 p-2 rounded-lg',
        'icon-sm': 'h-8 w-8 p-1.5 rounded-md',
        'icon-lg': 'h-12 w-12 p-2.5 rounded-xl',
      },
      prominence: {
        low: 'shadow-none',
        default: 'shadow-button hover:shadow-hover active:shadow-button',
        high: 'shadow-lg hover:shadow-xl active:shadow-lg',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
      disabled: {
        true: 'opacity-40 pointer-events-none',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      prominence: 'default',
      loading: false,
      disabled: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    prominence,
    loading = false, 
    loadingText,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    hapticFeedback = true,
    onClick,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    // Apple-inspired haptic feedback handler
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      // Provide subtle haptic feedback when supported
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }

      // Micro-interaction animation
      const button = event.currentTarget;
      button.classList.add('animate-button-press');
      setTimeout(() => {
        button.classList.remove('animate-button-press');
      }, 200);

      // Call the original onClick handler
      onClick?.(event);
    }, [onClick, hapticFeedback]);

    return (
      <button
        className={cn(buttonVariants({ 
          variant, 
          size, 
          prominence,
          loading, 
          disabled: isDisabled,
          className 
        }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        onClick={handleClick}
        {...props}
      >
        {/* Loading spinner with improved styling */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent opacity-90" />
          </div>
        )}
        
        {/* Button content wrapper */}
        <div className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {/* Left icon */}
          {leftIcon && (
            <span className="flex-shrink-0">{leftIcon}</span>
          )}
          
          {/* Button text content */}
          <span>
            {loadingText && loading ? loadingText : children}
          </span>
          
          {/* Right icon */}
          {rightIcon && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>
        
        {/* Glass morphism shine effect for glass buttons */}
        {(variant === 'glass' || variant === 'glass-dark') && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite'
            }}
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 