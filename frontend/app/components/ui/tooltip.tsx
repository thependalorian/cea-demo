/**
 * Tooltip Component - ACT Climate Economy Assistant
 * 
 * Purpose: Show additional information on hover/focus
 * Location: /app/components/ui/tooltip.tsx
 * Used by: Navigation items, form fields, buttons with compact labels
 * 
 * Features:
 * - Multiple positions
 * - Accessible keyboard focus support
 * - Animation with Apple-inspired timing
 * - Optional delay to prevent accidental triggering
 */

import * as React from "react"
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow,
  useDelayGroup,
  useDelayGroupContext,
  type Placement,
} from "@floating-ui/react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface TooltipOptions {
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  groupId?: string
  delay?: number | {
    open?: number
    close?: number
  }
}

export interface TooltipProps extends TooltipOptions {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  contentClassName?: string
  arrowClassName?: string
  asChild?: boolean
  interactive?: boolean
}

const Tooltip = ({
  children,
  content,
  placement = "top",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  className,
  contentClassName,
  arrowClassName,
  groupId,
  delay = 700,
  interactive = false,
}: TooltipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen

  const arrowRef = React.useRef(null)
  
  // Setup floating UI
  const { x, y, refs, strategy, context, middlewareData } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
        padding: 5,
      }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  })

  // Interactions for accessibility
  const hover = useHover(context, {
    move: false,
    enabled: !isControlled,
    delay,
  })
  const focus = useFocus(context, {
    enabled: !isControlled,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: "tooltip" })
  
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ])

  // Group delay for multiple tooltips
  const { delay: groupDelay } = useDelayGroupContext()
  useDelayGroup(context, { id: groupId })
  
  const actualDelay = groupId ? groupDelay : delay

  // Compute arrow position
  const { x: arrowX, y: arrowY } = middlewareData.arrow || {}
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]]

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps({
          className: cn("inline-block", className),
        })}
      >
        {children}
      </div>
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.setFloating}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }} // Apple easing
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 100,
                width: "max-content",
                maxWidth: "calc(100vw - 16px)",
              }}
              {...getFloatingProps({
                onPointerEnter: interactive ? undefined : () => {},
                onPointerLeave: interactive ? undefined : () => {},
              })}
            >
              <div 
                className={cn(
                  "bg-sand-gray-900 text-white text-sm px-3 py-1.5 rounded shadow-lg",
                  "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                  contentClassName
                )}
              >
                {content}
                <div
                  ref={arrowRef}
                  className={cn("absolute w-2 h-2 bg-sand-gray-900 rotate-45", arrowClassName)}
                  style={{
                    top: arrowY != null ? arrowY : "",
                    left: arrowX != null ? arrowX : "",
                    right: "",
                    bottom: "",
                    [staticSide as string]: "-4px",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  )
}

export { Tooltip } 