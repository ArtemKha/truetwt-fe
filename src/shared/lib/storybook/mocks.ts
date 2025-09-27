// import { vi } from 'vitest'

const vi = {
  fn: () => {
    return () => {}
  },
  mockClear: () => {},
}

// Mock useAuth hook for Storybook
export const mockUseAuth = {
  default: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoginLoading: false,
    isRegisterLoading: false,
    isLogoutLoading: false,
  },
  authenticated: {
    user: {
      id: 1,
      username: 'johndoe',
      email: 'johndoe@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    token: 'mock-token',
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoginLoading: false,
    isRegisterLoading: false,
    isLogoutLoading: false,
  },
  loading: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoginLoading: false,
    isRegisterLoading: false,
    isLogoutLoading: false,
  },
  loginLoading: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoginLoading: true,
    isRegisterLoading: false,
    isLogoutLoading: false,
  },
  registerLoading: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoginLoading: false,
    isRegisterLoading: true,
    isLogoutLoading: false,
  },
}

// Mock navigate function
export const mockNavigate = vi.fn()

// Mock toast function
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}
