import { http, HttpResponse } from 'msw'
import type { Post, TimelinePost } from '@/entities/post/model/types'

// Mock data for timeline posts
const mockTimelinePosts: TimelinePost[] = [
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

// Mock comments data
const mockComments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    content: 'Welcome to the team! Looking forward to working together.',
    createdAt: '2025-09-27T11:01:10.000Z',
    updatedAt: '2025-09-27T11:01:10.000Z',
    isDeleted: false,
    user: {
      id: 2,
      username: 'bob_designer',
    },
  },
  {
    id: 21,
    postId: 1,
    userId: 3,
    content:
      'Thanks for the warm welcome! Excited to contribute to this project.',
    createdAt: '2025-09-27T11:01:10.000Z',
    updatedAt: '2025-09-27T11:01:10.000Z',
    isDeleted: false,
    user: {
      id: 3,
      username: 'charlie_pm',
    },
  },
  {
    id: 2,
    postId: 2,
    userId: 1,
    content: 'Great progress on the new feature! The UI looks amazing.',
    createdAt: '2025-09-27T11:15:30.000Z',
    updatedAt: '2025-09-27T11:15:30.000Z',
    isDeleted: false,
    user: {
      id: 1,
      username: 'alice_dev',
    },
  },
  {
    id: 3,
    postId: 2,
    userId: 4,
    content: "I've tested this thoroughly and it works perfectly!",
    createdAt: '2025-09-27T11:30:45.000Z',
    updatedAt: '2025-09-27T11:30:45.000Z',
    isDeleted: false,
    user: {
      id: 4,
      username: 'diana_qa',
    },
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
    const paginatedPosts = mockTimelinePosts.slice(startIndex, endIndex)
    const total = mockTimelinePosts.length
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
      id: mockTimelinePosts.length + 1,
      userId: 1, // Current user
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      user: {
        id: 1,
        username: 'alice_dev',
      },
      mentions: [], // TODO: Extract mentions from content
    }

    // Add to timeline as well
    const timelinePost: TimelinePost = {
      id: newPost.id,
      userId: newPost.userId,
      username: newPost.user.username,
      content: newPost.content,
      createdAt: newPost.createdAt,
      mentions: [],
    }
    mockTimelinePosts.unshift(timelinePost)

    return HttpResponse.json(
      {
        success: true,
        data: { post: newPost },
      },
      { status: 201 }
    )
  }),

  // GET /api/posts/:id - Get specific post
  http.get(`${API_BASE_URL}/posts/:id`, ({ params }) => {
    const { id } = params
    const timelinePost = mockTimelinePosts.find(
      (p) => p.id === Number.parseInt(id as string, 10)
    )

    if (!timelinePost) {
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

    // Convert timeline post to full post format
    const post: Post = {
      id: timelinePost.id,
      userId: timelinePost.userId,
      content: timelinePost.content,
      createdAt: timelinePost.createdAt,
      updatedAt: timelinePost.createdAt,
      isDeleted: false,
      user: {
        id: timelinePost.userId,
        username: timelinePost.username,
      },
      mentions: timelinePost.mentions.map((m) => ({
        id: m.id,
        username: m.username,
      })),
    }

    return HttpResponse.json({
      success: true,
      data: { post },
    })
  }),

  // DELETE /api/posts/:id - Delete post
  http.delete(`${API_BASE_URL}/posts/:id`, ({ params }) => {
    const { id } = params
    const postIndex = mockTimelinePosts.findIndex(
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

    mockTimelinePosts.splice(postIndex, 1)

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

    const userPosts = mockTimelinePosts.filter(
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
      {
        id: 1,
        username: 'alice_dev',
        email: 'alice@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 2,
        username: 'bob_designer',
        email: 'bob@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 3,
        username: 'charlie_pm',
        email: 'charlie@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 4,
        username: 'diana_qa',
        email: 'diana@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 5,
        username: 'eve_marketing',
        email: 'eve@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 6,
        username: 'frank_cto',
        email: 'frank@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 7,
        username: 'grace_hr',
        email: 'grace@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 8,
        username: 'henry_sales',
        email: 'henry@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
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

  // GET /api/posts/:postId/comments - Get comments for a post
  http.get(`${API_BASE_URL}/posts/:postId/comments`, ({ request, params }) => {
    const { postId } = params
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10)

    // Filter comments by postId
    const postComments = mockComments.filter(
      (comment) => comment.postId === Number(postId) && !comment.isDeleted
    )

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedComments = postComments.slice(startIndex, endIndex)
    const total = postComments.length
    const hasNext = endIndex < total
    const hasPrev = page > 1

    return HttpResponse.json({
      success: true,
      data: {
        comments: paginatedComments,
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

  // GET /api/users/:id - Get user by ID
  http.get(`${API_BASE_URL}/users/:id`, ({ params }) => {
    const { id } = params
    const userId = Number(id)

    const mockUsers = [
      {
        id: 1,
        username: 'alice_dev',
        email: 'alice@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 2,
        username: 'bob_designer',
        email: 'bob@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 3,
        username: 'charlie_pm',
        email: 'charlie@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 4,
        username: 'diana_qa',
        email: 'diana@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 5,
        username: 'eve_marketing',
        email: 'eve@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 6,
        username: 'frank_cto',
        email: 'frank@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 7,
        username: 'grace_hr',
        email: 'grace@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
      {
        id: 8,
        username: 'henry_sales',
        email: 'henry@example.com',
        createdAt: '2025-09-27T11:01:10.000Z',
        updatedAt: '2025-09-27T11:01:10.000Z',
      },
    ]

    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: {
        user,
      },
    })
  }),

  // POST /api/posts/:postId/comments - Create a new comment
  http.post(
    `${API_BASE_URL}/posts/:postId/comments`,
    async ({ request, params }) => {
      const { postId } = params
      const body = (await request.json()) as { content: string }

      const newComment = {
        id: mockComments.length + 1,
        postId: Number(postId),
        userId: 1, // Current user
        content: body.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        user: {
          id: 1,
          username: 'alice_dev',
        },
      }

      // Add to mock data
      mockComments.push(newComment)

      return HttpResponse.json({
        success: true,
        data: newComment,
      })
    }
  ),
]
