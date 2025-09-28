import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { postApi } from '@/entities/post'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Loader2 } from 'lucide-react'

interface CommentsListProps {
  postId: string
}

export function CommentsList({ postId }: CommentsListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postApi.getPostComments(postId),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load comments
      </div>
    )
  }

  const comments = data?.data.comments ?? []

  if (comments.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div>
      <div className="border-t border-border p-4">
        <h3 className="font-semibold">Comments ({comments.length})</h3>
      </div>

      {comments.map((comment) => (
        <Card key={comment.id} className="border-x-0 border-t-0 rounded-none">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {comment.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    @{comment.user.username}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
