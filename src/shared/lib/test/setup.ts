import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { handlers } from '@/shared/api/mocks/handlers'

// Set up MSW server for testing
const server = setupServer(...handlers)

// Enable API mocking before tests
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done
afterAll(() => server.close())

// Prevent Storybook from accessing Vitest globals
if (typeof window !== 'undefined') {
  // Ensure test globals are properly isolated
  Object.defineProperty(window, 'expect', {
    value: undefined,
    configurable: true,
  })
}
