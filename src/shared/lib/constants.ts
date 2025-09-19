export const POST_MAX_LENGTH = 280

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  POSTS: {
    TIMELINE: '/timeline',
    CREATE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    BY_USER: (userId: string) => `/posts/user/${userId}`,
    COMMENTS: (postId: string) => `/posts/${postId}/comments`,
  },
} as const

export const QUERY_KEYS = {
  AUTH: ['auth'],
  TIMELINE: ['timeline'],
  USERS: ['users'],
  USER: (id: string) => ['user', id],
  POSTS: ['posts'],
  POST: (id: string) => ['post', id],
  USER_POSTS: (userId: string) => ['posts', 'user', userId],
  COMMENTS: (postId: string) => ['comments', postId],
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  USERS: '/users',
  PROFILE: (userId: string) => `/profile/${userId}`,
  POST: (postId: string) => `/post/${postId}`,
} as const
