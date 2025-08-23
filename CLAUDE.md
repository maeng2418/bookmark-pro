# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

```bash
# Start all services with HMR support
pnpm dev

# Start individual services (includes UI package for HMR)
pnpm run web:dev        # Next.js web app + UI package
pnpm run extension:dev  # Extension + UI package

# Individual app development (if needed)
pnpm --filter @bookmark-pro/web dev
pnpm --filter @bookmark-pro/extension dev
```

### Building

```bash
# Build all packages and apps
pnpm build

# Build individual apps
pnpm --filter @bookmark-pro/web build     # Next.js production build
pnpm --filter @bookmark-pro/extension build
pnpm --filter @bookmark-pro/ui build
```

### Next.js Specific Commands

```bash
# Development server (port 8080)
cd apps/web && pnpm dev

# Production build and start
cd apps/web && pnpm build && pnpm start

# Type checking
cd apps/web && pnpm run type-check
```

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @bookmark-pro/web lint      # Next.js ESLint config
```

### Chrome Extension Testing

1. Build extension: `pnpm --filter @bookmark-pro/extension build`
2. Load unpacked extension from `apps/extension/dist/` in Chrome developer mode

## Architecture Overview

### Monorepo Structure

- **Turborepo**: Orchestrates builds with proper dependency management
- **pnpm workspaces**: Package management with `workspace:*` dependencies
- **Volta**: Node.js/pnpm version pinning (Node 20.18.0, pnpm 9.15.0)

### Package Dependencies

```
@bookmark-pro/ui (packages/ui)
├── @bookmark-pro/web (apps/web) - Next.js 15 App Router
└── @bookmark-pro/extension (apps/extension) - Vite + React
```

### Web Application Architecture

- **Framework**: Next.js 15 with App Router
- **Rendering**: Server-Side Rendering (SSR) + Static Site Generation (SSG)
- **Routing**: App Router structure (`src/app/` directory)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Port**: 8080 (consistent with previous Vite setup)

### Shared Component System

- **UI Package**: Central component library using shadcn/ui + Radix UI
- **Development Mode**: Next.js transpiles `@bookmark-pro/ui` source files for instant HMR
- **Production Mode**: Uses built dist files with manual type definitions
- **Type Declarations**: Manual `.d.ts` file at `packages/ui/dist/index.d.ts` (tsup dts generation disabled due to complexity)
- **SSR Compatibility**: Components work with both server and client rendering

### Database Architecture (Supabase)

- **Tables**: `bookmarks`, `profiles` with Row Level Security (RLS)
- **Auth Integration**: User profiles auto-created on signup
- **Real-time**: Built-in subscriptions for data sync
- **Types**: Auto-generated TypeScript types in `integrations/supabase/types.ts`

### State Management Patterns

- **Web App**: React Query for server state, React hooks for local state
- **Extension**: Supabase direct queries + React hooks for state management, Chrome Storage API + React Context for auth state
- **Data Flow**: Supabase → React hooks/Context → UI components

## File Organization Patterns

### Chrome Extension Directory Structure

```
src/
├── components/         # Feature components
│   ├── BookmarkList.tsx    # Bookmark display, search & filtering
│   ├── UserProfile.tsx     # User avatar & profile display
│   ├── AuthScreen.tsx      # Authentication UI
│   └── BookmarkForm.tsx    # Bookmark creation/editing form
├── pages/             # Page-level components
│   ├── MainPage.tsx       # Primary extension interface
│   ├── AuthPage.tsx       # Authentication page
│   └── BookmarkFormPage.tsx # Bookmark form page
├── contexts/          # React context providers
│   └── AuthContext.tsx    # Authentication state management
├── hooks/             # Custom React hooks
│   └── useAuthGuard.tsx   # Authentication guard hook
├── integrations/      # External service clients
│   └── supabase/         # Database client & types
├── lib/              # Utilities
│   └── extension.ts      # Chrome extension API helpers
└── styles/           # Global styles
    └── globals.css       # Tailwind CSS + custom styles
```

### Next.js App Directory Structure

```
src/
├── app/                # Next.js App Router
│   ├── layout.tsx     # Root layout (server component)
│   ├── page.tsx       # Home page
│   ├── providers.tsx  # Client-side providers
│   ├── auth/          # Auth pages
│   ├── dashboard/     # Dashboard pages
│   └── not-found.tsx  # 404 page
├── components/         # Feature components
├── pages/             # Legacy page components (still used)
├── integrations/      # External service clients
│   └── supabase/     # Database client & types
├── lib/              # Utilities
└── contexts/         # React context providers
```

### Component Import Patterns

```typescript
// UI components (from shared package)
import { Button, Dialog, Badge, Input, ToggleGroup } from '@bookmark-pro/ui'

