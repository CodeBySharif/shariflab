---
version: alpha
name: My Design System
description: A shared design system for product UI. Same color, type, and style tokens across every surface.
colors:
  primary: '#3b82f6'
  on-primary: '#000000'
  primary-hover: '#2563eb'
  canvas: '#0f0f11'
  canvas-soft: '#18181b'
  ink: '#fafafa'
  ink-muted: '#a1a1aa'
  ink-subtle: '#818181'
  success: '#4ade80'
  warning: '#fbbf24'
  error: '#f87171'
  hairline: '#27272a'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.04em
  overline:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.08em
  button-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
  full: 9999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
    padding: '{spacing.md} {spacing.xl}'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
    padding: '{spacing.md} {spacing.xl}'
  button-secondary:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
    padding: '{spacing.md} {spacing.xl}'
  button-tertiary:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    borderColor: '{colors.hairline}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
    padding: '{spacing.md} {spacing.xl}'
  card-content:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.lg}'
    padding: '{spacing.xl}'
  card-feature:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.lg}'
    padding: '{spacing.xl}'
  text-input:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    borderColor: '{colors.hairline}'
    typography: '{typography.body-md}'
    rounded: '{rounded.md}'
    padding: '{spacing.md} {spacing.lg}'
  top-nav:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    padding: '{spacing.md} {spacing.xl}'
    height: 56px
  nav-link:
    textColor: '{colors.ink-muted}'
    typography: '{typography.body-sm}'
  footer:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink-subtle}'
    typography: '{typography.caption}'
    padding: '{spacing.3xl} {spacing.xl}'
  badge-success:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.success}'
    typography: '{typography.caption}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.md}'
  badge-warning:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.warning}'
    typography: '{typography.caption}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.md}'
  badge-error:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.error}'
    typography: '{typography.caption}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.md}'
uiStyle: skeuomorphism
dials:
  energy: 2
  rhythm: 2
  motion: 1
surfaces:
  - id: sign-in
    name: Sign in
    role: auth
    intent: One clear next step. Calm contrast. No marketing chrome competing with the form.
    composition: Centered or split form. Honest validation. Keyboard-friendly controls. Empty distraction.
    avoid: >-
      Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content. No hero
      feature grids. No fake social proof on auth.
  - id: list
    name: List
    role: collection
    intent: Help people scan, filter, and open the right record quickly.
    composition: Toolbar + table or card list. Dense but readable. Empty, loading, and error states required.
    avoid: >-
      Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content. Do not
      restyle list density with landing-page hero patterns.
  - id: detail
    name: Detail
    role: record
    intent: 'Show one record clearly: identity, status, and primary actions.'
    composition: Header with title/status + body sections. Quiet secondary chrome. One primary action.
    avoid: Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content.
  - id: settings
    name: Settings
    role: config
    intent: Group preferences so people can change one thing without noise.
    composition: Sectioned form groups or side nav + panel. Clear save/cancel feedback.
    avoid: Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content.
---

## Overview

**My Design System** - A shared design system for product UI. Same color, type, and style tokens across every surface.

This file is a **product design system**, not a single page template. Tone is **clear and direct** with a dark, product focused, professional visual register. Every surface (sign-in, list, detail, settings, and more) must reuse the same color, typography, radius, spacing, and component tokens. Layout and density change per page job; brand language does not.

**Design read:** Reading this as: a product design system for product teams, in a dark/product focused/professional register, dial ENERGY 2 / RHYTHM 2 / MOTION 1. Apply the same tokens across every surface; change layout per page job.

**Dials:** ENERGY 2 (Balanced) / RHYTHM 2 (Mostly consistent) / MOTION 1 (Hover only). Hold these dials across the product.

**UI style:** Skeuomorphic cues - subtle gradients, inset highlights, and tactile button affordances. Use this technique only when it serves hierarchy or identity; write the purpose down before shipping a flourish.

The system anchors on `{colors.canvas}` (`#0f0f11`) as the primary surface, with `{colors.ink}` (`#fafafa`) for headlines and core text. The brand accent `{colors.primary}` (`#3b82f6`) is reserved for the single most important action per screen, never used decoratively as a large background fill.

