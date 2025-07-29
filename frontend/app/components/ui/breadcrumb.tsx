/**
 * Breadcrumb Component - ACT Climate Economy Assistant
 * 
 * Purpose: Show navigation hierarchy and path
 * Location: /app/components/ui/breadcrumb.tsx
 * Used by: Pages with deep hierarchical structure
 * 
 * Features:
 * - Responsive design with truncation
 * - Semantic HTML structure
 * - Accessible navigation
 * - Massachusetts climate styling
 */

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

const BreadcrumbContext = React.createContext<{ isInsideBreadcrumb: boolean }>({
  isInsideBreadcrumb: false
})

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode
  truncate?: boolean
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator = <ChevronRight className="h-4 w-4" />, truncate = true, ...props }, ref) => {
    return (
      <BreadcrumbContext.Provider value={{ isInsideBreadcrumb: true }}>
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          className={cn(
            "inline-flex items-center flex-wrap text-sm text-sand-gray-600",
            className
          )}
          {...props}
        />
      </BreadcrumbContext.Provider>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export interface BreadcrumbListProps extends React.HTMLAttributes<HTMLOListElement> {
  children?: React.ReactNode
}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => {
    const { isInsideBreadcrumb } = React.useContext(BreadcrumbContext)

    if (!isInsideBreadcrumb) {
      throw new Error("BreadcrumbList must be used within a Breadcrumb component")
    }

    return (
      <ol
        ref={ref}
        className={cn(
          "flex items-center flex-wrap gap-1.5 sm:gap-2.5",
          className
        )}
        {...props}
      />
    )
  }
)
BreadcrumbList.displayName = "BreadcrumbList"

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    const { isInsideBreadcrumb } = React.useContext(BreadcrumbContext)

    if (!isInsideBreadcrumb) {
      throw new Error("BreadcrumbItem must be used within a Breadcrumb component")
    }

    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
      />
    )
  }
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export interface BreadcrumbLinkProps {
  children?: React.ReactNode
  className?: string
  href: string
  asChild?: boolean
  current?: boolean
  truncate?: boolean
  maxChars?: number
}

const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  children,
  className,
  href,
  current = false,
  truncate = true,
  maxChars = 20,
  ...props
}) => {
  const { isInsideBreadcrumb } = React.useContext(BreadcrumbContext)

  if (!isInsideBreadcrumb) {
    throw new Error("BreadcrumbLink must be used within a Breadcrumb component")
  }
  
  let content = children
  
  // Handle truncation for string content
  if (truncate && typeof children === 'string' && children.length > maxChars) {
    content = children.substring(0, maxChars) + '...'
  }

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-midnight-forest",
        current ? "font-medium text-sand-gray-900 pointer-events-none" : "text-sand-gray-600",
        className
      )}
      aria-current={current ? "page" : undefined}
      {...props}
    >
      {content}
    </Link>
  )
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {}

const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    const { isInsideBreadcrumb } = React.useContext(BreadcrumbContext)

    if (!isInsideBreadcrumb) {
      throw new Error("BreadcrumbSeparator must be used within a Breadcrumb component")
    }

    return (
      <span
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn("text-sand-gray-400", className)}
        {...props}
      >
        {children || <ChevronRight className="h-3.5 w-3.5" />}
      </span>
    )
  }
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  truncate?: boolean
  maxChars?: number
}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, children, truncate = true, maxChars = 20, ...props }, ref) => {
    const { isInsideBreadcrumb } = React.useContext(BreadcrumbContext)

    if (!isInsideBreadcrumb) {
      throw new Error("BreadcrumbPage must be used within a Breadcrumb component")
    }
    
    let content = children
    
    // Handle truncation for string content
    if (truncate && typeof children === 'string' && children.length > maxChars) {
      content = children.substring(0, maxChars) + '...'
    }

    return (
      <span
        ref={ref}
        aria-current="page"
        className={cn("font-medium text-sand-gray-900", className)}
        {...props}
      >
        {content}
      </span>
    )
  }
)
BreadcrumbPage.displayName = "BreadcrumbPage"

// Convenience component for home icon link
const BreadcrumbHome = ({ className, href = "/", ...props }: BreadcrumbLinkProps) => {
  return (
    <BreadcrumbLink 
      href={href}
      className={cn("text-sand-gray-500 hover:text-midnight-forest", className)} 
      {...props}
    >
      <Home className="h-4 w-4" />
      <span className="sr-only">Home</span>
    </BreadcrumbLink>
  )
}
BreadcrumbHome.displayName = "BreadcrumbHome"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbHome
} 