// Local components (Extension: use relative imports)
import BookmarkList from '../components/BookmarkList'
import UserProfile from '../components/UserProfile'

// Supabase integration
import { supabase } from '../integrations/supabase/client'
```

## Development Workflow

### Adding New UI Components

1. Create component in `packages/ui/src/ui/`
2. Export in `packages/ui/src/index.ts`
3. Add type declaration in `packages/ui/dist/index.d.ts`
4. Use in apps with `import { ComponentName } from "@bookmark-pro/ui"`

### Browser Extension Development

- **Manifest V3**: Uses service worker background script
- **Entry Points**: popup.html, background.ts, content.ts
- **API Usage**: Chrome Storage, Tabs, Scripting APIs
- **Build Process**: Vite handles bundling + manifest copying
- **Component Architecture**:
  - `MainPage.tsx`: Primary bookmark management interface with real-time data fetching
  - `BookmarkList.tsx`: Search, filtering, and bookmark display functionality
  - `UserProfile.tsx`: User avatar and profile information display
  - `AuthPage.tsx`: Authentication interface integration

### Environment Variables Required

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Technical Decisions

### HMR Setup

- Development mode uses Vite alias to point `@bookmark-pro/ui` to source files
- Enables instant updates when modifying shared components
- UI package runs in watch mode alongside app development

### Type System

- Manual type declarations for UI package due to tsup dts build complexity
- **Extension Import Consistency**: Mixed usage detected - should consistently use relative imports (`../`) for local files, avoid `@/` alias
- **Current Issue**: Some components use `@/` while others use relative imports
- **Recommendation**: Standardize on relative imports per project guidelines
- Strict TypeScript configuration across all packages

### Build Optimization

- Turbo caching for build artifacts
- Parallel builds with proper dependency ordering
- Extension builds include manifest copying to dist

### UI Package Import Strategy

- **Development Mode**: Next.js uses webpack alias to point `@bookmark-pro/ui` to source files (`src/`)
- **Production Mode**: Uses built dist files with manual type definitions
- **Dynamic Imports**: All UI components in providers.tsx use dynamic imports with `ssr: false` to prevent SSR conflicts
- **SSR Compatibility**: Components work with both server and client rendering when properly configured

## Common Gotchas

1. **UI Package Types**: Must manually update `packages/ui/dist/index.d.ts` when adding new exports
2. **Extension Import Inconsistency**: **CRITICAL** - Mixed usage of `@/` alias and relative imports (`../`) detected. Should consistently use relative imports for local files
3. **Extension Error Handling**: Missing user feedback for failed operations (bookmark deletion, data fetching)
4. **Extension Performance**: Real-time search without debouncing can cause performance issues with large bookmark lists
5. **Supabase RLS**: Row Level Security policies must be configured for new tables
6. **Chrome Extension**: Must rebuild and reload extension after changes to see updates
7. **Workspace Dependencies**: Use `workspace:*` for internal package dependencies
8. **UI Component SSR**: Use dynamic imports with `ssr: false` for components that cause hydration issues
9. **Development Path Mismatch**: Ensure tsconfig.json paths match webpack alias configuration for consistent module resolution
10. **Extension State Management**: useEffect cleanup functions needed to prevent memory leaks in extension popup
11. **Extension UserProfile Security**: Avoid innerHTML manipulation, use React state-based conditional rendering instead

## Troubleshooting Development Issues

### UI Package Import Errors

If you encounter `Cannot read properties of undefined` errors from UI package:

1. Check if UI components are properly imported as dynamic imports in providers.tsx
2. Verify tsconfig.json paths match the webpack alias configuration
3. Ensure UI package is built: `pnpm --filter @bookmark-pro/ui build`
4. For development, tsconfig should point to `src/` not `dist/`

### Next.js Development Server Issues

- Use port 8080 for web app: `pnpm --filter @bookmark-pro/web dev`
- HMR works with UI package source files in development mode
- If compilation fails, rebuild UI package and restart Next.js server

### Extension Development Issues

- **Import Path Errors**: If you encounter import resolution errors, check for mixed usage of `@/` and `../` imports
- **Real-time Data**: Extension uses direct Supabase queries instead of React Query - ensure proper error handling
- **Performance**: Large bookmark lists may cause rendering issues - consider implementing virtualization
- **User Feedback**: Operations may fail silently without proper error states and user notifications
- **Chrome API**: Extension popup has limited lifecycle - implement proper cleanup in useEffect hooks
