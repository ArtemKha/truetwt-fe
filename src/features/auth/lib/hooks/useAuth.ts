import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userApi,
  type LoginRequest,
  type CreateUserRequest,
} from '@/entities/user'
import { toast } from 'sonner'

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string
      }
    }
  }
  message?: string
}

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const token = localStorage.getItem('auth-token')
      const user = localStorage.getItem('auth-user')
      if (token && user) {
        try {
          return { token, user: JSON.parse(user) }
        } catch {
          // Clear invalid data
          localStorage.removeItem('auth-token')
          localStorage.removeItem('auth-user')
          return null
        }
      }
      return null
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY, // Updated from cacheTime in v5
  })

  const loginMutation = useMutation({
    mutationFn: userApi.login,
    onSuccess: (data) => {
      localStorage.setItem('auth-token', data.data.token)
      localStorage.setItem('auth-user', JSON.stringify(data.data.user))
      queryClient.setQueryData(['auth'], {
        token: data.data.token,
        user: data.data.user,
      })
      toast.success('Successfully logged in!')
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError
      const message =
        apiError?.response?.data?.error?.message ||
        apiError?.message ||
        'Login failed'
      toast.error(message)
    },
  })

  const registerMutation = useMutation({
    mutationFn: userApi.register,
    onSuccess: (data) => {
      localStorage.setItem('auth-token', data.data.token)
      localStorage.setItem('auth-user', JSON.stringify(data.data.user))
      queryClient.setQueryData(['auth'], {
        token: data.data.token,
        user: data.data.user,
      })
      toast.success('Account created successfully!')
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError
      const message =
        apiError?.response?.data?.error?.message ||
        apiError?.message ||
        'Registration failed'
      toast.error(message)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      queryClient.setQueryData(['auth'], null)
      queryClient.clear()
      toast.success('Successfully logged out!')
    },
  })

  const login = (data: LoginRequest) => loginMutation.mutate(data)
  const register = (data: CreateUserRequest) => registerMutation.mutate(data)
  const logout = () => logoutMutation.mutate()

  return {
    user: authData?.user,
    token: authData?.token,
    isAuthenticated: !!authData?.token,
    isLoading,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  }
}
