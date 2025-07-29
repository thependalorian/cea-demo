"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Sidebar container variants
const sidebarVariants = cva(
  "flex flex-col h-full transition-all will-change-transform",
  {
    variants: {
      variant: {
        default: "bg-white border-r border-sand-gray-200",
        glass: "bg-white/80 backdrop-blur-md border-r border-sand-gray-200/50",
        dark: "bg-midnight-forest-900 border-r border-midnight-forest-800",
        "glass-dark": "bg-midnight-forest-900/80 backdrop-blur-md border-r border-midnight-forest-800/50",
      },
      size: {
        compact: "w-16",
        default: "w-64",
        expanded: "w-80",
      },
      elevation: {
        none: "",
        low: "shadow-sm",
        default: "shadow-md",
        high: "shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      elevation: "low",
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  logo?: React.ReactNode
  footer?: React.ReactNode
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  className,
  children,
  variant,
  size,
  elevation,
  logo,
  footer,
  collapsed = false,
  onToggleCollapse,
  ...props
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(collapsed)
  
  // Toggle collapsed state
  const toggleCollapsed = React.useCallback(() => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onToggleCollapse && onToggleCollapse()
  }, [isCollapsed, onToggleCollapse])
  
  // Update internal state when prop changes
  React.useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  return (
    <div
      className={cn(
        sidebarVariants({ 
          variant, 
          size: isCollapsed ? "compact" : size, 
          elevation 
        }),
        className
      )}
      data-state={isCollapsed ? "collapsed" : "expanded"}
      {...props}
    >
      {/* Logo area */}
      {logo && (
        <div className="p-4 flex items-center justify-between border-b border-inherit">
          <div className={cn(
            "transition-opacity",
            isCollapsed && "opacity-0"
          )}>
            {logo}
          </div>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="w-8 h-8 rounded-full flex items-center justify-center text-midnight-forest-600 hover:bg-sand-gray-100 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "transition-transform duration-200",
                isCollapsed ? "rotate-180" : ""
              )}
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </div>
      
      {/* Footer area */}
      {footer && (
        <div className={cn(
          "border-t border-inherit p-4",
          isCollapsed && "flex justify-center"
        )}>
          {footer}
        </div>
      )}
    </div>
  )
}

// Navigation item variants
const navItemVariants = cva(
  "group flex items-center gap-3 rounded-md text-sm font-medium transition-all will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-midnight-forest-700 hover:bg-spring-green-50 hover:text-spring-green-600",
        subtle: "text-midnight-forest-600 hover:bg-sand-gray-100 hover:text-midnight-forest-700",
        accent: "text-spring-green-700 hover:bg-spring-green-50 hover:text-spring-green-600",
        destructive: "text-red-600 hover:bg-red-50 hover:text-red-700",
      },
      active: {
        true: "bg-spring-green-50 text-spring-green-600 font-medium",
        false: "",
      },
      size: {
        sm: "text-xs p-2",
        default: "p-3",
        lg: "text-base p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
      size: "default",
    },
  }
)

export interface NavItemProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navItemVariants> {
  href: string
  icon?: LucideIcon
  badge?: React.ReactNode
  external?: boolean
  collapsed?: boolean
}

export function NavItem({
  className,
  children,
  href,
  icon: Icon,
  badge,
  variant,
  active,
  size,
  external,
  collapsed = false,
  ...props
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = active !== undefined ? active : pathname === href
  
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {}
  
  return (
    <Link
      href={href}
      className={cn(
        navItemVariants({ variant, active: isActive, size }),
        className
      )}
      aria-current={isActive ? "page" : undefined}
      {...linkProps}
      {...props}
    >
      {/* Icon */}
      {Icon && (
        <span className={cn(
          "flex shrink-0 items-center justify-center transition-transform group-hover:scale-105",
          isActive && "text-spring-green-600"
        )}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      
      {/* Text and badge */}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {badge && <span className="ml-auto">{badge}</span>}
        </>
      )}
    </Link>
  )
}

export interface NavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  collapsed?: boolean
}

export function NavGroup({
  className,
  title,
  children,
  collapsed = false,
  ...props
}: NavGroupProps) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {title && !collapsed && (
        <h3 className="px-4 mb-1 text-xs font-semibold text-sand-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className={cn(
        "space-y-1 px-2",
        collapsed && "flex flex-col items-center"
      )}>
        {children}
      </div>
    </div>
  )
}

export interface NavSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NavSeparator({ className, ...props }: NavSeparatorProps) {
  return (
    <div 
      className={cn("h-px bg-sand-gray-200 my-2 mx-3", className)}
      role="separator" 
      {...props} 
    />
  )
}

export {
  sidebarVariants,
  navItemVariants,
} 