"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const radioVariants = cva(
  "h-5 w-5 rounded-full border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-spring-green-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
  {
    variants: {
      variant: {
        default: "border-sand-gray-300 text-spring-green-600",
        subtle: "border-sand-gray-300 text-midnight-forest-600",
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

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export interface RadioGroupItemProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants> {
  label?: string
  description?: string
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, size, label, description, ...props }, ref) => {
  const id = React.useId()
  
  return (
    <div className="flex items-start space-x-2">
      <RadioGroupPrimitive.Item
        id={props.id || id}
        ref={ref}
        className={cn(radioVariants({ variant, size }), className)}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className={cn(
            "h-2.5 w-2.5 fill-current text-current",
            size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3 w-3" : ""
          )} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      
      {(label || description) && (
        <div className="grid gap-1.5 leading-none pt-0.5">
          {label && (
            <label
              htmlFor={props.id || id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-sand-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Card-style radio option for visual selection
export interface RadioCardProps 
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'className'> {
  className?: string
  cardClassName?: string
  title: string
  description?: string
  icon?: React.ReactNode
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ cardClassName, title, description, icon, children, ...props }, ref) => {
  const id = React.useId()
  
  return (
    <div className="relative">
      <RadioGroupPrimitive.Item
        id={id}
        ref={ref}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex items-start space-x-3 rounded-lg border border-sand-gray-200 p-4 transition-all",
          "cursor-pointer hover:bg-sand-gray-50",
          "data-[state=checked]:border-spring-green-500 data-[state=checked]:ring-1 data-[state=checked]:ring-spring-green-500",
          cardClassName
        )}
      >
        {icon && (
          <span className="flex-shrink-0 text-spring-green-600">
            {icon}
          </span>
        )}
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">{title}</span>
          {description && (
            <span className="text-xs text-sand-gray-500">{description}</span>
          )}
          {children}
        </div>
        <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-spring-green-500 opacity-0 transition-opacity data-[state=checked]:opacity-100" />
      </label>
    </div>
  )
})
RadioCard.displayName = "RadioCard"

export { RadioGroup, RadioGroupItem, RadioCard, radioVariants } 