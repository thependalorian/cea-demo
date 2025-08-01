/**
 * Toast Component - ACT Climate Economy Assistant
 * 
 * Purpose: Display short-lived notifications to users
 * Location: /app/components/ui/toast.tsx
 * Used by: Form submissions, async actions, system notifications
 * 
 * Features:
 * - Multiple variants for different types of messages
 * - Accessible design with live regions
 * - Apple-inspired animations
 * - Customizable duration
 */

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-sand-gray-200 bg-white text-sand-gray-900",
        success: "border-spring-green-100 bg-spring-green-50 text-spring-green-900",
        info: "border-spring-green-100 bg-spring-green-50 text-spring-green-900",
        warning: "border-amber-100 bg-amber-50 text-amber-900",
        destructive: "border-red-100 bg-red-50 text-red-900",
        climate: "eco-gradient-light text-midnight-forest-900 border-moss-green-200",
        massachusetts: "border-blue-100 bg-blue-50 text-blue-900",
      },
      elevation: {
        low: "shadow-sm",
        default: "shadow-md",
        high: "shadow-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      elevation: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      icon?: React.ReactNode
    }
>(({ className, variant, elevation, icon, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, elevation }), className)}
      {...props}
    >
      {icon && (
        <div className="shrink-0 mr-2">
          {icon}
        </div>
      )}
      <div className="flex-1">{children}</div>
      <ToastPrimitives.Close className="absolute right-2 top-2 rounded-md p-1 text-sand-gray-500 opacity-0 transition-opacity hover:text-sand-gray-900 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-spring-green-500 group-hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-sand-gray-100 focus:outline-none focus:ring-1 focus:ring-spring-green-500 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-sand-gray-500 opacity-0 transition-opacity hover:text-sand-gray-900 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-spring-green-500 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} 