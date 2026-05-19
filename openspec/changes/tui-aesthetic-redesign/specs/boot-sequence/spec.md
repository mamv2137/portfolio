## ADDED Requirements

### Requirement: One-shot boot overlay

The site SHALL display a "boot / resource-loading" overlay on first visit per session, occupying the full viewport, before revealing the dashboard.

#### Scenario: Plays on first navigation

- **WHEN** the user lands on the site and `sessionStorage` does not have `tui:booted=1`
- **THEN** a full-viewport overlay SHALL render above the dashboard with a black/`tui-bg` background
- **AND** the overlay SHALL play the boot animation defined below

#### Scenario: Skipped on subsequent navigations within a session

- **WHEN** `sessionStorage["tui:booted"]` equals `"1"`
- **THEN** the boot overlay SHALL NOT render
- **AND** the dashboard SHALL be visible immediately on first paint

#### Scenario: Mark booted after completion

- **WHEN** the boot animation completes (or is skipped)
- **THEN** `sessionStorage["tui:booted"]` SHALL be set to `"1"`

### Requirement: Boot animation script

The boot overlay SHALL run a deterministic, scripted sequence that resembles a terminal loading resources.

#### Scenario: Sequence structure

- **WHEN** the boot overlay starts
- **THEN** it SHALL play, in order:
  1. A version banner (`MAURO OS v1.0.0 — booting...`)
  2. A series of scrolling status lines of the form `[ OK ] <task>` (e.g. `mounting /home`, `loading skills.db`, `connecting to github.com`, `compiling experience.tsx`) — between 6 and 12 lines, appended one at a time with 60–180ms between lines
  3. One or more progress bars filling to 100%, each labeled (e.g. `assets`, `fonts`, `links`)
  4. A final `ready.` line followed by the overlay fading out to reveal the dashboard

#### Scenario: Total duration cap

- **WHEN** the boot animation runs at default speed
- **THEN** the total runtime SHALL be ≤ 3500ms from first frame to overlay dismissal
- **AND** SHALL be ≥ 1500ms so the effect is perceivable

#### Scenario: Failure-tolerant scripting

- **WHEN** the boot script references a unit (e.g. fetching a font) that is asynchronous
- **THEN** the script SHALL NOT block on the real network — it SHALL simulate progress on a timer
- **AND** real font/asset loading SHALL happen in parallel under the overlay

### Requirement: Skip and reduced motion

The boot overlay SHALL be dismissible and SHALL respect user motion preferences.

#### Scenario: Manual skip

- **WHEN** the overlay is visible and the user presses any key, clicks, or taps
- **THEN** the overlay SHALL immediately fade out
- **AND** `sessionStorage["tui:booted"]` SHALL be set
- **AND** a `KeyHint` (`[ press any key to skip ]`) SHALL be visible near the bottom of the overlay throughout playback

#### Scenario: Reduced motion bypass

- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** the boot overlay SHALL render only the final state (banner + `ready.` line) for ≤ 400ms and then dismiss
- **AND** no scrolling, no progress filling, no flicker SHALL occur

### Requirement: Non-blocking rendering

The boot overlay SHALL NOT delay the underlying dashboard's first paint or hydration.

#### Scenario: Dashboard renders beneath overlay

- **WHEN** the overlay is visible
- **THEN** the dashboard DOM SHALL already be mounted and styled beneath it
- **AND** dismissing the overlay SHALL NOT trigger a re-render of the dashboard tree

#### Scenario: Hidden from screen readers

- **WHEN** the overlay is mounted
- **THEN** it SHALL carry `aria-hidden="true"` and `role="presentation"`
- **AND** focus SHALL remain on the document body so a screen reader user is never trapped in the animation
