'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { CATEGORIES, TOTAL_EXERCISES } from '@/lib/data/categories';
import { ProgressBar } from '@/components/progress-bar';
import { useUserData } from '@/lib/use-user-data';
import { overallAccuracy, totalCompletedExercises } from '@/lib/storage';

export default function StatsPage() {
  const { data, reset } = useUserData();
  const accuracy = overallAccuracy(data);
  const totalCompleted = totalCompletedExercises(data);

  const handleReset = () => {
    if (confirm('Tout effacer ? Cette action est irréversible.')) {
      reset();
    }
  };

  const heroCards = [
    {
      label: 'Exercices',
      value: data.totalAttempts,
      gradient: 'from-[#FF6B35] to-[#FF8C5A]',
      shadow: 'shadow-[#FF6B35]/20',
    },
    {
      label: 'Précision',
      value: accuracy,
      suffix: '%',
      gradient: 'from-[#34C759] to-[#4ADB6F]',
      shadow: 'shadow-[#34C759]/20',
    },
    {
      label: 'Série',
      value: data.streak,
      suffix: 'j',
      gradient: 'from-[#FFB800] to-[#FFCB42]',
      shadow: 'shadow-[#FFB800]/20',
    },
    {
      label: 'Complétés',
      value: totalCompleted,
      suffix: `/${TOTAL_EXERCISES}`,
      gradient: 'from-[#007AFF] to-[#5856D6]',
      shadow: 'shadow-[#007AFF]/20',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">
          Statistiques
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight mb-6">
          Tes progrès
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {heroCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${card.gradient} text-white shadow-lg ${card.shadow}`}
          >
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
              {card.label}
            </div>
            <div className="text-4xl font-black tabular-nums leading-none">
              {card.value}
              {card.suffix && <span className="text-2xl opacity-80">{card.suffix}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">
        Par catégorie
      </div>
      <div className="space-y-3 mb-8">
        {Object.entries(CATEGORIES).map(([key, cat], i) => {
          const prog = data.categoryProgress[cat.id] ?? { correct: 0, attempts: 0, completed: [] };
          const catAccuracy =
            prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm shadow-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
                    boxShadow: `0 6px 16px -8px ${cat.accent}80`,
                  }}
                >
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">{cat.name}</div>
                  <div className="text-xs text-gray-500 tabular-nums">
                    {prog.correct}/{prog.attempts} • {catAccuracy}% précis
                  </div>
                </div>
                <div className="text-xs font-black tabular-nums" style={{ color: cat.accent }}>
                  {prog.completed.length}/{cat.exercises.length}
                </div>
              </div>
              <ProgressBar
                value={prog.completed.length}
                max={cat.exercises.length}
                color={cat.accent}
                height="h-2"
              />
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleReset}
        className="w-full py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        <RotateCcw size={14} />
        Réinitialiser ma progression
      </button>
    </div>
  );
}
