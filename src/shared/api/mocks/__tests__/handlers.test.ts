import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '../handlers'

// Set up MSW server for testing
const server = setupServer(...handlers)

// Enable API mocking before tests
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done
afterAll(() => server.close())

describe('MSW Handlers', () => {
  describe('GET /api/timeline', () => {
    it('should return paginated timeline posts', async () => {
      const response = await fetch(
        'http://localhost:3000/api/timeline?offset=0&limit=10'
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('items')
      expect(data.data).toHaveProperty('pagination')
      expect(Array.isArray(data.data.items)).toBe(true)
      expect(data.data.pagination).toEqual({
        limit: 10,
        offset: 0,
        total: expect.any(Number),
      })
    })

    it('should handle pagination correctly', async () => {
      const response = await fetch(
        'http://localhost:3000/api/timeline?offset=2&limit=3'
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.pagination.limit).toBe(3)
      expect(data.data.pagination.offset).toBe(2)
      expect(data.data.items.length).toBeLessThanOrEqual(3)
    })

    it('should return posts with correct structure', async () => {
      const response = await fetch(
        'http://localhost:3000/api/timeline?offset=0&limit=1'
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.items.length).toBeGreaterThan(0)

      const post = data.data.items[0]
      expect(post).toHaveProperty('id')
      expect(post).toHaveProperty('user_id')
      expect(post).toHaveProperty('content')
      expect(post).toHaveProperty('created_at')
      expect(post).toHaveProperty('updated_at')
      expect(post).toHaveProperty('is_deleted')
      expect(post).toHaveProperty('user')
      expect(post.user).toHaveProperty('id')
      expect(post.user).toHaveProperty('username')
    })
  })

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const newPost = { content: 'Test post from MSW handler test' }

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty('data')
      expect(data.data.content).toBe(newPost.content)
      expect(data.data.user.username).toBe('johndoe')
      expect(data.data).toHaveProperty('id')
      expect(data.data).toHaveProperty('created_at')
    })
  })

  describe('GET /api/posts/:id', () => {
    it('should return a specific post', async () => {
      const response = await fetch('http://localhost:3000/api/posts/1')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.id).toBe('1')
      expect(data.data).toHaveProperty('content')
      expect(data.data).toHaveProperty('user')
    })

    it('should return 404 for non-existent post', async () => {
      const response = await fetch('http://localhost:3000/api/posts/999')
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error.code).toBe('not_found')
      expect(data.error.message).toBe('Post not found')
    })
  })

  describe('DELETE /api/posts/:id', () => {
    it('should soft delete a post', async () => {
      const response = await fetch('http://localhost:3000/api/posts/1', {
        method: 'DELETE',
      })

      expect(response.status).toBe(204)
    })

    it('should return 404 for non-existent post', async () => {
      const response = await fetch('http://localhost:3000/api/posts/999', {
        method: 'DELETE',
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error.code).toBe('not_found')
    })
  })

  describe('GET /api/posts/user/:userId', () => {
    it('should return posts by specific user', async () => {
      const response = await fetch(
        'http://localhost:3000/api/posts/user/1?offset=0&limit=10'
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('items')
      expect(data.data).toHaveProperty('pagination')

      // All posts should be from user 1
      data.data.items.forEach((post: any) => {
        expect(post.user_id).toBe('1')
        expect(post.is_deleted).toBe(false)
      })
    })
  })
})
