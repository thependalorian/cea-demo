"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const dropdownMenuSubTriggerVariants = cva(
  "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-spring-green-50 data-[state=open]:bg-spring-green-50",
  {
    variants: {
      inset: {
        true: "pl-8",
      },
    },
  }
)

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> &
    VariantProps<typeof dropdownMenuSubTriggerVariants>
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(dropdownMenuSubTriggerVariants({ inset }), className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4 text-midnight-forest-500" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const dropdownMenuSubContentVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-sand-gray-200 bg-white p-1 text-midnight-forest-800 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "",
        glass: "backdrop-blur-md bg-white/80 shadow-soft border-white/20",
        "glass-dark": "backdrop-blur-md bg-midnight-forest-900/80 shadow-soft border-white/10 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> &
    VariantProps<typeof dropdownMenuSubContentVariants>
>(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(dropdownMenuSubContentVariants({ variant }), className)}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const dropdownMenuContentVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-sand-gray-200 bg-white p-1 text-midnight-forest-800 shadow-lg will-change-[opacity,transform] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "",
        glass: "backdrop-blur-md bg-white/80 shadow-soft border-white/20",
        "glass-dark": "backdrop-blur-md bg-midnight-forest-900/80 shadow-soft border-white/10 text-white",
      },
      elevation: {
        none: "shadow-none",
        low: "shadow-sm",
        default: "shadow-lg",
        high: "shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      elevation: "default",
    },
  }
)

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
    VariantProps<typeof dropdownMenuContentVariants>
>(({ className, variant, elevation, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownMenuContentVariants({ variant, elevation }), className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const dropdownMenuItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-spring-green-50 focus:text-midnight-forest-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      inset: {
        true: "pl-8",
      },
      destructive: {
        true: "text-red-500 focus:bg-red-50",
      },
      success: {
        true: "text-green-600 focus:bg-green-50",
      },
      warning: {
        true: "text-amber-500 focus:bg-amber-50",
      },
    },
    defaultVariants: {
      inset: false,
      destructive: false,
      success: false,
      warning: false,
    },
  }
)

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
    VariantProps<typeof dropdownMenuItemVariants>
>(({ className, inset, destructive, success, warning, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownMenuItemVariants({ inset, destructive, success, warning }), className)}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-spring-green-50 focus:text-midnight-forest-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-spring-green-600" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-spring-green-50 focus:text-midnight-forest-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-spring-green-600 text-spring-green-600" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const dropdownMenuLabelVariants = cva(
  "px-2 py-1.5 text-sm font-medium",
  {
    variants: {
      inset: {
        true: "pl-8",
      },
      color: {
        default: "text-midnight-forest-900",
        muted: "text-midnight-forest-500",
        accent: "text-spring-green-700",
      }
    },
    defaultVariants: {
      inset: false,
      color: "muted",
    },
  }
)

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> &
    VariantProps<typeof dropdownMenuLabelVariants>
>(({ className, inset, color, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(dropdownMenuLabelVariants({ inset, color }), className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-sand-gray-200", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-sand-gray-500", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

// Export variant types for external use
export const DropdownMenuItemVariants = dropdownMenuItemVariants
export const DropdownMenuContentVariants = dropdownMenuContentVariants
export const DropdownMenuSubContentVariants = dropdownMenuSubContentVariants
export const DropdownMenuLabelVariants = dropdownMenuLabelVariants 