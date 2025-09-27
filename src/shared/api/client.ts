import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiError, ValidationError } from './types'
import { transformLegacyApiError } from '@/shared/lib/validation'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      // Use window.location.replace to prevent back button issues
      window.location.replace('/login')
    }

    // Transform error response to standardized format
    if (error.response?.data) {
      const errorData = error.response.data

      // If it's already in the new format, pass it through
      if (
        errorData.error?.code === 'VALIDATION_ERROR' &&
        errorData.error?.details
      ) {
        return Promise.reject(error)
      }

      // Transform legacy validation errors to new format
      if (
        errorData.error?.errors &&
        typeof errorData.error.errors === 'object'
      ) {
        const transformedError: ValidationError = transformLegacyApiError(
          errorData.error.errors,
          errorData.error.message || 'Validation failed'
        )

        // Replace the response data with transformed error
        error.response.data = transformedError as ApiError
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Type-safe API error handler that extracts validation errors
 */
export function isValidationError(
  error: unknown
): error is AxiosError<ValidationError> {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'error' in error.response.data &&
      error.response.data.error &&
      typeof error.response.data.error === 'object' &&
      'code' in error.response.data.error &&
      error.response.data.error.code === 'VALIDATION_ERROR' &&
      'details' in error.response.data.error &&
      error.response.data.error.details &&
      typeof error.response.data.error.details === 'object' &&
      'issues' in error.response.data.error.details &&
      Array.isArray(error.response.data.error.details.issues)
  )
}

/**
 * Extracts validation error from API response
 */
export function getValidationError(error: unknown): ValidationError | null {
  if (isValidationError(error) && error.response) {
    return error.response.data
  }
  return null
}

/**
 * Gets a user-friendly error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (isValidationError(error) && error.response) {
    const validationError = error.response.data
    return validationError.error.message
  }

  // Check if it's an AxiosError with response data
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'error' in error.response.data &&
    error.response.data.error &&
    typeof error.response.data.error === 'object' &&
    'message' in error.response.data.error &&
    typeof error.response.data.error.message === 'string'
  ) {
    return error.response.data.error.message
  }

  // Check if it's a regular error with message
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return 'An unexpected error occurred'
}
