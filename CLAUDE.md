# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is RTE's Design System — a React component library with a supporting design-token package. The project uses an npm workspaces monorepo architecture with design tokens generated from JSON source files.

The repository previously shipped an Angular package and a unified documentation package, both of which were removed in the `chore: remove @rte-ds/angular package` refactor. The `v-last-angular-supported` git tag preserves the last commit with Angular support as a rollback anchor.

## Quick Start

```bash
# Start the Storybook (primary development environment)
cd packages/react && npm run storybook  # Port 7008

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
├── core/    # Design tokens (JSON → SCSS), CSS themes, SCSS mixins, shared assets
└── react/   # React component library + Storybook
```

**Key architectural concepts:**

- `@rte-ds/core` is a pure assets package. It contains design tokens (auto-generated SCSS from JSON), CSS theme/font files, the `grid.scss` shared mixin, SVG icons, and component documentation MDX. It exports **no TypeScript**.
- `@rte-ds/react` is the only code-bearing package. It contains every React component, every component-prop interface, every utility, and the Storybook documentation site. It depends on `@rte-ds/core` for SCSS tokens and the shared icon SVGs.
- Design tokens flow: JSON source files → TypeScript generator → SCSS variables → consumed by React components.
- The Storybook lives at `packages/react/.storybook/` and runs on port **7008**. Shared documentation React components (Accordion, Heading, Body, ComponentDocs, etc.) live at `packages/react/storybook-docs/` — a sibling of `.storybook/`, not inside it, because Vite's import-analysis rejects cross-boundary imports into dot-prefixed directories.

## Common Commands

### Development

```bash
# Run the Storybook (dev server on port 7008)
cd packages/react && npm run storybook
# or from the repo root:
npm run storybook

# Build the React package (ESM + CJS + types + CSS)
cd packages/react && npm run build
# or
npm run build:all
```

### Design Tokens

```bash
# Generate design tokens from JSON source files
# Source: packages/core/scripts/design-tokens/sourceFiles/{primitives.json,tokens.json}
npm run generate:tokens

# Output:
# - packages/core/design-tokens/primitives/
# - packages/core/design-tokens/tokens/public/
```

### Icons

```bash
# Generate React icon components from SVG files in core/assets/icons
npm run generate:icons  # Runs @svgr/cli, then npm run lint:fix
```

### Testing

```bash
cd packages/react && npm test      # Storybook interaction tests (requires storybook running)
cd packages/core && npm test       # Vitest (for design-token generator tests)
npm run test:all                   # Alias for packages/react test
```

### Linting

```bash
npm run lint        # Lint root + packages/react
npm run lint:fix    # Auto-fix linting issues (runs on pre-commit hook)
```

### Test Apps

Test apps validate that the bundled React package works in a real consumer:

