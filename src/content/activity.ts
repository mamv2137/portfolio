export type ActivityKind = 'commit' | 'pr' | 'deploy' | 'log' | 'note';

export type ActivityLine = {
  kind: ActivityKind;
  text: string;
};

export const ACTIVITY_POOL: ActivityLine[] = [
  { kind: 'commit', text: 'commit 9f3a21c · refactor: split Dashboard.astro' },
  { kind: 'commit', text: 'commit 4b88e0a · feat(tui): add Sparkline live ticker' },
  { kind: 'commit', text: 'commit 1c0d77b · fix(a11y): aria-hidden on corner glyphs' },
  { kind: 'commit', text: 'commit 7e5fa12 · chore(deps): bump astro 5.1.2 → 5.2.0' },
  { kind: 'commit', text: 'commit d20a994 · docs: update README with TUI notes' },
  { kind: 'pr', text: 'pr #42 · merge tui-aesthetic-redesign into main' },
  { kind: 'pr', text: 'pr #41 · review left on @teammate/feature-x' },
  { kind: 'pr', text: 'pr #39 · closed (superseded by #42)' },
  { kind: 'deploy', text: 'deploy · main → production · 200 OK' },
  { kind: 'deploy', text: 'deploy · preview · pr-42 · 200 OK' },
  { kind: 'log', text: 'GET /api/skills 200 · 14ms' },
  { kind: 'log', text: 'GET /api/projects 200 · 22ms' },
  { kind: 'log', text: 'GET /favicon.svg 304 · 3ms' },
  { kind: 'log', text: 'WebSocket /ws connected · sid=4f1' },
  { kind: 'log', text: 'cron · nightly-backup · started' },
  { kind: 'log', text: 'cron · nightly-backup · done in 4.2s' },
  { kind: 'log', text: 'cache hit ratio · 0.94' },
  { kind: 'log', text: 'lint · 0 errors · 2 warnings' },
  { kind: 'log', text: 'test · 142 passed · 0 failed' },
  { kind: 'log', text: 'typecheck · 0 errors' },
  { kind: 'log', text: 'bundle · gzip 38.4 kB · -1.2 kB' },
  { kind: 'note', text: 'coffee.refill OK' },
  { kind: 'note', text: 'music · synthwave radio · playing' },
  { kind: 'note', text: 'focus.mode → deep work · 25:00' },
  { kind: 'note', text: 'note: ship the design-system update' },
  { kind: 'note', text: 'note: review docs PR before EOD' },
  { kind: 'note', text: 'note: prep talk for next meetup' },
  { kind: 'note', text: 'inbox · 0 unread · zen' },
  { kind: 'note', text: 'wifi · 142 Mbps · OK' },
  { kind: 'note', text: 'battery · 87% · 4h 12m' },
];
