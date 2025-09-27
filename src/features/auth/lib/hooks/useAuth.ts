import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userApi,
  type LoginRequest,
  type CreateUserRequest,
} from '@/entities/user'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api/client'

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const accessToken = localStorage.getItem('auth-access-token')
      const refreshToken = localStorage.getItem('auth-refresh-token')
      const user = localStorage.getItem('auth-user')

      if (accessToken && refreshToken && user) {
        try {
          return {
            accessToken,
            refreshToken,
            user: JSON.parse(user),
          }
        } catch {
          // Clear invalid data
          localStorage.removeItem('auth-access-token')
          localStorage.removeItem('auth-refresh-token')
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
    onSuccess: (response) => {
      if (response.data) {
        const { tokens, user } = response.data
        localStorage.setItem('auth-access-token', tokens.accessToken)
        localStorage.setItem('auth-refresh-token', tokens.refreshToken)
        localStorage.setItem('auth-user', JSON.stringify(user))
        queryClient.setQueryData(['auth'], {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        })
        toast.success('Successfully logged in!')
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const registerMutation = useMutation({
    mutationFn: userApi.register,
    onSuccess: (response) => {
      if (response.data) {
        const { tokens, user } = response.data
        localStorage.setItem('auth-access-token', tokens.accessToken)
        localStorage.setItem('auth-refresh-token', tokens.refreshToken)
        localStorage.setItem('auth-user', JSON.stringify(user))
        queryClient.setQueryData(['auth'], {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        })
        toast.success('Account created successfully!')
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      localStorage.removeItem('auth-access-token')
      localStorage.removeItem('auth-refresh-token')
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
    accessToken: authData?.accessToken,
    refreshToken: authData?.refreshToken,
    isAuthenticated: !!authData?.accessToken,
    isLoading,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  }
}
