/**
 * Section Component - ACT Climate Economy Assistant
 * 
 * Purpose: Content organization with consistent styling and structure
 * Location: /app/components/ui/section.tsx
 * Used by: Page layouts for dividing content into semantic sections
 * 
 * Features:
 * - Background color variants
 * - Optional borders and dividers
 * - Consistent padding and spacing
 * - Semantic HTML structure with appropriate ARIA
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        primary: "bg-spring-green-50",
        secondary: "bg-moss-green-50",
        tertiary: "bg-sand-gray-50",
        dark: "bg-midnight-forest-900 text-white",
        accent: "bg-spring-green-50",
        gradient: "bg-gradient-to-br from-spring-green-50 to-moss-green-50",
        "gradient-dark": "bg-gradient-to-br from-midnight-forest-800 to-midnight-forest-900 text-white",
      },
      padding: {
        none: "py-0",
        sm: "py-4",
        default: "py-8 md:py-12",
        lg: "py-12 md:py-16",
        xl: "py-16 md:py-24",
      },
      bordered: {
        none: "",
        top: "border-t",
        bottom: "border-b",
        both: "border-y",
        all: "border",
      },
      rounded: {
        none: "",
        sm: "rounded-md",
        default: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      bordered: "none",
      rounded: "none",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article" | "aside" | "main";
  containerClassName?: string;
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    variant, 
    padding, 
    bordered, 
    rounded,
    as: Component = "section", 
    containerClassName,
    title,
    description,
    titleClassName,
    descriptionClassName,
    children,
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          sectionVariants({ variant, padding, bordered, rounded }), 
          className
        )}
        {...props}
      >
        <div className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
          {(title || description) && (
            <div className="mb-8 md:mb-12">
              {title && (
                <h2 className={cn(
                  "text-2xl md:text-3xl font-bold tracking-tight",
                  titleClassName
                )}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={cn(
                  "mt-4 text-base md:text-lg text-sand-gray-600",
                  descriptionClassName
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </Component>
    )
  }
)
Section.displayName = "Section"

export { Section, sectionVariants } 