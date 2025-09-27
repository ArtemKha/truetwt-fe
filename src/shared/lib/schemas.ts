import { z } from 'zod'

/**
 * Custom error messages with proper error codes for validation
 */
const ValidationMessages = {
  required: 'Required',
  invalidEmail: 'Invalid email address',
  invalidString: 'Must be a valid string',
  tooSmall: (min: number, type: 'string' | 'number' = 'string') =>
    type === 'string'
      ? `Must be at least ${min} characters`
      : `Must be at least ${min}`,
  tooBig: (max: number, type: 'string' | 'number' = 'string') =>
    type === 'string'
      ? `Must be no more than ${max} characters`
      : `Must be no more than ${max}`,
  invalidType: 'Invalid type',
  passwordComplexity:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
} as const

/**
 * Enhanced email validation schema
 */
export const emailSchema = z
  .string({
    required_error: ValidationMessages.required,
    invalid_type_error: ValidationMessages.invalidType,
  })
  .min(1, { message: ValidationMessages.required })
  .email({ message: ValidationMessages.invalidEmail })

/**
 * Enhanced password validation schema with complexity requirements
 */
export const passwordSchema = z
  .string({
    required_error: ValidationMessages.required,
    invalid_type_error: ValidationMessages.invalidType,
  })
  .min(8, { message: ValidationMessages.tooSmall(8) })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: ValidationMessages.passwordComplexity,
  })

/**
 * Username validation schema
 */
export const usernameSchema = z
  .string({
    required_error: ValidationMessages.required,
    invalid_type_error: ValidationMessages.invalidType,
  })
  .min(3, { message: ValidationMessages.tooSmall(3) })
  .max(50, { message: ValidationMessages.tooBig(50) })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Username can only contain letters, numbers, underscores, and hyphens',
  })

/**
 * Post content validation schema
 */
export const postContentSchema = z
  .string({
    required_error: ValidationMessages.required,
    invalid_type_error: ValidationMessages.invalidType,
  })
  .min(1, { message: ValidationMessages.required })
  .max(280, { message: ValidationMessages.tooBig(280) })

/**
 * Comment content validation schema
 */
export const commentContentSchema = z
  .string({
    required_error: ValidationMessages.required,
    invalid_type_error: ValidationMessages.invalidType,
  })
  .min(1, { message: ValidationMessages.required })
  .max(500, { message: ValidationMessages.tooBig(500) })

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  username: z
    .string({
      required_error: ValidationMessages.required,
      invalid_type_error: ValidationMessages.invalidType,
    })
    .min(1, { message: ValidationMessages.required }),
  password: z
    .string({
      required_error: ValidationMessages.required,
      invalid_type_error: ValidationMessages.invalidType,
    })
    .min(1, { message: ValidationMessages.required }),
})

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string({
      required_error: ValidationMessages.required,
      invalid_type_error: ValidationMessages.invalidType,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

/**
 * Create post form validation schema
 */
export const createPostSchema = z.object({
  content: postContentSchema,
})

/**
 * Create comment form validation schema
 */
export const createCommentSchema = z.object({
  content: commentContentSchema,
  postId: z.string().uuid({ message: 'Invalid post ID' }),
})

/**
 * Update profile form validation schema
 */
export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  bio: z
    .string()
    .max(160, { message: ValidationMessages.tooBig(160) })
    .optional(),
})

/**
 * Change password form validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({
        required_error: ValidationMessages.required,
        invalid_type_error: ValidationMessages.invalidType,
      })
      .min(1, { message: ValidationMessages.required }),
    newPassword: passwordSchema,
    confirmNewPassword: z.string({
      required_error: ValidationMessages.required,
      invalid_type_error: ValidationMessages.invalidType,
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })

// Export types for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CreatePostFormData = z.infer<typeof createPostSchema>
export type CreateCommentFormData = z.infer<typeof createCommentSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
