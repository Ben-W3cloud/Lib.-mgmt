# Design

> Auto-generated and maintained by frontend-god-mode.
> Source of truth for typography, color, motion, layout, and component tokens.
> Read this BEFORE touching the UI in any subsequent session.

## Aesthetic direction

Refined operational library console: quiet zinc surfaces, emerald status accents, dense enough for daily borrowing workflows without feeling like admin sludge.

## Dials

- DESIGN_VARIANCE: 7 / 10
- MOTION_INTENSITY: 5 / 10
- VISUAL_DENSITY: 6 / 10

## Type stack

- Display: Geist
- Body: Geist
- Mono: Geist Mono
- Loaded via: `next/font/google`
- Optical features enabled: `font-feature-settings: "ss01", "cv11"`

Banned in this project: Inter, Roboto, Arial, system-ui as primary, serif dashboard fonts.

## Color tokens

```css
:root {
  --bg: oklch(0.985 0.004 145);
  --fg: oklch(0.17 0.01 145);
  --muted: oklch(0.48 0.012 145);
  --panel: oklch(0.965 0.006 145);
  --line: oklch(0.88 0.01 145);
  --accent: oklch(0.55 0.15 150);
  --success: oklch(0.58 0.14 150);
  --warning: oklch(0.68 0.14 75);
  --error: oklch(0.55 0.18 10);
}
```

Banned: pure black/white, purple-blue gradients, more than one main accent, untinted shadows.

## Motion

- CSS easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Framer spring: `{ type: "spring", stiffness: 100, damping: 20 }`
- Animate `transform` and `opacity` only.
- Respect `prefers-reduced-motion`.

## Layout

- Container: `max-w-[1400px] mx-auto px-4 md:px-10`
- Reading width: `max-w-[65ch]`
- Hero: asymmetric 60/40 console layout, never centered.
- Data views: rows and panels over nested cards.
- Mobile: all grids collapse under `md`.

## Component inventory

Custom: AppShell, ProviderShell, BookRow, MutationForm, StatusNote, SkeletonRows, Modal.

## Brand voice

Direct and specific. Banned copy: elevate, seamless, unleash, next-gen, game-changing.

## Accessibility floor

WCAG AA body contrast, visible focus rings, real form labels, 44px mobile touch targets, Esc-dismissable modals.

## Last updated

2026-07-09 by Codex: initial dApp UI and web3 integration.

