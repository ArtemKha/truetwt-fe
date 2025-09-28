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

export interface UsersResponse {
  success: boolean
  data: {
    users: Array<{
      id: number
      username: string
      email: string
      createdAt: string
      updatedAt: string
    }>
    pagination: {
      total: number
      page: number
      limit: number
      hasNext: boolean
      hasPrev: boolean
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

export interface CommentsResponse {
  success: boolean
  data: {
    comments: Array<{
      id: number
      postId: number
      userId: number
      content: string
      createdAt: string
      updatedAt: string
      isDeleted: boolean
      user: {
        id: number
        username: string
      }
    }>
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

export interface UserResponse {
  success: boolean
  data: {
    user: {
      id: number
      username: string
      email: string
      createdAt: string
      updatedAt: string
    }
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
