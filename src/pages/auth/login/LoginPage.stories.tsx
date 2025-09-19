import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { LoginPage } from './LoginPage'
import {
  withProviders,
  withPageLayout,
} from '@/shared/lib/storybook/decorators'
import { mockUseAuth, mockNavigate } from '@/shared/lib/storybook/mocks'

// Mock modules
const mockUseAuthModule = (authState = mockUseAuth.default) => ({
  useAuth: () => authState,
})

const mockRouterModule = () => ({
  useNavigate: () => mockNavigate,
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

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/Auth/LoginPage',
  component: LoginPage,
  decorators: [withProviders, withPageLayout],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete login page with branding, form, and navigation links.',
      },
    },
  },
  //   beforeEach: () => {
  //     mockNavigate.mockClear()
  //     mockUseAuth.default.login.mockClear()
  //   },
}

export default meta
type Story = StoryObj<typeof LoginPage>

// Default login page
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
    ],
  },
}

// Loading state
export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => mockUseAuthModule(mockUseAuth.loginLoading),
      },
      {
        url: 'react-router-dom',
        method: 'GET',
        status: 200,
        response: mockRouterModule,
      },
    ],
  },
}

// Page interaction flow
export const LoginFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify page elements
    await expect(canvas.getByText('TrueTweet')).toBeInTheDocument()
    await expect(
      canvas.getByText('Sign in to your account')
    ).toBeInTheDocument()
    await expect(canvas.getByText("Don't have an account?")).toBeInTheDocument()

    // Test form interaction
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/password/i)

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')

    // Verify form values
    await expect(usernameInput).toHaveValue('testuser')
    await expect(passwordInput).toHaveValue('password123')

    // Test sign up link
    const signUpLink = canvas.getByText('Sign up')
    await expect(signUpLink).toHaveAttribute('href', '/register')
  },
}

// Form validation
export const FormValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Try to submit empty form
    const submitButton = canvas.getByRole('button', { name: /sign in/i })
    await userEvent.click(submitButton)

    // Check for validation errors
    await expect(canvas.getByText(/username is required/i)).toBeInTheDocument()
    await expect(canvas.getByText(/password is required/i)).toBeInTheDocument()

    // Fill username only
    const usernameInput = canvas.getByLabelText(/username/i)
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.click(submitButton)

    // Username error should be gone, password error should remain
    await expect(
      canvas.queryByText(/username is required/i)
    ).not.toBeInTheDocument()
    await expect(canvas.getByText(/password is required/i)).toBeInTheDocument()
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
    ],
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
    ],
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
