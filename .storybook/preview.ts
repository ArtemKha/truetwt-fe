import type { Preview } from '@storybook/react'
import '../src/app/styles/globals.css'

// Prevent Jest/Vitest globals from interfering with Storybook
if (typeof globalThis !== 'undefined' && !globalThis.expect) {
  // Ensure Storybook doesn't try to access test globals
  globalThis.expect = undefined
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
      ],
    },
    // Disable test-related features that might conflict with Vitest
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
}

export default preview
