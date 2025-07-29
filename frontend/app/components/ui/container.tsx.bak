/**
 * Container Component - ACT Climate Economy Assistant
 * 
 * Purpose: Provides consistent width constraints and padding for page content
 * Location: /app/components/ui/container.tsx
 * Used by: Page layouts, sections, and content areas
 * 
 * Features:
 * - Responsive width constraints
 * - Consistent horizontal padding
 * - Optional vertical padding
 * - Size variants from narrow to full width
 * - Content centering
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva(
  "w-full mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        xs: "max-w-screen-sm",
        sm: "max-w-screen-md",
        default: "max-w-screen-lg",
        lg: "max-w-screen-xl",
        xl: "max-w-screen-2xl",
        full: "",
      },
      padding: {
        none: "py-0",
        sm: "py-4",
        default: "py-8",
        lg: "py-12",
        xl: "py-16",
      },
      centered: {
        true: "flex flex-col items-center",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      padding: "none",
      centered: false,
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, centered, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padding, centered }), className)}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container, containerVariants } 