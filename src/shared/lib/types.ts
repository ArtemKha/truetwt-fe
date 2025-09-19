export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

export interface PaginationParams {
  offset?: number
  limit?: number
}

export interface PaginationInfo {
  offset: number
  limit: number
  total: number
}

export type WithPagination<T> = {
  items: T[]
  pagination: PaginationInfo
}

export interface LoadingState {
  isLoading: boolean
  error: Error | null
}

export interface AsyncAction<T = void, P = void> extends LoadingState {
  execute: (params: P) => Promise<T>
  data?: T
}
