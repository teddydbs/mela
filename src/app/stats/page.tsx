'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Check,
  Dumbbell,
  Flame,
  RotateCcw,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES, CATEGORY_IDS, TOTAL_EXERCISES } from '@/lib/data/categories';
import { CategoryIconCircle } from '@/components/category-icon';
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

  const heroCards: {
    label: string;
    value: number;
    suffix: string;
    bg: string;
    accent: string;
    Icon: LucideIcon;
  }[] = [
    {
      label: 'Exercices',
      value: data.totalAttempts,
      suffix: '',
      bg: '#FFE4D6',
      accent: '#FF6B35',
      Icon: Dumbbell,
    },
    {
      label: 'Précision',
      value: accuracy,
      suffix: '%',
      bg: '#D6F5DD',
      accent: '#34C759',
      Icon: Target,
    },
    {
      label: 'Série',
      value: data.streak,
      suffix: 'j',
      bg: '#FFF4CC',
      accent: '#FFB800',
      Icon: Flame,
    },
    {
      label: 'Complétés',
      value: totalCompleted,
      suffix: `/${TOTAL_EXERCISES}`,
      bg: '#D7E8FF',
      accent: '#007AFF',
      Icon: Check,
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
          Mes progrès
          <BarChart3 size={26} className="text-[#AF52DE]" strokeWidth={2.5} />
        </h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">
          {data.totalAttempts} exercices · {totalCompleted} complété
          {totalCompleted !== 1 && 's'} sur {TOTAL_EXERCISES}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {heroCards.map((card, i) => {
          const Icon = card.Icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="relative rounded-3xl p-5 shadow-sm overflow-hidden"
              style={{ backgroundColor: card.bg }}
            >
              <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                <Icon size={16} strokeWidth={2.5} style={{ color: card.accent }} />
              </div>
              <div
                className="text-[10px] uppercase tracking-widest font-extrabold mb-1"
                style={{ color: card.accent }}
              >
                {card.label}
              </div>
              <div className="text-3xl font-extrabold tabular-nums leading-none text-gray-900">
                {card.value}
                {card.suffix && <span className="text-xl opacity-70">{card.suffix}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <h2 className="text-lg font-extrabold text-gray-900 mb-3">Par catégorie</h2>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {CATEGORY_IDS.map((catId, i) => {
          const cat = CATEGORIES[catId];
          const prog = data.categoryProgress[cat.id] ?? { correct: 0, attempts: 0, completed: [] };
          const catAccuracy =
            prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;
          const pct = Math.round((prog.completed.length / cat.exercises.length) * 100);
          return (
            <motion.div
              key={catId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="relative bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm hover:border-gray-200 transition"
            >
              <div className="absolute -top-3 right-5">
                <CategoryIconCircle catId={cat.id} size={40} iconSize={18} variant="tint" className="shadow-md border-2 border-white" />
              </div>

              <div className="text-base font-extrabold text-gray-900 leading-tight mb-1 pr-12">
                {cat.name}
              </div>
              <div className="text-xs text-gray-500 tabular-nums font-semibold mb-3">
                {prog.correct}/{prog.attempts} · {catAccuracy}% précis
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                <span className="text-gray-400 uppercase tracking-wider">
                  {prog.completed.length}/{cat.exercises.length}
                </span>
                <span className="tabular-nums" style={{ color: cat.accent }}>
                  {pct}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${cat.accent}, ${cat.accent}DD)`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleReset}
        className="w-full sm:w-auto sm:mx-auto sm:flex px-6 py-3 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl text-sm font-extrabold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        <RotateCcw size={14} />
        Réinitialiser ma progression
      </button>
    </div>
  );
}
