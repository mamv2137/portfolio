import { useEffect, useState } from 'react';

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

const DEFAULT: Lang = 'en';

function read(): Lang {
  if (typeof document === 'undefined') return DEFAULT;
  const attr = document.documentElement.getAttribute('data-lang');
  if (attr === 'es' || attr === 'en') return attr;
  return DEFAULT;
}

export function useLang(): Lang {
  const [lang, setLocal] = useState<Lang>(DEFAULT);

  useEffect(() => {
    setLocal(read());
    const observer = new MutationObserver(() => setLocal(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-lang'],
    });
    return () => observer.disconnect();
  }, []);

  return lang;
}

export function setLang(next: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-lang', next);
}

export function toggleLang(): Lang {
  const current = read();
  const next: Lang = current === 'en' ? 'es' : 'en';
  setLang(next);
  return next;
}

export type Localized = { en: string; es: string };

export function pick<T>(value: T | { en: T; es: T }, lang: Lang): T {
  if (value && typeof value === 'object' && 'en' in (value as object) && 'es' in (value as object)) {
    return (value as { en: T; es: T })[lang];
  }
  return value as T;
}
