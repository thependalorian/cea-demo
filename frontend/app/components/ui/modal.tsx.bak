/**
 * Modal/Dialog Component - ACT Climate Economy Assistant
 * 
 * Purpose: Modal dialogs and overlays with ACT branding and accessibility
 * Location: /app/components/ui/modal.tsx
 * Used by: Forms, confirmations, job applications, and user interactions
 * 
 * Features:
 * - Glass morphism backdrop
 * - ACT brand styling
 * - Keyboard navigation (ESC to close)
 * - Focus management
 * - ARIA accessibility
 * - Smooth animations
 * 
 * @example
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalHeader>
 *     <ModalTitle>Apply for Solar Technician Role</ModalTitle>
 *   </ModalHeader>
 *   <ModalContent>Application form...</ModalContent>
 * </Modal>
 */

import React, { useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const modalVariants = cva(
  // Apple-inspired modal layout with centered design
  'fixed inset-0 z-50 flex items-center justify-center p-4 will-change-transform',
  {
    variants: {
      size: {
        xs: 'sm:max-w-xs',
        sm: 'sm:max-w-sm',
        default: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        full: 'max-w-full m-4',
      },
      position: {
        center: 'items-center justify-center',
        top: 'items-start justify-center pt-16',
        bottom: 'items-end justify-center pb-16'
      }
    },
    defaultVariants: {
      size: 'default',
      position: 'center',
    },
  }
);

const modalContentVariants = cva(
  'relative w-full max-h-[90vh] overflow-hidden rounded-xl will-change-opacity transition-all duration-250',
  {
    variants: {
      variant: {
        // Standard modal variants
        default: 'bg-white border border-sand-gray-200 shadow-card',
        
        // Glass morphism variants
        glass: 'glass-card backdrop-blur-lg bg-white/80 border-sand-gray-100',
        'glass-dark': 'backdrop-blur-lg bg-midnight-forest-900/90 text-white border border-midnight-forest-800/30',
        
        // Special variants
        'eco-gradient': 'eco-gradient-light border-spring-green-200 text-midnight-forest-800',
        'eco-gradient-dark': 'eco-gradient-dark border-midnight-forest-700 text-white',
        
        // Status variants
        success: 'bg-spring-green-50 border-spring-green-200 shadow-card',
        warning: 'bg-solar-yellow-light/50 border-solar-yellow-light shadow-card',
        error: 'bg-red-50 border-red-200 shadow-card'
      },
      elevation: {
        none: '',
        low: 'shadow-soft',
        default: 'shadow-card',
        high: 'shadow-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      elevation: 'default',
    },
  }
);

export interface ModalProps 
  extends VariantProps<typeof modalVariants>,
    VariantProps<typeof modalContentVariants> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  contentClassName?: string;
  backdropClassName?: string;
  initialFocus?: React.RefObject<HTMLElement>;
  animate?: boolean;
  position?: 'center' | 'top' | 'bottom';
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  size,
  variant,
  elevation,
  position,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  contentClassName,
  backdropClassName,
  initialFocus,
  animate = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose, closeOnEscape]);

  // Focus trap and management - Apple-level accessibility
  useEffect(() => {
    if (!open) return;
    
    // Store current focus
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Focus either specified element or modal
    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else {
      modalRef.current?.focus();
    }
    
    // Create focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // Get all focusable elements in modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Trap focus in the modal
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    // Prevent scrolling on body
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Add event listener for focus trap
    document.addEventListener('keydown', handleTabKey);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = originalStyle;
      
      if (!initialFocus) {
        previousFocusRef.current?.focus();
      }
    };
  }, [open, initialFocus]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  // Animation classes
  const backdropAnimationClass = animate 
    ? 'animate-in fade-in duration-200' 
    : '';
  
  const modalAnimationClass = animate
    ? 'animate-in zoom-in-95 duration-200 ease-out'
    : '';

  return (
    <>
      {/* Backdrop - with subtle blur and opacity */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-midnight-forest-900/40 backdrop-blur-sm",
          backdropAnimationClass,
          backdropClassName
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className={cn(modalVariants({ size, position }), modalAnimationClass)}>
        <div
          ref={modalRef}
          className={cn(
            modalContentVariants({ variant, elevation }), 
            contentClassName
          )}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-labelledby="modal-title"
          {...(animate && { 'data-state': 'open' })}
        >
          <div className={cn('w-full', className)}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Modal Header Component with improved styling
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
  onClose?: () => void;
  bordered?: boolean;
  align?: 'start' | 'center';
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  className, 
  showClose = true, 
  onClose,
  bordered = true,
  align = 'start',
  ...props 
}) => (
  <div
    className={cn(
      'flex items-center p-6',
      align === 'start' ? 'justify-between' : 'justify-center',
      bordered && 'border-b border-sand-gray-200',
      className
    )}
    {...props}
  >
    <div className={cn(
      'flex-1',
      align === 'center' && 'text-center'
    )}>
      {children}
    </div>
    
    {/* Close button with Apple-inspired subtle styling */}
    {showClose && onClose && (
      <button
        onClick={onClose}
        className={cn(
          "p-2 rounded-full transition-all duration-250 focus:outline-none",
          "text-sand-gray-500 hover:text-midnight-forest-600 hover:bg-sand-gray-100",
          "focus-visible:ring-2 focus-visible:ring-spring-green-400 focus-visible:ring-offset-2",
          align === 'center' && 'absolute right-4 top-4'
        )}
        aria-label="Close modal"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clipRule="evenodd"
          />
        </svg>
      </button>
    )}
  </div>
);