Display typography uses **Inter** for hero and headline moments. Body copy uses **Inter** for long-form readability. The type scale follows a **balanced** rhythm with 12 defined steps from display to caption.

Cards and interactive elements use `{rounded.lg}` corner radii. Spacing follows a strict **8px** base unit to maintain vertical rhythm across sections.

## Surfaces

These are product surfaces that share one design system. Reuse the same tokens everywhere; only composition and density change.

### Sign in

- **Role:** auth
- **Intent:** One clear next step. Calm contrast. No marketing chrome competing with the form.
- **Composition:** Centered or split form. Honest validation. Keyboard-friendly controls. Empty distraction.
- **Avoid:** Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content. No hero feature grids. No fake social proof on auth.

### List

- **Role:** collection
- **Intent:** Help people scan, filter, and open the right record quickly.
- **Composition:** Toolbar + table or card list. Dense but readable. Empty, loading, and error states required.
- **Avoid:** Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content. Do not restyle list density with landing-page hero patterns.

### Detail

- **Role:** record
- **Intent:** Show one record clearly: identity, status, and primary actions.
- **Composition:** Header with title/status + body sections. Quiet secondary chrome. One primary action.
- **Avoid:** Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content.

### Settings

- **Role:** config
- **Intent:** Group preferences so people can change one thing without noise.
- **Composition:** Sectioned form groups or side nav + panel. Clear save/cancel feedback.
- **Avoid:** Do not invent testimonials, fake stats, or trust badges. Keep decorative chrome quieter than content.

## Colors

The palette is built around high-contrast neutrals and a single chromatic accent.

- **Primary (`#3b82f6`):** The sole driver for primary actions, links, and critical highlights. Pair with `{colors.on-primary}` (`#000000`) for text on filled buttons.
- **Canvas (`#0f0f11`):** The default page background and card surface.
- **Canvas Soft (`#18181b`):** A secondary surface for feature bands, alternating sections, and subtle containment.
- **Ink (`#fafafa`):** Headlines, body text, and high-emphasis labels.
- **Ink Muted (`#a1a1aa`):** Secondary text, captions, and metadata.
- **Ink Subtle (`#818181`):** Tertiary text, placeholders, and disabled states.
- **Hairline (`#27272a`):** Borders, dividers, and structural rules.
- **Success (`#4ade80`):** Positive states and confirmation feedback.
- **Warning (`#fbbf24`):** Caution states and non-blocking alerts.
- **Error (`#f87171`):** Destructive actions and validation errors.

Do not invent decorative gradients or glow treatments unless the brand direction requires them and the purpose is written down.

## Typography

Display type is set in **Inter**; body and UI labels use **Inter**. The scale preset is **balanced**.

- **`display-xl`:** Inter at 64px, weight 700, line-height 1.05, tracking -0.03em.
- **`display-lg`:** Inter at 48px, weight 700, line-height 1.1, tracking -0.02em.
- **`display-md`:** Inter at 36px, weight 600, line-height 1.15, tracking -0.01em.
- **`headline`:** Inter at 28px, weight 600, line-height 1.25.
- **`body-lg`:** Inter at 18px, weight 400, line-height 1.5.
- **`body-md`:** Inter at 16px, weight 400, line-height 1.5.
- **`body-sm`:** Inter at 14px, weight 400, line-height 1.4.
- **`caption`:** Inter at 12px, weight 400, line-height 1.4.
- **`label-md`:** Inter at 13px, weight 600, line-height 1.3, tracking 0.04em.
- **`overline`:** Inter at 11px, weight 600, line-height 1.2, tracking 0.08em.
- **`button-md`:** Inter at 16px, weight 600, line-height 1.2.
- **`code-sm`:** JetBrains Mono at 13px, weight 400, line-height 1.5.

Pair display-weight headings with regular-weight body text. Avoid mixing more than two font weights on a single screen. Choose type for brand character, not because it is a default AI stack.

## Layout

