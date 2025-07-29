/**
 * Avatar Component - ACT Climate Economy Assistant
 * 
 * Purpose: Display user profile images or initials
 * Location: /app/components/ui/avatar.tsx
 * Used by: User profiles, comments, chat interfaces
 * 
 * Features:
 * - Image display with fallback to initials
 * - Multiple size variants
 * - Optional status indicator
 * - Apple-inspired smooth design with subtle shadows
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Image from "next/image"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center shrink-0 font-medium overflow-hidden bg-sand-gray-100 text-midnight-forest-700 transition-all will-change-transform",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-24 w-24 text-2xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
      border: {
        none: "",
        thin: "border border-sand-gray-200",
        default: "ring-2 ring-white ring-offset-2",
        accent: "ring-2 ring-spring-green-500 ring-offset-2",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      border: "none",
      shadow: "none",
    },
  }
)

export interface AvatarProps 
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  initials?: string;
  fallback?: React.ReactNode;
  status?: "online" | "away" | "busy" | "offline";
  statusClassName?: string;
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ 
    className,
    src,
    alt,
    initials,
    fallback,
    size,
    shape,
    border,
    shadow,
    status,
    statusClassName,
    ...props
  }, ref) => {
    const [hasError, setHasError] = React.useState(false)
    
    // Generate initials if not provided
    const getInitials = () => {
      if (initials) return initials;
      if (!alt) return "";
      
      return alt
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Status indicator classes
    const statusColorClasses = {
      online: "bg-spring-green-500",
      away: "bg-amber-400",
      busy: "bg-red-500",
      offline: "bg-sand-gray-400",
    }

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size, shape, border, shadow }), className)}
        {...props}
      >
        {/* Image */}
        {src && !hasError ? (
          <Image
            src={src}
            alt={alt || "User avatar"}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setHasError(true)}
          />
        ) : fallback ? (
          // Custom fallback
          fallback
        ) : (
          // Initials fallback
          <span>{getInitials()}</span>
        )}
        
        {/* Status indicator */}
        {status && (
          <span 
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
              statusColorClasses[status],
              size === "xs" ? "h-1.5 w-1.5" : 
              size === "sm" ? "h-2 w-2" : 
              size === "md" ? "h-2.5 w-2.5" : 
              size === "lg" ? "h-3 w-3" : 
              size === "xl" ? "h-3.5 w-3.5" : 
              "h-4 w-4",
              statusClassName
            )}
          />
        )}
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants } 