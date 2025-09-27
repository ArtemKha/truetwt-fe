import { http, HttpResponse } from 'msw'
import type { Post } from '@/entities/post/model/types'

// Mock data for posts matching the new backend format
const mockPosts: Post[] = [
  {
    id: 9,
    userId: 1,
    username: 'alice_dev',
    content:
      'Working on some performance optimizations for the database queries. Should see significant improvements in response times soon.',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [],
  },
  {
    id: 8,
    userId: 8,
    username: 'henry_sales',
    content:
      'Closed 3 major deals this quarter! Our platform is really resonating with enterprise clients. @eve_marketing great campaigns!',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [
      {
        id: 5,
        username: 'eve_marketing',
      },
    ],
  },
  {
    id: 7,
    userId: 7,
    username: 'grace_hr',
    content:
      'Just onboarded 5 new team members this week. The team is growing fast! Welcome to everyone joining us. 👋',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [],
  },
  {
    id: 6,
    userId: 6,
    username: 'frank_cto',
    content:
      'Thinking about implementing real-time notifications. What are your thoughts on WebSocket vs Server-Sent Events? @alice_dev',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [
      {
        id: 1,
        username: 'alice_dev',
      },
    ],
  },
  {
    id: 5,
    userId: 5,
    username: 'eve_marketing',
    content:
      'Our user engagement metrics are through the roof! The community is really loving the new features. Great work team! 🎉',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [],
  },
  {
    id: 4,
    userId: 4,
    username: 'diana_qa',
    content:
      'Found an interesting bug in the timeline cache. @alice_dev @bob_designer might want to take a look at this edge case.',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [
      {
        id: 1,
        username: 'alice_dev',
      },
      {
        id: 2,
        username: 'bob_designer',
      },
    ],
  },
  {
    id: 3,
    userId: 3,
    username: 'charlie_pm',
    content:
      'Sprint planning meeting went great today. We have some exciting features coming up in the next release. Stay tuned! 📈',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [],
  },
  {
    id: 20,
    userId: 4,
    username: 'diana_qa',
    content:
      'Security audit completed successfully. No critical vulnerabilities found. Our security practices are solid! 🔒',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [],
  },
  {
    id: 2,
    userId: 2,
    username: 'bob_designer',
    content:
      'Just finished designing the new user interface mockups. The dark mode is going to look incredible! @alice_dev what do you think?',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [
      {
        id: 1,
        username: 'alice_dev',
      },
    ],
  },
  {
    id: 19,
    userId: 3,
    username: 'charlie_pm',
    content:
      'Roadmap for Q2 is finalized. Focus areas: performance, mobile experience, and advanced analytics. Exciting times ahead!',
    createdAt: '2025-09-27T10:48:02.000Z',
    mentions: [],
  },
]

const API_BASE_URL = 'http://localhost:3000/api'

export const handlers = [
  // GET /api/timeline - Get timeline posts with new pagination format
  http.get(`${API_BASE_URL}/timeline`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = mockPosts.slice(startIndex, endIndex)
    const total = mockPosts.length
    const hasNext = endIndex < total
    const hasPrev = page > 1

    return HttpResponse.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          total,
          page,
          limit,
          hasNext,
          hasPrev,
        },
      },
    })
  }),

  // POST /api/posts - Create a new post
  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const body = (await request.json()) as { content: string }

    const newPost: Post = {
      id: mockPosts.length + 1,
      userId: 1, // Current user
      username: 'alice_dev',
      content: body.content,
      createdAt: new Date().toISOString(),
      mentions: [], // TODO: Extract mentions from content
    }

    // Add to the beginning of the array (newest first)
    mockPosts.unshift(newPost)

    return HttpResponse.json(
      {
        success: true,
        data: newPost,
      },
      { status: 201 }
    )
  }),

  // GET /api/posts/:id - Get specific post
  http.get(`${API_BASE_URL}/posts/:id`, ({ params }) => {
    const { id } = params
    const post = mockPosts.find(
      (p) => p.id === Number.parseInt(id as string, 10)
    )

    if (!post) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Post not found',
          },
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: post,
    })
  }),

  // DELETE /api/posts/:id - Delete post
  http.delete(`${API_BASE_URL}/posts/:id`, ({ params }) => {
    const { id } = params
    const postIndex = mockPosts.findIndex(
      (p) => p.id === Number.parseInt(id as string, 10)
    )

    if (postIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Post not found',
          },
        },
        { status: 404 }
      )
    }

    mockPosts.splice(postIndex, 1)

    return HttpResponse.json({
      success: true,
    })
  }),

  // GET /api/posts/user/:userId - Get posts by user
  http.get(`${API_BASE_URL}/posts/user/:userId`, ({ params, request }) => {
    const { userId } = params
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)

    const userPosts = mockPosts.filter(
      (p) => p.userId === Number.parseInt(userId as string, 10)
    )

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = userPosts.slice(startIndex, endIndex)
    const total = userPosts.length
    const hasNext = endIndex < total
    const hasPrev = page > 1

    return HttpResponse.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          total,
          page,
          limit,
          hasNext,
          hasPrev,
        },
      },
    })
  }),

  // Authentication endpoints (keeping existing structure for now)
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      username: string
      password: string
    }

    // Simple mock authentication
    if (body.username && body.password) {
      return HttpResponse.json({
        success: true,
        data: {
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
          user: {
            id: 1,
            username: body.username,
          },
        },
      })
    }

    return HttpResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password',
        },
      },
      { status: 401 }
    )
  }),

  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      username: string
      password: string
    }

    return HttpResponse.json({
      success: true,
      data: {
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
        user: {
          id: Date.now(), // Simple ID generation
          username: body.username,
        },
      },
    })
  }),

  // GET /api/users - Get all users
  http.get(`${API_BASE_URL}/users`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)

    const mockUsers = [
      { id: 1, username: 'alice_dev' },
      { id: 2, username: 'bob_designer' },
      { id: 3, username: 'charlie_pm' },
      { id: 4, username: 'diana_qa' },
      { id: 5, username: 'eve_marketing' },
      { id: 6, username: 'frank_cto' },
      { id: 7, username: 'grace_hr' },
      { id: 8, username: 'henry_sales' },
    ]

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = mockUsers.slice(startIndex, endIndex)
    const total = mockUsers.length
    const hasNext = endIndex < total
    const hasPrev = page > 1

    return HttpResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          total,
          page,
          limit,
          hasNext,
          hasPrev,
        },
      },
    })
  }),
]
