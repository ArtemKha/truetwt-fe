import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/hooks/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ValidationError } from '@/shared/ui/validation-error'
import { loginSchema, type LoginFormData } from '@/shared/lib/schemas'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { getValidationError } from '@/shared/api/client'

export function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoginLoading, isAuthenticated } = useAuth()
  const { setValidationError, clearValidationError, getFieldIssues } =
    useValidationError()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  if (isAuthenticated) {
    navigate('/')
  }

  const onSubmit = async (data: LoginFormData) => {
    clearValidationError()

    try {
      await login(data)
    } catch (error) {
      const validationErr = getValidationError(error)
      if (validationErr) {
        setValidationError(validationErr)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register('username')}
          placeholder="Enter your username"
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
        <ValidationError issues={getFieldIssues('username')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <ValidationError issues={getFieldIssues('password')} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoginLoading}>
        {isLoginLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
