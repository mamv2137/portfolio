## 1. Tokens & Foundations

- [x] 1.1 Add `@fontsource-variable/jetbrains-mono` to `package.json` and import the variable file in `src/styles/globals.css`
- [x] 1.2 Define TUI CSS variables in `:root` and `.dark` blocks in `src/styles/globals.css` (bg, fg, muted, border, accent, success, warn, error, info, selection)
- [x] 1.3 Extend `tailwind.config.mjs` with `theme.extend.colors.tui.*` mapped to CSS vars and `fontFamily.mono` pointing at the JetBrains stack
- [x] 1.4 Add a global reduced-motion CSS guard (`@media (prefers-reduced-motion: reduce) ...`) and a `.motion-off` class with the same effect
- [x] 1.5 Verify dark/light contrast for every documented `fg-on-bg` pair meets AA (manual contrast checker pass, record values in design.md if any change)

## 2. State plumbing (theme + motion)

- [x] 2.1 Extend the inline script in `src/pages/index.astro` to also read/apply `localStorage["tui:motion"]` and toggle `.motion-off` on `<html>`
- [x] 2.2 Add a `MutationObserver`-driven persistence write for `tui:motion` mirroring the existing dark-mode pattern
- [x] 2.3 Create `src/lib/useMotion.ts` returning `"on" | "off"` from a combined `prefers-reduced-motion` + `localStorage["tui:motion"]` source

## 3. Content configs

- [x] 3.1 Create `src/content/profile.ts` exporting identity (user/host/path/clock), bio, skills (with proficiency 0..1), experience, projects, contact channels
- [x] 3.2 Create `src/content/boot.ts` exporting `BOOT_SCRIPT` (banner, lines pool, bars) typed as `BootStep[]`
- [x] 3.3 Create `src/content/activity.ts` exporting a pool of ~30 `tail -f` style lines

## 4. TUI widget primitives (`src/components/tui/`)

- [x] 4.1 `Block.astro` — bordered container with optional `title` (interrupted top border) and optional `hint` (bottom-right), corner glyphs via `::before/::after`
- [x] 4.2 `Panel.astro` — `Block` + `<section>` with heading semantics and a content slot
- [x] 4.3 `StatusBar.astro` — horizontal segment list with `│` dividers, accepts `segments: {label, value, tone?}[]`
- [x] 4.4 `KeyHint.astro` — renders `[ key ] label` with accent-colored brackets; supports chord (`Ctrl+K`)
- [x] 4.5 `Chip.astro` — inline `[ text ]` pill with `tone` variants
- [x] 4.6 `Tabs.tsx` — active label gets `[ ... ]` + `tui-accent`; emits change events; manages `aria-selected`
- [x] 4.7 `List.astro` + `ListItem.astro` — supports leading marker, selected state (`tui-selection` bg + `▸`), trailing meta; `aria-selected` on selected
- [x] 4.8 `Gauge.tsx` — clamped 0..1, label, tone variants; **must** support count-up + fill animation gated by `useMotion()`
- [x] 4.9 `Sparkline.tsx` — `variant: "bars" | "line"`, accepts series; optional `live` ticker (1.5–3s jitter) gated by `useMotion()` + IntersectionObserver pause
- [x] 4.10 `Caret.tsx` — CSS-only blink at ~1.06Hz, fixed when motion off
- [x] 4.11 `Typewriter.tsx` — types one char per 40–60ms; cycles strings (type→hold 2s→delete→next); shows full string when motion off; pauses on tab hidden
- [x] 4.12 Create a private `src/pages/_tui-preview.astro` route showing every widget in light + dark for manual QA (delete or keep gated before merge)

## 5. Dashboard composition

- [x] 5.1 Create `src/components/dashboard/HeaderBar.astro` — prompt (`user@host:path$`) + `Typewriter` tagline + live `Clock.tsx`
- [x] 5.2 Create `src/components/dashboard/Clock.tsx` — ticks every 1s, pauses on `visibilitychange`
- [x] 5.3 Create `src/components/dashboard/FooterStatusBar.astro` consuming `StatusBar` + theme/motion segments + `KeyHint`s
- [x] 5.4 Wire `t` keypress on the document to toggle theme (existing localStorage logic) — only when not inside a form/input
- [x] 5.5 Create panel components: `AboutPanel.astro`, `SkillsPanel.astro` (gauges), `ExperiencePanel.astro` (List, most recent selected), `ProjectsPanel.astro` (List + chips + external links), `ContactPanel.astro` (List with mailto + socials)
- [x] 5.6 Create `src/components/dashboard/ActivityFeed.tsx` — capped ring buffer of 8, 4–8s jittered interval, paused via IntersectionObserver + visibilitychange, static snapshot when motion off
- [x] 5.7 Create `src/components/dashboard/Dashboard.astro` orchestrating header / panel grid / footer; grid is 3-col ≥1024px, 2-col 640–1023px, 1-col <640px

