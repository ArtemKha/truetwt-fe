import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { postApi } from '@/entities/post'
import { Button } from '@/shared/ui/Button'

interface DeletePostButtonProps {
  postId: string
  onDelete?: () => void
}

export function DeletePostButton({ postId, onDelete }: DeletePostButtonProps) {
  const queryClient = useQueryClient()

  const deletePostMutation = useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted successfully!')
      onDelete?.()
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { error?: { message?: string } } }
        message?: string
      }
      const message =
        apiError?.response?.data?.error?.message ||
        apiError?.message ||
        'Failed to delete post'
      toast.error(message)
    },
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deletePostMutation.isPending}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
