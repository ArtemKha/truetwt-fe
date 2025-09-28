import type { ValidationIssue } from '@/shared/api/types'
import { cn } from '@/shared/lib/utils'

interface ValidationErrorProps {
  issues?: ValidationIssue[]
  className?: string
}

export function ValidationError({ issues, className }: ValidationErrorProps) {
  if (!issues || issues.length === 0) {
    return null
  }

  if (issues.length === 1) {
    return (
      <p className={cn('text-sm text-destructive', className)}>
        {issues[0].message}
      </p>
    )
  }

  return (
    <div className={cn('text-sm text-destructive', className)}>
      <ul className="list-disc list-inside space-y-1">
        {issues.map((issue, index) => (
          <li key={`${issue.path}-${index}`}>{issue.message}</li>
        ))}
      </ul>
    </div>
  )
}

interface FieldValidationErrorProps {
  issues?: ValidationIssue[]
  fieldPath: string
  className?: string
}

export function FieldValidationError({
  issues,
  fieldPath,
  className,
}: FieldValidationErrorProps) {
  const fieldIssues = issues?.filter((issue) => issue.path === fieldPath) || []

  return <ValidationError issues={fieldIssues} className={className} />
}
