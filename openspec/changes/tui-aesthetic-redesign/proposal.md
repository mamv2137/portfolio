## Why

The portfolio is a generic minimal hero on a single page — it doesn't reflect the owner's frontend craft or have a memorable personality. Reskinning it with a TUI (terminal user interface) aesthetic — bordered "widgets," monospace type, status bars, gauges, sparklines, keyboard hints — borrows the visual language of tools like `ratatui`, `btop`, `lazygit`, and `k9s` to make the site feel handcrafted by a developer for developers, while still being a real responsive web site (not an emulated terminal).

## What Changes

- Add a TUI design system: a token set (mono fonts, ANSI-style palette, fixed character grid), and a set of "widget" primitives (`Block`, `Panel`, `Gauge`, `Sparkline`, `List`, `Tabs`, `StatusBar`, `KeyHint`, `Chip`) rendered as Tailwind/React components — visual only, not interactive emulation.
- Replace the current `Hero.astro` with a TUI layout: header bar, two-column dashboard of bordered panels (About, Skills, Experience, Contact), and a bottom status bar with key hints.
- Add a "boot / resource-loading" intro animation that runs once per session: scrolling lines (`[ OK ] mounting filesystem...`, progress bars filling, version banner), then reveals the dashboard. Skippable via key / click / `prefers-reduced-motion`.
- Add ambient micro-animations: blinking caret, typewriter text in the header, value tickers on gauges/sparklines, a `tail -f`-style activity feed.
- Add a CRT/scanline visual layer (subtle, toggleable).
- Keep current stack (Astro 5, React 19, Tailwind, shadcn). No new heavy dependencies beyond optional `motion`/`framer-motion` for sequenced animations.
- **BREAKING** for the current `Hero` component — it will be removed and replaced by the dashboard composition.

## Capabilities

### New Capabilities
- `tui-design-system`: design tokens (palette, type scale, spacing, borders) and base widget primitives that compose the terminal look.
- `tui-dashboard`: page-level composition of the portfolio as a multi-panel dashboard, including the responsive layout rules and panel content contracts.
- `boot-sequence`: the one-shot loading animation that plays before the dashboard appears, including skip and reduced-motion behavior.
- `ambient-animations`: ongoing micro-animations (caret blink, typewriter, gauge tick, activity feed) that keep the UI feeling alive after boot.

### Modified Capabilities
<!-- No existing specs in openspec/specs/ — nothing to modify. -->

## Impact

- **Code**: `src/components/Hero.astro` is removed; new components added under `src/components/tui/` (primitives) and `src/components/dashboard/` (compositions). `src/pages/index.astro` is rewired to render the new dashboard with the boot overlay. `src/styles/globals.css` gains TUI tokens.
- **Dependencies**: adds `motion` (or keeps animations CSS-only — decided in design.md). No removals.
- **Assets**: adds a monospace font (e.g., JetBrains Mono / IBM Plex Mono) via `@fontsource` or a CDN link.
- **Performance**: boot animation must not block first paint of the dashboard — it overlays the rendered DOM and dismisses. Respect `prefers-reduced-motion`.
- **Accessibility**: monospace + ANSI palette must still meet WCAG AA contrast; widgets carry real semantic HTML (`section`, `h2`, lists), not ASCII art.
