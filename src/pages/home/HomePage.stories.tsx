import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { HomePage } from './HomePage'
import {
  withProviders,
  withPageLayout,
} from '@/shared/lib/storybook/decorators'
import { mockUseAuth, mockToast } from '@/shared/lib/storybook/mocks'
import { handlers } from '@/shared/api/mocks'
import { setupWorker } from 'msw/browser'

// Set up MSW worker for stories
const worker = setupWorker(...handlers)

// Mock modules for non-API dependencies
const mockUseAuthModule = (authState = mockUseAuth.authenticated) => ({
  useAuth: () => authState,
})

const mockRouterModule = () => ({
  useNavigate: () => () => {},
  Link: ({
    to,
    children,
    className,
  }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
})

const mockSonnerModule = () => ({
  toast: mockToast,
})

// Helper function to start MSW worker
const startWorker = async () => {
  if (typeof window !== 'undefined') {
    try {
      await worker.start({
        onUnhandledRequest: 'warn',
        quiet: true,
      })
    } catch (error) {
      // MSW worker might already be running or service worker not available
      console.warn('MSW worker failed to start:', error)
    }
  }
}

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
  decorators: [withProviders, withPageLayout],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main home page with timeline feed and post creation form. Uses MSW to mock API calls for realistic data fetching.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HomePage>

// Default home page with MSW handling API calls
export const Default: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
}

// Loading state - MSW will handle the API, but we can simulate loading in React Query
export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
      {
        url: '@tanstack/react-query',
        method: 'GET',
        status: 200,
        response: () => ({
          useInfiniteQuery: () => ({
            data: null,
            fetchNextPage: () => {},
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: true,
            error: null,
          }),
          useMutation: () => ({
            mutate: () => {},
            isPending: false,
          }),
          useQueryClient: () => ({
            invalidateQueries: () => {},
          }),
        }),
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
}

// Empty timeline state - use React Query mock instead of MSW override
export const EmptyTimeline: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
      {
        url: '@tanstack/react-query',
        method: 'GET',
        status: 200,
        response: () => ({
          useInfiniteQuery: () => ({
            data: {
              pages: [
                {
                  data: {
                    items: [],
                    pagination: {
                      limit: 10,
                      offset: 0,
                      total: 0,
                    },
                  },
                },
              ],
            },
            fetchNextPage: () => {},
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            error: null,
          }),
          useMutation: () => ({
            mutate: () => {},
            isPending: false,
          }),
          useQueryClient: () => ({
            invalidateQueries: () => {},
          }),
        }),
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
}

// Error state - MSW returns error
export const ErrorState: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
      {
        url: '@tanstack/react-query',
        method: 'GET',
        status: 200,
        response: () => ({
          useInfiniteQuery: () => ({
            data: null,
            fetchNextPage: () => {},
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            error: new Error('Failed to load timeline'),
          }),
          useMutation: () => ({
            mutate: () => {},
            isPending: false,
          }),
          useQueryClient: () => ({
            invalidateQueries: () => {},
          }),
        }),
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
}

// Interactive story - test post creation with MSW
export const CreatePostFlow: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for the page to load
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verify page elements
    await expect(canvas.getByText('Home')).toBeInTheDocument()
    await expect(
      canvas.getByPlaceholderText("What's happening?")
    ).toBeInTheDocument()

    // Test post creation form
    const textarea = canvas.getByPlaceholderText("What's happening?")
    const postButton = canvas.getByRole('button', { name: /post/i })

    // Initially button should be disabled
    await expect(postButton).toBeDisabled()

    // Type a message
    await userEvent.type(
      textarea,
      'This is a test post from Storybook with MSW!'
    )

    // Button should now be enabled
    await expect(postButton).toBeEnabled()

    // Check character counter
    const characterCount = canvas.getByText(/characters remaining/i)
    await expect(characterCount).toBeInTheDocument()

    // Verify timeline posts are visible (from MSW)
    await expect(canvas.getByText('johndoe')).toBeInTheDocument()
    await expect(
      canvas.getByText('Just built an amazing React app! 🚀 #coding #react')
    ).toBeInTheDocument()
  },
}

// Character limit validation
export const CharacterLimitValidation: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for the page to load
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const textarea = canvas.getByPlaceholderText("What's happening?")
    const postButton = canvas.getByRole('button', { name: /post/i })

    // Type a message that exceeds the character limit
    const longMessage = 'a'.repeat(300) // 300 characters, over the 280 limit
    await userEvent.type(textarea, longMessage)

    // Button should be disabled due to character limit
    await expect(postButton).toBeDisabled()

    // Character counter should show negative number and be red
    const characterCount = canvas.getByText(/-20 characters remaining/i)
    await expect(characterCount).toBeInTheDocument()
  },
}

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
}

// Dark mode
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
      {
        url: 'sonner',
        method: 'GET',
        status: 200,
        response: mockSonnerModule,
      },
    ],
  },
  beforeEach: async () => {
    await startWorker()
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
    withProviders,
    withPageLayout,
  ],
}
