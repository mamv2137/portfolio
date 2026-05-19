## ADDED Requirements

### Requirement: Design tokens

The system SHALL expose a single source of truth for TUI design tokens covering color, typography, spacing, and border styles, consumable from both Tailwind config and CSS variables.

#### Scenario: Palette covers ANSI-style roles

- **WHEN** a developer references a color token (e.g. `tui-bg`, `tui-fg`, `tui-accent`, `tui-success`, `tui-warn`, `tui-error`, `tui-muted`, `tui-selection`)
- **THEN** the token SHALL resolve to a value evoking a classic terminal ANSI palette
- **AND** every foreground/background pair documented as "text on background" SHALL meet WCAG AA contrast (≥ 4.5:1 for body text)

#### Scenario: Typography is monospace-first

- **WHEN** any TUI widget renders text
- **THEN** the default font family SHALL be a loaded monospace face (e.g. JetBrains Mono / IBM Plex Mono)
- **AND** the type scale SHALL provide at minimum `xs`, `sm`, `base`, `lg` sizes with a fixed line-height tuned to the grid

#### Scenario: Tokens drive both light and dark themes

- **WHEN** the user toggles between light and dark mode
- **THEN** every TUI token SHALL have a defined value in both themes
- **AND** widget borders, fills, and text SHALL remain visible and AA-contrasting in both

### Requirement: Block widget

The system SHALL provide a `Block` primitive — a bordered container with an optional title and optional bottom-right hint — that is the visual base for every other widget.

#### Scenario: Border style

- **WHEN** a `Block` renders with default props
- **THEN** it SHALL display a single-line box-drawing border (using CSS borders or `┌─┐│└┘` characters) around its children
- **AND** the border color SHALL come from the `tui-border` token

#### Scenario: Titled block

- **WHEN** a `Block` is given a `title` prop
- **THEN** the title SHALL render inline on the top border, aligned start, with the border interrupted around the text
- **AND** the title SHALL use the `tui-accent` color

#### Scenario: Block hint

- **WHEN** a `Block` is given a `hint` prop (e.g. `"[ q ] quit"`)
- **THEN** the hint SHALL render inline on the bottom border, aligned end, in `tui-muted` color

### Requirement: Status bar

The system SHALL provide a `StatusBar` primitive — a horizontal strip displaying key/value segments, typically docked top or bottom of a layout.

#### Scenario: Segment rendering

- **WHEN** a `StatusBar` receives a list of `{label, value, tone?}` segments
- **THEN** each segment SHALL render as `label: value`, separated by a visible divider (e.g. `│`)
- **AND** when `tone` is `success | warn | error | info`, the value SHALL adopt the corresponding token color

### Requirement: Key hint

The system SHALL provide a `KeyHint` primitive that renders one or more keyboard hints in the form `[ key ] label`.

#### Scenario: Single hint

- **WHEN** `KeyHint` receives `keys=["q"]` and `label="quit"`
- **THEN** it SHALL render `[ q ] quit` with the key bracket in `tui-accent` and the label in default foreground

#### Scenario: Chord hint

- **WHEN** `KeyHint` receives `keys=["Ctrl","K"]`
- **THEN** it SHALL render `[ Ctrl+K ]` as one bracketed group

### Requirement: Gauge widget

The system SHALL provide a `Gauge` primitive that renders a horizontal progress bar with a labeled percentage.

#### Scenario: Percentage rendering

- **WHEN** `Gauge` receives `value=0.62` (clamped to 0..1)
- **THEN** it SHALL render a filled bar covering 62% of its width using block characters (`█▉▊▋▌▍▎▏`) or a CSS fill
- **AND** display the label `62%` aligned to the bar

#### Scenario: Toned gauge

- **WHEN** `Gauge` receives `tone="success" | "warn" | "error"`
- **THEN** the filled portion SHALL adopt the corresponding token color

### Requirement: Sparkline widget

The system SHALL provide a `Sparkline` primitive that renders a compact bar/line chart from a numeric series.

#### Scenario: Bar sparkline

- **WHEN** `Sparkline` receives `data=[3,1,4,1,5,9,2,6]` with `variant="bars"`
- **THEN** it SHALL render the series as block bars (`▁▂▃▄▅▆▇█`) scaled to the data's max
- **AND** the rendering SHALL fit within the parent without overflow

### Requirement: List widget

The system SHALL provide a `List` primitive that renders an ordered set of rows with optional leading marker, optional selected state, and trailing meta.

#### Scenario: Selected row

- **WHEN** a row in `List` is marked selected
- **THEN** the row background SHALL use `tui-selection` and the leading marker SHALL be `▸` (or `>`)
- **AND** the selected state SHALL be exposed as `aria-selected="true"`

### Requirement: Tabs widget

The system SHALL provide a `Tabs` primitive that renders a row of section labels with one active label visually highlighted in the TUI style.

#### Scenario: Active tab

- **WHEN** one tab is active
- **THEN** that tab's label SHALL be wrapped in brackets `[ active ]` and use `tui-accent`
- **AND** inactive tabs SHALL be plain `tui-fg`

### Requirement: Chip widget

The system SHALL provide a `Chip` primitive — a small inline pill used for tags (skills, tech, status).

#### Scenario: Default chip

- **WHEN** `Chip` renders with text content
- **THEN** it SHALL render as `[ text ]` or as a bordered inline span using `tui-border` and `tui-muted` text
- **AND** SHALL accept a `tone` prop matching the palette roles

### Requirement: Accessibility floor

The system SHALL preserve real semantic HTML and accessibility even though the visual style is decorative ASCII.

#### Scenario: Decorative characters are hidden from assistive tech

- **WHEN** any widget uses purely decorative box-drawing characters in its DOM (corners, dividers)
- **THEN** those characters SHALL be marked `aria-hidden="true"`
- **AND** the underlying content (titles, items, values) SHALL remain in real heading, list, or paragraph elements

#### Scenario: Focus visible

- **WHEN** an interactive widget (link in `List`, tab in `Tabs`, button-styled `KeyHint`) receives keyboard focus
- **THEN** a visible focus ring using `tui-accent` SHALL be shown that does not rely on color alone
