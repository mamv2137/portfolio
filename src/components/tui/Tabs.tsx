import { useState, type ReactNode } from 'react';

export type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export type TabsProps = {
  tabs: Tab[];
  defaultId?: string;
  onChange?: (id: string) => void;
  className?: string;
};

export default function Tabs({ tabs, defaultId, onChange, className = '' }: TabsProps) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);

  const handle = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={`font-tui ${className}`}>
      <div role="tablist" className="flex flex-wrap gap-2 text-sm">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${t.id}`}
              id={`tab-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handle(t.id)}
              className={`inline-flex items-center gap-1 rounded-sm px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tui-accent ${
                isActive ? 'text-tui-accent' : 'text-tui-fg hover:text-tui-accent'
              }`}
            >
              <span aria-hidden="true" className={isActive ? 'opacity-100' : 'opacity-0'}>[</span>
              <span>{t.label}</span>
              <span aria-hidden="true" className={isActive ? 'opacity-100' : 'opacity-0'}>]</span>
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`tabpanel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          className="pt-3"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