The layout follows a **fixed-max-width grid** capped at 1200px with 24px gutters.

Section padding defaults to 64px vertical rhythm. Components are grouped using containment principles. Related items live inside cards with generous internal padding (`{spacing.xl}`) only when containment helps interaction or understanding.

RHYTHM is 2: keep a consistent system with a few deliberate breaks.

A strict **8px** spacing scale drives all margins, paddings, and gaps:

- `{spacing.xxs}`: 2px
- `{spacing.xs}`: 4px
- `{spacing.sm}`: 8px
- `{spacing.md}`: 16px
- `{spacing.lg}`: 24px
- `{spacing.xl}`: 32px
- `{spacing.2xl}`: 48px
- `{spacing.3xl}`: 64px

## Elevation & Depth

Depth is achieved through **tonal layers** rather than heavy shadows. The background uses `{colors.canvas-soft}`, while primary content sits on `{colors.canvas}` cards. Alternate section bands create rhythm without decorative effects.

## Shapes

The shape language is defined by **soft** corners. Modern softness: moderate radii (4–16px) that feel approachable without becoming playful.

Radius scale:

- `{rounded.none}`: 0px
- `{rounded.sm}`: 4px
- `{rounded.md}`: 8px
- `{rounded.lg}`: 12px
- `{rounded.xl}`: 16px
- `{rounded.pill}`: 9999px
- `{rounded.full}`: 9999px

Buttons use `{rounded.md}` corners. Do not make every element pill-shaped.

## Components

The following component tokens are defined for consistent styling. Reference them by name when building UI.

### `button-primary`

  - backgroundColor: `{colors.primary}`
  - textColor: `{colors.on-primary}`
  - typography: `{typography.button-md}`
  - rounded: `{rounded.md}`
  - padding: `{spacing.md} {spacing.xl}`

### `button-primary-hover`

  - backgroundColor: `{colors.primary-hover}`
  - textColor: `{colors.on-primary}`
  - typography: `{typography.button-md}`
  - rounded: `{rounded.md}`
  - padding: `{spacing.md} {spacing.xl}`

### `button-secondary`

  - backgroundColor: `{colors.canvas-soft}`
  - textColor: `{colors.ink}`
  - typography: `{typography.button-md}`
  - rounded: `{rounded.md}`
  - padding: `{spacing.md} {spacing.xl}`

### `button-tertiary`

  - backgroundColor: `{colors.canvas}`
  - textColor: `{colors.ink}`
  - borderColor: `{colors.hairline}`
  - typography: `{typography.button-md}`
  - rounded: `{rounded.md}`
  - padding: `{spacing.md} {spacing.xl}`

### `card-content`

  - backgroundColor: `{colors.canvas}`
  - textColor: `{colors.ink}`
  - typography: `{typography.body-md}`
  - rounded: `{rounded.lg}`
  - padding: `{spacing.xl}`

### `card-feature`

  - backgroundColor: `{colors.canvas-soft}`
  - textColor: `{colors.ink}`
  - typography: `{typography.body-md}`
  - rounded: `{rounded.lg}`
  - padding: `{spacing.xl}`

### `text-input`

  - backgroundColor: `{colors.canvas}`
  - textColor: `{colors.ink}`
  - borderColor: `{colors.hairline}`
  - typography: `{typography.body-md}`
  - rounded: `{rounded.md}`
  - padding: `{spacing.md} {spacing.lg}`

### `top-nav`

  - backgroundColor: `{colors.canvas}`
  - textColor: `{colors.ink}`
  - typography: `{typography.body-sm}`
  - padding: `{spacing.md} {spacing.xl}`
  - height: `56px`

### `nav-link`

  - textColor: `{colors.ink-muted}`
  - typography: `{typography.body-sm}`

### `footer`

  - backgroundColor: `{colors.canvas-soft}`
  - textColor: `{colors.ink-subtle}`
  - typography: `{typography.caption}`
  - padding: `{spacing.3xl} {spacing.xl}`

