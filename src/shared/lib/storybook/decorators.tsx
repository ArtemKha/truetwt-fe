import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Decorator } from '@storybook/react'

// Mock QueryClient for Storybook
const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
})

// Router decorator
export const withRouter: Decorator = (Story) => (
  <BrowserRouter>
    <Story />
  </BrowserRouter>
)

// React Query decorator
export const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={mockQueryClient}>
    <Story />
  </QueryClientProvider>
)

// Combined providers decorator
export const withProviders: Decorator = (Story) => (
  <QueryClientProvider client={mockQueryClient}>
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  </QueryClientProvider>
)

// Layout decorator for pages
export const withPageLayout: Decorator = (Story) => (
  <div className="min-h-screen bg-background">
    <Story />
  </div>
)
