import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApi } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Card, CardContent } from '@/shared/ui/card'
import { toast } from 'sonner'

const MAX_CHARACTERS = 280

export function CreatePostForm() {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success('Post created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create post')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && content.length <= MAX_CHARACTERS) {
      createPostMutation.mutate({ content: content.trim() })
    }
  }

  const remainingCharacters = MAX_CHARACTERS - content.length
  const isOverLimit = remainingCharacters < 0

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[100px] resize-none"
            maxLength={MAX_CHARACTERS + 50} // Allow typing over limit to show error
          />
          
          <div className="flex items-center justify-between">
            <div className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {remainingCharacters} characters remaining
            </div>
            
            <Button
              type="submit"
              disabled={!content.trim() || isOverLimit || createPostMutation.isPending}
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
