import '@testing-library/jest-dom'

// Prevent Storybook from accessing Vitest globals
if (typeof window !== 'undefined') {
  // Ensure test globals are properly isolated
  Object.defineProperty(window, 'expect', {
    value: undefined,
    configurable: true,
  })
}
