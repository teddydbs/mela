'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Check, Lock, Play, Search } from 'lucide-react';
import { CATEGORIES, TOTAL_EXERCISES, CATEGORY_IDS } from '@/lib/data/categories';
import { WEEKLY_PLAN, PHASE_COLORS } from '@/lib/data/weekly-plan';
import { useUserData } from '@/lib/use-user-data';
import {
  estimatedCurrentWeek,
  overallAccuracy,
  totalCompletedExercises,
} from '@/lib/storage';

const CATEGORY_ICONS = {
  tenses: '⏰',
  modals: '🎯',
  conditionals: '✨',
  gerunds: '📚',
  prepositions: '🧭',
} as const;

export default function HomePage() {
  const { data, loaded } = useUserData();
  const accuracy = overallAccuracy(data);
  const completed = totalCompletedExercises(data);
  const upcoming = TOTAL_EXERCISES - completed;
  const currentWeek = estimatedCurrentWeek(data);

  return (
    <div className="px-5 md:px-8 pt-6 pb-6 grid lg:grid-cols-[1fr_320px] gap-6">
      {/* MAIN COLUMN */}
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between mb-6 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
              My Learning Plan
              <span className="text-3xl md:text-4xl">🇦🇺</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              A2 → B1 en 12 semaines · Direction Sydney
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 min-w-[200px]">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
            />
          </div>
        </motion.div>

        {/* Stats horizontales */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="flex-1 bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-center">
            <div className="text-2xl font-extrabold tabular-nums leading-none">
              {TOTAL_EXERCISES}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mt-1">
              Total
            </div>
          </div>
          <div className="flex-1 bg-[#B5F0C9] rounded-2xl px-4 py-3 text-center relative">
            {completed > 0 && (
              <span className="absolute -top-2 -right-2 text-lg">🎉</span>
            )}
            <div className="text-2xl font-extrabold tabular-nums leading-none text-[#1F7A3F]">
              {loaded ? completed : 0}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#1F7A3F]/80 mt-1">
              Completed
            </div>
          </div>
          <div className="flex-1 bg-white border-2 border-dashed border-gray-200 rounded-2xl px-4 py-3 text-center">
            <div className="text-2xl font-extrabold tabular-nums leading-none text-gray-400">
              {loaded ? upcoming : TOTAL_EXERCISES}
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mt-1">
              Upcoming
            </div>
          </div>
        </motion.div>

        {/* Current featured lesson */}
        <CurrentFeaturedCard currentWeek={currentWeek} />

        {/* Learning path */}
        <div className="space-y-0">
          {CATEGORY_IDS.map((catId, i) => {
            const cat = CATEGORIES[catId];
            const prog = data.categoryProgress[catId] ?? {
              correct: 0,
              attempts: 0,
              completed: [],
            };
            const isCompleted = prog.completed.length === cat.exercises.length;
            const isInProgress = prog.completed.length > 0 && !isCompleted;
            const isLocked = false; // for now, all unlocked
            const sideAlternate = i % 2 === 1; // alternate left/right like in the design

            return (
              <div key={catId}>
                <LearningPathCard
                  category={cat}
                  emoji={CATEGORY_ICONS[catId]}
                  isCompleted={isCompleted}
                  isInProgress={isInProgress}
                  isLocked={isLocked}
                  completedCount={prog.completed.length}
                  totalCount={cat.exercises.length}
                  delay={0.1 + i * 0.06}
                  alignRight={sideAlternate}
                />
                {/* Dotted connector between cards (except after last) */}
                {i < CATEGORY_IDS.length - 1 && (
                  <div className="dotted-connector h-8 w-1 mx-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom mini bar with category emojis (decorative — like the design) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="hidden md:flex justify-center mt-10"
        >
          <div className="flex items-center gap-2 bg-[#0A0A0A] rounded-full px-4 py-2.5 shadow-lg">
            {CATEGORY_IDS.map((catId) => {
              const cat = CATEGORIES[catId];
              return (
                <Link
                  key={catId}
                  href={`/learn/${catId}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition active:scale-90 hover:scale-105"
                  style={{ backgroundColor: cat.bgLight }}
                  title={cat.name}
                >
                  {CATEGORY_ICONS[catId]}
                </Link>
              );
            })}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-white text-xl font-bold transition active:scale-90"
              aria-label="More"
            >
              +
            </button>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDEBAR (desktop only) */}
      <aside className="hidden lg:block">
        <MyEvents accuracy={accuracy} streak={data.streak} totalXP={data.totalXP} />
      </aside>
    </div>
  );
}

// ============================================================
// Featured current lesson card (violet pastel, like in design)
// ============================================================

function CurrentFeaturedCard({ currentWeek }: { currentWeek: number }) {
  const week = WEEKLY_PLAN[currentWeek - 1];
  const phaseColors = PHASE_COLORS[week.phase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative bg-[#E5C8E8] rounded-3xl p-6 mb-8 shadow-lg overflow-hidden"
    >
      {/* Decorative music notes */}
      <div className="absolute top-4 right-4 text-2xl opacity-60">🎵</div>
      <div className="absolute bottom-12 right-32 text-xl opacity-40">♪</div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-purple-900/60 mb-2">
            Semaine {currentWeek} · {week.phase}
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            {week.title}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">{week.goal}</p>

          {/* "Watching" pill */}
          <Link
            href={`/learn/${week.focus[0]}`}
            className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-bold text-gray-900 shadow-md active:scale-95 transition"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            En cours
          </Link>
        </div>

        {/* Big play button */}
        <Link
          href={`/practice/${week.focus[0]}`}
          className="hidden sm:flex flex-shrink-0 w-20 h-20 rounded-full bg-white items-center justify-center shadow-xl active:scale-90 transition hover:scale-105"
          style={{ boxShadow: `0 10px 30px -10px ${phaseColors.accent}80` }}
        >
          <Play size={28} fill="currentColor" className="text-gray-900 ml-1" />
        </Link>
      </div>

      {/* Decorative avatars (bottom) */}
      <div className="hidden sm:flex absolute bottom-3 right-3 -space-x-2">
        {['👧🏻', '🧑🏽', '🧒🏿'].map((emoji, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full bg-white border-2 border-[#E5C8E8] flex items-center justify-center text-lg shadow-sm"
          >
            {emoji}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================
// Learning Path Card (each grammar category)
// ============================================================

function LearningPathCard({
  category,
  emoji,
  isCompleted,
  isInProgress,
  isLocked,
  completedCount,
  totalCount,
  delay,
  alignRight,
}: {
  category: (typeof CATEGORIES)[keyof typeof CATEGORIES];
  emoji: string;
  isCompleted: boolean;
  isInProgress: boolean;
  isLocked: boolean;
  completedCount: number;
  totalCount: number;
  delay: number;
  alignRight: boolean;
}) {
  const statusBadge = isCompleted ? (
    <span className="inline-flex items-center gap-1 bg-[#B5F0C9] text-[#1F7A3F] text-[11px] font-bold px-2.5 py-1 rounded-full">
      Completed <span>👋</span>
    </span>
  ) : isInProgress ? (
    <span className="inline-flex items-center gap-1 bg-[#FFF4B3] text-[#9C7A37] text-[11px] font-bold px-2.5 py-1 rounded-full">
      In progress <span>⚡</span>
    </span>
  ) : isLocked ? (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
      Upcoming <Lock size={10} strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
      Upcoming 🔒
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}
    >
      <div className="relative bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm w-full sm:max-w-[420px] hover:border-gray-200 hover:shadow-md transition">
        {/* Small circular icon top-right */}
        <div
          className="absolute -top-3 right-5 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white"
          style={{ backgroundColor: category.bgLight }}
        >
          {emoji}
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-1 pr-10">
          {category.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {category.description}
        </p>

        <div className="flex items-center justify-between">
          {statusBadge}

          <div className="flex items-center gap-1.5">
            {/* Dot menu */}
            <button
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition"
              aria-label="Options"
            >
              <span className="text-xs font-bold tracking-tight">···</span>
            </button>
            {/* Action: lesson */}
            <Link
              href={`/learn/${category.id}`}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition active:scale-90"
              aria-label="Voir le cours"
              title="Cours"
            >
              <BookOpen size={13} strokeWidth={2.5} />
            </Link>
            {/* Action: practice (CTA) */}
            <Link
              href={`/practice/${category.id}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition active:scale-90 shadow-sm ${
                isCompleted
                  ? 'bg-[#1F7A3F] text-white'
                  : 'bg-[#0A0A0A] text-white hover:bg-gray-800'
              }`}
              aria-label="Faire les exercices"
              title="Exercices"
            >
              {isCompleted ? (
                <Check size={13} strokeWidth={3} />
              ) : (
                <Play size={11} fill="currentColor" className="ml-0.5" />
              )}
            </Link>
          </div>
        </div>

        {/* Progress line at bottom (only if started) */}
        {isInProgress && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className="text-gray-400 uppercase tracking-wider">Progression</span>
              <span className="tabular-nums" style={{ color: category.accent }}>
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                  background: `linear-gradient(90deg, ${category.accent}, ${category.accent}DD)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// Right sidebar: My Events
// ============================================================

function MyEvents({
  accuracy,
  streak,
  totalXP,
}: {
  accuracy: number;
  streak: number;
  totalXP: number;
}) {
  return (
    <div className="sticky top-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2 mb-5">
        Mes événements
        <span className="text-2xl">😉</span>
      </h2>

      <div className="space-y-3">
        {/* Daily check-in (mint) */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-extrabold">
                🔥
              </div>
              <span className="text-sm font-extrabold text-gray-900">Streak</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {todayDate()}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tu enchaînes <span className="font-extrabold text-gray-900">{streak} jour{streak > 1 ? 's' : ''}</span> d&apos;affilée. Continue pour ne pas casser la série !
          </p>
        </motion.div>

        {/* Accuracy card (violet) */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#E8DEFE] rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#AF52DE] flex items-center justify-center text-white text-xs font-extrabold">
                🎯
              </div>
              <span className="text-sm font-extrabold text-gray-900">Précision</span>
            </div>
            <span className="text-[11px] font-bold text-purple-900/60 uppercase tracking-wider">
              global
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            Tu réponds juste à <span className="font-extrabold text-gray-900">{accuracy}%</span> des
            questions. Vise au-dessus de 80% pour passer la catégorie.
          </p>
        </motion.div>

        {/* XP card (yellow) */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#FFF4B3] rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FFB800] flex items-center justify-center text-white text-xs font-extrabold">
                ⭐
              </div>
              <span className="text-sm font-extrabold text-gray-900">XP gagnés</span>
            </div>
            <span className="text-[11px] font-bold text-yellow-900/60 uppercase tracking-wider">
              total
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-extrabold text-gray-900 text-base">{totalXP} XP</span> accumulés.
            +10 par bonne réponse, +2 par tentative.
          </p>
        </motion.div>

        {/* Reminder mint */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#D6F5DD] rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#34C759] flex items-center justify-center text-white text-xs font-extrabold">
                💡
              </div>
              <span className="text-sm font-extrabold text-gray-900">Tip du jour</span>
            </div>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            Privilégie 15 min/jour à 1h une fois par semaine. La régularité bat l&apos;intensité.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function todayDate() {
  const days = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
  const d = new Date();
  return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}
