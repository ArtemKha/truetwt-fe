import { http, HttpResponse } from 'msw'
import type { Post } from '@/entities/post/model/types'

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    content: 'Just built an amazing React app! 🚀 #coding #react',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    is_deleted: false,
    user: {
      id: '1',
      username: 'johndoe',
    },
  },
  {
    id: '2',
    user_id: '2',
    content: 'Beautiful sunset today! Nature never fails to amaze me 🌅',
    created_at: '2024-01-15T09:15:00Z',
    updated_at: '2024-01-15T09:15:00Z',
    is_deleted: false,
    user: {
      id: '2',
      username: 'janedoe',
    },
  },
  {
    id: '3',
    user_id: '3',
    content:
      'Learning TypeScript has been a game changer for my development workflow. Highly recommend it to anyone working with JavaScript!',
    created_at: '2024-01-15T08:45:00Z',
    updated_at: '2024-01-15T08:45:00Z',
    is_deleted: false,
    user: {
      id: '3',
      username: 'devuser',
    },
  },
  {
    id: '4',
    user_id: '4',
    content:
      'Coffee ☕ + Code 💻 = Perfect morning! What are you working on today?',
    created_at: '2024-01-15T07:20:00Z',
    updated_at: '2024-01-15T07:20:00Z',
    is_deleted: false,
    user: {
      id: '4',
      username: 'codemaster',
    },
  },
  {
    id: '5',
    user_id: '5',
    content:
      'Just deployed my first full-stack application! The feeling is incredible 🎉',
    created_at: '2024-01-14T22:45:00Z',
    updated_at: '2024-01-14T22:45:00Z',
    is_deleted: false,
    user: {
      id: '5',
      username: 'newdev',
    },
  },
  {
    id: '6',
    user_id: '1',
    content:
      'Working on a new feature for our app. The architecture is coming together nicely!',
    created_at: '2024-01-14T18:30:00Z',
    updated_at: '2024-01-14T18:30:00Z',
    is_deleted: false,
    user: {
      id: '1',
      username: 'johndoe',
    },
  },
  {
    id: '7',
    user_id: '6',
    content:
      'Anyone else excited about the new React features? The concurrent rendering is amazing!',
    created_at: '2024-01-14T16:15:00Z',
    updated_at: '2024-01-14T16:15:00Z',
    is_deleted: false,
    user: {
      id: '6',
      username: 'reactfan',
    },
  },
  {
    id: '8',
    user_id: '2',
    content: 'Taking a break from coding to enjoy this beautiful weather 🌞',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    is_deleted: false,
    user: {
      id: '2',
      username: 'janedoe',
    },
  },
]

const API_BASE_URL = 'http://localhost:3000/api'

export const handlers = [
  // GET /api/timeline - Get timeline posts with pagination
  http.get(`${API_BASE_URL}/timeline`, ({ request }) => {
    const url = new URL(request.url)
    const offset = Number.parseInt(url.searchParams.get('offset') || '0', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)

    // Simulate pagination
    const startIndex = offset
    const endIndex = startIndex + limit
    const paginatedPosts = mockPosts.slice(startIndex, endIndex)

    return HttpResponse.json({
      data: {
        items: paginatedPosts,
        pagination: {
          limit,
          offset,
          total: mockPosts.length,
        },
      },
    })
  }),

  // POST /api/posts - Create a new post
  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const body = (await request.json()) as { content: string }

    const newPost: Post = {
      id: String(mockPosts.length + 1),
      user_id: '1', // Current user
      content: body.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      user: {
        id: '1',
        username: 'johndoe',
      },
    }

    // Add to the beginning of the array (newest first)
    mockPosts.unshift(newPost)

    return HttpResponse.json(
      {
        data: newPost,
      },
      { status: 201 }
    )
  }),

  // GET /api/posts/:id - Get specific post
  http.get(`${API_BASE_URL}/posts/:id`, ({ params }) => {
    const { id } = params
    const post = mockPosts.find((p) => p.id === id)

    if (!post) {
      return HttpResponse.json(
        {
          error: {
            code: 'not_found',
            message: 'Post not found',
          },
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      data: post,
    })
  }),

  // DELETE /api/posts/:id - Delete post
  http.delete(`${API_BASE_URL}/posts/:id`, ({ params }) => {
    const { id } = params
    const postIndex = mockPosts.findIndex((p) => p.id === id)

    if (postIndex === -1) {
      return HttpResponse.json(
        {
          error: {
            code: 'not_found',
            message: 'Post not found',
          },
        },
        { status: 404 }
      )
    }

    // Soft delete
    mockPosts[postIndex].is_deleted = true

    return HttpResponse.json(null, { status: 204 })
  }),

  // GET /api/posts/user/:userId - Get posts by user
  http.get(`${API_BASE_URL}/posts/user/:userId`, ({ params, request }) => {
    const { userId } = params
    const url = new URL(request.url)
    const offset = Number.parseInt(url.searchParams.get('offset') || '0', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)

    const userPosts = mockPosts.filter(
      (post) => post.user_id === userId && !post.is_deleted
    )
    const startIndex = offset
    const endIndex = startIndex + limit
    const paginatedPosts = userPosts.slice(startIndex, endIndex)

    return HttpResponse.json({
      data: {
        items: paginatedPosts,
        pagination: {
          limit,
          offset,
          total: userPosts.length,
        },
      },
    })
  }),
]

// Export individual handlers for specific use cases
export const timelineHandlers = [
  handlers[0], // GET /timeline
  handlers[1], // POST /posts
]

export const postHandlers = handlers.slice(2) // All other post-related handlers
