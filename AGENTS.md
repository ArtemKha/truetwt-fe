# Validation Error Handling System

This document describes the standardized validation error handling system implemented in the TrueTweet application.

## Overview

The validation system provides a consistent format for handling validation errors across the entire application, both on the frontend and backend. All validation errors follow a standardized structure that makes error handling predictable and user-friendly.

## Error Format

All validation errors follow this standardized format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "issues": [
        {
          "path": "email",
          "message": "Required",
          "code": "invalid_type"
        },
        {
          "path": "password",
          "message": "Password must be at least 8 characters",
          "code": "too_small"
        },
        {
          "path": "password",
          "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          "code": "invalid_string"
        }
      ]
    }
  }
}
```

### Field Descriptions

- **success**: Always `false` for error responses
- **error.code**: Always `"VALIDATION_ERROR"` for validation errors
- **error.message**: Human-readable summary of the validation failure
- **error.details.issues**: Array of specific validation issues
  - **path**: The field path that failed validation
  - **message**: Human-readable error message for this specific issue
  - **code**: Machine-readable error code for programmatic handling

## Frontend Implementation

### Core Components

#### 1. Type Definitions (`src/shared/api/types.ts`)

```typescript
export interface ValidationIssue {
  path: string
  message: string
  code: string
}

export interface ValidationError {
  success: false
  error: {
    code: 'VALIDATION_ERROR'
    message: string
    details: {
      issues: ValidationIssue[]
    }
  }
}
```

#### 2. Validation Utilities (`src/shared/lib/validation.ts`)

Provides utility functions for:
- Transforming Zod errors to the standard format
- Converting React Hook Form errors
- Handling legacy API error formats
- Extracting field-specific validation issues

#### 3. API Client Integration (`src/shared/api/client.ts`)

The API client automatically:
- Transforms legacy error formats to the new standard
- Provides type-safe error checking functions
- Extracts user-friendly error messages

#### 4. Validation Hook (`src/shared/lib/hooks/useValidationError.ts`)

Custom React hook for managing validation errors in components:

```typescript
const { 
  validationError, 
  setValidationError, 
  clearValidationError,
  getFieldIssues,
  hasFieldError 
} = useValidationError()
```

#### 5. UI Components (`src/shared/ui/validation-error.tsx`)

Reusable components for displaying validation errors:

```tsx
<ValidationError issues={getFieldIssues('email')} />
<FieldValidationError issues={allIssues} fieldPath="password" />
```

### Validation Schemas (`src/shared/lib/schemas.ts`)

Enhanced Zod schemas with proper error messages and codes:

```typescript
export const emailSchema = z
  .string({
    required_error: 'Required',
    invalid_type_error: 'Invalid type',
  })
  .min(1, { message: 'Required' })
  .email({ message: 'Invalid email address' })

export const passwordSchema = z
  .string({
    required_error: 'Required',
    invalid_type_error: 'Invalid type',
  })
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
```

## Usage Examples

### Basic Form with Validation

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { getValidationError } from '@/shared/api/client'
import { ValidationError } from '@/shared/ui/validation-error'
import { loginSchema, type LoginFormData } from '@/shared/lib/schemas'

function LoginForm() {
  const { 
    setValidationError, 
    clearValidationError,
    getFieldIssues 
  } = useValidationError()
  
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && (
        <p className="text-sm text-destructive">{errors.username.message}</p>
      )}
      <ValidationError issues={getFieldIssues('username')} />
      
      <input {...register('password')} type="password" />
      {errors.password && (
        <p className="text-sm text-destructive">{errors.password.message}</p>
      )}
      <ValidationError issues={getFieldIssues('password')} />
      
      <button type="submit">Login</button>
    </form>
  )
}
```

### API Error Handling

```typescript
import { getValidationError, getErrorMessage, isValidationError } from '@/shared/api/client'

const mutation = useMutation({
  mutationFn: apiCall,
  onError: (error: unknown) => {
    if (isValidationError(error)) {
      // Handle validation errors specifically
      const validationError = getValidationError(error)
      setValidationError(validationError)
    } else {
      // Handle other errors with generic message
      toast.error(getErrorMessage(error))
    }
  },
})
```

## Common Validation Error Codes

The backend uses Zod for validation and can return any of the following error codes. The frontend automatically handles all these codes:

| Code | Description | Example Use Case |
|------|-------------|------------------|
| `invalid_type` | Field has wrong type or is missing | Required field not provided, wrong data type |
| `invalid_literal` | Value doesn't match expected literal | Enum value not in allowed list |
| `custom` | Custom validation rule failed | Passwords don't match, business logic validation |
| `invalid_union` | Value doesn't match any union type | Field accepts multiple types but matches none |
| `invalid_union_discriminator` | Union discriminator field invalid | Discriminated union type detection failed |
| `invalid_enum_value` | Value not in allowed enum values | Status field with invalid option |
| `unrecognized_keys` | Object has unexpected properties | Extra fields in request body |
| `invalid_arguments` | Function arguments are invalid | Invalid parameters passed to validation |
| `invalid_return_type` | Return type validation failed | Response validation error |
| `invalid_date` | Date format or value is invalid | Malformed date string, invalid date |
| `invalid_string` | String validation failed | Invalid format, regex mismatch, email format |
| `too_small` | Value is too small/short | Password too short, number below minimum |
| `too_big` | Value is too big/long | Content exceeds character limit, number above maximum |
| `invalid_intersection_types` | Intersection type validation failed | Object doesn't satisfy all required types |
| `not_multiple_of` | Number is not a multiple of specified value | Number validation with step requirements |
| `not_finite` | Number is not finite | Infinite or NaN values |

### Common Frontend-Specific Codes

| Code | Description | Example Use Case |
|------|-------------|------------------|
| `invalid_email` | Invalid email format | Malformed email address (derived from `invalid_string`) |
| `validation_error` | General validation error | Legacy API error transformation |

## Backend Integration

The backend should return validation errors in the same format. The frontend API client automatically transforms legacy formats to maintain compatibility.

### Expected Backend Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "issues": [
        {
          "path": "email",
          "message": "Invalid email address",
          "code": "invalid_string"
        }
      ]
    }
  }
}
```

### Legacy Format Support

The system also supports legacy error formats and automatically transforms them:

```json
{
  "error": {
    "message": "Validation failed",
    "errors": {
      "email": ["Invalid email address"],
      "password": ["Too short", "Missing special character"]
    }
  }
}
```

## Best Practices

1. **Always use the validation hook** in forms that need server-side validation error display
2. **Clear validation errors** before making new API calls
3. **Combine client and server validation** - use Zod schemas for immediate feedback and server validation for security
4. **Provide specific error messages** that help users understand how to fix the issue
5. **Use consistent error codes** for programmatic error handling
6. **Display field-specific errors** near the relevant form fields

## Testing

The validation system includes comprehensive examples and utilities for testing:

- Mock validation errors for different scenarios
- Type-safe error handling
- Consistent error display across components

See `src/shared/lib/validation-examples.ts` for complete examples and test cases.
