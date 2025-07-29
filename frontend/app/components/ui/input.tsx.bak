/**
 * Input & Textarea Components - ACT Climate Economy Assistant
 * 
 * Purpose: Form input components with ACT branding and enhanced UX
 * Location: /app/components/ui/input.tsx
 * Used by: All forms throughout the application
 * 
 * Features:
 * - ACT brand focus effects (Spring Green highlights)
 * - Floating labels and placeholder animations
 * - Error states and validation styling
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Massachusetts-focused placeholder examples
 * 
 * @example
 * <Input placeholder="Enter your email" type="email" />
 * <Textarea placeholder="Tell us about your clean energy experience" />
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  // Apple-inspired input styles for ACT Climate Economy
  'flex w-full rounded-lg border text-midnight-forest bg-white px-3 py-2 font-medium transition-all duration-250 will-change-transform focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand-gray-100',
  {
    variants: {
      variant: {
        default: 'border-sand-gray-300 hover:border-moss-green-400 focus:border-spring-green-400 focus:ring focus:ring-spring-green-200/50',
        
        // Error & Success states with consistent styling
        error: 'border-red-400 hover:border-red-500 focus:border-red-500 focus:ring focus:ring-red-200/50 bg-red-50/30',
        success: 'border-spring-green-400 hover:border-spring-green-500 focus:border-spring-green-500 focus:ring focus:ring-spring-green-200/50 bg-spring-green-50/30',
        
        // Ghost for subtle inputs in cards/panels
        ghost: 'border-transparent bg-moss-green-50/50 hover:bg-white focus:bg-white focus:border-spring-green-400 focus:ring focus:ring-spring-green-200/50',
        
        // Filled variant for forms with many inputs
        filled: 'border-transparent bg-sand-gray-100 hover:bg-sand-gray-50 focus:bg-white focus:border-spring-green-400 focus:ring focus:ring-spring-green-200/50',
        
        // Glass variant for inputs on gradients/images
        glass: 'glass-effect border-sand-gray-200 bg-opacity-70 backdrop-blur-sm focus:bg-white/90 focus:border-spring-green-400 focus:ring focus:ring-spring-green-200/50',
      },
      size: {
        sm: 'h-8 px-3 py-1.5 text-sm rounded-md',
        default: 'h-10 px-4 py-2 text-base rounded-lg',
        lg: 'h-12 px-5 py-3 text-lg rounded-xl',
      },
      state: {
        idle: '',
        focus: 'ring ring-spring-green-200/50 border-spring-green-400',
        error: 'ring ring-red-200/50 border-red-400',
        success: 'ring ring-spring-green-200/50 border-spring-green-400',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'idle',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  isRequired?: boolean;
  hideLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    type = 'text',
    label,
    error,
    success,
    helper,
    leftIcon,
    rightIcon,
    loading,
    id,
    isRequired,
    hideLabel,
    placeholder,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;
    
    // Determine current variant and state based on conditions
    const currentVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;
    const currentState = hasError ? 'error' : hasSuccess ? 'success' : state;
    
    // Enhance placeholder with Massachusetts-relevant examples if not provided
    const defaultPlaceholders: Record<string, string> = {
      email: 'email@climate-economy.org',
      text: placeholder || 'Enter text',
      password: '••••••••',
      search: 'Search clean energy jobs...',
      tel: '(617) 555-0123',
      url: 'https://climate-economy.org',
      number: '0',
    };
    
    const enhancedPlaceholder = placeholder || defaultPlaceholders[type] || '';
    
    return (
      <div className="space-y-2 w-full">
        {/* Label with required indicator */}
        {label && !hideLabel && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-midnight-forest-800 mb-1.5"
          >
            {label}
            {isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative w-full">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-moss-green-600">
              {leftIcon}
            </div>
          )}
          
          {/* Input Field */}
          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant, size, state: currentState }),
              leftIcon && 'pl-10',
              (rightIcon || loading) && 'pr-10',
              className
            )}
            placeholder={enhancedPlaceholder}
            aria-invalid={hasError}
            aria-required={isRequired}
            aria-describedby={
              helper ? `${inputId}-helper` : 
              error ? `${inputId}-error` : 
              success ? `${inputId}-success` : undefined
            }
            ref={ref}
            {...props}
          />
          
          {/* Right Icon / Loading */}
          {(rightIcon || loading) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-moss-green-600">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-spring-green-500 border-t-transparent opacity-80" />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {/* Helper Text / Error / Success */}
        {(helper || error || success) && (
          <div className="mt-1.5">
            {error && (
              <p 
                className="text-sm text-red-600 flex items-center gap-1"
                id={`${inputId}-error`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {success && (
              <p 
                className="text-sm text-spring-green-700 flex items-center gap-1"
                id={`${inputId}-success`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            )}
            {helper && !error && !success && (
              <p 
                className="text-sm text-moss-green-600"
                id={`${inputId}-helper`}
              >
                {helper}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  loading?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  isRequired?: boolean;
  hideLabel?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size,
    state,
    label,
    error,
    success,
    helper,
    loading,
    resize = 'vertical',
    rows = 4,
    id,
    isRequired,
    hideLabel,
    placeholder = 'Enter your message',
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;
    
    // Determine current variant and state based on conditions
    const currentVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;
    const currentState = hasError ? 'error' : hasSuccess ? 'success' : state;
    
    return (
      <div className="space-y-2 w-full">
        {/* Label with required indicator */}
        {label && !hideLabel && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-midnight-forest-800 mb-1.5"
          >
            {label}
            {isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}
        
        {/* Textarea Container */}
        <div className="relative w-full">
          <textarea
            id={textareaId}
            rows={rows}
            className={cn(
              inputVariants({ variant: currentVariant, size, state: currentState }),
              'min-h-[80px] py-3 leading-relaxed w-full',
              {
                'resize-none': resize === 'none',
                'resize': resize === 'both',
                'resize-x': resize === 'horizontal',
                'resize-y': resize === 'vertical',
              },
              loading && 'pr-10',
              className
            )}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-required={isRequired}
            aria-describedby={
              helper ? `${textareaId}-helper` : 
              error ? `${textareaId}-error` : 
              success ? `${textareaId}-success` : undefined
            }
            ref={ref}
            {...props}
          />
          
          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-3 top-3 text-moss-green-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-spring-green-500 border-t-transparent opacity-80" />
            </div>
          )}
        </div>
        
        {/* Helper Text / Error / Success */}
        {(helper || error || success) && (
          <div className="mt-1.5">
            {error && (
              <p 
                className="text-sm text-red-600 flex items-center gap-1"
                id={`${textareaId}-error`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {success && (
              <p 
                className="text-sm text-spring-green-700 flex items-center gap-1"
                id={`${textareaId}-success`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            )}
            {helper && !error && !success && (
              <p 
                className="text-sm text-moss-green-600"
                id={`${textareaId}-helper`}
              >
                {helper}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Search Input Component (specialized for job search)
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClear?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, showClear = true, placeholder = "Search Massachusetts clean energy jobs...", ...props }, ref) => {
    const [query, setQuery] = React.useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
      props.onChange?.(e);
    };
    
    const handleClear = () => {
      setQuery('');
      onSearch?.('');
      onClear?.();
    };
    
    return (
      <Input
        {...props}
        ref={ref}
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          showClear && query ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-spring-green transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : undefined
        }
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { Input, Textarea, SearchInput, inputVariants }; 