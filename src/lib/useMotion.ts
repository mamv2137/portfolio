import { useEffect, useState } from 'react';

export type MotionState = 'on' | 'off';

function read(): MotionState {
  if (typeof window === 'undefined') return 'on';
  if (localStorage.getItem('tui:motion') === 'off') return 'off';
  if (localStorage.getItem('tui:motion') === 'on') return 'on';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'on';
}

export function useMotion(): MotionState {
  const [motion, setMotion] = useState<MotionState>('on');

  useEffect(() => {
    setMotion(read());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setMotion(read());
    mq.addEventListener('change', onMq);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tui:motion') setMotion(read());
    };
    window.addEventListener('storage', onStorage);

    const observer = new MutationObserver(() => setMotion(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      mq.removeEventListener('change', onMq);
      window.removeEventListener('storage', onStorage);
      observer.disconnect();
    };
  }, []);

  return motion;
}

export function setMotion(next: MotionState) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('motion-off', next === 'off');
}

export function toggleMotion() {
  if (typeof document === 'undefined') return;
  const isOff = document.documentElement.classList.contains('motion-off');
  setMotion(isOff ? 'on' : 'off');
}
