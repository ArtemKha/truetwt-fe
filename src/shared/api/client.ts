import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiError, ValidationError } from './types'

// Extend the AxiosRequestConfig to include _retry flag
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

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
    const accessToken = localStorage.getItem('auth-access-token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string | null) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config

    // Handle authentication errors
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('auth-refresh-token')

      if (refreshToken) {
        try {
          // Create a new axios instance to avoid interceptor loops
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
              },
            }
          )

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data.data

          // Update stored tokens
          localStorage.setItem('auth-access-token', accessToken)
          localStorage.setItem('auth-refresh-token', newRefreshToken)

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          processQueue(null, accessToken)

          return apiClient(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)

          // Clear all auth data and redirect to login
          localStorage.removeItem('auth-access-token')
          localStorage.removeItem('auth-refresh-token')
          localStorage.removeItem('auth-user')
          window.location.replace('/login')

          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // No refresh token, clear auth data and redirect
        localStorage.removeItem('auth-access-token')
        localStorage.removeItem('auth-refresh-token')
        localStorage.removeItem('auth-user')
        window.location.replace('/login')
      }
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
