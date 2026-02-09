# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is RTE's Design System - a multi-framework design system supporting React, Angular, and core web components. The project uses an npm workspaces monorepo architecture with design tokens generated from JSON source files.

**Primary Usage**: This design system is primarily used for **React-based projects**. Angular support exists in the codebase but is not actively used in production applications.

## Quick Start (React Development)

```bash
# Start React Storybook
cd packages/react && npm run storybook

# Run tests
cd packages/react && npm test

# Build React package
cd packages/react && npm run build

# Generate new component
npm run generate:component

# Regenerate design tokens (after editing JSON source files)
npm run generate:tokens

# Regenerate icons (after adding SVGs to core/assets/icons)
npm run generate:icons
```

## Monorepo Structure

```
packages/
├── core/          # Design tokens, SCSS, interfaces, and shared utilities
├── react/         # React component library
├── angular/       # Angular component library
└── design-docs/   # Unified Storybook documentation (aggregates React + Angular)
```

**Key architectural concepts:**
- `core` contains design tokens (auto-generated SCSS from JSON), CSS themes/fonts, component interfaces, and base SCSS
- React and Angular packages depend on `core` and implement framework-specific components
- `design-docs` hosts a unified Storybook that references both React (`localhost:7008`) and Angular (`localhost:7007`) Storybooks
- Design tokens flow: JSON source files → TypeScript generator → SCSS variables → consumed by components

## Common Commands

### Development (React Focus)

```bash
# Run React Storybook (primary development environment)
cd packages/react && npm run storybook  # Port 7008

# Run unified documentation (includes React + Angular references)
npm run design-docs  # Port 7006

# Build React package
cd packages/react && npm run build

# Build all packages (includes Angular for completeness)
npm run build:all
```

### Design Tokens

```bash
# Generate design tokens from JSON source files
# Located at: packages/core/scripts/design-tokens/sourceFiles/{primitives.json,tokens.json}
npm run generate:tokens

# This auto-generates SCSS files in:
# - packages/core/design-tokens/primitives/
# - packages/core/design-tokens/tokens/public/
```

### Icons

```bash
# Generate icon components from SVG files in core/assets/icons
npm run generate:icons  # Generates for both React and Angular, runs lint:fix after
```

### Testing (React Focus)

```bash
# React tests (primary)
npm run test:react                 # React Storybook interaction tests (requires Storybook running)
cd packages/react && npm test      # Vitest + Storybook test-runner

# Core package tests
cd packages/core && npm test       # Vitest

# All packages (includes Angular)
npm run test:all                   # Test both frameworks
```

### Linting

```bash
npm run lint        # Lint all packages
npm run lint:fix    # Auto-fix linting issues (runs on pre-commit hook)
```

### Test Apps (React Focus)

Test apps validate bundled packages work correctly:

```bash
# React test app (primary)
npm run prepare-test-app:react    # Bundle + install React test app
npm run test-bundle:react         # Run React test app (Vite dev server)

# Available test apps: test-apps/react, test-apps/react@19, test-apps/angular
```

### Publishing & Releases

```bash
npm run changeset:add          # Interactive changeset creation
npm run auto-changesets        # Auto-generate changesets from git changes
npm run publish:all            # Publish all packages (uses changesets)
npm run changelog              # Generate CHANGELOG.md
```

## Architecture Notes

### Design Token System

Design tokens are the single source of truth for design decisions. They follow a two-tier hierarchy:

1. **Primitives** (`primitives.json`): Base values (colors, font sizes, spacing values)
2. **Tokens** (`tokens.json`): Semantic tokens that reference primitives (e.g., `button-primary-background`)

Generator scripts (`packages/core/scripts/design-tokens/`) transform these JSON files into SCSS variables that components consume. The tokens support theming and are organized into:
- **Public tokens**: Exposed for consumption (`_typography.scss`, `_spacing.scss`, `_layout.scss`, etc.)
- **Private tokens**: Internal use only (`_size.scss`, `_shadows.scss`, etc.)

### Responsive Design

The grid system uses 6 breakpoints defined in `packages/core/design-tokens/tokens/public/_layout.scss`:
- `xxs`: 320px, `xs`: 480px, `s`: 768px, `m`: 1024px, `l`: 1440px, `xl`: 1768px

Components can use responsive column spans via `Grid.Col` props: `xxs={2} xs={3} s={4} m={6} l={8} xl={12}`

