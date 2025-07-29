/**
 * Card Component - ACT Climate Economy Assistant
 * 
 * Purpose: Reusable card component with glass morphism and ACT branding
 * Location: /app/components/ui/card.tsx
 * Used by: Job listings, user profiles, dashboards, and content display
 * 
 * Features:
 * - Glass morphism effects for modern UI
 * - ACT brand subtle accents
 * - Interactive hover states
 * - Flexible content structure
 * - Accessibility compliant
 * 
 * @example
 * <Card variant="glass" className="p-6">
 *   <CardHeader>
 *     <CardTitle>Solar Installation Technician</CardTitle>
 *     <CardDescription>Boston, MA • Full-time</CardDescription>
 *   </CardHeader>
 *   <CardContent>Job details...</CardContent>
 * </Card>
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  // Base card styles with Apple-inspired refinement
  'rounded-xl border text-midnight-forest-800 will-change-transform transition-all duration-250',
  {
    variants: {
      variant: {
        // Standard white card with subtle shadow
        default: 'bg-white border-sand-gray-200 shadow-card',
        
        // Glass morphism cards for layered UI
        glass: 'glass-card backdrop-blur-lg bg-white/80 border-white/20 shadow-card',
        'glass-dark': 'glass-card backdrop-blur-lg bg-midnight-forest-900/80 border-midnight-forest-800/30 text-white shadow-card',
        
        // Special variants
        outline: 'border border-moss-green-200 bg-white hover:border-moss-green-300 shadow-soft',
        elevated: 'bg-white border-sand-gray-100 shadow-lg',
        
        // Gradient cards
        gradient: 'eco-gradient-light border-spring-green-200 text-midnight-forest-800',
        'gradient-dark': 'eco-gradient-dark border-midnight-forest-700 text-white',
        
        // Status variants
        success: 'bg-spring-green-50 border-spring-green-200 text-spring-green-900',
        warning: 'bg-solar-yellow-light/50 border-solar-yellow-light text-solar-yellow-dark',
        error: 'bg-red-50 border-red-200 text-red-900',
        
        // Massachusetts branded card
        massachusetts: 'bg-white border-moss-green-300 border-l-4',
      },
      size: {
        xs: 'p-3',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer glass-card-interactive',
        false: '',
      },
      elevation: {
        flat: 'shadow-none',
        low: 'shadow-soft',
        default: 'shadow-card',
        high: 'shadow-lg',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
      elevation: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean;
  elevation?: 'flat' | 'low' | 'default' | 'high';
  hoverEffect?: 'none' | 'lift' | 'glow';
  as?: React.ElementType;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive, 
    elevation,
    hoverEffect = 'none',
    as: Component = 'div',
    ...props 
  }, ref) => {
    // Combine hover effects with main classes
    const hoverClasses = {
      none: '',
      lift: 'hover:translate-y-[-4px] hover:shadow-hover transition-transform',
      glow: 'hover:shadow-[0_0_15px_rgba(178,222,38,0.3)]',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          cardVariants({ variant, size, interactive, elevation }), 
          hoverClasses[hoverEffect],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

// Card Title Component with improved typography
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', size = 'default', ...props }, ref) => {
    const sizeClasses = {
      xs: 'text-sm font-semibold',
      sm: 'text-base font-semibold',
      default: 'text-xl font-semibold',
      lg: 'text-2xl font-bold',
      xl: 'text-3xl font-bold'
    };
    
    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          'leading-tight tracking-tight text-midnight-forest-800',
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

// Card Description Component with improved typography
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  color?: 'default' | 'muted' | 'accent';
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, color = 'default', ...props }, ref) => {
    const colorClasses = {
      default: 'text-moss-green-600',
      muted: 'text-sand-gray-600',
      accent: 'text-spring-green-700'
    };
    
    return (
      <p
        ref={ref}
        className={cn('text-sm leading-relaxed', colorClasses[color], className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pb-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

// Card Footer Component with improved styling
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  align?: 'start' | 'center' | 'end' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = true, align = 'between', ...props }, ref) => {
    const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center pt-4 gap-3',
          alignClasses[align],
          bordered && 'border-t border-sand-gray-200',
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

// Specialized Job Card Component for ACT Climate Economy
export interface JobCardProps extends CardProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  posted: string;
  tags?: string[];
  climateImpact?: 'low' | 'medium' | 'high'; // Climate impact rating
  onApply?: () => void;
  onSave?: () => void;
  saved?: boolean;
  remote?: boolean;
}

const JobCard = React.forwardRef<HTMLDivElement, JobCardProps>(
  ({ 
    title, 
    company, 
    location, 
    salary, 
    type, 
    posted, 
    tags = [], 
    climateImpact = 'medium',
    onApply, 
    onSave, 
    saved = false,
    remote = false,
    className,
    ...props 
  }, ref) => {
    const climateImpactColors = {
      high: 'bg-spring-green-500',
      medium: 'bg-spring-green-300',
      low: 'bg-spring-green-200'
    };
    
    return (
      <Card
        ref={ref}
        variant="glass"
        interactive
        hoverEffect="lift"
        className={cn('group relative overflow-hidden', className)}
        {...props}
      >
        {/* Climate impact indicator */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-1.5",
            climateImpactColors[climateImpact],
            "opacity-70 group-hover:opacity-100 transition-opacity"
          )} 
          title={`Climate Impact: ${climateImpact}`}
        />
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle 
                size="lg"
                className="group-hover:text-spring-green-600 transition-colors"
              >
                {title}
              </CardTitle>
              <CardDescription className="mt-1.5">
                <span className="font-medium text-moss-green-600">{company}</span>
                <span className="mx-2">•</span>
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1 text-moss-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {location}
                  {remote && <span className="ml-2 text-xs bg-moss-green-100 text-moss-green-700 px-2 py-0.5 rounded-full">Remote</span>}
                </span>
              </CardDescription>
            </div>
            
            {/* Save button with improved styling */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
              className={cn(
                'p-2 rounded-full transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400',
                saved 
                  ? 'text-spring-green-500 bg-spring-green-50 hover:bg-spring-green-100'
                  : 'text-moss-green-500 hover:text-spring-green-500 hover:bg-spring-green-50'
              )}
              aria-label={saved ? 'Remove from saved' : 'Save job'}
            >
              <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Job details with improved styling */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-moss-green-600">
              {/* Job type */}
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-moss-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {type}
              </span>
              
              {/* Salary when available */}
              {salary && (
                <span className="flex items-center gap-1.5 font-medium">
                  <svg className="w-4 h-4 text-moss-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  {salary}
                </span>
              )}
              
              {/* Posted date */}
              <span className="ml-auto text-xs flex items-center gap-1.5 text-sand-gray-600">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {posted}
              </span>
            </div>
            
            {/* Tags with improved styling */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-spring-green-50 text-spring-green-700 rounded-full border border-spring-green-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter bordered align="between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="flex-1 py-2 px-4 rounded-lg bg-spring-green text-midnight-forest-800 font-medium hover:bg-spring-green-600 transition-colors shadow-button hover:shadow-hover"
          >
            Apply Now
          </button>
          <span className="text-xs text-moss-green-600 flex items-center gap-1.5">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Quick Apply
          </span>
        </CardFooter>
      </Card>
    );
  }
);

JobCard.displayName = 'JobCard';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  JobCard,
  cardVariants 
};