```bash
npm run prepare-test-app:react    # Bundle + install React test app
npm run test-bundle:react         # Run React test app (Vite dev server)

# Available: test-apps/react (React 18), test-apps/react@19 (React 19)
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

Generator scripts (`packages/core/scripts/design-tokens/`) transform these JSON files into SCSS variables that components consume. The tokens are organized into:

- **Public tokens**: Exposed for consumption (`_typography.scss`, `_spacing.scss`, `_layout.scss`, etc.)
- **Private tokens**: Internal use only (`_size.scss`, `_shadows.scss`, etc.)

### Responsive Design

The grid system uses 6 breakpoints defined in `packages/core/design-tokens/tokens/public/_layout.scss`:

- `xxs`: 320px, `xs`: 480px, `s`: 768px, `m`: 1024px, `l`: 1440px, `xl`: 1768px

Components can use responsive column spans via `Grid.Col` props: `xxs={2} xs={3} s={4} m={6} l={8} xl={12}`.

### Component Architecture

Each component follows this structure:

```
packages/react/src/components/component-name/
├── ComponentName.tsx
├── ComponentName.stories.tsx        # Storybook stories + interaction tests
├── component-name.module.scss       # Styles using core tokens
└── (optional) hooks/, utils.ts, etc.
```

Component-prop interfaces, shared constants, and utility functions live under `packages/react/src/core-types/` using kebab-case folders (e.g. `core-types/button/button.interface.d.ts`, `core-types/tooltip/tooltip.constants.ts`). These were inlined from `@rte-ds/core/components/*` as part of the Angular-removal refactor — they are implementation details of `@rte-ds/react` and are NOT part of the `@rte-ds/core` public surface.

### Icon System

Icons are SVG files stored in `packages/core/assets/icons/`. Running `npm run generate:icons`:

1. Uses `@svgr/cli` to convert SVGs to React components under `packages/react/src/components/icon/generated/`
2. Generates a TypeScript icon map file
3. Runs `npm run lint:fix` to format the output

### Storybook Structure

Single Storybook on port **7008**, built from `packages/react/.storybook/`. Story globs:

- `packages/react/src/**/*.stories.@(ts|tsx)` — component stories + interaction tests
- `packages/react/src/**/*.mdx` — component documentation MDX
- `packages/react/stories/**/*.mdx` — foundations, guidelines, getting-started, home
- `packages/core/components/**/docs/**/*.mdx` — core-hosted component doc pages for components whose long-form documentation still lives under core

Shared React documentation components (Accordion, Body, Heading, Header, ComponentDocs, DocsSection, List, Paragraph, Table, Usage, etc.) live at `packages/react/storybook-docs/` — deliberately outside `.storybook/` because Vite's import-analysis rejects cross-boundary imports into dot-prefixed directories. Every story MDX file in `packages/react/stories/` imports from this location via relative paths.

Storybook uses ES modules: `import.meta.url`, `fileURLToPath`, `import.meta.resolve()`.

## React-Specific Workflows

### Component Generation

```bash
# React component generator (interactive)
npm run generate:component
# or from the React package
cd packages/react && npm run generate:component
```

This scaffolds a new component with proper structure, types, stories, and styles.

### React Package Structure

```
packages/react/
├── .storybook/        # Storybook config (main.ts, preview.tsx, manager.ts, theme, assets)
├── storybook-docs/    # Shared docs React components consumed by story MDX files
├── stories/           # Foundations, Guidelines, GetStarted, Home MDX stories
├── src/
│   ├── components/    # React components (the public API, re-exported from @rte-ds/react)
│   ├── core-types/    # Component-prop interfaces, constants, utilities (kebab-case folders)
│   └── utils/         # Cross-component utilities (concatClassNames, etc.)
├── dist/              # Build output (ESM + CJS + types + CSS)
└── package.json       # Exports: . (components) and ./style.css
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
npm run build-storybook    # Build static Storybook to ./storybook-static
npm run test               # Run Storybook interaction tests
npm run test:watch         # Watch mode for tests
npm run lint               # ESLint
npm run format             # Prettier
npm run generate-icons     # Regenerate icon components from SVGs
```

## Git Workflow

- Pre-commit hook: Runs `npm run lint:fix` automatically
- Uses changesets for version management and changelog generation
- Main branch: `master` (note: `.changeset/config.json` lists `main` as the baseBranch — a pre-existing mismatch that does not block local development)

## Build Outputs

- **Core**: Generates CSS theme files and font files in `packages/core/css/`
- **React**: Builds to `packages/react/dist/` (ESM + CJS bundles + types + CSS)
- **Storybook**: Static site at `packages/react/storybook-static/`

## Important File Locations

- Design token sources: `packages/core/scripts/design-tokens/sourceFiles/`
- Component-prop interfaces: `packages/react/src/core-types/*/` (`.interface.d.ts` files)
- Design token SCSS: `packages/core/design-tokens/`
- Typography mixins: `packages/core/design-tokens/abstract/mixins/_typography.scss`
- Grid system: `packages/core/components/grid/grid.scss` (the one SCSS file React still imports from core's components tree)
- SVG icons: `packages/core/assets/icons/`
- Storybook config: `packages/react/.storybook/`
- Storybook shared docs components: `packages/react/storybook-docs/`
- Core component documentation MDX: `packages/core/components/*/docs/*.mdx`

## Package Dependencies

```
@rte-ds/core (base package — design tokens, SCSS, CSS themes, SVG icons, core docs MDX)
    ↓
@rte-ds/react → depends on core
```

**For React projects**: Install `@rte-ds/react`. Core is installed automatically as a dependency.

- Peer dependency: `react >=18.0.0`
- Includes: All components, TypeScript types (inlined from the former `@rte-ds/core` interfaces), and compiled CSS
