import { useQuery } from '@tanstack/react-query'
import { postApi } from '@/entities/post'
import { PostCard } from '@/shared/ui/post-card'
import { CreateCommentForm } from '@/features/comments/create-comment'
import { CommentsList } from './CommentsList'
import { Loader2 } from 'lucide-react'

interface PostDetailProps {
  postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postApi.getPost(postId),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="p-8 text-center text-destructive">Post not found</div>
    )
  }

  const post = data.data.post

  return (
    <div>
      <PostCard post={post} />

      <div className="border-t border-border p-4">
        <h3 className="font-semibold mb-4">Add a comment</h3>
        <CreateCommentForm postId={postId} />
      </div>

      <CommentsList postId={postId} />
    </div>
  )
}
