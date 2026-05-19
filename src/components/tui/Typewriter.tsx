import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../lib/useMotion';
import Caret from './Caret';

export type TypewriterProps = {
  strings: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  cycle?: boolean;
  showCaret?: boolean;
  className?: string;
};

export default function Typewriter({
  strings,
  typeMs = 50,
  deleteMs = 30,
  holdMs = 2000,
  cycle = true,
  showCaret = true,
  className = '',
}: TypewriterProps) {
  const motion = useMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(motion === 'off' ? strings[0] ?? '' : '');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');
  const timer = useRef<number | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (motion === 'off') {
      setText(strings[index] ?? '');
      return;
    }

    const onVis = () => {
      paused.current = document.visibilityState !== 'visible';
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [motion, index, strings]);

  useEffect(() => {
    if (motion === 'off') return;

    const target = strings[index] ?? '';
    const tick = () => {
      if (paused.current) {
        timer.current = window.setTimeout(tick, 200);
        return;
      }
      if (phase === 'typing') {
        if (text.length < target.length) {
          setText(target.slice(0, text.length + 1));
          timer.current = window.setTimeout(tick, typeMs);
        } else {
          setPhase('holding');
          timer.current = window.setTimeout(tick, holdMs);
        }
      } else if (phase === 'holding') {
        if (!cycle || strings.length <= 1) return;
        setPhase('deleting');
        timer.current = window.setTimeout(tick, deleteMs);
      } else {
        if (text.length > 0) {
          setText(target.slice(0, text.length - 1));
          timer.current = window.setTimeout(tick, deleteMs);
        } else {
          setIndex((i) => (i + 1) % strings.length);
          setPhase('typing');
          timer.current = window.setTimeout(tick, typeMs);
        }
      }
    };
    timer.current = window.setTimeout(tick, typeMs);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [phase, text, index, motion, strings, cycle, typeMs, deleteMs, holdMs]);

  return (
    <span className={`font-tui ${className}`}>
      <span>{text}</span>
      {showCaret && motion === 'on' && <Caret />}
    </span>
  );
}
