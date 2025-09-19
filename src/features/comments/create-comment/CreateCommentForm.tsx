import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApi } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { toast } from 'sonner'

interface CreateCommentFormProps {
  postId: string
}

export function CreateCommentForm({ postId }: CreateCommentFormProps) {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string }) => postApi.createComment(postId, data),
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      toast.success('Comment added successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to add comment')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      createCommentMutation.mutate({ content: content.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[80px] resize-none"
      />
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!content.trim() || createCommentMutation.isPending}
          size="sm"
        >
          {createCommentMutation.isPending ? 'Commenting...' : 'Comment'}
        </Button>
      </div>
    </form>
  )
}
