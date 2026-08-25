# Design

> Source of truth for typography, color, motion, layout, and component tokens.
> Read this BEFORE touching the UI in any subsequent session.

## System

**Nothing-inspired instrument panel.** Monochrome OLED canvas, typographic hierarchy, flat surfaces with border separation, red reserved as an interrupt. Brand name: Folio.

## Fonts (declared, loaded via `next/font/google`)

- Display (hero moments only): **Doto** (`--font-doto`) — 36px+, tight tracking, never body
- Body / UI: **Space Grotesk** (`--font-grotesk`) — 300–700
- Data / labels: **Space Mono** (`--font-space-mono`, 400/700) — ALL CAPS labels, numbers

Type scale: display 72/48/36 · heading 24 · subheading 18 · body 16 · body-sm 14 · caption 12 · label 11 caps +0.08em.

## Mode

Dark-first (OLED black). Light tokens defined in the skill but not wired; flip via custom properties if ever needed.

## Color tokens (dark)

```css
--bg: #000000;        --panel: #111111;      --panel-strong: #1a1a1a;
--line: #222222;      --line-strong: #333333;
--fg: #e8e8e8;        --display: #ffffff;    --muted: #999999;   --disabled: #666666;
--accent: #d71921;    --accent-subtle: rgba(215,25,33,.15);
--success: #4a9e5c;   --warning: #d4a843;    --interactive: #5b9bf6;
```

- Hierarchy = gray scale: display → primary → secondary → disabled. Max 4 levels.
- Red = interrupt only (errors, wrong network, one accent word per screen). Never decorative.
- Status colors apply to VALUES (points, dots, borders), never row backgrounds or labels.
- Banned: gradients in chrome, shadows, blur, zebra stripes, filled icons, skeletons, toast popups.

## Motion

- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` ease-out. Durations 150–250ms micro.
- No springs, no bounce, no parallax, no scale on hover. Press = translateY(1px) at 80ms.
- Elements fade, don't slide. Loading = `[LOADING]` bracket text + segmented bar (`steps()` blink).
- Respect `prefers-reduced-motion`.

## Layout & components

- Container `max-w-[1400px] mx-auto px-4 md:px-10`. Spacing does the grouping; dividers only in data lists.
- Cards: surface `#111`, 1px `#222` border, radius ≤16px. Buttons: pill, Space Mono caps 13px; primary = white/black inversion; danger = red outline.
- Inputs: full border 8px radius, mono text, focus border brightens. Labels: caps mono above.
- Nav: mono caps pills; active = white text + red dot prefix. Header: solid black, 1px bottom border, no blur.
- Modals: backdrop `rgba(0,0,0,.8)` no blur; dialog bordered surface, `[X]` ghost close; opacity-only enter/exit.
- Dot-matrix motif: `.dot-grid` backgrounds masked into corners; Doto hero headline; segmented bars are THE data viz.
- Status line replaces toasts: fixed bottom, bordered, mono caps, auto-dismiss.
- Stats composition: ONE hero number (Doto) + stat rows with segmented bars — vary form, keep voice.

## Routing

`/` marketing landing (Hero, StatsRow, Why, Roadmap, Cta) · `/dashboard` `/browse` `/list` `/listings` `/profile` app routes behind wallet connect.

## Brand voice

Plain, specific, technical-calm. Wallet = library card. Banned copy: elevate, seamless, unleash, next-gen, game-changing.

## Accessibility floor

Visible focus rings (white), real form labels, 44px touch targets, Esc-dismissable modals, `prefers-reduced-motion` honored, AA contrast via token pairs.

## Last updated

2026-08-24: full visual rebuild on Nothing design system — OLED dark mode, Space Grotesk/Space Mono/Doto stack, flat bordered surfaces, segmented loading/data bars, dot-matrix motif, inline status lines replacing toasts and skeletons, springs replaced with ease-out tweens. Prior iterations (emerald console, warm paper "Folio" skin) retired.
