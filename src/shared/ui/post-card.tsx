import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { type Post } from '@/entities/post'
import { useAuth } from '@/features/auth'
import { DeletePostButton } from '@/features/posts/delete-post'
import { Card, CardContent } from './card'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { MessageCircle } from 'lucide-react'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const isOwner = user?.id === post.user_id

  const formatContent = (content: string) => {
    // Simple mention detection and linking
    return content.replace(
      /@(\w+)/g,
      '<span class="text-primary font-medium">@$1</span>'
    )
  }

  return (
    <Card className="border-x-0 border-t-0 rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {post.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link
                to={`/profile/${post.user_id}`}
                className="font-semibold hover:underline"
              >
                @{post.user.username}
              </Link>
              <span className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              {isOwner && (
                <div className="ml-auto">
                  <DeletePostButton postId={post.id} />
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <Link to={`/post/${post.id}`}>
                <p
                  className="text-foreground whitespace-pre-wrap hover:cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />
              </Link>
            </div>
            
            <div className="mt-3 flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/post/${post.id}`}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Comment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
