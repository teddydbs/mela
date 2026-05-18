'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Dumbbell, Flame } from 'lucide-react';
import { CATEGORIES, TOTAL_EXERCISES } from '@/lib/data/categories';
import { ProgressBar } from '@/components/progress-bar';
import { useUserData } from '@/lib/use-user-data';
import { overallAccuracy, todayISO } from '@/lib/storage';

export default function HomePage() {
  const { data, loaded } = useUserData();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning, Teddy' : hour < 18 ? 'Good afternoon, Teddy' : 'Good evening, Teddy';
  const accuracy = overallAccuracy(data);
  const completedToday = data.lastActive === todayISO();

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-4">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">
          {greeting} 👋
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">
          Ready for
          <br />
          Australia ?
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          A2 → B1 en 12 semaines. Cap sur Sydney.
        </p>
      </motion.div>

      {/* Hero card aujourd'hui */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-6 relative overflow-hidden rounded-3xl shadow-lg shadow-[#FF6B35]/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] via-[#FF8C5A] to-[#FFB800]" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        <div className="relative p-6 text-white">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
                Aujourd&apos;hui
              </div>
              <div className="text-2xl font-black leading-tight">
                {completedToday ? 'Mission accomplie ✓' : "C'est l'heure !"}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Flame size={22} className="text-white" fill={data.streak > 0 ? 'white' : 'none'} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <div className="text-3xl font-black tabular-nums leading-none">
                {loaded ? data.streak : 0}
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mt-1">
                jours
              </div>
            </div>
            <div>
              <div className="text-3xl font-black tabular-nums leading-none">
                {loaded ? accuracy : 0}
                <span className="text-lg">%</span>
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mt-1">
                précision
              </div>
            </div>
            <div>
              <div className="text-3xl font-black tabular-nums leading-none">
                {loaded ? data.totalXP : 0}
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mt-1">
                XP
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catégories</h2>
        <span className="text-xs text-gray-400 font-semibold">{TOTAL_EXERCISES} exercices</span>
      </div>

      <div className="space-y-3">
        {Object.entries(CATEGORIES).map(([key, cat], i) => {
          const prog = data.categoryProgress[cat.id] ?? { correct: 0, attempts: 0, completed: [] };
          const pct =
            cat.exercises.length > 0
              ? Math.round((prog.completed.length / cat.exercises.length) * 100)
              : 0;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm shadow-gray-100"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
                    boxShadow: `0 8px 20px -10px ${cat.accent}80`,
                  }}
                >
                  <span>{cat.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-base leading-tight">
                    {cat.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{cat.description}</div>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <ProgressBar
                    value={prog.completed.length}
                    max={cat.exercises.length}
                    color={cat.accent}
                    height="h-2"
                  />
                </div>
                <div className="text-xs font-bold tabular-nums" style={{ color: cat.accent }}>
                  {prog.completed.length}/{cat.exercises.length}
                </div>
              </div>

              {/* Actions séparées : Cours / Exercices */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/learn/${cat.id}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-sm font-bold transition active:scale-[0.97] border-2"
                  style={{
                    backgroundColor: cat.bgLight,
                    color: cat.accent,
                    borderColor: 'transparent',
                  }}
                >
                  <BookOpen size={15} strokeWidth={2.5} />
                  Cours
                </Link>
                <Link
                  href={`/practice/${cat.id}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-sm font-bold transition active:scale-[0.97] text-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
                    boxShadow: `0 6px 16px -8px ${cat.accent}80`,
                  }}
                >
                  <Dumbbell size={15} strokeWidth={2.5} />
                  Exercices
                  {pct === 100 && <span className="text-xs">✓</span>}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
