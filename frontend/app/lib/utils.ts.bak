/**
 * Utility functions for the Climate Economy Assistant
 * 
 * This module provides common utility functions used throughout the application.
 * - Type-safe class name merging
 * - Performance optimized
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind CSS
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency for Massachusetts clean energy salaries
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format relative time for job postings and activity
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) !== 1 ? 's' : ''} ago`;
  } else {
    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: targetDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Slugify strings for URLs (useful for job titles, etc.)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Sleep utility for testing and demos
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Massachusetts-specific utilities
 */
export const massachusettsUtilities = {
  /**
   * Format Massachusetts zip codes
   */
  formatZipCode(zip: string): string {
    const cleaned = zip.replace(/\D/g, '');
    if (cleaned.length === 5) {
      return cleaned;
    } else if (cleaned.length === 9) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return zip; // Return original if doesn't match expected format
  },

  /**
   * Common Massachusetts clean energy job categories
   */
  jobCategories: [
    'Solar Installation',
    'Wind Energy',
    'Energy Efficiency',
    'Clean Transportation',
    'Grid Modernization',
    'Energy Storage',
    'Green Building',
    'Environmental Compliance',
    'Renewable Energy Engineering',
    'Climate Policy',
  ] as const,

  /**
   * Massachusetts regions for job location filtering
   */
  regions: [
    'Greater Boston',
    'Western Massachusetts',
    'Central Massachusetts',
    'Cape Cod & Islands',
    'North Shore',
    'South Shore',
    'Metro West',
    'Pioneer Valley',
  ] as const,
}; 