export interface ApiResponse<T> {
  data: T
}

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

export interface ApiError {
  error: {
    code: string
    message: string
    errors?: Record<string, string[]>
  }
}
