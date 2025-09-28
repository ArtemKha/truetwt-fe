import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { postApi } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { PostCard } from '@/shared/ui/post-card'

export function Timeline() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['timeline'],
    queryFn: ({ pageParam = 1 }) =>
      postApi.getTimeline({ page: pageParam, limit: 10 }),
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
        Failed to load timeline. Please try again.
      </div>
    )
  }

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? []

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No posts yet. Be the first to share something!
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasNextPage && (
        <div className="p-4 text-center">
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