## 6. Boot overlay

- [x] 6.1 Create `src/components/boot/BootOverlay.tsx` — fixed full-viewport, `aria-hidden`, `role="presentation"`
- [x] 6.2 Implement the reducer state machine: `banner → lines → bars → ready → dismissed`, consuming `BOOT_SCRIPT`
- [x] 6.3 Implement scroll-line appender (60–180ms cadence) and progress bars (filling to 100%)
- [x] 6.4 Implement skip handlers: `keydown` (any key) and `pointerdown` anywhere on the overlay
- [x] 6.5 On dismiss: set `sessionStorage["tui:booted"]="1"`, fade opacity 250ms, then unmount
- [x] 6.6 Reduced-motion / `motion=off` path: render final state for ≤400ms then dismiss
- [x] 6.7 `?noboot=1` URL flag short-circuits the overlay (treated as already booted)
- [x] 6.8 Mount `<BootOverlay client:load />` in `src/pages/index.astro` above the dashboard so the dashboard renders beneath

## 7. CRT overlay

- [x] 7.1 Create `src/components/tui/CrtOverlay.astro` — fixed, `pointer-events: none`, with scanline gradient and faint vignette
- [x] 7.2 Add a toggle in the status bar (key hint + click) — persists `tui:crt` in `localStorage`
- [x] 7.3 Disable flicker animation when motion is off (CSS guard + class)

## 8. Rewire entry & cleanup

- [x] 8.1 Replace `<Hero />` in `src/pages/index.astro` with `<Dashboard />` and `<BootOverlay client:load />`
- [x] 8.2 Delete `src/components/Hero.astro` and the stale comment inside it
- [x] 8.3 Update `<title>` and meta description in `src/layouts/Layout.astro` to match the new aesthetic
- [x] 8.4 Remove any references to the old hero from the codebase (grep `Hero` and `from '@/components/Hero'`)

## 9. Accessibility + verification

- [x] 9.1 Add `aria-hidden="true"` to every decorative glyph element (corner chars, dividers, gauge fill characters, sparkline characters)
- [x] 9.2 Confirm focus rings on all interactive elements use `tui-accent` and remain visible in both themes
- [x] 9.3 Run an axe / Lighthouse a11y pass on the rendered page; resolve any contrast or landmark issues
- [x] 9.4 Verify SSR: `view-source` on the built page contains real bio/skills/projects text (not just placeholders rendered by JS)
- [x] 9.5 Run with `prefers-reduced-motion: reduce` enabled in DevTools and confirm: no caret blink, no typewriter, no gauge count-up, no activity feed appends, no sparkline ticker, no CRT flicker, boot dismisses in ≤400ms

## 10. Build + smoke test

- [x] 10.1 `npm run build` succeeds with no type errors
- [x] 10.2 `npm run preview` — manually verify boot plays once per session, dashboard layout at 1440 / 900 / 600 / 375 widths
- [x] 10.3 Toggle theme via `t` key and via status bar — confirms persistence on reload
- [x] 10.4 Toggle motion off — confirms all ambient motion stops and reload preserves the choice
- [x] 10.5 Append `?noboot=1` — confirms boot is skipped

## 11. Multi-theme system (catppuccin · monokai · dracula · nord · tokyo-night)

