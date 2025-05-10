# JobBuilder Project Structure (v2)

This is the new and improved project structure for the JobBuilder client application. The goal of this reorganization is to create a more maintainable, scalable, and feature-focused architecture.

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
│   ├── common/       # Shared components (Button, Input, etc.)
│   ├── layouts/      # Layout components (Header, Footer, etc.)
│   ├── user/         # User-specific components
│   └── manager/      # Manager-specific components
├── features/         # Feature-based modules
│   ├── auth/         # Authentication related features
│   ├── dashboard/    # Dashboard features
│   └── profile/      # Profile management
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization
│   ├── locales/      # Translation files
│   └── config.ts     # i18n configuration
├── redux/            # Redux state management
│   ├── slices/       # Redux toolkit slices
│   └── store.ts      # Redux store configuration
├── routes/           # Routing configuration
│   ├── PrivateRoute.tsx # Protected route component
│   └── routes.tsx    # Main routes definition
├── services/         # API services
│   ├── api.ts        # Axios configuration
│   └── userService.ts # User-related API calls
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main App component
└── main.tsx          # Entry point
```

## Key Design Principles

1. **Component Organization**:

   - Common components are reusable across the entire application
   - Feature-specific components are organized by domain

2. **Feature-Based Structure**:

   - Related functionality is grouped together
   - Each feature can contain its own components, hooks, utils, etc.

3. **Service Layer**:

   - API calls are abstracted into service modules
   - Each service handles a specific domain (users, jobs, etc.)

4. **State Management**:

   - Redux with Redux Toolkit for global state
   - React hooks for local component state

5. **Routing**:

   - React Router v6 for navigation
   - Protected routes for authenticated pages

6. **Internationalization**:
   - i18next for managing translations
   - Support for multiple languages

## Styling Approach

We use Tailwind CSS for styling components, with a few custom utility classes defined in `styles/index.css`.

## Getting Started

To work with this codebase:

1. Familiarize yourself with the project structure
2. Use existing components when possible
3. Follow the established patterns for creating new features

## Best Practices

1. **Component Creation**:

   - Create functional components with TypeScript
   - Use proper typing for props and state
   - Use React hooks for state management

2. **Code Organization**:

   - Keep files small and focused
   - Group related functionality
   - Use descriptive names

3. **State Management**:

   - Use Redux for global state that is shared across components
   - Use local state for component-specific state

4. **API Calls**:
   - All API calls should go through the service layer
   - Use async/await for handling promises

## Useful Tools

- React DevTools
- Redux DevTools
- TypeScript for type checking
- ESLint for code quality
- Prettier for code formatting

## Roadmap and Future Improvements

- Add unit and integration tests
- Implement performance optimizations
- Add CI/CD pipeline
- Add documentation for components

# JobBuilder Client (v2)

This is the updated client-side codebase for the JobBuilder application. It uses modern React, TypeScript, and Redux for state management.

## Project Structure

```
src-v2/
├── assets/ - Images, icons and other static assets
├── components/ - UI components organized by domain
├── features/ - Feature-specific logic and components
├── hooks/ - Custom React hooks
├── i18n/ - Internationalization setup
├── pages/ - Page components for routing
├── redux/ - Redux store, slices and selectors
├── routes/ - Route configuration
├── services/ - API services for backend communication
├── styles/ - Global styles and theme setup
├── types/ - TypeScript type definitions
└── utils/ - Utility functions
```

## Core Technologies

- React
- TypeScript
- Redux Toolkit
- React Router
- Axios

## Type System

The type system provides full type safety between frontend and backend by matching MongoDB models:

- Core models: User, Job, Resume, Application
- Profile models: UserProfile, AdminProfile, CompanyProfile, HRProfile
- Support models: JobCategory, Skill, Notification, Chat, SavedJob, etc.

## API Services

API Services handle all backend communication and match the backend routes:

- Authentication: login, register, password reset
- User profiles: create, update, delete profile information
- Jobs: search, create, apply, etc.
- Other entity-specific services

## Redux State Management

The Redux store is organized by domain:

- `auth` - Authentication state (user, token, login status)
- `user` - User profiles data
- `jobs` - Jobs search, filtering, and details
- `loading` - Global loading states for API calls

## Custom Hooks

Custom hooks provide easy access to the Redux store and API services:

- `useAuth` - Authentication operations
- `useUserProfile` - User profile operations
- `useJobs` - Job search and operations
- `useApiCall` - Generic API call wrapper with loading states
- `useLoading` - Hook to check loading status
- `useLoadingIndicator` - Component-ready loading indicators

## Loading States

Loading states are managed through Redux with a global loading slice:

- Each API call registers its loading state with a unique key
- Components can check loading state with `useLoading(key)`
- Loading indicators can be added with `useLoadingIndicator(key)`

## Usage Example

```typescript
import { useAuth, useLoading, useLoadingIndicator } from "../hooks";

function LoginPage() {
  const { login } = useAuth();
  const isLoading = useLoading("login");
  // OR use the component-based approach:
  const { LoadingComponent } = useLoadingIndicator("login");

  const handleLogin = async (email, password) => {
    await login(email, password);
  };

  return (
    <LoadingComponent>
      <form onSubmit={handleLogin}>
        {/* Form fields */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </LoadingComponent>
  );
}
```
