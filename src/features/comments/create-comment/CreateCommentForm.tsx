import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { postApi } from '@/entities/post'
import { getErrorMessage, getValidationError } from '@/shared/api/client'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import {
  type CreateCommentFormData,
  createCommentSchema,
} from '@/shared/lib/schemas'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { ValidationError } from '@/shared/ui/validationError'

interface CreateCommentFormProps {
  postId: string
}

export function CreateCommentForm({ postId }: CreateCommentFormProps) {
  const queryClient = useQueryClient()
  const { setValidationError, clearValidationError, getFieldIssues } =
    useValidationError()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
    },
  })

  const content = watch('content')
  const characterCount = content?.length || 0
  const maxLength = 500

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      postApi.createComment(postId, data),
    onSuccess: () => {
      reset()
      clearValidationError()
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      toast.success('Comment added successfully!')
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

  const onSubmit = (data: CreateCommentFormData) => {
    clearValidationError()
    createCommentMutation.mutate({ content: data.content })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-2">
        <div className="relative">
          <Textarea
            {...register('content')}
            placeholder="Write a comment..."
            className="min-h-[80px] resize-none pr-16"
            maxLength={maxLength}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            <span
              className={characterCount > maxLength ? 'text-destructive' : ''}
            >
              {characterCount}/{maxLength}
            </span>
          </div>
        </div>
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
        <ValidationError issues={getFieldIssues('content')} />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            createCommentMutation.isPending ||
            characterCount === 0 ||
            characterCount > maxLength
          }
          size="sm"
        >
          {createCommentMutation.isPending ? 'Commenting...' : 'Comment'}
        </Button>
      </div>
    </form>
  )
}
