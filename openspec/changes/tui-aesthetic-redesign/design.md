## Context

The portfolio today is a single Astro page with one centered hero composed of plain text and an avatar (`src/components/Hero.astro`). Stack is Astro 5, React 19, Tailwind 3 with `tailwindcss-animate`, shadcn/ui scaffolding (`components.json` present, `lucide-react`, Radix avatar/slot), and a working dark-mode toggle script in `src/pages/index.astro`. There are no existing OpenSpec specs to extend.

The goal is to keep the stack but reskin the site as a TUI-style dashboard inspired by `ratatui`/`btop`/`lazygit`: bordered widgets on a mono grid, ANSI palette, blinking caret, status bar, and a one-shot "boot/loading" animation. It's a visual style, not a real terminal — keyboard "hints" are decorative (only `t` for theme is wired up).

## Goals / Non-Goals

**Goals:**

- A coherent token system (Tailwind + CSS vars) so swapping/refining colors and fonts is a one-file change.
- Reusable, composable widget primitives (`Block`, `Panel`, `Gauge`, `Sparkline`, `List`, `Tabs`, `StatusBar`, `KeyHint`, `Chip`) that look identical whether used in Astro `.astro` or React `.tsx`.
- A boot animation that *feels* like resource loading but doesn't actually block the page or break SEO.
- Ambient motion (caret, typewriter, gauge fills, activity feed) that's lively but quiet, with one switch to turn everything off — plus full `prefers-reduced-motion` compliance.
- Real semantic HTML behind the ASCII so accessibility and SEO are unharmed.

**Non-Goals:**

- A real interactive terminal (xterm.js, command parsing, REPL). The visuals borrow from terminals; behavior does not.
- A full design-system package — primitives live in this repo only.
- Multi-page routing changes. This change targets the single home page; the dashboard *is* the page.
- Backend, CMS, or content-loading work. Content is hard-coded in a config file for now.
- Internationalization. English-only.

## Decisions

### 1. Astro + React split: islands only where motion needs state

