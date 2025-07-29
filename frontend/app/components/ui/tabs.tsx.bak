/**
 * Tabs Component - ACT Climate Economy Assistant
 * 
 * Purpose: Accessible tab navigation component with Apple-inspired design
 * Location: /app/components/ui/tabs.tsx
 * Used by: Dashboard, settings pages, profile pages, and content sections
 * 
 * Features:
 * - ARIA-compliant keyboard navigation
 * - Massachusetts climate economy branding
 * - Animated indicator
 * - Mobile responsive
 * - Multiple style variants
 * 
 * @example
 * <Tabs defaultValue="profile" variant="underline">
 *   <TabsList>
 *     <TabsTrigger value="profile">Profile</TabsTrigger>
 *     <TabsTrigger value="preferences">Preferences</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="profile">Profile content...</TabsContent>
 *   <TabsContent value="preferences">Preferences content...</TabsContent>
 * </Tabs>
 */

"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "flex flex-wrap text-midnight-forest-700 w-full",
  {
    variants: {
      variant: {
        // Default underlined tabs with green indicator
        underline: "border-b border-sand-gray-200 mb-4",
        
        // Pills with background color change
        pill: "p-1 bg-sand-gray-100 rounded-lg mb-4 gap-1",
        
        // Segmented control style (Apple-inspired)
        segmented: "p-1 border border-sand-gray-200 rounded-lg mb-4 gap-0",
        
        // Card tabs
        card: "gap-2 mb-4",
        
        // Vertical tabs
        vertical: "flex-col border-r border-sand-gray-200 pr-4 max-w-[240px]",
      },
      fullWidth: {
        true: "justify-between",
        false: "",
      }
    },
    defaultVariants: {
      variant: "underline",
      fullWidth: false,
    },
  }
)

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, fullWidth, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, fullWidth }), className)}
    {...props}
  />
))

TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        // Underlined tabs
        underline: "px-4 py-3 border-b-2 border-transparent data-[state=active]:text-spring-green-600 data-[state=active]:border-spring-green-500",
        
        // Pills 
        pill: "px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-midnight-forest-800 data-[state=active]:shadow-sm",
        
        // Segmented control style (Apple-inspired)
        segmented: "flex-1 px-4 py-2 first:rounded-l-md last:rounded-r-md data-[state=active]:bg-white data-[state=active]:text-midnight-forest-800 data-[state=active]:shadow-sm",
        
        // Card tabs
        card: "px-4 py-2 rounded-t-lg border-x border-t border-transparent data-[state=active]:border-sand-gray-200 data-[state=active]:bg-white data-[state=active]:text-midnight-forest-800",
        
        // Vertical tabs
        vertical: "justify-start py-2 px-4 text-left border-l-2 border-transparent data-[state=active]:border-spring-green-500 data-[state=active]:text-spring-green-600 data-[state=active]:bg-spring-green-50/50",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      variant: "underline",
      size: "default"
    },
  }
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
))

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const tabsContentVariants = cva(
  "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "data-[state=inactive]:animate-out data-[state=inactive]:fade-out data-[state=active]:animate-in data-[state=active]:fade-in",
        vertical: "ml-4"
      },
      animated: {
        true: "transition-all duration-200 ease-in-out",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      animated: true
    }
  }
)

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
    VariantProps<typeof tabsContentVariants>
>(({ className, variant, animated, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, animated }), className)}
    {...props}
  />
))

TabsContent.displayName = TabsPrimitive.Content.displayName

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} 