### `badge-success`

  - backgroundColor: `{colors.canvas-soft}`
  - textColor: `{colors.success}`
  - typography: `{typography.caption}`
  - rounded: `{rounded.pill}`
  - padding: `{spacing.xs} {spacing.md}`

### `badge-warning`

  - backgroundColor: `{colors.canvas-soft}`
  - textColor: `{colors.warning}`
  - typography: `{typography.caption}`
  - rounded: `{rounded.pill}`
  - padding: `{spacing.xs} {spacing.md}`

### `badge-error`

  - backgroundColor: `{colors.canvas-soft}`
  - textColor: `{colors.error}`
  - typography: `{typography.caption}`
  - rounded: `{rounded.pill}`
  - padding: `{spacing.xs} {spacing.md}`

## Do's and Don'ts

### Do

- Use `{colors.primary}` only for the single most important action per screen.
- Maintain WCAG AA contrast ratios (4.5:1 for normal text).
- Use the spacing scale consistently. Avoid arbitrary pixel values.
- Pair display weight headings with regular-weight body text.
- Keep color, typography, radius, and component tokens identical across auth, list, detail, and settings.
- Change layout and density per page job; do not invent a new visual brand per screen.
- Write a one-line purpose for every major visual technique (gradient, glow, glass, cards, badges, motion).
- Keep one deliberate accent moment per screen. Scarcity makes the accent land.
- Ship empty, loading, and error states for any view that shows data.
- Every interactive control must do something real, or be removed / labeled Coming soon.
- Meet WCAG AA contrast (4.5:1 normal text, 3:1 large text).
- Reserve the darkest canvas token as the anchor surface.
- Hold dials ENERGY 2 (Balanced), RHYTHM 2 (Mostly consistent), MOTION 1 (Hover only) across every page.

### Don't

- Don't use more than two font weights on a single screen.
- Don't mix rounded and sharp corners in the same view.
- Don't use the primary color as a large background fill.
- Don't introduce colors outside the defined palette.
- Don't force landing-page hero patterns onto auth, list, or settings screens.
- Don't use em dashes in UI or marketing copy.
- Don't invent statistics, testimonials, compliance claims, or customer logos.
- Don't default to blue-purple gradients, glow-everywhere, or glass on every surface.
- Don't ship Lucide-style icon rows or sparkle/magic icons as empty decoration.
- Don't use generic CTAs (Get Started, Learn More, Try Now, Explore, Discover) when a specific action exists.
- Don't clone Linear, Vercel, Stripe, or Notion visuals unless the brief explicitly asks for that reference.
- Don't build a hero as title + subtitle + two CTAs + feature card grid by default.
- Don't use pure #000000 as the canvas. Prefer a tinted dark surface.
- Don't add atmospheric gradients that compete with product content.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | 1280px | Default multi-column layout |
| Tablet | 1024px | Card grids reduce to 2 columns |
| Mobile | 768px | Single column; nav collapses to hamburger |
| Mobile-Sm | 480px | Display type scales down; touch targets grow |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Form inputs hold ≥44px tap target on touch devices.
- Navigation items hold ≥44px tap target when collapsed to mobile menu.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below tablet breakpoint.
- **Card grids**: multi-column layouts step down to single column on mobile.
- **Display type**: largest display steps scale down proportionally on small screens.

Mobile layout is part of the design, not an afterthought. No horizontal overflow, clipped cards, or unusable navbar.

## Iteration Guide

1. Read the **Design read** and **Surfaces** briefs before generating any screen.
2. Reuse the same color, type, radius, and component tokens on every surface.
3. Focus on ONE component at a time and reference it by its `components:` token name.
4. When introducing a section, decide first which surface and spacing tokens it uses, and write one line for why.
5. Default body text to `{typography.body-md}` at weight 400.
6. MOTION 1: hover/focus only. Do not add scroll choreography.
7. Run `npx @google/design.md lint DESIGN.md` after edits.
8. Add new variants as separate component entries (e.g. `button-primary-hover`).
9. Keep the primary accent scarce: one chromatic voice per screen.
10. Before delivery: verify keyboard focus, contrast, and empty/loading/error states.
