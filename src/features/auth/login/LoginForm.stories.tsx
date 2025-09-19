import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { LoginForm } from './LoginForm'
import { withProviders } from '@/shared/lib/storybook/decorators'
import { mockUseAuth, mockNavigate } from '@/shared/lib/storybook/mocks'

// Mock the useAuth hook
const mockUseAuthModule = () => ({
  useAuth: () => mockUseAuth.default,
})

// Mock react-router-dom
const mockRouterModule = () => ({
  useNavigate: () => mockNavigate,
})

const meta: Meta<typeof LoginForm> = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
  decorators: [withProviders],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Login form component with validation and authentication handling.',
      },
    },
  },
  // beforeEach: () => {
  //   // Reset mocks before each story
  //   mockNavigate.mockClear()
  //   mockUseAuth.default.login.mockClear()
  // },
}

export default meta
type Story = StoryObj<typeof LoginForm>

// Default state
export const Default: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: mockUseAuthModule,
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

// With validation errors
export const WithValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Try to submit empty form
    const submitButton = canvas.getByRole('button', { name: /sign in/i })
    await userEvent.click(submitButton)

    // Check for validation errors
    await expect(canvas.getByText(/username is required/i)).toBeInTheDocument()
    await expect(canvas.getByText(/password is required/i)).toBeInTheDocument()
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
        response: () => ({
          useAuth: () => mockUseAuth.loginLoading,
        }),
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

// Successful form submission
export const SuccessfulSubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill in the form
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/password/i)

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'testpassword')

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /sign in/i })
    await userEvent.click(submitButton)

    // Verify form values
    await expect(usernameInput).toHaveValue('testuser')
    await expect(passwordInput).toHaveValue('testpassword')
  },
}

// Form interaction
export const FormInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test typing in username field
    const usernameInput = canvas.getByLabelText(/username/i)
    await userEvent.type(usernameInput, 'john')
    await expect(usernameInput).toHaveValue('john')

    // Test typing in password field
    const passwordInput = canvas.getByLabelText(/password/i)
    await userEvent.type(passwordInput, 'secret')
    await expect(passwordInput).toHaveValue('secret')

    // Clear and retype
    await userEvent.clear(usernameInput)
    await userEvent.type(usernameInput, 'johndoe')
    await expect(usernameInput).toHaveValue('johndoe')
  },
}
