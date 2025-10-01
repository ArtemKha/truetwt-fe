import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@/shared/lib/test/testUtils'
import { UserPosts } from '../UserPosts'

// Mock the PostCard component
vi.mock('@/shared/ui/PostCard', () => ({
  PostCard: ({ post }: { post: { id: number; content: string } }) => (
    <div data-testid={`post-${post.id}`}>{post.content}</div>
  ),
}))

describe('UserPosts', () => {
  it('renders loading state initially', () => {
    render(<UserPosts userId="1" />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders empty state when user has no posts', async () => {
    render(<UserPosts userId="999" />)

    await waitFor(() => {
      expect(screen.getByText('No posts yet')).toBeInTheDocument()
    })
  })

  it('renders user posts when data is available', async () => {
    render(<UserPosts userId="1" />)

    await waitFor(() => {
      expect(screen.getByText('Posts')).toBeInTheDocument()
    })

    // Should render posts from user 1
    await waitFor(() => {
      const posts = screen.getAllByTestId(/^post-/)
      expect(posts.length).toBeGreaterThan(0)
    })
  })

  it('handles API response format correctly', async () => {
    render(<UserPosts userId="1" />)

    // Wait for the component to load and verify it handles the pagination correctly
    await waitFor(() => {
      expect(screen.getByText('Posts')).toBeInTheDocument()
    })
  })
})
