import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { postApi } from '@/entities/post'
import { getErrorMessage, getValidationError } from '@/shared/api/client'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { type CreatePostFormData, createPostSchema } from '@/shared/lib/schemas'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent } from '@/shared/ui/Card'
import { Textarea } from '@/shared/ui/Textarea'
import { ValidationError } from '@/shared/ui/validationError'

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
