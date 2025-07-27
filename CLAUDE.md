# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Start all services with HMR support
pnpm dev

# Start individual services (includes UI package for HMR)
pnpm run web:dev        # Web app + UI package
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
pnpm --filter @bookmark-pro/web build
pnpm --filter @bookmark-pro/extension build
pnpm --filter @bookmark-pro/ui build
```

### Linting
```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @bookmark-pro/web lint
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
├── @bookmark-pro/web (apps/web)
└── @bookmark-pro/extension (apps/extension)
```

### Shared Component System
- **UI Package**: Central component library using shadcn/ui + Radix UI
- **Development Mode**: Vite aliases `@bookmark-pro/ui` to source files for instant HMR
- **Production Mode**: Uses built dist files with manual type definitions
- **Type Declarations**: Manual `.d.ts` file at `packages/ui/dist/index.d.ts` (tsup dts generation disabled due to complexity)

### Database Architecture (Supabase)
- **Tables**: `bookmarks`, `profiles` with Row Level Security (RLS)
- **Auth Integration**: User profiles auto-created on signup
- **Real-time**: Built-in subscriptions for data sync
- **Types**: Auto-generated TypeScript types in `integrations/supabase/types.ts`

### State Management Patterns
- **Web App**: React Query for server state, React hooks for local state
- **Extension**: Chrome Storage API + React Context for auth state
- **Data Flow**: Supabase → React Query → UI components

## File Organization Patterns

### Standard Directory Structure
```
src/
├── components/          # Feature components
├── pages/              # Route components (web only)
├── integrations/       # External service clients
│   └── supabase/      # Database client & types
├── lib/               # Utilities
├── hooks/             # Custom React hooks
└── contexts/          # React context providers
```

### Component Import Patterns
```typescript
// UI components (from shared package)
import { Button, Dialog } from "@bookmark-pro/ui";

// Local components
import { BookmarkCard } from "../components/BookmarkCard";

// Supabase integration
import { supabase } from "../integrations/supabase/client";
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
- Extension uses `../` relative imports for local files (not `@/` alias)
- Strict TypeScript configuration across all packages

### Build Optimization
- Turbo caching for build artifacts
- Parallel builds with proper dependency ordering
- Extension builds include manifest copying to dist

## Common Gotchas

1. **UI Package Types**: Must manually update `packages/ui/dist/index.d.ts` when adding new exports
2. **Extension Imports**: Use relative imports (`../`) not alias imports (`@/`) for local files
3. **Supabase RLS**: Row Level Security policies must be configured for new tables
4. **Chrome Extension**: Must rebuild and reload extension after changes to see updates
5. **Workspace Dependencies**: Use `workspace:*` for internal package dependencies