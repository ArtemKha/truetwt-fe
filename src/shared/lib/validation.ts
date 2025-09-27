import type { ZodError, ZodIssue } from 'zod'
import type { FieldErrors } from 'react-hook-form'
import type {
  ValidationIssue,
  ValidationError,
  ValidationErrorDetails,
} from '@/shared/api/types'

/**
 * Maps Zod error codes to our validation error codes (1:1 mapping)
 * These codes match exactly what the backend Zod validation returns
 */
const ZOD_ERROR_CODE_MAP: Record<string, string> = {
  invalid_type: 'invalid_type',
  invalid_literal: 'invalid_literal',
  custom: 'custom',
  invalid_union: 'invalid_union',
  invalid_union_discriminator: 'invalid_union_discriminator',
  invalid_enum_value: 'invalid_enum_value',
  unrecognized_keys: 'unrecognized_keys',
  invalid_arguments: 'invalid_arguments',
  invalid_return_type: 'invalid_return_type',
  invalid_date: 'invalid_date',
  invalid_string: 'invalid_string',
  too_small: 'too_small',
  too_big: 'too_big',
  invalid_intersection_types: 'invalid_intersection_types',
  not_multiple_of: 'not_multiple_of',
  not_finite: 'not_finite',
}

/**
 * Transforms a Zod error into our validation error format
 */
export function transformZodError(zodError: ZodError): ValidationError {
  const issues: ValidationIssue[] = zodError.issues.map((issue: ZodIssue) => ({
    path: issue.path.join('.') || 'root',
    message: issue.message,
    code: ZOD_ERROR_CODE_MAP[issue.code] || issue.code,
  }))

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: {
        issues,
      },
    },
  }
}

/**
 * Transforms React Hook Form errors into our validation error format
 */
export function transformReactHookFormErrors(
  errors: FieldErrors
): ValidationError {
  const issues: ValidationIssue[] = Object.entries(errors).map(
    ([field, error]) => ({
      path: field,
      message: error?.message || 'Invalid value',
      code: error?.type || 'invalid_type',
    })
  )

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Form validation failed',
      details: {
        issues,
      },
    },
  }
}

/**
 * Extracts validation issues for a specific field
 */
export function getFieldValidationIssues(
  validationError: ValidationError,
  fieldPath: string
): ValidationIssue[] {
  return validationError.error.details.issues.filter(
    (issue) => issue.path === fieldPath
  )
}

/**
 * Gets the first validation message for a specific field
 */
export function getFieldValidationMessage(
  validationError: ValidationError,
  fieldPath: string
): string | undefined {
  const issues = getFieldValidationIssues(validationError, fieldPath)
  return issues.length > 0 ? issues[0].message : undefined
}

/**
 * Checks if a validation error has issues for a specific field
 */
export function hasFieldValidationError(
  validationError: ValidationError,
  fieldPath: string
): boolean {
  return getFieldValidationIssues(validationError, fieldPath).length > 0
}

/**
 * Creates a validation error from a single field error
 */
export function createFieldValidationError(
  fieldPath: string,
  message: string,
  code = 'validation_error'
): ValidationError {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Field validation failed',
      details: {
        issues: [
          {
            path: fieldPath,
            message,
            code,
          },
        ],
      },
    },
  }
}

/**
 * Merges multiple validation errors into one
 */
export function mergeValidationErrors(
  ...errors: ValidationError[]
): ValidationError {
  const allIssues = errors.flatMap((error) => error.error.details.issues)

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Multiple validation errors',
      details: {
        issues: allIssues,
      },
    },
  }
}

/**
 * Formats validation issues for display
 */
export function formatValidationIssues(issues: ValidationIssue[]): string {
  if (issues.length === 0) return ''
  if (issues.length === 1) return issues[0].message

  return issues
    .map((issue, index) => `${index + 1}. ${issue.message}`)
    .join('\n')
}

/**
 * Groups validation issues by field path
 */
export function groupValidationIssuesByField(
  validationError: ValidationError
): Record<string, ValidationIssue[]> {
  const grouped: Record<string, ValidationIssue[]> = {}

  for (const issue of validationError.error.details.issues) {
    if (!grouped[issue.path]) {
      grouped[issue.path] = []
    }
    grouped[issue.path].push(issue)
  }

  return grouped
}
