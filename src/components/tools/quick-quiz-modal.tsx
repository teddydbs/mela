'use client';

import { useMemo, useState } from 'react';
import { Check, RotateCcw, X, Zap } from 'lucide-react';
import { CATEGORIES, CATEGORY_IDS } from '@/lib/data/categories';
import { useUserData } from '@/lib/use-user-data';
import type { CategoryId, Exercise } from '@/lib/types';
import { ToolSheet } from './tool-sheet';

interface QuizItem {
  catId: CategoryId;
  exerciseIdx: number;
  exercise: Exercise;
}

const QUIZ_LENGTH = 5;

function pickRandomItems(): QuizItem[] {
  const all: QuizItem[] = [];
  CATEGORY_IDS.forEach((catId) => {
    CATEGORIES[catId].exercises.forEach((ex, idx) => {
      all.push({ catId, exerciseIdx: idx, exercise: ex });
    });
  });
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUIZ_LENGTH);
}

export function QuickQuizModal({ onClose }: { onClose: () => void }) {
  const { recordAnswer } = useUserData();
  const [items, setItems] = useState<QuizItem[]>(() => pickRandomItems());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = items[currentIdx];
  const cat = current ? CATEGORIES[current.catId] : null;

  const isCorrect = current && selected === current.exercise.c;

  const handleAnswer = (idx: number) => {
    if (showResult || !current) return;
    setSelected(idx);
    setShowResult(true);
    const ok = idx === current.exercise.c;
    if (ok) setCorrect((c) => c + 1);
    recordAnswer({ category: current.catId, exerciseIdx: current.exerciseIdx, correct: ok });
  };

  const next = () => {
    setSelected(null);
    setShowResult(false);
    if (currentIdx < items.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setItems(pickRandomItems());
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setCorrect(0);
    setFinished(false);
  };

  const accuracy = useMemo(
    () => (items.length > 0 ? Math.round((correct / items.length) * 100) : 0),
    [correct, items.length],
  );

  if (finished) {
    return (
      <ToolSheet
        title="Quick Quiz"
        subtitle="Résultat"
        Icon={Zap}
        color="#FFB800"
        bgLight="#FFF4CC"
        onClose={onClose}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={reset}
              className="py-3 rounded-2xl bg-gray-100 text-gray-700 font-extrabold active:scale-95 transition flex items-center justify-center gap-1.5 text-sm"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
              Recommencer
            </button>
            <button
              onClick={onClose}
              className="py-3 rounded-2xl text-white font-extrabold active:scale-95 transition shadow-md text-sm"
              style={{
                background: 'linear-gradient(135deg, #FFB800, #FFCB42)',
                boxShadow: '0 6px 20px -8px #FFB80080',
              }}
            >
              Fermer
            </button>
          </div>
        }
      >
        <div className="py-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFB800] to-[#FFCB42] flex items-center justify-center mb-4 shadow-xl shadow-[#FFB800]/40">
            <Zap size={32} className="text-white" strokeWidth={2.5} fill="white" />
          </div>
          <div className="text-5xl font-extrabold tabular-nums text-gray-900 leading-none mb-2">
            {correct}
            <span className="text-2xl text-gray-400">/{items.length}</span>
          </div>
          <div className="text-sm text-gray-500 font-semibold mb-4">{accuracy}% de précision</div>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
            {accuracy >= 80
              ? 'Solide ! Continue à cette vitesse.'
              : accuracy >= 60
                ? 'Pas mal. Encore quelques rounds et tu cartonnes.'
                : "On en refait une ? La pratique paie."}
          </p>
        </div>
      </ToolSheet>
    );
  }

  if (!current || !cat) return null;

  return (
    <ToolSheet
      title="Quick Quiz"
      subtitle={`Question ${currentIdx + 1} / ${items.length}`}
      Icon={Zap}
      color="#FFB800"
      bgLight="#FFF4CC"
      onClose={onClose}
      footer={
        showResult ? (
          <button
            onClick={next}
            className="w-full py-3.5 rounded-2xl font-extrabold text-white shadow-lg active:scale-[0.98] transition"
            style={{
              background: 'linear-gradient(135deg, #FFB800, #FFCB42)',
              boxShadow: '0 10px 30px -10px #FFB80080',
            }}
          >
            {currentIdx < items.length - 1 ? 'Question suivante →' : 'Voir le résultat'}
          </button>
        ) : null
      }
    >
      <div className="space-y-3">
        {/* Category badge */}
        <div
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
          style={{ backgroundColor: cat.bgLight, color: cat.accent }}
        >
          {cat.name}
        </div>

        {/* Question */}
        <h3 className="text-lg leading-snug font-extrabold tracking-tight text-gray-900">
          {current.exercise.q.split('_____').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span
                  className="inline-block mx-1 px-2 py-0.5 rounded-md font-extrabold"
                  style={{
                    minWidth: '60px',
                    backgroundColor: showResult ? cat.bgLight : '#F3F4F6',
                    color: cat.accent,
                  }}
                >
                  {showResult ? current.exercise.o[current.exercise.c] : '___'}
                </span>
              )}
            </span>
          ))}
        </h3>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {current.exercise.o.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrectOpt = idx === current.exercise.c;
            let classes = 'border-gray-200 bg-white hover:border-gray-300';
            if (showResult) {
              if (isCorrectOpt) classes = 'border-[#34C759] bg-[#E8F8EC]';
              else if (isSelected) classes = 'border-[#FF3B30] bg-[#FFEBEA]';
              else classes = 'border-gray-100 bg-gray-50/50 opacity-60';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 border-2 rounded-2xl transition active:scale-[0.99] flex items-center gap-3 ${classes}`}
              >
                <div className="text-sm font-bold text-gray-900 flex-1">{opt}</div>
                {showResult && isCorrectOpt && <Check size={16} className="text-[#34C759]" strokeWidth={3} />}
                {showResult && isSelected && !isCorrectOpt && (
                  <X size={16} className="text-[#FF3B30]" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div
            className="mt-3 rounded-2xl p-3.5 border-2"
            style={{
              backgroundColor: isCorrect ? '#E8F8EC' : '#FFEBEA',
              borderColor: isCorrect ? '#34C759' : '#FF3B30',
            }}
          >
            <div className="text-[10px] uppercase tracking-widest font-extrabold mb-1.5 text-gray-500">
              {isCorrect ? 'Bien joué' : 'La règle'}
            </div>
            <p className="text-xs text-gray-800 leading-relaxed font-medium">
              {current.exercise.e}
            </p>
          </div>
        )}
      </div>
    </ToolSheet>
  );
}
