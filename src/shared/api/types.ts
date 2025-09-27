export interface PaginatedResponse<T> {
  data: {
    items: T[]
    pagination: {
      offset: number
      limit: number
      total: number
    }
  }
}

export interface TimelineResponse<T> {
  success: boolean
  data: {
    posts: T[]
    pagination: {
      total: number
      page: number
      limit: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface ValidationIssue {
  path: string
  message: string
  code: string
}

export interface ValidationErrorDetails {
  issues: ValidationIssue[]
}

export interface ValidationError {
  success: false
  error: {
    code: 'VALIDATION_ERROR'
    message: string
    details: ValidationErrorDetails
  }
}

export interface ApiError {
  success: boolean
  error?: {
    code: string
    message: string
    details?: ValidationErrorDetails
    errors?: Record<string, string[]> // Legacy format support
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: ValidationErrorDetails
  }
}
