import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { RegisterForm } from './RegisterForm'
import { withProviders } from '@/shared/lib/storybook/decorators'
import { mockUseAuth, mockNavigate } from '@/shared/lib/storybook/mocks'

// Mock modules
const mockUseAuthModule = (authState = mockUseAuth.default) => ({
  useAuth: () => authState,
})

const mockRouterModule = () => ({
  useNavigate: () => mockNavigate,
})

const meta: Meta<typeof RegisterForm> = {
  title: 'Features/Auth/RegisterForm',
  component: RegisterForm,
  decorators: [withProviders],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Registration form component with validation and password confirmation.',
      },
    },
  },
  // beforeEach: () => {
  //   mockNavigate.mockClear()
  //   mockUseAuth.default.register.mockClear()
  // },
}

export default meta
type Story = StoryObj<typeof RegisterForm>

// Default state
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

// With validation errors
export const WithValidationErrors: Story = {
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
  },
}

// Password mismatch validation
export const PasswordMismatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill in form with mismatched passwords
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'differentpassword')

    // Submit form
    const submitButton = canvas.getByRole('button', { name: /create account/i })
    await userEvent.click(submitButton)

    // Check for password mismatch error
    await expect(canvas.getByText(/passwords don't match/i)).toBeInTheDocument()
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

// Successful form submission
export const SuccessfulSubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill in the form correctly
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)

    await userEvent.type(usernameInput, 'newuser')
    await userEvent.type(passwordInput, 'securepassword123')
    await userEvent.type(confirmPasswordInput, 'securepassword123')

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /create account/i })
    await userEvent.click(submitButton)

    // Verify form values
    await expect(usernameInput).toHaveValue('newuser')
    await expect(passwordInput).toHaveValue('securepassword123')
    await expect(confirmPasswordInput).toHaveValue('securepassword123')
  },
}

// Progressive validation
export const ProgressiveValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test username validation
    const usernameInput = canvas.getByLabelText(/username/i)
    await userEvent.type(usernameInput, 'ab') // Too short

    const submitButton = canvas.getByRole('button', { name: /create account/i })
    await userEvent.click(submitButton)

    await expect(
      canvas.getByText(/username must be at least 3 characters/i)
    ).toBeInTheDocument()

    // Fix username
    await userEvent.clear(usernameInput)
    await userEvent.type(usernameInput, 'validuser')
    await userEvent.click(submitButton)

    // Username error should be gone
    await expect(
      canvas.queryByText(/username must be at least 3 characters/i)
    ).not.toBeInTheDocument()

    // Test password validation
    const passwordInput = canvas.getByLabelText(/^password$/i)
    await userEvent.type(passwordInput, '123') // Too short
    await userEvent.click(submitButton)

    await expect(
      canvas.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument()
  },
}

// Form interaction
export const FormInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test all form fields
    const usernameInput = canvas.getByLabelText(/username/i)
    const passwordInput = canvas.getByLabelText(/^password$/i)
    const confirmPasswordInput = canvas.getByLabelText(/confirm password/i)

    // Test typing and clearing
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'password123')

    await expect(usernameInput).toHaveValue('testuser')
    await expect(passwordInput).toHaveValue('password123')
    await expect(confirmPasswordInput).toHaveValue('password123')

    // Test clearing fields
    await userEvent.clear(usernameInput)
    await expect(usernameInput).toHaveValue('')
  },
}