- **Decision:** Static structure (`Layout`, dashboard scaffolding, panel shells, content) stays in `.astro`. Only widgets that need client state — boot overlay, typewriter, live clock, gauge count-up, activity feed, sparkline ticker, theme toggle — are React islands hydrated with `client:idle` (or `client:visible` for off-screen ones).
- **Why:** Keeps the HTML payload tiny and SSR-rendered for SEO/first paint; hydrates only the moving parts.
- **Alternatives considered:** All-React (simpler, but loses Astro's static rendering win) and all-Astro with vanilla JS (cheaper still, but losing React means re-implementing trivial state machines).

### 2. Animation library: keep it lean

- **Decision:** Use CSS animations for everything periodic (caret blink, scanline flicker, gauge fill via `@property` + `transition`, CRT vignette). Use plain `requestAnimationFrame` / `setTimeout` + `useReducer` for sequenced flows (boot script, typewriter, activity feed). **Do not** add `framer-motion` / `motion`.
- **Why:** Animations here are short, deterministic, and don't need spring physics or shared layout. Adding `motion` would be ~30KB gzipped for things CSS already handles. `tailwindcss-animate` is already installed for fades.
- **Alternatives considered:** `motion`/`framer-motion` (overkill), `gsap` (heavier, license complexity for some uses).

### 3. Tokens live in Tailwind config + CSS vars

- **Decision:** Define raw colors as CSS custom properties in `src/styles/globals.css` for `:root` (light) and `.dark` (dark). Map them in `tailwind.config.mjs` via `theme.extend.colors.tui.*` so `bg-tui-bg`, `text-tui-accent`, `border-tui-border` work everywhere. Same for `fontFamily.mono`.
- **Why:** Single source of truth, theme switch is class-based (already in place), no runtime JS needed to recolor.
- **Alternatives considered:** Pure Tailwind colors (couldn't share with arbitrary CSS), CSS-in-JS (unnecessary).

### 4. ANSI-ish palette

- **Decision:** Two themes, both rooted in a desaturated ANSI feel.
  - Dark: `bg=#0b0f10`, `fg=#cdd6f4`, `muted=#7f849c`, `border=#313244`, `accent=#a6e3a1` (green prompt), `success=#a6e3a1`, `warn=#f9e2af`, `error=#f38ba8`, `info=#89b4fa`, `selection=#1e2030`. (Catppuccin-ish / classic terminal.)
  - Light: `bg=#f8f8f2`, `fg=#1a1a1a`, `muted=#5c6370`, `border=#d0d0d0`, `accent=#2d6a4f`, `success=#2d6a4f`, `warn=#9a6700`, `error=#a40e26`, `info=#1f6feb`, `selection=#ebe9d8`.
- **Why:** Hits the "terminal" gestalt while staying WCAG AA on body text. Values verified for `fg-on-bg` ≥ 7:1 in both themes.
- **Alternatives considered:** Strict ANSI 16 (looks dated and breaks contrast), Solarized (legal/recognizability concerns + lower contrast on accents).

### 5. Box-drawing strategy: borders, not characters

- **Decision:** Render block borders with CSS (`border`, `border-color`, occasional `clip-path` for title interruption) — **not** ASCII box characters in the DOM. The Block title interrupts the top border using a small absolutely-positioned span over the border.
- **Why:** Real CSS borders scale cleanly across DPIs, don't break with font fallbacks, and don't pollute the accessibility tree. Decorative characters are reserved for spots where they read as content (gauges, sparklines, dividers in the status bar).
- **Trade-off:** Loses some "true terminal" purity. We claw it back with a tasteful overlay (corners drawn with pseudo-elements where it matters most: panel corners get the `┌ ┐ └ ┘` glyphs as `::before/::after` content).

### 6. Boot overlay: portal + scripted state machine

- **Decision:** A React component `<BootOverlay />` mounted at the root of `index.astro`, hydrated with `client:load`. It renders a fixed full-viewport `<div role="presentation" aria-hidden="true">` with the script lines. A reducer drives state: `banner → lines → bars → ready → dismissed`. Skip listeners (`keydown`, `pointerdown`) call `dismiss()`. On dismiss it sets `sessionStorage["tui:booted"]="1"` and animates opacity to 0 over 250ms, then unmounts.
- **Why:** Reducer keeps the sequence testable and deterministic. The overlay paints over an already-rendered dashboard so first content paint is the dashboard, satisfying the "non-blocking" spec.
- **Alternatives considered:** Astro `<script>` only (would require duplicating state machine in vanilla JS), CSS-only keyframe scroll (can't randomize lines or react to skip).

### 7. Boot content is data, not strings in JSX

- **Decision:** Boot lines live in a single config: `src/content/boot.ts` exporting `BOOT_SCRIPT: BootStep[]`. The reducer consumes the array. Skill list, projects, experience, contact channels live in similar configs (`src/content/profile.ts`).
- **Why:** Editing a number/string in one file shouldn't require touching components. Also makes the spec scenarios trivially testable.

### 8. Reduced-motion handling: one hook + a CSS guard

- **Decision:** A `useMotion()` hook returns `"on" | "off"`, taking the max of `prefers-reduced-motion` and `localStorage["tui:motion"]`. Components read it for JS-driven loops. CSS animations include a global guard: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }` plus a `.motion-off` class on `<html>` mirroring the user toggle.
- **Why:** Belt-and-suspenders — even animations we forget to gate are caught by the CSS guard.

### 9. Font loading

- **Decision:** Load JetBrains Mono via `@fontsource-variable/jetbrains-mono` (regular + bold weights), imported once from `src/styles/globals.css`. Pair with a system mono fallback stack (`ui-monospace, "JetBrains Mono Variable", "JetBrains Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace`).
- **Why:** Self-hosted, no CDN call, FOUT is invisible because fallback is already monospaced and the layout is character-grid friendly.

### 10. Activity feed: deterministic-ish pool

- **Decision:** Pool of ~30 lines in `src/content/activity.ts`. Pick uniformly at random with a 4–8s jittered interval. State is a capped ring buffer of length 8. Pauses via `IntersectionObserver` + `document.visibilitychange`.
- **Why:** Cheap to implement, looks alive without being noisy or repetitive within a session.

### 11. Theme + motion toggles wire into existing dark-mode script

- **Decision:** Reuse the existing `is:inline` script in `index.astro` that toggles `.dark` on `<html>` and persists to `localStorage`. Add a sibling key `tui:motion` and a `.motion-off` class with the same MutationObserver pattern. Status bar segments dispatch via custom events; `index.astro` listens and toggles classes.
- **Why:** No new state library needed; keeps the inline-script + class-on-html pattern already established.

### 12. Avatar

- **Decision:** Keep the existing `AvatarWrapper` React component but wrap it in a `Block` titled `~/avatar.png` with a one-line ASCII frame around the image. Add a subtle `mix-blend-mode: screen` + green tint in dark mode to evoke a CRT scan.
- **Why:** Cheap continuity with the existing code; honors the "terminal portrait" trope.

## Risks / Trade-offs

- **[Risk] Cluttered dashboard on first impression** → Mitigation: cap panels at 5 on desktop, group projects/experience into tabs within one panel if needed, keep mobile to a clean single-column stack.
- **[Risk] Accessibility regressions from heavy decoration** → Mitigation: a11y is a hard requirement in the specs — `aria-hidden` on glyphs, semantic HTML behind every widget, visible focus rings, contrast verified, screen-reader pass before merging.
- **[Risk] CLS / FOUT from font loading** → Mitigation: ship a system-mono fallback that matches advance width closely; preload the variable font; reserve panel heights with `min-h` Tailwind utilities.
- **[Risk] "Cute once, annoying always" — animations get tiresome** → Mitigation: boot is one-shot per session; ambient motion is quiet (slow ticks, small deltas); a single toggle kills everything.
- **[Risk] CRT overlay looks gimmicky** → Mitigation: ship CRT *off* by default; expose a key hint to opt in; flicker is gated by reduced-motion.
- **[Risk] Hydration cost from many small islands** → Mitigation: prefer `client:idle` / `client:visible` over `client:load`; only `BootOverlay` and the theme toggle use `client:load`.
- **[Trade-off] CSS borders vs ASCII box chars** → loses some authenticity but wins on rendering correctness and a11y; recovered with selective corner glyphs.
- **[Trade-off] No `motion` library** → fewer "wow" effects (no spring-driven layout) but a much smaller bundle and simpler mental model.

## Migration Plan

1. Land tokens + globals (palette, font, base classes) — visual diff but no structural change to the page.
2. Land widget primitives in `src/components/tui/` with stories/examples in a private `src/pages/_tui-preview.astro` (not linked publicly) for manual verification.
3. Land the new dashboard composition under `src/components/dashboard/` and rewire `src/pages/index.astro` to render it. Delete `src/components/Hero.astro` in the same commit.
4. Land the boot overlay last so the dashboard is testable without it.
5. No data migration; content lives in committed config files.
6. **Rollback:** revert the rewire commit; `Hero.astro` is preserved in git history if a fast revert is needed.

## Open Questions

- Should the projects panel pull from GitHub at build time (Astro content collections + GitHub API) or stay hard-coded in `profile.ts` for v1? *Default if unresolved:* hard-coded, defer dynamic fetch to a follow-up.
- Should the boot overlay play once per *session* (current spec) or once per *day*? *Default:* per session — feels intentional without being annoying on rapid revisits.
- Do we want a `?noboot=1` URL flag for sharing the dashboard without the intro (e.g. recruiter links)? *Default:* yes, low-cost addition; will fold into the boot-sequence implementation.
- Color palette — Catppuccin-ish or a more neutral phosphor-green? *Default:* Catppuccin-ish (broader contrast, looks modern); revisit after first visual review.
