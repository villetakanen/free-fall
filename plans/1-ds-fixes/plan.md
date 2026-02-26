# Design System Fixes

## Goal Description
The demo app is currently broken due to CSS and layout bugs in the `AppTray` component. Specifically, the "rail bugs" occur because the burger button sits outside the rail's background container, and the drawer stacks vertically below the rail on desktop instead of sitting side-by-side horizontally. This plan details the necessary fixes to the component's internal DOM structure, CSS flexbox layout, and the aligning specification updates.

## Proposed Changes

### Design System Components (`packages/design-system`)

#### [MODIFY] [AppTray.astro](file:///Users/ville.takanen/dev/free-fall/packages/design-system/src/components/AppTray.astro)
- Wrap the `.app-tray__burger` and `.app-tray__rail` in a new container `<div class="app-tray__rail-column">`. This simplifies the layout by acting as the unified "rail" element on medium/large viewports, ensuring the burger button shares the rail's styling background and border.

#### [MODIFY] [app-tray.css](file:///Users/ville.takanen/dev/free-fall/packages/design-system/src/styles/app-tray.css)
- Implement a **mobile-first** approach: The default (`< 620px`) styling should define the base `.app-tray` and `.app-tray__rail-column` logic, ensuring the hidden state works seamlessly.
- Add Flexbox styling to the root `.app-tray` container (`display: flex; flex-direction: row; height: 100%`) so the rail and the drawer align horizontally. This base styling prevents the vertical-stacking bug when the drawer opens in push-mode on desktop.
- Transfer `width`, `background`, and `border-right` from `.app-tray__rail` to the new `.app-tray__rail-column` wrapper for the medium/tablet (`>= 620px`) media query, fulfilling the "Rail + Overlay" structural requirement.
- Ensure the large/desktop (`>= 780px`) media query cleanly handles the "Rail + Push content" layout with the new flex-row container.
- Make `.app-tray__rail` just a flex-column wrapper for the nav items to eliminate any margin separation issues across all sizes.
- Fix `.app-tray__burger` alignment so it natively sits inside the rail-column cleanly at all breakpoints.

### Specifications (`specs/design-system`)

#### [MODIFY] [spec.md](file:///Users/ville.takanen/dev/free-fall/specs/design-system/app-tray/spec.md)
- Update the **Anatomy** and **Component Structure** sections to explicitly state that the Root `.app-tray` must act as a `flex-direction: row` container.
- Update the documentation to reflect the new `app-tray__rail-column` wrapper that bounds both the hamburger button and the rail item list on tablet and desktop.

## Verification Plan

### Automated Tests
- Run `pnpm lint`, `pnpm build`, and `pnpm test` successfully across the workspace.

### Manual Verification
- Since the automated browser tool failed on macOS with `local chrome mode is only supported on Linux`, I will manually test the fixes by confirming that `pnpm dev` builds successfully without structural or CSS-syntax errors. 
- *Fallback for UI Testing*: I will rely on the user to visually inspect the responsive breakpoints (resize window to check `< 620px`, `620-779px`, and `>= 780px`) using the provided dev URL `http://localhost:4323/`.
- Ensure the push drawer no longer drops below the rail and correctly slides out horizontally on desktop viewports.
