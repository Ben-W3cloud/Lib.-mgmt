# Design

> Auto-generated and maintained by frontend-god-mode.
> Source of truth for typography, color, motion, layout, and component tokens.
> Read this BEFORE touching the UI in any subsequent session.

## Aesthetic direction

Dark cyber-technical library console: near-black green-tinted surfaces, glowing emerald accents, radial green glows on hero + CTA, subtle grid. Dark-only (no light theme, no toggle). `color-scheme: dark`.

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
  --bg: oklch(0.17 0.014 155);
  --bg-deep: oklch(0.13 0.012 155);
  --fg: oklch(0.96 0.008 150);
  --muted: oklch(0.68 0.018 150);
  --panel: oklch(0.21 0.016 155);
  --panel-strong: oklch(0.25 0.02 155);
  --line: oklch(0.32 0.018 155);
  --accent: oklch(0.72 0.16 152);
  --accent-strong: oklch(0.78 0.17 152);
  --success: oklch(0.72 0.16 152);
  --warning: oklch(0.78 0.13 75);
  --error: oklch(0.66 0.17 20);
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

Landing (`components/landing/`): Landing (client shell + toast wiring), Hero (full-bleed, parallax glow/grid, line-mask reveal, ledger receipt card), StatsRow (4-col divided grid, static data, CountUp on view), About (asymmetric 2-col, fact rows), Roadmap (vertical scroll-driven timeline, spring rail-fill, node dots light on pass), Cta (wallet-aware copy + button). Primitives: Reveal/RevealItem (staggered scroll-reveal), CountUp (motion-value tween), EnterAppButton (magnetic, routes connected→/dashboard else opens RainbowKit modal + toast), useToast (auto-dismiss 4s).

Landing motion dial: 8/10 (landing only). Site baseline stays 5/10.

Routing: `/` is marketing landing (full-bleed main, no container padding). Former dashboard moved to `/dashboard`. Nav gained a Dashboard pill.

## Brand voice

Direct and specific. Banned copy: elevate, seamless, unleash, next-gen, game-changing.

## Accessibility floor

WCAG AA body contrast, visible focus rings, real form labels, 44px mobile touch targets, Esc-dismissable modals.

## Last updated

2026-07-09 by Codex: initial dApp UI and web3 integration.
2026-07-17: landing page redesign — hero, stats row, about, how-it-works roadmap, CTA. Moved dashboard to /dashboard.
2026-07-17: flipped to dark-only theme (near-black green-tinted base, glowing emerald, radial glows). Airy section spacing (7–10rem), separated cards with gaps + individual rounding. Old light zinc tokens retired across all routes.

