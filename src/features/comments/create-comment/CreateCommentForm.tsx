import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postApi } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { ValidationError } from '@/shared/ui/validation-error'
import {
  createCommentSchema,
  type CreateCommentFormData,
} from '@/shared/lib/schemas'
import { useValidationError } from '@/shared/lib/hooks/useValidationError'
import { getValidationError, getErrorMessage } from '@/shared/api/client'
import { toast } from 'sonner'

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
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
      postId,
    },
  })

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
        <Textarea
          {...register('content')}
          placeholder="Write a comment..."
          className="min-h-[80px] resize-none"
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
        <ValidationError issues={getFieldIssues('content')} />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={createCommentMutation.isPending}
          size="sm"
        >
          {createCommentMutation.isPending ? 'Commenting...' : 'Comment'}
        </Button>
      </div>
    </form>
  )
}
