/**
 * API utility functions for standardized responses
 */

export type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'BACKEND_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT_ERROR';

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: ErrorCode;
  };
}

/**
 * Create a standardized success response
 * @param data Response data
 * @param message Optional success message
 * @returns Standardized success response
 */
export function createSuccessResponse<T = any>(data: T, message?: string): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

/**
 * Create a standardized error response
 * @param message Error message
 * @param code Error code
 * @returns Standardized error response
 */
export function createErrorResponse(message: string, code: ErrorCode): ApiErrorResponse {
  return {
    success: false,
    error: {
      message,
      code
    }
  };
}

/**
 * Handle common API errors
 * @param error Error object
 * @param defaultMessage Default error message
 * @returns Standardized error response
 */
export function handleApiError(error: unknown, defaultMessage: string): ApiErrorResponse {
  console.error('API error:', error);
  
  let message = defaultMessage;
  let code: ErrorCode = 'SERVER_ERROR';
  
  // Parse error status if available
  if (error.status === 401) {
    message = 'Authentication required';
    code = 'UNAUTHORIZED';
  } else if (error.status === 403) {
    message = 'Insufficient permissions';
    code = 'FORBIDDEN';
  } else if (error.status === 404) {
    message = 'Resource not found';
    code = 'NOT_FOUND';
  } else if (error.status === 422) {
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  } else if (error.status === 429) {
    message = 'Rate limit exceeded';
    code = 'RATE_LIMIT_ERROR';
  }
  
  return createErrorResponse(error.message || message, code);
} 