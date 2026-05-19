import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../lib/useMotion';

export type SparklineProps = {
  data: number[];
  variant?: 'bars' | 'line';
  live?: boolean;
  liveRange?: [number, number];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
};

const BAR_GLYPHS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Sparkline({
  data,
  variant = 'bars',
  live = false,
  liveRange = [0, 1],
  width = 120,
  height = 28,
  className = '',
  ariaLabel,
}: SparklineProps) {
  const motion = useMotion();
  const [series, setSeries] = useState<number[]>(data);
  const timer = useRef<number | null>(null);
  const visible = useRef(true);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => setSeries(data), [data]);

  useEffect(() => {
    if (!live || motion === 'off') return;

    const schedule = () => {
      const delay = rand(1500, 3000);
      timer.current = window.setTimeout(() => {
        if (visible.current && document.visibilityState === 'visible') {
          setSeries((prev) => {
            const next = prev.slice(1);
            next.push(rand(liveRange[0], liveRange[1]));
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
  }, [live, motion, liveRange]);

  const max = Math.max(...series, 1);

  if (variant === 'bars') {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel ?? 'sparkline'}
        className={`font-tui leading-none text-tui-accent ${className}`}
        style={{ fontSize: `${Math.round(height * 0.9)}px`, transition: 'all 400ms ease' }}
      >
        <span aria-hidden="true">
          {series.map((v, i) => {
            const idx = Math.min(BAR_GLYPHS.length - 1, Math.max(0, Math.floor((v / max) * (BAR_GLYPHS.length - 1))));
            return <span key={i}>{BAR_GLYPHS[idx]}</span>;
          })}
        </span>
      </div>
    );
  }

  // line variant — SVG
  const w = width;
  const h = height;
  const stepX = series.length > 1 ? w / (series.length - 1) : w;
  const points = series
    .map((v, i) => `${(i * stepX).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(' ');

  return (
    <div ref={ref} role="img" aria-label={ariaLabel ?? 'sparkline'} className={className}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <polyline
          fill="none"
          stroke="var(--tui-accent)"
          strokeWidth={1.5}
          points={points}
          style={{ transition: 'all 400ms ease' }}
        />
      </svg>
    </div>
  );
}
