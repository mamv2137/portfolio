import type { Localized } from '@/lib/useLang';

export type BootLine = {
  tag: 'OK' | 'INFO' | 'WARN';
  text: string;
};

export type BootBar = {
  label: string;
  durationMs: number;
};

export type BootScript = {
  banner: Localized[];
  lines: BootLine[];
  bars: BootBar[];
  ready: Localized;
  skipHint: Localized;
};

export const BOOT_SCRIPT: BootScript = {
  banner: [
    {
      en: 'MAURO OS  v1.0.0  (terminal-portfolio build)',
      es: 'MAURO OS  v1.0.0  (build terminal-portfolio)',
    },
    {
      en: 'Copyright (c) 2026 — booting...',
      es: 'Copyright (c) 2026 — iniciando...',
    },
  ],
  lines: [
    { tag: 'OK', text: 'mounting /home/mauro ...' },
    { tag: 'OK', text: 'reading profile.json ...' },
    { tag: 'OK', text: 'loading skills.db ...' },
    { tag: 'OK', text: 'indexing experience.tsx ...' },
    { tag: 'INFO', text: 'connecting to github.com:443 ...' },
    { tag: 'OK', text: 'fetching projects.list ...' },
    { tag: 'OK', text: 'warming up react runtime ...' },
    { tag: 'OK', text: 'compiling tailwind atoms ...' },
    { tag: 'OK', text: 'attaching keyboard handlers ...' },
    { tag: 'INFO', text: 'checking caffeine level ... [ok]' },
  ],
  bars: [
    { label: 'assets', durationMs: 900 },
    { label: 'fonts ', durationMs: 700 },
    { label: 'links ', durationMs: 500 },
  ],
  ready: { en: 'ready.', es: 'listo.' },
  skipHint: {
    en: 'press any key to skip',
    es: 'pulsa cualquier tecla para saltar',
  },
};
