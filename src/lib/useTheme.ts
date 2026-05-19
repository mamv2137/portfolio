import { useEffect, useState } from 'react';

export const THEMES = ['catppuccin', 'monokai', 'dracula', 'nord', 'tokyo-night'] as const;
export type Theme = (typeof THEMES)[number];

const DEFAULT: Theme = 'catppuccin';

function read(): Theme {
  if (typeof document === 'undefined') return DEFAULT;
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr && (THEMES as readonly string[]).includes(attr)) return attr as Theme;
  return DEFAULT;
}

export function useTheme(): Theme {
  const [theme, setLocal] = useState<Theme>(DEFAULT);

  useEffect(() => {
    setLocal(read());
    const observer = new MutationObserver(() => setLocal(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function setTheme(next: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', next);
}

export function cycleTheme(direction: 1 | -1 = 1): Theme {
  const current = read();
  const idx = THEMES.indexOf(current);
  const nextIdx = (idx + direction + THEMES.length) % THEMES.length;
  const next = THEMES[nextIdx];
  setTheme(next);
  return next;
}
