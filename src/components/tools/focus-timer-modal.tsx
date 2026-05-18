'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { ToolSheet } from './tool-sheet';

const DURATIONS_MIN = [10, 15, 25, 45];

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function FocusTimerModal({ onClose }: { onClose: () => void }) {
  const [minutes, setMinutes] = useState(25);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      setRemaining(minutes * 60 * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes]);

  useEffect(() => {
    if (running) {
      endRef.current = Date.now() + remaining;
      intervalRef.current = setInterval(() => {
        const left = (endRef.current ?? 0) - Date.now();
        if (left <= 0) {
          setRemaining(0);
          setRunning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          try {
            new Audio(
              'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
            ).play();
          } catch {}
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('Session terminée 🎉', {
                body: `${minutes} minutes bien jouées. Pause méritée.`,
              });
            }
          }
        } else {
          setRemaining(left);
        }
      }, 250);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const toggle = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(minutes * 60 * 1000);
  };

  const pct = 1 - remaining / (minutes * 60 * 1000);
  const circumference = 2 * Math.PI * 100;
  const offset = circumference * (1 - pct);

  return (
    <ToolSheet
      title="Focus session"
      subtitle="Concentre-toi sans interruption"
      Icon={Timer}
      color="#34C759"
      bgLight="#D6F5DD"
      onClose={onClose}
    >
      <div className="flex flex-col items-center py-4">
        {/* Duration picker */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {DURATIONS_MIN.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              disabled={running}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition active:scale-95 ${
                m === minutes
                  ? 'bg-[#34C759] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>

        {/* Circular timer */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              strokeWidth="10"
              stroke="#E5E7EB"
              fill="none"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              strokeWidth="10"
              stroke="url(#timer-grad)"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
            <defs>
              <linearGradient id="timer-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34C759" />
                <stop offset="100%" stopColor="#4ADB6F" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <div className="text-5xl font-extrabold tabular-nums text-gray-900 leading-none">
              {format(remaining)}
            </div>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mt-2">
              {running ? 'En cours' : remaining === 0 ? 'Terminé' : 'Prêt'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition active:scale-95 flex items-center justify-center"
            aria-label="Reset"
          >
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={toggle}
            className="px-8 py-4 rounded-full font-extrabold text-white shadow-lg active:scale-95 transition flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #34C759, #4ADB6F)',
              boxShadow: '0 10px 30px -10px #34C75980',
            }}
          >
            {running ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
            {running ? 'Pause' : remaining === 0 ? 'Recommencer' : 'Démarrer'}
          </button>
        </div>

        <p className="text-xs text-gray-400 font-semibold mt-6 text-center max-w-xs leading-relaxed">
          Astuce : 25 min de focus puis 5 min de pause. C&apos;est la méthode Pomodoro,
          imbattable pour apprendre une langue sans se cramer.
        </p>
      </div>
    </ToolSheet>
  );
}
