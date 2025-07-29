/**
 * API Response Utilities
 * 
 * Standardized response helpers for API routes
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function createSuccessResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export function createErrorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status })
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return createErrorResponse(error.message)
  }
  
  return createErrorResponse('An unexpected error occurred')
}

// Pagination utilities
export interface PaginationParams {
  page?: number
  limit?: number
  total?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function createPagination<T>(
  data: T[],
  page: number = 1,
  limit: number = 10,
  total: number = 0
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)
  
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)) // Cap at 100 items per page
  }
}

export function validateRequiredFields(data: unknown, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field]) {
      return `Missing required field: ${field}`
    }
  }
  return null
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
} 