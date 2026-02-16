# Spec for Tab Component

branch: claude/feature/tab-component
figma_component: Tab Component (node 403-23272)

## Summary

A segmented tab/tabulation component that allows users to switch between different content panels. The component displays a horizontal row of tab segments inside a pill-shaped container. Selecting a tab renders the associated external content below the tab bar. Only one tab can be active at a time.

## Functional Requirements

- Display a horizontal row of clickable tab segments within a pill-shaped container
- Support an `activeTab` state (controlled and uncontrolled modes)
- Render external content associated with the currently selected tab
- Active tab segment shows a white pill background with a check icon and brand blue text
- Inactive tab segments show transparent background with white text on brand blue
- Support keyboard navigation between tabs (arrow keys, Enter/Space to select)
- Support a `disabled` state for individual tabs
- Expose an `onChange` callback when the active tab changes
- First and last segments have rounded corners matching the container pill shape; middle segments have straight edges
- Component should accept an array of tab items (label + content) or use a compound component pattern (Tabs / Tabs.Tab / Tabs.Panel)

## Figma Design Reference

- File: [CSRD-Copy – Tab Component](https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/CSRD-Copy?node-id=403-23272&m=dev)
- Component name: Tab / Segmented Control
- Key visual constraints:
  - Pill-shaped outer container with `$radius-pill` (999px) border radius
  - Container background: `$background-brand-default` (#2964a0)
  - White borders (`$width-xs`: 1px) between segments using `$border-inverse`
  - Active segment: white pill background (`$background-brand-inverse-default`), brand blue text (`$content-brand-default`), includes `check_small` icon
  - Inactive segment: transparent background, white text (`$content-primary-inverse`)
  - Typography: `typography-button-l` mixin (Nunito SemiBold, 600 weight, negative letter-spacing)
  - Outer padding: `$positive-spacing_050` (4px vertical)
  - Inner segment padding: `$positive-spacing_100` (8px horizontal) × `$positive-spacing_075` (6px vertical)

## Possible Edge Cases

- Only one tab provided (should still render correctly without borders)
- Very long tab labels (truncation or wrapping strategy needed)
- Rapid tab switching while content is loading
- Tab content that varies significantly in height
- Dynamically adding or removing tabs at runtime

## Acceptance Criteria

- Clicking an inactive tab makes it active and renders the corresponding content panel
- Active tab displays the check icon, white background, and brand blue text
- Inactive tabs display white text on the brand blue container
- Keyboard navigation works: Left/Right arrows move focus, Enter/Space activates
- The component respects controlled (`activeTab` + `onChange`) and uncontrolled (default active) modes
- SCSS uses the design token variables from `@rte-ds/core` as specified in the Figma reference
- Component is accessible (proper ARIA roles: `tablist`, `tab`, `tabpanel`)

## Open Questions

- Should the component support an icon-only tab variant (no label)? no
- Should tab overflow be handled with horizontal scrolling or a "more" dropdown?
- Is there a need for a vertical tab orientation in the future? no
- Should the content panel transition be animated? no

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders all provided tabs with correct labels
- Clicking a tab triggers `onChange` and updates the active tab visually
- Active tab displays the check icon and correct styling
- Default/uncontrolled mode selects the first tab initially
- Controlled mode respects the `activeTab` prop
- Disabled tabs cannot be selected
- Keyboard navigation (arrow keys move focus, Enter/Space activate)
- Correct ARIA attributes are applied (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`)
