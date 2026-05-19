## ADDED Requirements

### Requirement: Dashboard layout

The portfolio home page SHALL render as a single-screen TUI dashboard composed of a header bar, a panel grid, and a footer status bar.

#### Scenario: Default desktop layout

- **WHEN** the page is viewed on a viewport ≥ 1024px wide
- **THEN** the layout SHALL show:
  - A top header bar with the site identity (e.g. `mauro@portfolio:~$`), a typewriter tagline, and a live clock
  - A panel grid containing at least: `About`, `Skills`, `Experience`, `Projects`, `Contact`
  - A bottom status bar with key hints and meta segments
- **AND** the panel grid SHALL use a two- or three-column arrangement that fills the viewport without horizontal scroll

#### Scenario: Tablet layout

- **WHEN** the viewport is between 640px and 1023px
- **THEN** the panel grid SHALL collapse to a two-column arrangement
- **AND** all panels SHALL remain visible without truncation of content

#### Scenario: Mobile layout

- **WHEN** the viewport is < 640px
- **THEN** panels SHALL stack vertically in a single column
- **AND** the header and status bar SHALL remain visible and pinned
- **AND** the status bar SHALL prioritize short hints (e.g. `[ ↓ ] scroll`) and may hide non-essential segments

### Requirement: Header bar

The header bar SHALL render the site identity, an animated tagline, and a live local clock.

#### Scenario: Identity prompt

- **WHEN** the dashboard mounts
- **THEN** the header SHALL show a prompt of the form `<user>@<host>:<path>$` in `tui-accent`, followed by a blinking caret
- **AND** the values SHALL be configurable via a single config object (no hard-coded strings scattered across files)

#### Scenario: Live clock

- **WHEN** the dashboard is mounted
- **THEN** a clock segment SHALL display the current local time (HH:MM:SS, 24h) and update at least every second
- **AND** the clock SHALL pause updates when the tab is not visible (per `document.visibilityState`)

### Requirement: Panel content contracts

Each dashboard panel SHALL have a defined content contract so the layout stays cohesive.

#### Scenario: About panel

- **WHEN** the `About` panel renders
- **THEN** it SHALL contain a short bio paragraph, the existing avatar, and a list of meta items (location, role, years of experience) rendered as a `List`

#### Scenario: Skills panel

- **WHEN** the `Skills` panel renders
- **THEN** it SHALL render skills as `Gauge` widgets (one per skill, each with a label and a 0..1 proficiency value) OR as a grid of `Chip` widgets — chosen consistently across the panel

#### Scenario: Experience panel

- **WHEN** the `Experience` panel renders
- **THEN** it SHALL render entries as a `List` of `{ company, role, range, summary }`
- **AND** the most recent entry SHALL be selected by default

#### Scenario: Projects panel

- **WHEN** the `Projects` panel renders
- **THEN** it SHALL render projects as a `List` with title, stack chips, and an external link
- **AND** each item's external link SHALL be a real `<a>` with `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: Contact panel

- **WHEN** the `Contact` panel renders
- **THEN** it SHALL display contact channels (email, GitHub, LinkedIn) as a `List` with `KeyHint`-styled triggers
- **AND** the email value SHALL be a real `mailto:` link

### Requirement: Status bar segments

The footer status bar SHALL surface site-wide meta and key hints.

#### Scenario: Default segments

- **WHEN** the dashboard renders on desktop
- **THEN** the status bar SHALL show segments for: theme (`◐ dark` / `◑ light`), git-branch-style label (e.g. ` main`), build/version label, and key hints (`[ t ] theme`, `[ ? ] help`)

#### Scenario: Theme toggle hint

- **WHEN** the user presses `t` while the dashboard has focus
- **THEN** the theme SHALL toggle between light and dark
- **AND** the status bar segment SHALL update to reflect the new theme

### Requirement: CRT/scanline layer

The dashboard SHALL optionally apply a CRT-style overlay (subtle scanlines, faint vignette, optional flicker).

#### Scenario: Toggle CRT layer

- **WHEN** the user activates the CRT toggle (key hint or status-bar control)
- **THEN** a fixed-position overlay SHALL be added above the dashboard with `pointer-events: none`
- **AND** the preference SHALL persist in `localStorage`

#### Scenario: Reduced motion disables flicker

- **WHEN** the user's OS reports `prefers-reduced-motion: reduce`
- **THEN** the CRT overlay (if enabled) SHALL render as a static texture without flicker animation
