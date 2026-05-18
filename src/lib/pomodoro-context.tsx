'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface PomodoroState {
  running: boolean;
  remaining: number;
  durationMin: number;
  hidden: boolean;
  finished: boolean;
  start: (minutes: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setDurationMin: (m: number) => void;
  toggleHidden: () => void;
  dismiss: () => void;
}

const PomodoroContext = createContext<PomodoroState | null>(null);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [running, setRunning] = useState(false);
  const [durationMin, setDurationMin] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const [hidden, setHidden] = useState(false);
  const [finished, setFinished] = useState(false);
  const endRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    endRef.current = Date.now() + remaining;
    intervalRef.current = setInterval(() => {
      const left = (endRef.current ?? 0) - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        setFinished(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        try {
          if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification('Session terminée 🎉', {
              body: `${durationMin} minutes bien jouées. Pause méritée.`,
            });
          }
        } catch {}
        try {
          new Audio(
            'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
          ).play();
        } catch {}
      } else {
        setRemaining(left);
      }
    }, 250);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, durationMin]);

  const start = useCallback((minutes: number) => {
    setDurationMin(minutes);
    setRemaining(minutes * 60 * 1000);
    setFinished(false);
    setHidden(false);
    setRunning(true);
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => setRunning(true), []);

  const reset = useCallback(() => {
    setRunning(false);
    setFinished(false);
    setRemaining(durationMin * 60 * 1000);
  }, [durationMin]);

  const toggleHidden = useCallback(() => setHidden((h) => !h), []);

  const dismiss = useCallback(() => {
    setRunning(false);
    setFinished(false);
    setRemaining(durationMin * 60 * 1000);
    setHidden(false);
  }, [durationMin]);

  const value: PomodoroState = {
    running,
    remaining,
    durationMin,
    hidden,
    finished,
    start,
    pause,
    resume,
    reset,
    setDurationMin,
    toggleHidden,
    dismiss,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) {
    throw new Error('usePomodoro must be used within <PomodoroProvider>');
  }
  return ctx;
}

export function formatTimer(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}
