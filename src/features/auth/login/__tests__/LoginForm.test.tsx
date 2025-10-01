import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@/shared/lib/test/testUtils'
import { LoginForm } from '../LoginForm'

// Mock the useAuth hook
vi.mock('@/features/auth/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isLoginLoading: false,
    isAuthenticated: false,
  }),
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => children,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
}))

describe('LoginForm', () => {
  it('renders login form with username and password fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('updates input values when typing', () => {
    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })

    expect(usernameInput.value).toBe('testuser')
    expect(passwordInput.value).toBe('testpass')
  })
})
