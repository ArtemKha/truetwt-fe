import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { userApi } from '@/entities/user'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Loader2 } from 'lucide-react'

export function UsersList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) =>
      userApi.getUsers({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.pagination.hasNext
        ? lastPage.data.pagination.page + 1
        : undefined
    },
    initialPageParam: 1,
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
        Failed to load users
      </div>
    )
  }

  const users = data?.pages.flatMap((page) => page.data.users) ?? []

  return (
    <div className="space-y-4 p-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">@{user.username}</h3>
                <p className="text-sm text-muted-foreground">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}

      {hasNextPage && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
