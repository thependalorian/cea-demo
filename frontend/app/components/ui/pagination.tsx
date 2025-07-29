/**
 * Pagination Component - ACT Climate Economy Assistant
 * 
 * Purpose: Navigate through multi-page content with consistent UI
 * Location: /app/components/ui/pagination.tsx
 * Used by: Job listings, search results, data tables
 * 
 * Features:
 * - Responsive design that adapts to screen sizes
 * - Previous/next navigation
 * - Page number indicators with ellipsis for large ranges
 * - Accessible keyboard navigation
 * - Climate branding
 */

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  showFirstLast?: boolean
  maxVisible?: number
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({
    className,
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    showFirstLast = true,
    maxVisible = 5,
    size = "default",
    variant = "outline",
    ...props
  }, ref) => {
    // Calculate page ranges to show
    const getVisiblePages = React.useMemo(() => {
      // If we can show all pages
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }
      
      // Always show first and last page
      const firstPage = 1
      const lastPage = totalPages
      
      // Calculate how many neighbors to show on each side of current page
      const sideItems = Math.floor((maxVisible - 3) / 2) // -3 accounts for current, first, last
      
      let startPage = Math.max(firstPage + 1, currentPage - sideItems)
      const endPage = Math.min(lastPage - 1, startPage + maxVisible - 3)
      
      if (endPage - startPage < maxVisible - 3) {
        startPage = Math.max(firstPage + 1, lastPage - maxVisible + 2)
      }
      
      // Build the array of pages to show
      const pages: (number | "ellipsis-start" | "ellipsis-end")[] = []
      
      // Add first page
      if (showFirstLast) pages.push(firstPage)
      
      // Add ellipsis if needed
      if (startPage > firstPage + 1) {
        pages.push("ellipsis-start")
      } else if (startPage === firstPage + 1) {
        pages.push(firstPage + 1)
      }
      
      // Add visible pages
      for (let i = startPage + 1; i < endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-end")
      } else if (endPage === lastPage - 1) {
        pages.push(lastPage - 1)
      }
      
      // Add last page
      if (showFirstLast) pages.push(lastPage)
      
      return pages
    }, [currentPage, totalPages, maxVisible, showFirstLast])
    
    // Button size mapping
    const buttonSizeMap = {
      sm: "btn-sm h-8 w-8 text-xs",
      default: "h-10 w-10",
      lg: "btn-lg h-12 w-12",
    }
    
    // Handle page change
    const handlePageChange = (page: number) => {
      if (page !== currentPage && page >= 1 && page <= totalPages && !disabled) {
        onPageChange(page)
      }
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center space-x-1 md:space-x-2",
          className
        )}
        {...props}
      >
        {/* Previous page button */}
        <Button
          variant={variant}
          size="icon"
          className={cn(buttonSizeMap[size])}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className={cn(
            size === "sm" ? "h-4 w-4" : 
            size === "lg" ? "h-6 w-6" : 
            "h-5 w-5"
          )} />
        </Button>
        
        {/* Page numbers */}
        {getVisiblePages.map((page, i) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span 
                key={`ellipsis-${i}`} 
                className={cn(
                  "flex items-center justify-center text-sand-gray-400",
                  buttonSizeMap[size]
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )
          }
          
          return (
            <Button
              key={`page-${page}`}
              variant={page === currentPage ? "default" : variant}
              size="icon"
              className={cn(buttonSizeMap[size])}
              onClick={() => handlePageChange(page as number)}
              disabled={disabled || page === currentPage}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          )
        })}
        
        {/* Next page button */}
        <Button
          variant={variant}
          size="icon"
          className={cn(buttonSizeMap[size])}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className={cn(
            size === "sm" ? "h-4 w-4" : 
            size === "lg" ? "h-6 w-6" : 
            "h-5 w-5"
          )} />
        </Button>
      </div>
    )
  }
)
Pagination.displayName = "Pagination"

export { Pagination } 