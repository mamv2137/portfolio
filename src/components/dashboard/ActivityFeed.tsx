import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../lib/useMotion';
import { ACTIVITY_POOL, type ActivityLine } from '../../content/activity';

const CAP = 8;

function pick(prev: ActivityLine[]): ActivityLine {
  if (prev.length === 0) return ACTIVITY_POOL[0];
  let next = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
  let guard = 0;
  while (next.text === prev[prev.length - 1].text && guard < 4) {
    next = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
    guard++;
  }
  return next;
}

function kindColor(kind: ActivityLine['kind']): string {
  switch (kind) {
    case 'commit': return 'text-tui-accent';
    case 'pr': return 'text-tui-info';
    case 'deploy': return 'text-tui-success';
    case 'log': return 'text-tui-muted';
    case 'note': return 'text-tui-warn';
  }
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function ActivityFeed() {
  const motion = useMotion();
  const [lines, setLines] = useState<ActivityLine[]>(() =>
    ACTIVITY_POOL.slice(0, 5)
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const visible = useRef(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (motion === 'off') return;

    const schedule = () => {
      const delay = rand(4000, 8000);
      timer.current = window.setTimeout(() => {
        if (visible.current && document.visibilityState === 'visible') {
          setLines((prev) => {
            const next = [...prev, pick(prev)];
            if (next.length > CAP) next.shift();
            return next;
          });
        }
        schedule();
      }, delay);
    };

    const onVis = () => {
      if (document.visibilityState !== 'visible') {
        if (timer.current) window.clearTimeout(timer.current);
      } else {
        schedule();
      }
    };

    let io: IntersectionObserver | undefined;
    if (ref.current) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible.current = e.isIntersecting;
        },
        { threshold: 0.1 }
      );
      io.observe(ref.current);
    }
    document.addEventListener('visibilitychange', onVis);
    schedule();

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  }, [motion]);

  return (
    <div
      ref={ref}
      className="font-tui text-xs leading-snug space-y-[2px]"
      aria-live="polite"
      aria-atomic="false"
    >
      {lines.map((l, i) => (
        <div key={`${i}-${l.text}`} className="flex items-baseline gap-2">
          <span aria-hidden="true" className="text-tui-muted">›</span>
          <span className={kindColor(l.kind)}>{l.text}</span>
        </div>
      ))}
    </div>
  );
}
