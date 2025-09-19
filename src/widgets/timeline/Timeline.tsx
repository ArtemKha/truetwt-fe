import { useInfiniteQuery } from '@tanstack/react-query'
import { postApi } from '@/entities/post'
import { PostCard } from '@/shared/ui/post-card'
import { Button } from '@/shared/ui/button'
import { Loader2 } from 'lucide-react'

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
    queryFn: ({ pageParam = 0 }) =>
      postApi.getTimeline({ offset: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, pages) => {
      const totalItems = pages.reduce(
        (acc, page) => acc + page.data.items.length,
        0
      )
      if (totalItems < lastPage.data.pagination.total) {
        return totalItems
      }
      return undefined
    },
    initialPageParam: 0,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  console.log('error', error)

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load timeline. Please try again.
      </div>
    )
  }

  const posts = data?.pages.flatMap((page) => page.data.items) ?? []

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
