# Spec for Divider Text Label

branch: claude/feature/divider-text-label
figma_component: Divider with Text Label (node 403-21783)

## Summary

Modify the existing Divider component to support an optional text label displayed inline alongside the divider line. When a `text` prop is provided (e.g. a date like "23/02/2025"), the divider renders as a horizontal flex container with the label on the left and the line stretching to fill the remaining width. When no text is provided, the divider behaves exactly as it does today.

## Functional Requirements

- Add an optional `text` prop to the Divider component
- When `text` is provided and orientation is `horizontal`, render a flex container with the text label on the left and the divider line on the right
- The text label has a fixed width and is right-aligned
- The divider line flexes to fill remaining horizontal space (`flex: 1`)
- The label and line are vertically centered using `align-items: center`
- When `text` is not provided, the component renders identically to the current implementation (no visual or behavioral changes)
- The text variant only applies to horizontal dividers; vertical dividers ignore the `text` prop
- All existing props (`orientation`, `thickness`, `appearance`, `endPoint`) continue to work as before

## Figma Design Reference

- File: [CSRD-Copy – Divider with Text Label](https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/CSRD-Copy?node-id=403-21783&m=dev)
- Component name: Divider with Text Label
- Key visual constraints:
  - Horizontal flex layout with `align-items: center` and a 15px gap between label and line
  - Text label: ~87px fixed width, right-aligned, color `#727272` (map to a neutral/secondary content token)
  - Typography: Inter Regular, 13px (map to closest design system typography token)
  - Divider line: 1px height, stretches to fill remaining width (`flex: 1 0 0`)
  - Line uses the same divider border color as the standard horizontal divider

## Possible Edge Cases

- Very long text content overflowing the fixed-width label area
- Text prop provided with a vertical orientation (should be ignored)
- Empty string passed as text (should behave as if no text was provided)
- Interaction with different `thickness` values (the line portion should respect thickness)
- Interaction with different `appearance` values (line color changes, text color stays neutral)

## Acceptance Criteria

- Passing `text="23/02/2025"` to a horizontal Divider renders the date label on the left and the line on the right
- The label is right-aligned and vertically centered with the divider line
- Without the `text` prop, the Divider renders identically to the current implementation
- The `text` prop is ignored when `orientation="vertical"`
- All existing props (`thickness`, `appearance`, `endPoint`) continue to function correctly
- The interface in `@rte-ds/core` is updated with the new optional `text` prop
- SCSS uses design tokens from `@rte-ds/core` for spacing, colors, and typography

## Open Questions

- Should the text label support being placed on the right side as well, or only left?
- Should the text color change with different `appearance` values (e.g. inverse, brand)?
- Is the 87px fixed width appropriate for all use cases, or should it auto-size to content?

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders a standard divider without text (no regression)
- Renders text label alongside divider line when `text` prop is provided
- Text label is not rendered when `text` is an empty string
- Vertical divider ignores the `text` prop
- Different `thickness` and `appearance` values still apply correctly with text
