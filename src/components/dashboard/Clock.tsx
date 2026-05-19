import { useEffect, useState } from 'react';

const pad = (n: number) => n.toString().padStart(2, '0');
const format = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export default function Clock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => format(new Date()));

  useEffect(() => {
    let id: number | null = null;
    const tick = () => {
      if (document.visibilityState === 'visible') setNow(format(new Date()));
    };
    const start = () => {
      tick();
      id = window.setInterval(tick, 1000);
    };
    const stop = () => {
      if (id !== null) {
        window.clearInterval(id);
        id = null;
      }
    };
    const onVis = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <span className={`font-tui tabular-nums text-tui-muted ${className}`} suppressHydrationWarning>
      {now}
    </span>
  );
}
