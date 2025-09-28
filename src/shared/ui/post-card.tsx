import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import type { Post, TimelinePost } from '@/entities/post'
import { useAuth } from '@/features/auth'
import { DeletePostButton } from '@/features/posts/delete-post'
import { Card, CardContent } from './card'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { MessageCircle } from 'lucide-react'

interface PostCardProps {
  post: Post | TimelinePost
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const isOwner = user?.id === post.userId

  // Handle both Post and TimelinePost formats
  const username = 'user' in post ? post.user.username : post.username

  const renderContent = (
    content: string,
    mentions: typeof post.mentions
  ): (string | React.ReactElement)[] => {
    // Split content by mentions and render safely
    let parts: (string | React.ReactElement)[] = [content]

    mentions.forEach((mention) => {
      const newParts: (string | React.ReactElement)[] = []
      parts.forEach((part, index) => {
        if (typeof part === 'string') {
          const mentionText = `@${mention.username}`
          const splitParts = part.split(mentionText)
          splitParts.forEach((splitPart, splitIndex) => {
            if (splitIndex > 0) {
              newParts.push(
                <Link
                  key={`${mention.id}-${index}-${splitIndex}`}
                  to={`/profile/${mention.id}`}
                  className="text-primary font-medium hover:underline"
                >
                  {mentionText}
                </Link>
              )
            }
            if (splitPart) {
              newParts.push(splitPart)
            }
          })
        } else {
          newParts.push(part)
        }
      })
      parts = newParts
    })

    return parts
  }

  return (
    <Card className="border-x-0 border-t-0 rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link
                to={`/profile/${post.userId}`}
                className="font-semibold hover:underline"
              >
                @{username}
              </Link>
              <span className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {isOwner && (
                <div className="ml-auto">
                  <DeletePostButton postId={post.id.toString()} />
                </div>
              )}
            </div>

            <div className="mt-2">
              <Link to={`/post/${post.id}`}>
                <p className="text-foreground whitespace-pre-wrap hover:cursor-pointer">
                  {renderContent(post.content, post.mentions)}
                </p>
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
