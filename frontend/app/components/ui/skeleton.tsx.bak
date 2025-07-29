/**
 * Skeleton Component - ACT Climate Economy Assistant
 * 
 * Purpose: Display placeholder loading animations for content
 * Location: /app/components/ui/skeleton.tsx
 * Used by: Lists, cards, and content areas during data loading
 * 
 * Features:
 * - Customizable dimensions
 * - Shape variants (rectangle, circle, text line)
 * - Massachusetts climate branding with subtle animation
 * - Accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-shimmer bg-gradient-to-r from-sand-gray-100 via-sand-gray-200 to-sand-gray-100 bg-[length:400%_100%]",
  {
    variants: {
      variant: {
        default: "rounded",
        circle: "rounded-full",
        card: "rounded-lg",
        avatar: "rounded-full",
        button: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        aria-label="Loading..."
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Prebuilt skeleton types
const SkeletonText = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <Skeleton 
    className={cn("h-4 w-full max-w-[24rem]", className)} 
    {...props} 
  />
)
SkeletonText.displayName = "SkeletonText"

const SkeletonAvatar = ({ 
  className, 
  size = "md", 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { size?: "xs" | "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12", 
    xl: "h-16 w-16",
  }
  
  return (
    <Skeleton 
      variant="avatar" 
      className={cn(sizeClasses[size], className)} 
      {...props} 
    />
  )
}
SkeletonAvatar.displayName = "SkeletonAvatar"

const SkeletonCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <Skeleton 
    variant="card" 
    className={cn("h-48 w-full", className)} 
    {...props} 
  />
)
SkeletonCard.displayName = "SkeletonCard"

const SkeletonButton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <Skeleton 
    variant="button" 
    className={cn("h-10 w-20", className)} 
    {...props} 
  />
)
SkeletonButton.displayName = "SkeletonButton"

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard, 
  SkeletonButton, 
  skeletonVariants 
} 