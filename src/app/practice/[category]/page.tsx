'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { ProgressBar } from '@/components/progress-bar';
import { useUserData } from '@/lib/use-user-data';
import type { CategoryId } from '@/lib/types';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function PracticePage({ params }: PageProps) {
  const { category } = use(params);
  const router = useRouter();

  if (!(category in CATEGORIES)) {
    notFound();
  }
  const catId = category as CategoryId;
  const cat = CATEGORIES[catId];

  const { recordAnswer } = useUserData();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercise = cat.exercises[currentIdx];
  const isCorrect = selected === exercise?.c;

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B35', '#34C759', '#FFB800', '#AF52DE', '#007AFF'],
    });
  }, []);

  const handleAnswer = (idx: number) => {
    if (showResult || !exercise) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === exercise.c;
    setSessionTotal((s) => s + 1);
    if (correct) {
      setSessionCorrect((s) => s + 1);
      fireConfetti();
    }
    recordAnswer({ category: catId, exerciseIdx: currentIdx, correct });
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    if (currentIdx < cat.exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  // Keyboard shortcuts (1-4 to answer, Enter to continue)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (finished) return;
      if (!showResult) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4 && exercise && num <= exercise.o.length) {
          handleAnswer(num - 1);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, finished, currentIdx, exercise]);

  if (finished) {
    const sessionAccuracy =
      sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    return (
      <FinishedView
        catId={catId}
        correct={sessionCorrect}
        total={sessionTotal}
        accuracy={sessionAccuracy}
      />
    );
  }

  if (!exercise) return null;

  return (
    <div className="text-gray-900 pb-8">
      {/* Header */}
      <div className="sticky top-[60px] z-10 bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-900 transition active:scale-95"
            aria-label="Quitter"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <ProgressBar
              value={currentIdx + (showResult ? 1 : 0)}
              max={cat.exercises.length}
              color={cat.accent}
              height="h-2"
            />
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-xs font-bold tabular-nums"
            style={{ backgroundColor: cat.bgLight, color: cat.accent }}
          >
            {sessionCorrect}/{sessionTotal}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">{cat.emoji}</div>
          <div
            className="text-xs uppercase tracking-widest font-bold"
            style={{ color: cat.accent }}
          >
            {cat.name}
          </div>
        </div>

        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm shadow-gray-200/40 border border-gray-100 mb-6"
        >
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">
            Question {currentIdx + 1}
          </div>
          <h2 className="text-2xl leading-tight font-bold tracking-tight text-gray-900">
            {exercise.q.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span
                    className="inline-block mx-1 px-3 py-0.5 rounded-lg font-bold"
                    style={{
                      minWidth: '70px',
                      backgroundColor: showResult ? cat.bgLight : '#F3F4F6',
                      color: cat.accent,
                    }}
                  >
                    {showResult ? exercise.o[exercise.c] : '___'}
                  </span>
                )}
              </span>
            ))}
          </h2>
        </motion.div>

        {/* Options */}
        <div className="space-y-3">
          {exercise.o.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrectOpt = idx === exercise.c;
            let classes = 'border-gray-200 bg-white hover:border-gray-300 active:scale-[0.99]';
            let dotStyle: React.CSSProperties = {
              backgroundColor: '#F3F4F6',
              color: '#9CA3AF',
            };

            if (showResult) {
              if (isCorrectOpt) {
                classes = 'border-[#34C759] bg-[#E8F8EC]';
                dotStyle = {
                  background: 'linear-gradient(135deg, #34C759, #4ADB6F)',
                  color: 'white',
                };
              } else if (isSelected) {
                classes = 'border-[#FF3B30] bg-[#FFEBEA]';
                dotStyle = {
                  background: 'linear-gradient(135deg, #FF3B30, #FF6961)',
                  color: 'white',
                };
              } else {
                classes = 'border-gray-100 bg-gray-50/50 opacity-50';
              }
            }

            return (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                whileTap={!showResult ? { scale: 0.99 } : undefined}
                className={`w-full text-left px-5 py-4 border-2 rounded-2xl transition-all ${classes}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                    style={dotStyle}
                  >
                    {showResult && isCorrectOpt ? (
                      <Check size={16} strokeWidth={3} />
                    ) : showResult && isSelected && !isCorrectOpt ? (
                      <X size={16} strokeWidth={3} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className="text-base font-semibold text-gray-900 flex-1">{opt}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation enrichie */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-3xl p-5 border-2"
              style={{
                backgroundColor: isCorrect ? '#E8F8EC' : '#FFEBEA',
                borderColor: isCorrect ? '#34C759' : '#FF3B30',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#34C759] to-[#4ADB6F] text-white text-xs font-black tracking-wide flex items-center gap-1">
                      <Sparkles size={12} fill="white" /> +10 XP
                    </div>
                    <span className="text-sm font-bold text-[#1F7A3F]">Bien joué !</span>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6961] text-white text-xs font-black tracking-wide">
                      Pas tout à fait
                    </div>
                    <span className="text-sm font-bold text-[#B91C1C]">+2 XP pour l&apos;effort</span>
                  </>
                )}
              </div>

              {/* Encadré "Pourquoi du comment" */}
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    La règle
                  </div>
                  <p className="text-sm leading-relaxed text-gray-800 font-medium">
                    {exercise.e}
                  </p>
                </div>

                {!isCorrect && selected !== null && (
                  <div className="pt-3 border-t border-current/10">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                      Ta réponse
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm line-through text-gray-500">
                        {exercise.o[selected]}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-bold" style={{ color: cat.accent }}>
                        {exercise.o[exercise.c]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        {showResult && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleNext}
            className="mt-5 w-full py-5 rounded-3xl font-bold text-white transition-all active:scale-[0.98] shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
              boxShadow: `0 10px 30px -10px ${cat.accent}80`,
            }}
          >
            {currentIdx < cat.exercises.length - 1
              ? 'Question suivante →'
              : 'Terminer la session 🎉'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function FinishedView({
  catId,
  correct,
  total,
  accuracy,
}: {
  catId: CategoryId;
  correct: number;
  total: number;
  accuracy: number;
}) {
  const cat = CATEGORIES[catId];

  useEffect(() => {
    if (accuracy >= 70) {
      const fire = () =>
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.3 },
          colors: ['#FF6B35', '#34C759', '#FFB800', '#AF52DE', '#007AFF'],
        });
      fire();
      setTimeout(fire, 250);
      setTimeout(fire, 500);
    }
  }, [accuracy]);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center mb-8"
      >
        <div className="text-7xl mb-4">{accuracy >= 70 ? '🎉' : '💪'}</div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
          {accuracy >= 70 ? 'Session terminée !' : 'Belle session'}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {accuracy >= 70
            ? 'T’as cartonné. Continue comme ça.'
            : "T'as bossé, c'est le principal."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-6 text-white shadow-lg mb-6"
        style={{
          background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
        }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-black tabular-nums leading-none">{correct}</div>
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mt-2">
              Bonnes
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tabular-nums leading-none">{total - correct}</div>
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mt-2">
              À revoir
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tabular-nums leading-none">
              {accuracy}
              <span className="text-2xl opacity-70">%</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mt-2">
              Précision
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/learn/${catId}`}
          className="text-center py-4 rounded-2xl bg-white border border-gray-200 font-bold text-gray-700 hover:border-gray-300 transition active:scale-95"
        >
          Relire le cours
        </Link>
        <Link
          href="/"
          className="text-center py-4 rounded-2xl font-bold text-white shadow-lg transition active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
          }}
        >
          Retour accueil
        </Link>
      </div>
    </div>
  );
}
