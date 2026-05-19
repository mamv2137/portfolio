import { useEffect, useReducer, useRef } from 'react';
import { useMotion } from '../../lib/useMotion';
import { BOOT_SCRIPT, type BootLine } from '../../content/boot';

type Phase = 'banner' | 'lines' | 'bars' | 'ready' | 'dismissing' | 'dismissed';

type State = {
  phase: Phase;
  visibleLines: BootLine[];
  bars: { label: string; progress: number; durationMs: number }[];
  readyShown: boolean;
};

type Action =
  | { type: 'next-phase'; phase: Phase }
  | { type: 'add-line'; line: BootLine }
  | { type: 'set-bar'; index: number; progress: number }
  | { type: 'show-ready' }
  | { type: 'dismiss' }
  | { type: 'force-final' };

const initialState: State = {
  phase: 'banner',
  visibleLines: [],
  bars: BOOT_SCRIPT.bars.map((b) => ({ label: b.label, progress: 0, durationMs: b.durationMs })),
  readyShown: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next-phase':
      return { ...state, phase: action.phase };
    case 'add-line':
      return { ...state, visibleLines: [...state.visibleLines, action.line] };
    case 'set-bar':
      return {
        ...state,
        bars: state.bars.map((b, i) => (i === action.index ? { ...b, progress: action.progress } : b)),
      };
    case 'show-ready':
      return { ...state, readyShown: true };
    case 'dismiss':
      return { ...state, phase: 'dismissing' };
    case 'force-final':
      return {
        ...state,
        phase: 'ready',
        visibleLines: BOOT_SCRIPT.lines.slice(-3),
        bars: state.bars.map((b) => ({ ...b, progress: 1 })),
        readyShown: true,
      };
    default:
      return state;
  }
}

function tagColor(tag: BootLine['tag']) {
  if (tag === 'OK') return 'text-tui-success';
  if (tag === 'WARN') return 'text-tui-warn';
  return 'text-tui-info';
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function BootOverlay() {
  const motion = useMotion();
  const [state, dispatch] = useReducer(reducer, initialState);
  const dismissed = useRef(false);

  const sessionBooted = (): boolean => {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem('tui:booted') === '1';
  };

  const noBootFlag = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      return new URLSearchParams(window.location.search).get('noboot') === '1';
    } catch {
      return false;
    }
  };

  const startDismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    try {
      sessionStorage.setItem('tui:booted', '1');
    } catch {}
    dispatch({ type: 'dismiss' });
    window.setTimeout(() => {
      dispatch({ type: 'next-phase', phase: 'dismissed' });
    }, 250);
  };

  useEffect(() => {
    if (sessionBooted() || noBootFlag()) {
      dispatch({ type: 'next-phase', phase: 'dismissed' });
      dismissed.current = true;
      return;
    }
  }, []);

  useEffect(() => {
    if (dismissed.current) return;

    if (motion === 'off') {
      dispatch({ type: 'force-final' });
      const t = window.setTimeout(startDismiss, 400);
      return () => window.clearTimeout(t);
    }

    let cancelled = false;
    const timers: number[] = [];

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });

    (async () => {
      // banner
      await sleep(350);
      if (cancelled) return;
      dispatch({ type: 'next-phase', phase: 'lines' });

      // lines
      for (const line of BOOT_SCRIPT.lines) {
        if (cancelled) return;
        dispatch({ type: 'add-line', line });
        await sleep(rand(60, 180));
      }

      // bars
      if (cancelled) return;
      dispatch({ type: 'next-phase', phase: 'bars' });
      await Promise.all(
        BOOT_SCRIPT.bars.map((bar, i) =>
          new Promise<void>((resolve) => {
            const start = performance.now();
            const tick = () => {
              if (cancelled) return resolve();
              const t = Math.min(1, (performance.now() - start) / bar.durationMs);
              dispatch({ type: 'set-bar', index: i, progress: t });
              if (t < 1) {
                const id = window.requestAnimationFrame(tick);
                timers.push(id);
              } else resolve();
            };
            window.requestAnimationFrame(tick);
          })
        )
      );
      if (cancelled) return;

      // ready
      dispatch({ type: 'next-phase', phase: 'ready' });
      await sleep(220);
      if (cancelled) return;
      dispatch({ type: 'show-ready' });
      await sleep(380);
      if (cancelled) return;
      startDismiss();
    })();

    return () => {
      cancelled = true;
      for (const id of timers) {
        window.clearTimeout(id);
        window.cancelAnimationFrame(id);
      }
    };
  }, [motion]);

  useEffect(() => {
    if (dismissed.current) return;
    const onKey = () => startDismiss();
    const onPointer = () => startDismiss();
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  if (state.phase === 'dismissed') return null;

  const dismissing = state.phase === 'dismissing';

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-tui-bg text-tui-fg font-tui overflow-hidden"
      style={{
        opacity: dismissing ? 0 : 1,
        transition: 'opacity 250ms ease-out',
        pointerEvents: dismissing ? 'none' : 'auto',
      }}
    >
      <div className="max-w-3xl mx-auto px-5 py-6 sm:py-12 text-sm leading-relaxed">
        {BOOT_SCRIPT.banner.map((b, i) => (
          <p key={i} className={i === 0 ? 'text-tui-accent' : 'text-tui-muted'}>
            {b}
          </p>
        ))}
        <div className="h-3" />

        <div className="space-y-[2px]">
          {state.visibleLines.map((line, i) => (
            <p key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-tui-muted">[</span>
              <span className={`${tagColor(line.tag)} w-10 inline-block`}>{line.tag}</span>
              <span aria-hidden="true" className="text-tui-muted">]</span>
              <span className="text-tui-fg">{line.text}</span>
            </p>
          ))}
        </div>

        {(state.phase === 'bars' || state.phase === 'ready' || state.readyShown) && (
          <div className="mt-4 space-y-1">
            {state.bars.map((bar, i) => {
              const cells = 30;
              const filled = Math.round(bar.progress * cells);
              return (
                <p key={i} className="flex items-center gap-3">
                  <span className="text-tui-muted w-16">{bar.label}</span>
                  <span aria-hidden="true" className="text-tui-accent tracking-tighter">
                    {'█'.repeat(filled)}
                    <span className="text-tui-border">{'░'.repeat(cells - filled)}</span>
                  </span>
                  <span className="text-tui-muted tabular-nums w-12 text-right">
                    {Math.round(bar.progress * 100)}%
                  </span>
                </p>
              );
            })}
          </div>
        )}

        {state.readyShown && (
          <p className="mt-4 text-tui-success">{BOOT_SCRIPT.ready}</p>
        )}
      </div>

      <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-tui-muted">
        <span aria-hidden="true" className="text-tui-accent">[</span>
        <span className="text-tui-accent"> press any key to skip </span>
        <span aria-hidden="true" className="text-tui-accent">]</span>
      </p>
    </div>
  );
}