### Component Architecture

Each component follows this structure:
```
component-name/
├── ComponentName.tsx (React) or component-name.component.ts (Angular)
├── ComponentName.stories.tsx (Storybook stories + interaction tests)
├── component-name.scss (styles using core tokens)
└── component-name.interface.d.ts (TypeScript interfaces in core)
```

Interfaces are defined in `@rte-ds/core` and imported by React/Angular implementations for consistency.

### Icon System

Icons are SVG files stored in `packages/core/assets/icons/`. Running `npm run generate:icons`:
1. Uses `@svgr/cli` to convert SVGs to React components
2. Generates TypeScript icon map files
3. Copies icons to Angular assets
4. Runs linting to ensure code quality

### Storybook Structure

The project uses a three-Storybook architecture:
- **React Storybook** (port 7008): React component documentation
- **Angular Storybook** (port 7007): Angular component documentation
- **Design Docs Storybook** (port 7006): Unified documentation that references the other two via `refs` configuration

The design-docs Storybook includes:
- Foundation documentation (colors, typography, spacing, grids)
- Getting started guides
- Framework-specific implementation guides
- Links to framework-specific component documentation

### ES Module Compatibility

The Storybook configuration (`packages/design-docs/.storybook/main.ts`) uses ES modules:
- Uses `import.meta.url` and `fileURLToPath` instead of `__dirname`
- Uses `import.meta.resolve()` instead of `require.resolve()`

## React-Specific Workflows

### Component Generation

```bash
# React component generator (interactive)
npm run generate:component  # From root
cd packages/react && npm run generate:component  # From React package
```

This scaffolds a new component with proper structure, types, stories, and styles.

### React Package Structure

```
packages/react/
├── src/
│   ├── components/        # React components (import from @rte-ds/react)
│   │   ├── button/
│   │   ├── grid/         # Grid.Col API for responsive layouts
│   │   ├── icon/         # Auto-generated from SVGs
│   │   └── ...
│   └── utils/            # Shared utilities (concatClassNames, etc.)
├── dist/                 # Build output (ESM + types + CSS)
└── package.json          # Exports: . (components) and ./style.css
```

### Using the React Package

```tsx
// In your React app
import { Button, Grid, Icon } from '@rte-ds/react';
import '@rte-ds/react/style.css';

function App() {
  return (
    <Grid gridType="fluid">
      <Grid.Col xs={12} m={6}>
        <Button variant="primary">
          <Icon name="check" />
          Click me
        </Button>
      </Grid.Col>
    </Grid>
  );
}
```

### React Development Commands

```bash
cd packages/react

npm run storybook          # Dev server on port 7008
npm run build              # Build package to dist/
npm run test               # Run Storybook interaction tests
npm run test:watch         # Watch mode for tests
npm run lint               # ESLint
npm run format             # Prettier
npm run generate-icons     # Regenerate icon components from SVGs
```

## Git Workflow

- Pre-commit hook: Runs `npm run lint:fix` automatically
- Uses changesets for version management and changelog generation
- Main branch: `master` (note: not `main` despite changeset config)

## Build Outputs

- **Core**: Generates CSS theme files and font files in `packages/core/css/`
- **React**: Builds to `packages/react/dist/` (ESM bundle + types + CSS)
- **Angular**: Builds to `packages/angular/dist/lib/` (Angular package format)
- **Storybooks**: Build to static sites in `packages/design-docs/storybook-static/{react,angular}`

## Important File Locations

- Design token sources: `packages/core/scripts/design-tokens/sourceFiles/`
- Component interfaces: `packages/core/components/*/` (`.interface.d.ts` files)
- Design token SCSS: `packages/core/design-tokens/`
- Typography mixins: `packages/core/design-tokens/abstract/mixins/_typography.scss`
- Grid system: `packages/core/components/grid/grid.scss`
- SVG icons: `packages/core/assets/icons/`

## Package Dependencies

```
@rte-ds/core (base package - design tokens, SCSS, interfaces)
    ↓
@rte-ds/react → depends on core (PRIMARY PACKAGE FOR PRODUCTION USE)
@rte-ds/angular → depends on core (available but not actively used)
    ↓
@rte-ds/design-docs → references both for documentation
```

**For React projects**: Install `@rte-ds/react` which includes `@rte-ds/core` as a dependency.
- Peer dependency: `react >=18.0.0`
- Includes: All components, TypeScript types, and compiled CSS
