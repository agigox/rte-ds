# Responsive SideNav Component

## Summary

Make the SideNav component responsive by adding a mobile-friendly horizontal navigation bar that replaces the vertical sidebar on small screens. The mobile version includes a hamburger menu to toggle navigation, a middle action slot (e.g., campaign icon), and a right action slot (e.g., settings icon). The desktop SideNav remains unchanged.

## Design Reference

**Figma**: [Mocks - Mobile SideNav](https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/Mocks?node-id=388-4088&m=dev)

### Design Specifications

- **Mobile Header Bar**: Fixed 64px height, horizontal layout containing: Logo box (64x64px), hamburger menu icon (24x24px), middle action button (campaign icon in 40px blue button), and right settings icon (24x24px). Items spaced with 4px gaps.
- **Color Tokens**: Background uses `$background-brand-navigation-default` (#15253c), divider border uses `$border-brand-navigation-divider` (#214770), content uses `$content-brand-navigation-default` (#e6eef8), middle button uses `$background-brand-default` (#2964a0).
- **Spacing & Borders**: Container padding `$positive-spacing_050` (4px), icon button padding `$positive-spacing_200` (16px), gap `$positive-spacing_300` (24px), border radius `$radius-s` (4px).
- **Logo Box**: 64x64px square with `$background-brand-navigation-default`, contains centered identifier text using `typography-text-s-bold` (12px/700) in `$content-brand-navigation-default`, inner background uses `$background-brand-navigation-pressed` with 4px border radius.
- **Breakpoint**: Mobile layout active below `$breakpoints-s` (768px), desktop vertical SideNav above 768px.
- **Interactive States**: All interactive elements use 4px border radius with hover backgrounds (`$background-brand-navigation-hover`).

## Motivation

The current SideNav component only supports a vertical sidebar layout. On mobile devices and small screens, this layout consumes too much horizontal space and does not provide a good user experience. A responsive version is needed so that the SideNav adapts to screen size automatically.

## Requirements

### Functional Requirements

1. **Breakpoint-based layout switching**: Below 768px (`$breakpoints-s`), render the mobile horizontal bar instead of the vertical sidebar.
2. **Hamburger menu**: Display a hamburger icon that, when clicked, opens a drawer/overlay containing the full navigation items list.
3. **Middle item slot (`middleItem`)**: Accept a custom React node (e.g., an icon button) rendered in the center of the mobile bar.
4. **Right item slot (`rightItem`)**: Accept a custom React node (e.g., a settings icon) rendered on the right side of the mobile bar.
5. **Logo / Identifier**: The logo box with identifier text from `headerConfig` should remain visible on the left side of the mobile bar.
6. **Navigation drawer**: When the hamburger menu is toggled, show the existing navigation items in a slide-out drawer or full-screen overlay.
7. **Close behavior**: The drawer should close when a navigation item is clicked, when the user presses Escape, or when the user clicks outside the drawer.
8. **Active item**: The active item should be visually indicated in the mobile drawer, consistent with desktop behavior.

### Non-Functional Requirements

1. **Backwards compatible**: The existing SideNav API must continue to work without changes. The new props (`middleItem`, `rightItem`) should be optional.
2. **Accessibility**: The hamburger button must have an `aria-label`, the drawer must trap focus when open, and Escape must close it.
3. **Smooth transitions**: The drawer should animate open/close (slide from left, ~300ms matching existing transitions).
4. **No layout shift**: Switching between mobile and desktop layouts should not cause content jumps.

## New Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `middleItem` | `ReactNode` | `undefined` | Content rendered in the center of the mobile navigation bar |
| `rightItem` | `ReactNode` | `undefined` | Content rendered on the right side of the mobile navigation bar |

## Affected Files

### Core Package
- `packages/core/components/side-nav/side-nav.interface.d.ts` - Add `middleItem` and `rightItem` to the interface

### React Package
- `packages/react/src/components/sideNav/SideNav.tsx` - Add responsive detection and mobile bar rendering
- `packages/react/src/components/sideNav/SideNav.module.scss` - Add mobile styles with media queries
- `packages/react/src/components/sideNav/mobileSideNav/MobileSideNav.tsx` - New mobile bar sub-component
- `packages/react/src/components/sideNav/mobileSideNav/MobileSideNav.module.scss` - Mobile bar styles
- `packages/react/src/components/sideNav/SideNav.stories.tsx` - Add responsive story variants

## User Experience

### Desktop (>= 768px)
No changes. The existing vertical SideNav renders as it does today.

### Mobile (< 768px)
1. The vertical sidebar is replaced by a horizontal bar at the top.
2. The bar shows (left to right): Logo identifier, hamburger icon, middle item, right item.
3. Tapping the hamburger icon opens a drawer from the left containing all navigation items.
4. The drawer overlay dims the background content.
5. Navigation items in the drawer behave identically to the desktop sidebar (expand/collapse menus, active states, keyboard navigation).

## Edge Cases

- If `middleItem` or `rightItem` are not provided, those slots should be empty (no placeholder).
- The `collapsed` prop should be ignored on mobile since the mobile bar has its own layout.
- If `collapsible` is true, the collapse button should not appear in the mobile drawer.
- Screen resize from mobile to desktop (and vice versa) should transition cleanly.
- The mobile drawer should support scrolling if navigation items overflow.

## Testing

- Verify desktop layout remains unchanged at viewport >= 768px.
- Verify mobile bar renders at viewport < 768px with correct layout.
- Verify hamburger menu opens and closes the navigation drawer.
- Verify `middleItem` and `rightItem` render in the correct positions.
- Verify keyboard navigation (Escape to close drawer, Tab trapping).
- Verify active item highlighting in the mobile drawer.
- Verify transition between mobile and desktop on resize.
