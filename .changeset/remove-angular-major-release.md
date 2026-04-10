---
"@rte-ds/core": major
"@rte-ds/react": major
---

**BREAKING**: Remove the Angular package and restructure the monorepo as React-only.

### What changed

- **`@rte-ds/angular` removed.** The Angular package is no longer published. Last-supported state is preserved at the git tag `v-last-angular-supported`. The last published version on npm remains installable for existing Angular consumers as a maintenance release; it will receive no further updates.
- **`@rte-ds/core` is now a pure assets package.** All TypeScript files (component-prop interfaces, shared constants, utilities) that previously lived under `@rte-ds/core/components/*/` have been moved into `@rte-ds/react`. The core package now exports only: design tokens (SCSS), CSS theme files, CSS font files, SVG icons, SCSS mixins (including `grid.scss`), and component documentation MDX.
- **`@rte-ds/design-docs` removed.** The unified documentation Storybook has been collapsed into the React Storybook. There is now a single Storybook on port 7008, served by `@rte-ds/react`. Ports 7006 and 7007 are no longer used.

### Migration guide

**React consumers** (the primary audience):

If you import only from `@rte-ds/react`, no action is required:

```tsx
import { Button, Grid, Icon } from "@rte-ds/react";
import "@rte-ds/react/style.css";
```

If you import component-prop interfaces directly from `@rte-ds/core/components/...`, update your imports. Those types now live in `@rte-ds/react`. The cleanest migration is to import them via the React package's public API surface (types are re-exported alongside components where appropriate), or pin the previous `@rte-ds/core` major until you can refactor.

SCSS imports from `@rte-ds/core` are unchanged:

```scss
@use "@rte-ds/core/design-tokens/main" as *;
@use "@rte-ds/core/design-tokens/fonts" as *;
@include theme-selector("bleu_iceberg", "light");
```

The `@rte-ds/core/components/grid/grid.scss` mixin is also unchanged and still available from core.

**Angular consumers**:

There is no migration path forward on the `@rte-ds/angular` package — it will not receive future updates. Continue using the last published version or migrate to `@rte-ds/react`.

### Rollback

The `v-last-angular-supported` git tag points at the last commit with Angular support, design-docs, and the previous core-types layout intact. Check out that tag to restore the pre-refactor state.
