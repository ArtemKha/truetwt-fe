# TrueTweet Frontend

A modern mini-blogging platform built with React, TypeScript, and Tailwind CSS following Feature Slice Design (FSD) architecture.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code
- `npm run check` - Run Biome check
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## Features

### Core Features
- User authentication (register/login)
- Create and delete posts (280 character limit)
- Real-time character counter
- User mentions detection (@username)
- Comment system
- Global timeline with infinite scroll
- User profiles and post history
- Users directory

## Architecture

### Feature Slice Design (FSD)

The project follows FSD architecture with these layers:

1. **App Layer** (`app/`) - App initialization, providers, global configuration
2. **Pages Layer** (`pages/`) - Route components that compose widgets and features
3. **Widgets Layer** (`widgets/`) - Large UI blocks (timeline, user profile, etc.)
4. **Features Layer** (`features/`) - User-facing functionality (auth, posting, etc.)
5. **Entities Layer** (`entities/`) - Business entities and their API methods
6. **Shared Layer** (`shared/`) - Reusable utilities, UI components, API client

### Data Flow

- **React Query** manages server state and caching
- **React Hook Form** with **Zod** validation for forms
- **Axios** for HTTP requests with interceptors
- **Local Storage** for authentication tokens

## Development

### Storybook

The project includes a comprehensive Storybook setup for component development and documentation:

```bash
npm run storybook  # Start Storybook on http://localhost:6006
```

Storybook includes:
- **Interactive component playground** with live prop editing
- **Visual testing** for different component states
- **Documentation** with usage examples and best practices
- **Accessibility testing** and responsive design validation

See [STORYBOOK.md](./STORYBOOK.md) for detailed documentation.

### Testing

Run tests with:
```bash
npm run test
npm run test:ui      # Interactive UI
npm run test:coverage # With coverage report
```

## Deployment

Build for production:
```bash
npm run build
```

The `dist` folder contains the production build ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

MIT License
