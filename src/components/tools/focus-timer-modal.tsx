'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { ToolSheet } from './tool-sheet';
import { formatTimer, usePomodoro } from '@/lib/pomodoro-context';

const DURATIONS_MIN = [10, 15, 25, 45];

export function FocusTimerModal({ onClose }: { onClose: () => void }) {
  const { running, remaining, durationMin, start, pause, resume, reset, finished } = usePomodoro();
  const [selectedMin, setSelectedMin] = useState(durationMin);

  const effectiveMin = running || finished ? durationMin : selectedMin;
  const total = effectiveMin * 60 * 1000;
  const displayRemaining = running || finished ? remaining : selectedMin * 60 * 1000;
  const pct = 1 - displayRemaining / total;
  const circumference = 2 * Math.PI * 100;
  const offset = circumference * (1 - pct);

  const handleStart = () => {
    start(selectedMin);
    onClose(); // Close modal so the timer is visible as a floating pill
  };

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
              onClick={() => setSelectedMin(m)}
              disabled={running}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition active:scale-95 ${
                m === effectiveMin
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
            <circle cx="112" cy="112" r="100" strokeWidth="10" stroke="#E5E7EB" fill="none" />
            <circle
              cx="112"
              cy="112"
              r="100"
              strokeWidth="10"
              stroke="url(#timer-grad-modal)"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
            <defs>
              <linearGradient id="timer-grad-modal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34C759" />
                <stop offset="100%" stopColor="#4ADB6F" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <div className="text-5xl font-extrabold tabular-nums text-gray-900 leading-none">
              {formatTimer(displayRemaining)}
            </div>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mt-2">
              {running ? 'En cours' : finished ? 'Terminé' : 'Prêt'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            disabled={!running && !finished && displayRemaining === selectedMin * 60 * 1000}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition active:scale-95 flex items-center justify-center disabled:opacity-40"
            aria-label="Reset"
          >
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>

          {!running && !finished ? (
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-full font-extrabold text-white shadow-lg active:scale-95 transition flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #34C759, #4ADB6F)',
                boxShadow: '0 10px 30px -10px #34C75980',
              }}
            >
              <Play size={16} fill="white" />
              Démarrer
            </button>
          ) : running ? (
            <button
              onClick={pause}
              className="px-8 py-4 rounded-full font-extrabold text-white shadow-lg active:scale-95 transition flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #34C759, #4ADB6F)',
                boxShadow: '0 10px 30px -10px #34C75980',
              }}
            >
              <Pause size={16} fill="white" />
              Pause
            </button>
          ) : finished ? (
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-full font-extrabold text-white shadow-lg active:scale-95 transition flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #FFB800, #FFCB42)',
                boxShadow: '0 10px 30px -10px #FFB80080',
              }}
            >
              <Play size={16} fill="white" />
              Nouvelle session
            </button>
          ) : (
            <button
              onClick={resume}
              className="px-8 py-4 rounded-full font-extrabold text-white shadow-lg active:scale-95 transition flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #34C759, #4ADB6F)',
                boxShadow: '0 10px 30px -10px #34C75980',
              }}
            >
              <Play size={16} fill="white" />
              Reprendre
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 font-semibold mt-6 text-center max-w-xs leading-relaxed">
          {running
            ? 'Le timer reste affiché dans une pill flottante quand tu fermes cette fenêtre.'
            : 'Astuce : 25 min de focus puis 5 min de pause. C’est la méthode Pomodoro, imbattable pour apprendre une langue sans se cramer.'}
        </p>
      </div>
    </ToolSheet>
  );
}
