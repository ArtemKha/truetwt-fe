import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { userApi } from '@/entities/user'
import { Avatar, AvatarFallback } from '@/shared/ui/Avatar'
import { Card, CardHeader, CardTitle } from '@/shared/ui/Card'

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserById(userId),
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
      <div className="p-8 text-center text-destructive">User not found</div>
    )
  }

  const user = data.data.user

  return (
    <Card className="border-x-0 border-t-0 rounded-none">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">@{user.username}</CardTitle>
            <p className="text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
