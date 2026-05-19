## ADDED Requirements

### Requirement: Blinking caret

The system SHALL render a blinking block caret (`▌` or `█`) next to designated text endpoints (e.g. header prompt, end of typewriter).

#### Scenario: Blink rate

- **WHEN** a caret is rendered with default props
- **THEN** it SHALL toggle visibility at ~1.06Hz (≈ 530ms on, 530ms off)
- **AND** the toggle SHALL be driven by CSS animation, not JavaScript timers

#### Scenario: Caret pauses with reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** the caret SHALL render in its visible state and NOT animate

### Requirement: Typewriter text

The system SHALL provide a typewriter effect that reveals a string one character at a time.

#### Scenario: Header tagline types in

- **WHEN** the dashboard mounts after the boot overlay dismisses
- **THEN** the header tagline SHALL type in at ~40–60ms per character
- **AND** the trailing caret SHALL remain attached to the last typed character until the line completes

#### Scenario: Cycling taglines

- **WHEN** the header tagline component is given multiple strings
- **THEN** it SHALL cycle through them: type → hold 2s → delete → next
- **AND** the cycle SHALL pause when the tab is hidden

#### Scenario: Reduced motion shows full text

- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** the typewriter SHALL render the final string immediately and not cycle

### Requirement: Gauge tick

Skills/usage gauges in the dashboard SHALL gently animate their fill on mount and on viewport reveal.

#### Scenario: Mount-in animation

- **WHEN** a `Gauge` enters the viewport for the first time
- **THEN** its fill SHALL animate from 0 to its target value over 600–900ms with an ease-out curve
- **AND** the displayed percentage label SHALL count up in step with the fill

#### Scenario: Reduced motion fixes final state

- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** gauges SHALL render at their target value with no count-up

### Requirement: Activity feed

The dashboard SHALL include a `tail -f`-style activity feed panel that appends synthetic log lines on a slow interval.

#### Scenario: Append cadence

- **WHEN** the activity feed is mounted
- **THEN** a new line SHALL be appended every 4–8 seconds (jittered) from a curated pool (e.g. `pushed to main`, `closed PR #42`, `coffee.refill OK`)
- **AND** the feed SHALL keep at most the last 8 lines visible (older lines scroll out)

#### Scenario: Pauses off-screen and off-tab

- **WHEN** the feed is not in the viewport OR the tab is hidden
- **THEN** the append interval SHALL pause
- **AND** SHALL resume when visibility returns

#### Scenario: Reduced motion shows static snapshot

- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** the activity feed SHALL render a fixed snapshot (e.g. last 5 lines) and SHALL NOT append new lines

### Requirement: Sparkline tick

Sparkline widgets used as decorative status (e.g. CPU/coffee/commits) SHALL update their series on a slow interval.

#### Scenario: Update cadence

- **WHEN** a `Sparkline` has `live={true}`
- **THEN** it SHALL shift in a new random value within a configured range every 1.5–3 seconds
- **AND** SHALL animate the transition smoothly (no hard jumps)

#### Scenario: Reduced motion stops the ticker

- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** live sparklines SHALL hold their initial series and NOT update

### Requirement: Global animation kill-switch

The system SHALL expose a single mechanism to disable all ambient animations regardless of OS preference.

#### Scenario: User toggles motion via UI

- **WHEN** the user activates an "animations: off" control (status bar or settings panel)
- **THEN** all ambient animations (caret, typewriter, gauge tick, activity feed, sparkline tick, CRT flicker) SHALL stop
- **AND** the preference SHALL persist in `localStorage` under `tui:motion`

#### Scenario: Preference precedence

- **WHEN** either `localStorage["tui:motion"] === "off"` OR `prefers-reduced-motion: reduce` is set
- **THEN** ambient animations SHALL be disabled
- **AND** the UI SHALL surface this state in the status bar