// Modal Title Component with improved typography
export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

const ModalTitle: React.FC<ModalTitleProps> = ({ 
  children, 
  className, 
  as: Component = 'h2',
  size = 'default',
  ...props 
}) => {
  // Typography scale aligned with Apple design standards
  const sizeClasses = {
    sm: 'text-base font-semibold',
    default: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };
  
  return (
    <Component
      id="modal-title"
      className={cn(
        sizeClasses[size],
        'text-midnight-forest-800 leading-tight tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Modal Description Component with improved typography
export interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  color?: 'default' | 'muted' | 'accent';
}

const ModalDescription: React.FC<ModalDescriptionProps> = ({ 
  children, 
  className,
  color = 'muted',
  ...props 
}) => {
  // Description color variations
  const colorClasses = {
    default: 'text-midnight-forest-700',
    muted: 'text-moss-green-600',
    accent: 'text-spring-green-700'
  };
  
  return (
    <p
      id="modal-description"
      className={cn(
        'text-sm mt-2 leading-relaxed', 
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// Modal Content Component with improved scrolling behavior
export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
  padded?: boolean;
  dividers?: boolean;
}

const ModalContent: React.FC<ModalContentProps> = ({ 
  children, 
  className, 
  scrollable = true,
  padded = true,
  dividers = false,
  ...props 
}) => (
  <div
    className={cn(
      padded ? 'p-6' : 'p-0',
      scrollable && 'overflow-y-auto custom-scrollbar overscroll-contain',
      scrollable && 'max-h-[min(60vh,500px)]',
      dividers && 'border-y border-sand-gray-200',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Modal Footer Component with improved alignment options
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  align?: 'start' | 'center' | 'end' | 'between';
  padded?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  className, 
  bordered = true,
  align = 'end',
  padded = true,
  ...props 
}) => {
  // Alignment variants for button groups
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };
  
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        padded && 'p-6',
        alignClasses[align],
        bordered && 'border-t border-sand-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Confirmation Dialog Component (specialized modal)
export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  loading?: boolean;
  icon?: React.ReactNode;
  size?: 'xs' | 'sm' | 'default';
  cancelButtonVariant?: 'ghost' | 'outline';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  icon,
  size = 'sm',
  cancelButtonVariant = 'ghost',
}) => {
  // Map dialog variants to button styles
  const buttonVariants = {
    default: 'bg-spring-green text-midnight-forest-800 hover:bg-spring-green-600',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-solar-yellow-dark text-white hover:bg-solar-yellow-dark/90',
    success: 'bg-spring-green-600 text-white hover:bg-spring-green-700'
  };
  
  // Map variants to dialog styles
  const dialogVariants = {
    default: 'default',
    destructive: 'error',
    warning: 'warning',
    success: 'success'
  };
  
  // Map variants to icons if none provided
  const defaultIcons = {
    default: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-spring-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    destructive: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-solar-yellow-dark" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-spring-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  };
  
  const currentIcon = icon || defaultIcons[variant];
  const buttonClasses = buttonVariants[variant];
  const cancelClasses = cancelButtonVariant === 'ghost' 
    ? 'bg-transparent text-moss-green-600 hover:bg-sand-gray-100 hover:text-moss-green-700'
    : 'border border-sand-gray-300 bg-white text-midnight-forest-700 hover:bg-sand-gray-50';
  
  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      size={size} 
      variant={dialogVariants[variant] as any}
    >
      <ModalHeader onClose={onClose} bordered={false} align="center">
        {currentIcon && (
          <div className="flex justify-center mb-4">
            {currentIcon}
          </div>
        )}
        <ModalTitle size={size === 'xs' ? 'sm' : 'default'} className="text-center">
          {title}
        </ModalTitle>
        {description && (
          <ModalDescription className="text-center">
            {description}
          </ModalDescription>
        )}
      </ModalHeader>
      
      <ModalFooter bordered={false} align="center" className="pt-2 pb-6">
        <button
          onClick={onClose}
          disabled={loading}
          className={cn(
            "py-2 px-4 rounded-lg font-medium transition-colors duration-250",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400",
            cancelClasses
          )}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            "py-2 px-4 rounded-lg font-medium transition-colors duration-250 shadow-button",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400",
            buttonClasses,
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{confirmText}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
};

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ConfirmDialog,
  modalVariants,
  modalContentVariants,
}; 