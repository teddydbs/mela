'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Lightbulb,
  Lock,
  MapPin,
  MoreHorizontal,
  Play,
  Search,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { CATEGORIES, TOTAL_EXERCISES, CATEGORY_IDS } from '@/lib/data/categories';
import { WEEKLY_PLAN, PHASE_COLORS } from '@/lib/data/weekly-plan';
import { useUserData } from '@/lib/use-user-data';
import {
  estimatedCurrentWeek,
  overallAccuracy,
  totalCompletedExercises,
} from '@/lib/storage';
import { CategoryIconCircle } from '@/components/category-icon';
import { AvatarStack } from '@/components/avatar';
import type { CategoryId } from '@/lib/types';

export default function HomePage() {
  const { data, loaded } = useUserData();
  const accuracy = overallAccuracy(data);
  const completed = totalCompletedExercises(data);
  const upcoming = TOTAL_EXERCISES - completed;
  const currentWeek = estimatedCurrentWeek(data);

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 grid lg:grid-cols-[1fr_300px] gap-6">
      {/* MAIN COLUMN */}
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-4 mb-5 flex-wrap"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
              My Learning Plan
              <MapPin
                size={28}
                className="text-[#FF6B35]"
                fill="#FFD9C7"
                strokeWidth={2.5}
              />
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              A2 → B1 en 12 semaines · Direction Sydney
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 w-full sm:w-auto sm:min-w-[220px]">
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
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-center">
            <div className="text-2xl font-extrabold tabular-nums leading-none text-gray-900">
              {TOTAL_EXERCISES}
            </div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">
              Total
            </div>
          </div>
          <div className="bg-[#B5F0C9] rounded-2xl px-4 py-3.5 text-center relative">
            {completed > 0 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Sparkles size={13} className="text-[#FFB800]" fill="#FFB800" />
              </div>
            )}
            <div className="text-2xl font-extrabold tabular-nums leading-none text-[#1F7A3F]">
              {loaded ? completed : 0}
            </div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-[#1F7A3F]/80 mt-1">
              Completed
            </div>
          </div>
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl px-4 py-3.5 text-center">
            <div className="text-2xl font-extrabold tabular-nums leading-none text-gray-400">
              {loaded ? upcoming : TOTAL_EXERCISES}
            </div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">
              Upcoming
            </div>
          </div>
        </motion.div>

        {/* Featured current lesson */}
        <FeaturedCard currentWeek={currentWeek} />

        {/* Learning path */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {CATEGORY_IDS.map((catId, i) => {
            const cat = CATEGORIES[catId];
            const prog = data.categoryProgress[catId] ?? {
              correct: 0,
              attempts: 0,
              completed: [],
            };
            const isCompleted = prog.completed.length === cat.exercises.length;
            const isInProgress = prog.completed.length > 0 && !isCompleted;
            return (
              <CategoryCard
                key={catId}
                catId={catId}
                category={cat}
                isCompleted={isCompleted}
                isInProgress={isInProgress}
                completedCount={prog.completed.length}
                totalCount={cat.exercises.length}
                delay={0.1 + i * 0.05}
                index={i}
              />
            );
          })}
        </div>

        {/* Bottom decorative sticker bar (desktop) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="hidden md:flex justify-center mt-8"
        >
          <div className="flex items-center gap-2 bg-[#0A0A0A] rounded-full px-4 py-2.5 shadow-lg">
            {CATEGORY_IDS.map((catId) => (
              <Link
                key={catId}
                href={`/learn/${catId}`}
                className="transition active:scale-90 hover:scale-110"
                title={CATEGORIES[catId].name}
              >
                <CategoryIconCircle catId={catId} size={40} iconSize={18} variant="tint" />
              </Link>
            ))}
            <Link
              href="/plan"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-white text-xl font-bold transition active:scale-90 hover:bg-gray-600"
              aria-label="More"
            >
              +
            </Link>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:block">
        <MyEvents accuracy={accuracy} streak={data.streak} totalXP={data.totalXP} />
      </aside>
    </div>
  );
}

function FeaturedCard({ currentWeek }: { currentWeek: number }) {
  const week = WEEKLY_PLAN[currentWeek - 1];
  const phaseColors = PHASE_COLORS[week.phase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative bg-[#E5C8E8] rounded-3xl p-6 mb-6 shadow-lg overflow-hidden"
    >
      {/* Decorative blobs (no emojis) */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

      <div className="flex items-center gap-6 relative z-10 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-purple-900/70 mb-2">
            Semaine {currentWeek} · {week.phase}
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
            {week.title}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4 max-w-lg">{week.goal}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/practice/${week.focus[0]}`}
              className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-gray-900 shadow-md active:scale-95 transition hover:scale-105"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Reprendre
            </Link>
            <Link
              href={`/learn/${week.focus[0]}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-900/70 hover:text-purple-900"
            >
              Voir le cours
              <ChevronRight size={14} strokeWidth={3} />
            </Link>
          </div>

          {/* Avatars */}
          <div className="flex items-center gap-3 mt-5">
            <AvatarStack count={4} size={32} />
            <span className="text-xs font-semibold text-purple-900/60">
              +28 apprenants cette semaine
            </span>
          </div>
        </div>

        <Link
          href={`/practice/${week.focus[0]}`}
          className="hidden sm:flex flex-shrink-0 w-24 h-24 rounded-full bg-white items-center justify-center shadow-xl active:scale-90 transition hover:scale-105"
          style={{ boxShadow: `0 12px 36px -10px ${phaseColors.accent}AA` }}
        >
          <Play size={32} fill="currentColor" className="text-gray-900 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
}

function CategoryCard({
  catId,
  category,
  isCompleted,
  isInProgress,
  completedCount,
  totalCount,
  delay,
  index,
}: {
  catId: CategoryId;
  category: (typeof CATEGORIES)[keyof typeof CATEGORIES];
  isCompleted: boolean;
  isInProgress: boolean;
  completedCount: number;
  totalCount: number;
  delay: number;
  index: number;
}) {
  const statusBadge = isCompleted ? (
    <span className="inline-flex items-center gap-1 bg-[#B5F0C9] text-[#1F7A3F] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
      <Check size={11} strokeWidth={3} />
      Completed
    </span>
  ) : isInProgress ? (
    <span className="inline-flex items-center gap-1 bg-[#FFF4B3] text-[#9C7A37] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
      <Sparkles size={11} strokeWidth={2.5} />
      In progress
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
      <Lock size={10} strokeWidth={3} />
      Upcoming
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm hover:border-gray-200 hover:shadow-md transition ${
        index === 1 ? 'sm:mt-8' : index === 3 ? 'sm:mt-8' : ''
      }`}
    >
      <div className="absolute -top-3 right-5">
        <CategoryIconCircle catId={catId} size={42} iconSize={20} variant="tint" className="shadow-md border-2 border-white" />
      </div>

      <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-1 pr-14">
        {category.name}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {category.description}
      </p>

      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold mb-4">
        <span className="flex items-center gap-1">
          <Clock size={11} strokeWidth={2.5} />
          ~{Math.ceil(totalCount * 0.7)} min
        </span>
        <span className="text-gray-200">·</span>
        <span className="flex items-center gap-1">
          <Target size={11} strokeWidth={2.5} />
          {totalCount} exercices
        </span>
      </div>

      {(isInProgress || isCompleted) && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
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

      <div className="flex items-center justify-between gap-2">
        {statusBadge}

        <div className="flex items-center gap-1.5">
          <button
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition"
            aria-label="Options"
          >
            <MoreHorizontal size={14} strokeWidth={2.5} />
          </button>
          <Link
            href={`/learn/${category.id}`}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition active:scale-90"
            aria-label="Voir le cours"
            title="Cours"
          >
            <BookOpen size={14} strokeWidth={2.5} />
          </Link>
          <Link
            href={`/practice/${category.id}`}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-90 shadow-sm ${
              isCompleted ? 'bg-[#1F7A3F] text-white' : 'bg-[#0A0A0A] text-white hover:bg-gray-800'
            }`}
            aria-label="Faire les exercices"
            title="Exercices"
          >
            {isCompleted ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <Play size={12} fill="currentColor" className="ml-0.5" />
            )}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function MyEvents({
  accuracy,
  streak,
  totalXP,
}: {
  accuracy: number;
  streak: number;
  totalXP: number;
}) {
  const cards = [
    {
      title: 'Streak',
      Icon: Flame,
      iconColor: 'bg-[#FF6B35]',
      bg: 'bg-white border-2 border-gray-100',
      meta: todayDate(),
      body: (
        <>
          Tu enchaînes{' '}
          <span className="font-extrabold text-gray-900">
            {streak} jour{streak > 1 ? 's' : ''}
          </span>{' '}
          d&apos;affilée. Continue !
        </>
      ),
    },
    {
      title: 'Précision',
      Icon: Target,
      iconColor: 'bg-[#AF52DE]',
      bg: 'bg-[#E8DEFE]',
      meta: 'global',
      body: (
        <>
          Tu réponds juste à <span className="font-extrabold text-gray-900">{accuracy}%</span> des
          questions. Vise au-dessus de 80%.
        </>
      ),
    },
    {
      title: 'XP gagnés',
      Icon: Star,
      iconColor: 'bg-[#FFB800]',
      bg: 'bg-[#FFF4B3]',
      meta: 'total',
      body: (
        <>
          <span className="font-extrabold text-gray-900 text-base">{totalXP} XP</span> accumulés.
          +10 par bonne réponse.
        </>
      ),
    },
    {
      title: 'Tip du jour',
      Icon: Lightbulb,
      iconColor: 'bg-[#34C759]',
      bg: 'bg-[#D6F5DD]',
      meta: '',
      body: <>Privilégie 15 min/jour à 1h une fois par semaine. La régularité bat l&apos;intensité.</>,
    },
  ];

  return (
    <div className="sticky top-4">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-5 flex items-center gap-2">
        Mes événements
        <Sparkles size={20} className="text-[#FFB800]" fill="#FFB800" />
      </h2>

      <div className="space-y-3">
        {cards.map((card, i) => {
          const Icon = card.Icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className={`${card.bg} rounded-2xl p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${card.iconColor} flex items-center justify-center text-white`}>
                    <Icon size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">{card.title}</span>
                </div>
                {card.meta && (
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {card.meta}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{card.body}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function todayDate() {
  const days = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
  const d = new Date();
  return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}
