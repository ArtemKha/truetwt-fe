import { apiClient } from '@/shared/api/client'
import { ApiResponse, PaginatedResponse } from '@/shared/api/types'
import { User, CreateUserRequest, LoginRequest, AuthResponse } from '../model/types'

export const userApi = {
  register: (data: CreateUserRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post('/auth/register', data).then((res) => res.data),

  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post('/auth/login', data).then((res) => res.data),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout').then((res) => res.data),

  refreshToken: (): Promise<ApiResponse<{ token: string }>> =>
    apiClient.post('/auth/refresh').then((res) => res.data),

  getUsers: (params?: { offset?: number; limit?: number }): Promise<PaginatedResponse<User>> =>
    apiClient.get('/users', { params }).then((res) => res.data),

  getUserById: (id: string): Promise<ApiResponse<User>> =>
    apiClient.get(`/users/${id}`).then((res) => res.data),

  updateUser: (id: string, data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.put(`/users/${id}`, data).then((res) => res.data),
}
