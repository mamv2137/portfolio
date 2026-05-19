import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../lib/useMotion';

export type GaugeTone = 'default' | 'accent' | 'success' | 'warn' | 'error' | 'info';

export type GaugeProps = {
  label: string;
  value: number;
  tone?: GaugeTone;
  showPercent?: boolean;
  className?: string;
};

const toneColor = (tone: GaugeTone = 'default') => {
  switch (tone) {
    case 'accent':
    case 'success':
      return 'var(--tui-accent)';
    case 'warn':
      return 'var(--tui-warn)';
    case 'error':
      return 'var(--tui-error)';
    case 'info':
      return 'var(--tui-info)';
    default:
      return 'var(--tui-accent)';
  }
};

export default function Gauge({
  label,
  value,
  tone = 'default',
  showPercent = true,
  className = '',
}: GaugeProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const motion = useMotion();
  const [displayed, setDisplayed] = useState(motion === 'off' ? clamped : 0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (motion === 'off') {
      setDisplayed(clamped);
      return;
    }
    if (!ref.current) {
      setDisplayed(clamped);
      return;
    }
    const el = ref.current;
    let raf = 0;
    let started = false;
    const animate = () => {
      const start = performance.now();
      const duration = 700;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayed(eased * clamped);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            animate();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [clamped, motion]);

  const pct = Math.round(displayed * 100);
  const color = toneColor(tone);

  return (
    <div ref={ref} className={`font-tui text-xs ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-tui-fg truncate">{label}</span>
        {showPercent && <span className="text-tui-muted tabular-nums">{pct}%</span>}
      </div>
      <div
        className="relative mt-1 h-[10px] w-full overflow-hidden border border-tui-border bg-tui-bg"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          aria-hidden="true"
          className="h-full"
          style={{ width: `${displayed * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}
