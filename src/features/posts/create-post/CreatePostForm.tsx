import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postApi } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Card, CardContent } from '@/shared/ui/card'
import { ValidationError } from '@/shared/ui/validation-error'
import { createPostSchema, type CreatePostFormData } from '@/shared/lib/schemas'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { getValidationError, getErrorMessage } from '@/shared/api/client'
import { toast } from 'sonner'

const MAX_CHARACTERS = 280

export function CreatePostForm() {
  const queryClient = useQueryClient()
  const { setValidationError, clearValidationError, getFieldIssues } =
    useValidationError()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
    },
  })

  const content = watch('content') || ''
  const remainingCharacters = MAX_CHARACTERS - content.length
  const isOverLimit = remainingCharacters < 0

  const createPostMutation = useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      reset()
      clearValidationError()
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success('Post created successfully!')
    },
    onError: (error: unknown) => {
      const validationErr = getValidationError(error)
      if (validationErr) {
        setValidationError(validationErr)
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })

  const onSubmit = (data: CreatePostFormData) => {
    clearValidationError()
    createPostMutation.mutate(data)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What's happening?"
              {...register('content')}
              className="min-h-[100px] resize-none"
              maxLength={MAX_CHARACTERS + 50} // Allow typing over limit to show error
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
            <ValidationError issues={getFieldIssues('content')} />
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              {remainingCharacters} characters remaining
            </div>

            <Button
              type="submit"
              disabled={
                !content.trim() || isOverLimit || createPostMutation.isPending
              }
              size="sm"
            >
              {createPostMutation.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
