import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { RegisterPage } from './RegisterPage'
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

const meta: Meta<typeof RegisterPage> = {
  title: 'Pages/Auth/RegisterPage',
  component: RegisterPage,
  decorators: [withProviders, withPageLayout],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete registration page with branding, form, and navigation links.',
      },
    },
  },
  //   beforeEach: () => {
  //     mockNavigate.mockClear()
  //     mockUseAuth.default.register.mockClear()
  //   },
}

export default meta
type Story = StoryObj<typeof RegisterPage>

// Default register page
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
        response: () => mockUseAuthModule(mockUseAuth.registerLoading),
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
export const RegistrationFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify page elements
    await expect(canvas.getByText('TrueTweet')).toBeInTheDocument()
    await expect(canvas.getByText('Create your account')).toBeInTheDocument()
    await expect(
      canvas.getByText('Already have an account?')
    ).toBeInTheDocument()

    // Test form interaction
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)

    await userEvent.type(usernameInput, 'newuser')
    await userEvent.type(passwordInput, 'securepass123')
    await userEvent.type(confirmPasswordInput, 'securepass123')

    // Verify form values
    await expect(usernameInput).toHaveValue('newuser')
    await expect(passwordInput).toHaveValue('securepass123')
    await expect(confirmPasswordInput).toHaveValue('securepass123')

    // Test sign in link
    const signInLink = canvas.getByText('Sign in')
    await expect(signInLink).toHaveAttribute('href', '/login')
  },
}

// Form validation flow
export const FormValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Try to submit empty form
    const submitButton = canvas.getByRole('button', { name: /create account/i })
    await userEvent.click(submitButton)

    // Check for validation errors
    await expect(
      canvas.getByText(/username must be at least 3 characters/i)
    ).toBeInTheDocument()
    await expect(
      canvas.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument()

    // Fill form with mismatched passwords
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)

    await userEvent.type(usernameInput, 'validuser')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'differentpassword')

    await userEvent.click(submitButton)

    // Check for password mismatch error
    await expect(canvas.getByText(/passwords don't match/i)).toBeInTheDocument()

    // Fix password confirmation
    await userEvent.clear(confirmPasswordInput)
    await userEvent.type(confirmPasswordInput, 'password123')

    await userEvent.click(submitButton)

    // Password mismatch error should be gone
    await expect(
      canvas.queryByText(/passwords don't match/i)
    ).not.toBeInTheDocument()
  },
}

// Complete registration flow
export const CompleteRegistration: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill out the complete form
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)

    await userEvent.type(usernameInput, 'johndoe')
    await userEvent.type(passwordInput, 'mysecurepassword123')
    await userEvent.type(confirmPasswordInput, 'mysecurepassword123')

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /create account/i })
    await userEvent.click(submitButton)

    // Verify no validation errors
    await expect(
      canvas.queryByText(/username must be at least 3 characters/i)
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByText(/password must be at least 6 characters/i)
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByText(/passwords don't match/i)
    ).not.toBeInTheDocument()
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

// Error states
export const WithErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test various error states
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)
    const submitButton = canvas.getByRole('button', { name: /create account/i })

    // Test short username
    await userEvent.type(usernameInput, 'ab')
    await userEvent.click(submitButton)
    await expect(
      canvas.getByText(/username must be at least 3 characters/i)
    ).toBeInTheDocument()

    // Test short password
    await userEvent.clear(usernameInput)
    await userEvent.type(usernameInput, 'validuser')
    await userEvent.type(passwordInput, '123')
    await userEvent.click(submitButton)
    await expect(
      canvas.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument()

    // Test password mismatch
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'validpassword')
    await userEvent.type(confirmPasswordInput, 'differentpassword')
    await userEvent.click(submitButton)
    await expect(canvas.getByText(/passwords don't match/i)).toBeInTheDocument()
  },
}
