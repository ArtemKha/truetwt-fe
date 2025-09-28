import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getValidationError } from '@/shared/api/client'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { type RegisterFormData, registerSchema } from '@/shared/lib/schemas'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { ValidationError } from '@/shared/ui/validationError'
import { useAuth } from '../lib/hooks/useAuth'

export function RegisterForm() {
  const { register: registerUser, isRegisterLoading } = useAuth()
  const { setValidationError, clearValidationError, getFieldIssues } =
    useValidationError()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    clearValidationError()

    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      })
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
          placeholder="Choose a username"
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
        <ValidationError issues={getFieldIssues('username')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        <ValidationError issues={getFieldIssues('email')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <ValidationError issues={getFieldIssues('password')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
        <ValidationError issues={getFieldIssues('confirmPassword')} />
      </div>

      <Button type="submit" className="w-full" disabled={isRegisterLoading}>
        {isRegisterLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
