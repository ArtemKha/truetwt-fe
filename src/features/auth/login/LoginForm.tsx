import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getValidationError } from '@/shared/api/client'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { type LoginFormData, loginSchema } from '@/shared/lib/schemas'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { ValidationError } from '@/shared/ui/validationError'
import { useAuth } from '../lib/hooks/useAuth'

export function LoginForm() {
  const { login, isLoginLoading } = useAuth()
  const { setValidationError, clearValidationError, getFieldIssues } =
    useValidationError()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

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
