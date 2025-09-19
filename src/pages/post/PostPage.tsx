import { useParams } from 'react-router-dom'
import { PostDetail } from '@/widgets/post-detail'

export function PostPage() {
  const { postId } = useParams<{ postId: string }>()

  if (!postId) {
    return <div>Post not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PostDetail postId={postId} />
    </div>
  )
}
