# Storybook Documentation

This document provides comprehensive information about the Storybook setup for the TrueTweet frontend project.

## Overview

Storybook is integrated into the TrueTweet project to provide:

- **Component Development** - Isolated component development environment
- **Visual Testing** - Visual regression testing and component states
- **Documentation** - Living documentation for the design system
- **Collaboration** - Shared component library for designers and developers

## Installation & Setup

Storybook is already configured in the project. To run it:

```bash
# Install dependencies
npm install

# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Project Structure

```
.storybook/
├── main.ts              # Storybook configuration
├── preview.ts           # Global decorators and parameters
└── preview-head.html    # Custom HTML head content

src/
├── stories/
│   └── Introduction.stories.mdx  # Welcome documentation
├── shared/
│   ├── lib/
│   │   └── storybook/
│   │       ├── decorators.tsx    # Reusable decorators
│   │       └── mocks.ts          # Mock data and functions
│   └── ui/
│       ├── button.stories.tsx    # UI component stories
│       └── card.stories.tsx
├── features/
│   └── auth/
│       ├── login/
│       │   └── LoginForm.stories.tsx
│       └── register/
│           └── RegisterForm.stories.tsx
└── pages/
    └── auth/
        ├── login/
        │   └── LoginPage.stories.tsx
        └── register/
            └── RegisterPage.stories.tsx
```

## Configuration

### Main Configuration (.storybook/main.ts)

- **Stories**: Automatically discovers `*.stories.@(js|jsx|ts|tsx|mdx)` files
- **Addons**: Essential addons for development and testing
- **Framework**: React with Vite integration
- **TypeScript**: Full TypeScript support with React docgen

### Preview Configuration (.storybook/preview.ts)

- **Global Styles**: Imports Tailwind CSS
- **Parameters**: Default backgrounds, controls, and actions
- **Decorators**: Applied to all stories

## Decorators

Located in `src/shared/lib/storybook/decorators.tsx`:

### `withRouter`
Wraps components with React Router's BrowserRouter for components that use routing.

### `withQueryClient`
Provides React Query client for components that use data fetching.

### `withProviders`
Combines router and query client providers - use for most components.

### `withPageLayout`
Adds full-screen layout styling for page components.

## Mocks

Located in `src/shared/lib/storybook/mocks.ts`:

### `mockUseAuth`
Provides different authentication states:
- `default` - Not authenticated
- `authenticated` - Logged in user
- `loading` - Loading state
- `loginLoading` - Login in progress
- `registerLoading` - Registration in progress

### `mockNavigate`
Mock function for React Router's useNavigate hook.

### `mockToast`
Mock functions for toast notifications.

## Story Categories

### UI Components (`src/shared/ui/*.stories.tsx`)
- Basic building blocks (Button, Card, Input, etc.)
- Design system documentation
- All variants and states
- Accessibility examples

### Features (`src/features/**/*.stories.tsx`)
- Interactive components with business logic
- Form validation examples
- Loading and error states
- User interaction flows

### Pages (`src/pages/**/*.stories.tsx`)
- Complete page layouts
- Full user journeys
- Responsive design examples
- Dark/light mode variants

## Writing Stories

### Basic Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './MyComponent'
import { withProviders } from '@/shared/lib/storybook/decorators'

const meta: Meta<typeof MyComponent> = {
  title: 'Category/MyComponent',
  component: MyComponent,
  decorators: [withProviders],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of the component.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    prop: 'value',
  },
}
```

### Interactive Stories with Play Function

```typescript
export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find elements
    const button = canvas.getByRole('button')
    const input = canvas.getByLabelText(/username/i)
    
    // Simulate user interactions
    await userEvent.type(input, 'testuser')
    await userEvent.click(button)
    
    // Assert expected behavior
    await expect(input).toHaveValue('testuser')
  },
}
```

### Mock Data in Stories

```typescript
export const WithMockData: Story = {
  parameters: {
    mockData: [
      {
        url: '@/features/auth/lib/hooks/useAuth',
        method: 'GET',
        status: 200,
        response: () => ({
          useAuth: () => mockUseAuth.authenticated,
        }),
      },
    ],
  },
}
```

## Best Practices

### Story Organization
- Use descriptive story names (Default, Loading, WithError, etc.)
- Group related stories in the same file
- Use consistent naming conventions

### Documentation
- Add component descriptions in meta.parameters.docs
- Document props with TypeScript interfaces
- Include usage examples in story descriptions

### Testing
- Use play functions for interaction testing
- Test different component states
- Verify accessibility with screen readers

### Responsive Design
- Include mobile/tablet viewport stories
- Test different screen sizes
- Use viewport addon for responsive testing

### Accessibility
- Test with keyboard navigation
- Verify screen reader compatibility
- Include high contrast and reduced motion variants

## Available Addons

### Essential Addons
- **Controls** - Interactive props editing
- **Actions** - Event handler logging
- **Docs** - Auto-generated documentation
- **Viewport** - Responsive design testing

### Interactions Addon
- **Play functions** - Automated user interactions
- **Testing utilities** - Built-in testing tools
- **Debugging** - Step-through interaction debugging

## Deployment

### Building for Production
```bash
npm run build-storybook
```

This creates a `storybook-static` folder that can be deployed to any static hosting service.

### Continuous Integration
Add Storybook build to your CI pipeline:

```yaml
- name: Build Storybook
  run: npm run build-storybook
  
- name: Deploy Storybook
  # Deploy storybook-static folder
```

## Troubleshooting

### Common Issues

**Tailwind styles not working:**
- Ensure `globals.css` is imported in `.storybook/preview.ts`
- Check that Tailwind config includes Storybook files

**React Router errors:**
- Use `withRouter` decorator for components using routing
- Mock navigation functions in stories

**React Query errors:**
- Use `withQueryClient` decorator for data-fetching components
- Provide mock data in story parameters

**TypeScript errors:**
- Ensure proper type imports from `@storybook/react`
- Check that component props are properly typed

### Performance Tips

- Use `parameters.docs.disable` to skip docs generation for performance
- Lazy load heavy components in stories
- Use `parameters.chromatic.disable` to skip visual testing for specific stories

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [React Storybook Guide](https://storybook.js.org/docs/react/get-started/introduction)
- [Testing with Storybook](https://storybook.js.org/docs/react/writing-tests/introduction)
- [Storybook Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction)
