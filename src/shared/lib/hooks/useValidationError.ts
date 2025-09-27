import { useState, useCallback } from 'react'
import type { ValidationError, ValidationIssue } from '@/shared/api/types'
import {
  getFieldValidationIssues,
  hasFieldValidationError,
  groupValidationIssuesByField,
} from '@/shared/lib/validation'

interface UseValidationErrorReturn {
  validationError: ValidationError | null
  setValidationError: (error: ValidationError | null) => void
  clearValidationError: () => void
  getFieldIssues: (fieldPath: string) => ValidationIssue[]
  hasFieldError: (fieldPath: string) => boolean
  getAllFieldErrors: () => Record<string, ValidationIssue[]>
  clearFieldError: (fieldPath: string) => void
}

/**
 * Custom hook for managing validation errors in forms
 */
export function useValidationError(): UseValidationErrorReturn {
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null)

  const clearValidationError = useCallback(() => {
    setValidationError(null)
  }, [])

  const getFieldIssues = useCallback(
    (fieldPath: string): ValidationIssue[] => {
      if (!validationError) return []
      return getFieldValidationIssues(validationError, fieldPath)
    },
    [validationError]
  )

  const hasFieldError = useCallback(
    (fieldPath: string): boolean => {
      if (!validationError) return false
      return hasFieldValidationError(validationError, fieldPath)
    },
    [validationError]
  )

  const getAllFieldErrors = useCallback((): Record<
    string,
    ValidationIssue[]
  > => {
    if (!validationError) return {}
    return groupValidationIssuesByField(validationError)
  }, [validationError])

  const clearFieldError = useCallback(
    (fieldPath: string) => {
      if (!validationError) return

      const remainingIssues = validationError.error.details.issues.filter(
        (issue) => issue.path !== fieldPath
      )

      if (remainingIssues.length === 0) {
        setValidationError(null)
      } else {
        setValidationError({
          ...validationError,
          error: {
            ...validationError.error,
            details: {
              issues: remainingIssues,
            },
          },
        })
      }
    },
    [validationError]
  )

  return {
    validationError,
    setValidationError,
    clearValidationError,
    getFieldIssues,
    hasFieldError,
    getAllFieldErrors,
    clearFieldError,
  }
}
