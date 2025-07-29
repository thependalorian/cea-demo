"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const checkboxVariants = cva(
  "peer h-5 w-5 shrink-0 rounded-sm border shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white will-change-transform transition-all",
  {
    variants: {
      variant: {
        default: "border-sand-gray-300 data-[state=checked]:bg-spring-green-600 data-[state=checked]:border-spring-green-600",
        subtle: "border-sand-gray-300 data-[state=checked]:bg-midnight-forest-600 data-[state=checked]:border-midnight-forest-600",
        outline: "border-spring-green-600 bg-transparent data-[state=checked]:bg-spring-green-600",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CheckboxProps 
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  description?: string
  error?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, size, label, description, error, ...props }, ref) => {
  const id = React.useId()
  
  return (
    <div className="flex items-start space-x-2">
      <CheckboxPrimitive.Root
        id={props.id || id}
        ref={ref}
        className={cn(checkboxVariants({ variant, size }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className={cn("h-4 w-4", size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "")} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      {(label || description) && (
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={props.id || id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-red-500"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-sand-gray-500">
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, checkboxVariants } 