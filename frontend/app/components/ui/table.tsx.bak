"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Table wrapper variants
const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      variant: {
        default: "border border-sand-gray-200 rounded-md",
        clean: "",
      },
      density: {
        compact: "",
        default: "",
        relaxed: "",
      },
      stripe: {
        none: "",
        even: "[&_tbody_tr:nth-child(even)]:bg-sand-gray-50",
        odd: "[&_tbody_tr:nth-child(odd)]:bg-sand-gray-50",
      },
      hover: {
        true: "[&_tbody_tr:hover]:bg-spring-green-50",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      density: "default",
      stripe: "even",
      hover: true,
    },
  }
)

// Table cell variants
const cellVariants = cva(
  "align-middle",
  {
    variants: {
      density: {
        compact: "px-2 py-2",
        default: "px-4 py-3",
        relaxed: "px-6 py-4",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      density: "default",
      align: "left",
    },
  }
)

// Table head cell variants
const headCellVariants = cva(
  "h-10 text-sand-gray-500 font-medium align-middle [&:has([role=checkbox])]:pr-0 bg-sand-gray-50",
  {
    variants: {
      density: {
        compact: "px-2 py-2",
        default: "px-4 py-3",
        relaxed: "px-6 py-4",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      sortable: {
        true: "cursor-pointer select-none hover:bg-sand-gray-100",
        false: "",
      }
    },
    defaultVariants: {
      density: "default",
      align: "left",
      sortable: false,
    },
  }
)

export interface TableProps 
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<
  HTMLTableElement,
  TableProps
>(({ className, variant, density, stripe, hover, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn(tableVariants({ variant, density, stripe, hover }), className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("border-b border-sand-gray-200", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-sand-gray-200", className)} {...props} />
))
TableBody.displayName = "TableBody"

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-sand-gray-50 font-medium border-t border-sand-gray-200", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
}

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  TableRowProps
>(({ className, selected, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors hover:bg-spring-green-50/50 data-[state=selected]:bg-spring-green-50",
      selected && "bg-spring-green-50",
      className
    )}
    {...selected && { "data-state": "selected" }}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export interface TableHeadProps 
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof headCellVariants> {
  sorted?: "asc" | "desc" | false
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(({ className, density, align, sortable, sorted, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      headCellVariants({ density, align, sortable }),
      sortable && "group relative",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-1">
      {children}
      {sortable && (
        <span className={cn(
          "inline-flex opacity-0 group-hover:opacity-70",
          sorted === "asc" && "opacity-100",
          sorted === "desc" && "opacity-100 rotate-180",
        )}>
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
            className="h-4 w-4"
          >
            <path d="m6 9 6-6 6 6" />
          </svg>
        </span>
      )}
    </div>
  </th>
))
TableHead.displayName = "TableHead"

export interface TableCellProps 
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof cellVariants> {}

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ className, density, align, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(cellVariants({ density, align }), className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-sand-gray-500 text-center", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} 