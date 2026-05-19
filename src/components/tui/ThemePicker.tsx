import { useTheme, cycleTheme, THEMES, setTheme, type Theme } from '../../lib/useTheme';
import { useState } from 'react';

export default function ThemePicker({ className = '' }: { className?: string }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const onCycle = () => {
    cycleTheme(1);
  };

  const onPick = (t: Theme) => {
    setTheme(t);
    setOpen(false);
  };

  return (
    <span className={`relative inline-flex items-center gap-1 font-tui text-xs ${className}`}>
      <button
        type="button"
        onClick={onCycle}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        aria-label={`theme: ${theme} (click to cycle, right-click to choose)`}
        className="inline-flex items-center gap-1 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tui-accent hover:text-tui-accent"
      >
        <span className="text-tui-muted">theme:</span>
        <span className="text-tui-accent">{theme}</span>
      </button>

      {open && (
        <ul
          role="menu"
          aria-label="select theme"
          className="absolute bottom-full mb-1 right-0 z-20 border border-tui-border bg-tui-bg-elev p-1 min-w-[140px] font-tui text-xs"
        >
          {THEMES.map((t) => (
            <li key={t} role="menuitem">
              <button
                type="button"
                onClick={() => onPick(t)}
                className={`flex w-full items-center gap-2 px-2 py-1 rounded-sm hover:bg-tui-selection focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tui-accent ${
                  t === theme ? 'text-tui-accent' : 'text-tui-fg'
                }`}
              >
                <span aria-hidden="true" className={t === theme ? 'opacity-100' : 'opacity-0'}>▸</span>
                <span>{t}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
