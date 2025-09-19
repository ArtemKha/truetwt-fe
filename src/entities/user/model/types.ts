export interface User {
  id: string
  username: string
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  username: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