- [x] 11.1 Refactor `globals.css` so the existing TUI vars live under `[data-theme="catppuccin"]` (default) for both `:root` and `.dark`
- [x] 11.2 Add palette blocks for `monokai`, `dracula`, `nord`, `tokyo-night` — each with `[data-theme="<name>"]` (light) and `[data-theme="<name>"].dark` (dark) variants, contrast-verified AA
- [x] 11.3 Extend the inline script in `src/pages/index.astro` to read/apply `localStorage["tui:theme"]` and set the `data-theme` attribute on `<html>` (default `"catppuccin"`)
- [x] 11.4 Extend the persistence `MutationObserver` to also write `data-theme` changes back to `localStorage["tui:theme"]`
- [x] 11.5 Create `src/lib/useTheme.ts` exporting `THEMES`, `useTheme()`, `setTheme()`, `cycleTheme()`
- [x] 11.6 Create `src/components/tui/ThemePicker.tsx` — small React island that shows current theme + cycles on click (used inside the status bar)
- [x] 11.7 Wire keyboard shortcut `]` to cycle to next theme and `[` to previous; lowercase `t` keeps toggling light/dark
- [x] 11.8 Add `theme:` segment + `[ ] ] theme` key hint to `FooterStatusBar`, clickable to cycle
- [x] 11.9 Smoke-test all themes in browser at desktop width (dark + light each) — verify no contrast regressions, no console errors
- [x] 11.10 Confirm reload preserves the chosen `data-theme` alongside `dark`/`motion-off`/`crt-on`

## 12. Language toggle (en · es)

- [x] 12.1 Extend the inline script in `src/pages/index.astro` to read `localStorage["tui:lang"]` (fallback to `navigator.language.startsWith('es') ? 'es' : 'en'`) and set `data-lang` on `<html>`; extend the `MutationObserver` to persist `data-lang` changes
- [x] 12.2 Add CSS rules in `globals.css` so `html[data-lang="en"] [data-lang="es"]` and `html[data-lang="es"] [data-lang="en"]` resolve to `display: none` (rendering dual + CSS hide pattern)
- [x] 12.3 Create `src/lib/useLang.ts` exporting `LANGS`, `useLang()`, `setLang()`, `toggleLang()`
- [x] 12.4 Create `src/components/tui/T.astro` and `src/components/tui/TR.tsx` — `<T en="..." es="..." />` renders both spans tagged with `data-lang`; React variant for islands that need strings (Typewriter)
- [x] 12.5 Refactor `src/content/profile.ts`: introduce `Localized = { en: string; es: string }` type; localize `bio.greeting`, `bio.subgreeting`, `bio.paragraph`, `bio.meta` labels/values, `bio.taglines`, `experience[].summary`, `projects[].blurb`
- [x] 12.6 Localize natural-language strings in `src/content/boot.ts` (banner second line, `ready.`, skip hint) — keep technical `[ OK ]` lines in English (terminal authenticity)
- [x] 12.7 Update Astro panels (`AboutPanel`, `ExperiencePanel`, `ProjectsPanel`) and `HeaderBar` to consume localized strings via `<T>`; update `Typewriter` to receive a `lang`-aware string set from `useLang()`
- [x] 12.8 Wire `l` keypress to toggle lang in `FooterStatusBar` script (no conflict: contact `key:'l'` is decorative); add `lang:` segment + `[ l ] lang` key hint, both clickable
- [x] 12.9 Build + browser smoke test: toggle lang, confirm all localized strings swap instantly, persistence on reload, no console errors, no layout shift

## 13. Identity tweaks (role, favicon, meta grid)

- [x] 13.1 Update `bio.meta` in `src/content/profile.ts`: `role` value EN `Frontend Developer` → `Software Engineer`, ES `Desarrollador Frontend` → `Ingeniero de Software`
- [x] 13.2 Replace `public/favicon.svg` with an on-brand TUI favicon (bordered box + `$` prompt + caret) using theme accent colors and a dark-mode media query
- [x] 13.3 Refactor the meta section in `AboutPanel.astro` from a single vertical list to a 2-column grid of mini bordered cards (label on top muted, value below in `fg`) — denser and more "card-like"
- [x] 13.4 Build + browser smoke test (en + es): confirm the role now reads `Software Engineer` / `Ingeniero de Software`, favicon renders in the browser tab, and the meta cards lay out 2×2 on desktop, 1-col on mobile

## 14. Idle tab title — terminal-style title cycling on blur

- [x] 14.1 Create `src/content/idle.ts` exporting `IDLE_TITLES: string[]` — ~12-18 terminal-style strings (e.g. `$ idle...`, `[ AFK ] zZz`, `$ tail -f activity.log`, `you closed the tab? :(`, etc.)
- [x] 14.2 Add a `<script>` block to `src/pages/index.astro` that: stores the original title, listens for `visibilitychange`, when hidden cycles random `IDLE_TITLES` every 2-4s (jittered); when visible restores the original title; gates on `html.motion-off` (no cycling if motion off)
- [x] 14.3 Build + browser smoke test: confirm `document.title` changes when tab is hidden and restores when visible; no console errors
