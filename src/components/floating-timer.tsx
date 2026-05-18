'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Pause, Play, Timer, X } from 'lucide-react';
import { formatTimer, usePomodoro } from '@/lib/pomodoro-context';
import { FocusTimerModal } from '@/components/tools/focus-timer-modal';

export function FloatingTimer() {
  const { running, remaining, hidden, finished, pause, resume, toggleHidden, dismiss } =
    usePomodoro();
  const [modalOpen, setModalOpen] = useState(false);

  // Show when running OR when finished and not dismissed
  const visible = running || finished;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed bottom-[80px] sm:bottom-[88px] right-3 sm:right-5 z-30 pointer-events-none"
          >
            <div className="pointer-events-auto">
              {hidden ? (
                /* Collapsed: just a pulsing dot */
                <button
                  onClick={toggleHidden}
                  className="w-12 h-12 rounded-full bg-[#0A0A0A] border-2 border-white/10 flex items-center justify-center text-white shadow-2xl active:scale-95 transition relative"
                  aria-label="Afficher le timer"
                  title="Afficher le timer"
                >
                  <Timer size={18} strokeWidth={2.5} className="text-[#34C759]" />
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${
                      running ? 'bg-[#34C759] animate-pulse' : 'bg-[#FFB800]'
                    } border-2 border-[#0A0A0A]`}
                  />
                </button>
              ) : (
                /* Expanded pill */
                <div
                  className={`flex items-center gap-2 bg-[#0A0A0A] border-2 border-white/10 rounded-full pl-2 pr-1.5 py-1.5 shadow-2xl ${
                    finished ? 'ring-2 ring-[#FFB800]/60' : ''
                  }`}
                >
                  {/* Big tappable area opens modal */}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 active:scale-95 transition pr-1"
                    aria-label="Détails du timer"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        finished ? 'bg-[#FFB800]' : 'bg-[#34C759]'
                      }`}
                    >
                      <Timer size={14} strokeWidth={2.5} className="text-white" />
                    </div>
                    <span className="text-sm font-extrabold text-white tabular-nums">
                      {formatTimer(remaining)}
                    </span>
                  </button>

                  {/* Pause / Resume (only if not finished) */}
                  {!finished && (
                    <button
                      onClick={() => (running ? pause() : resume())}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition active:scale-90"
                      aria-label={running ? 'Pause' : 'Reprendre'}
                      title={running ? 'Pause' : 'Reprendre'}
                    >
                      {running ? (
                        <Pause size={12} fill="white" />
                      ) : (
                        <Play size={12} fill="white" className="ml-0.5" />
                      )}
                    </button>
                  )}

                  {/* Hide / Dismiss */}
                  {!finished ? (
                    <button
                      onClick={toggleHidden}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition active:scale-90"
                      aria-label="Masquer le temps"
                      title="Masquer (le timer continue)"
                    >
                      <EyeOff size={12} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      onClick={dismiss}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition active:scale-90"
                      aria-label="Fermer"
                      title="Fermer"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              )}

              {/* Mini label below when expanded and finished */}
              {finished && !hidden && (
                <div className="text-center mt-2">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#FFB800] bg-[#0A0A0A]/80 backdrop-blur px-2 py-0.5 rounded-full">
                    Session terminée
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && <FocusTimerModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

// Reveal-from-hidden button (always available when hidden=true, even via Eye icon)
export function RevealTimerButton() {
  const { hidden, running, toggleHidden } = usePomodoro();
  if (!hidden || !running) return null;
  return (
    <button
      onClick={toggleHidden}
      className="fixed bottom-[80px] right-3 z-30 w-10 h-10 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-2xl active:scale-95 transition"
      aria-label="Afficher le timer"
      title="Afficher le timer"
    >
      <Eye size={16} strokeWidth={2.5} />
    </button>
  );
}
