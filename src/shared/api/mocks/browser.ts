import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Setup MSW worker for browser environment
export const worker = setupWorker(...handlers)

// Start the worker in development mode
export const startMocking = async () => {
  if (typeof window !== 'undefined') {
    return worker.start({
      onUnhandledRequest: 'warn',
    })
  }
}
