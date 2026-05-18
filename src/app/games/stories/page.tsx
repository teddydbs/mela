'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  ChevronRight,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  STORIES,
  STORIES_INSTRUCTIONS,
  STORY_LEVELS,
  STORY_LEVEL_COLORS,
  STORY_THEMES,
} from '@/lib/data/stories';
import { useUserData } from '@/lib/use-user-data';
import type { StoryLevel, StoryTheme } from '@/lib/types';

const THEME_FILTERS: (StoryTheme | 'all')[] = [
  'all',
  'daily',
  'food',
  'work',
  'travel',
  'emergencies',
  'mixed',
];

export default function StoriesIndexPage() {
  const { data, loaded } = useUserData();
  const [levelFilter, setLevelFilter] = useState<StoryLevel | 'all'>('all');
  const [themeFilter, setThemeFilter] = useState<StoryTheme | 'all'>('all');

  const stats = loaded ? data.games?.stories : undefined;
  const completedSet = useMemo(() => new Set(stats?.completed ?? []), [stats]);

  const filtered = useMemo(() => {
    return STORIES.filter((s) => {
      if (levelFilter !== 'all' && s.level !== levelFilter) return false;
      if (themeFilter !== 'all' && s.theme !== themeFilter) return false;
      return true;
    });
  }, [levelFilter, themeFilter]);

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-3 mb-5"
      >
        <Link
          href="/games"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition active:scale-95 flex-shrink-0 mt-1"
          aria-label="Retour aux jeux"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3 flex-wrap">
            Translation Stories
            <BookOpenCheck size={26} className="text-[#34C759]" strokeWidth={2.5} />
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Réécris en anglais des mini-histoires françaises avec le vocab vu.
          </p>
        </div>
      </motion.div>

      {/* Featured rules card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative bg-[#D6F5DD] rounded-3xl p-5 sm:p-6 mb-6 shadow-lg overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
        <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
          <Sparkles size={22} className="text-[#34C759]" strokeWidth={2.5} />
        </div>
        <div className="relative max-w-md">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#1F7A3F] mb-2">
            Comment jouer
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            20 mini-histoires · A2 → C1
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            {STORIES_INSTRUCTIONS}
          </p>
          {stats && stats.attempts > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <span className="inline-flex items-center gap-1 bg-white/60 backdrop-blur-sm text-[#1F7A3F] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                <Check size={11} strokeWidth={3} />
                {completedSet.size}/{STORIES.length} terminées
              </span>
              <span className="inline-flex items-center gap-1 bg-white/60 backdrop-blur-sm text-[#1F7A3F] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                <Trophy size={11} strokeWidth={3} />
                {stats.attempts} essais
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-2">
            Niveau
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <FilterPill
              active={levelFilter === 'all'}
              onClick={() => setLevelFilter('all')}
              label="Tous"
            />
            {STORY_LEVELS.map((lvl) => {
              const c = STORY_LEVEL_COLORS[lvl];
              return (
                <FilterPill
                  key={lvl}
                  active={levelFilter === lvl}
                  onClick={() => setLevelFilter(lvl)}
                  label={lvl}
                  accent={c.accent}
                  bg={c.bgLight}
                />
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-2">
            Thème
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {THEME_FILTERS.map((th) => {
              if (th === 'all') {
                return (
                  <FilterPill
                    key="all"
                    active={themeFilter === 'all'}
                    onClick={() => setThemeFilter('all')}
                    label="Tous"
                  />
                );
              }
              const meta = STORY_THEMES[th];
              return (
                <FilterPill
                  key={th}
                  active={themeFilter === th}
                  onClick={() => setThemeFilter(th)}
                  label={meta.name}
                  accent={meta.accent}
                  bg={meta.bgLight}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Story cards grid */}
      <h2 className="text-lg font-extrabold text-gray-900 mb-3">
        {filtered.length} histoire{filtered.length > 1 ? 's' : ''}
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((story, i) => {
          const themeMeta = STORY_THEMES[story.theme];
          const levelColors = STORY_LEVEL_COLORS[story.level];
          const Icon = themeMeta.icon;
          const isCompleted = completedSet.has(story.id);
          const bestScore = stats?.bestScores?.[story.id];

          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + Math.min(i, 8) * 0.03 }}
            >
              <Link
                href={`/games/stories/${story.id}`}
                className="relative block bg-white border-2 border-gray-100 hover:border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
              >
                {/* Floating icon */}
                <div className="absolute -top-3 right-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border-2 border-white"
                    style={{ backgroundColor: themeMeta.bgLight, color: themeMeta.accent }}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="pr-14 mb-3">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span
                      className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: levelColors.bgLight, color: levelColors.accent }}
                    >
                      {story.level}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">
                      #{String(story.id).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                    {story.title_fr}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">
                    {story.fr}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 bg-[#B5F0C9] text-[#1F7A3F] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        <Check size={10} strokeWidth={3} />
                        {bestScore !== undefined ? `${bestScore} pts` : 'Réussie'}
                      </span>
                    ) : bestScore !== undefined ? (
                      <span className="inline-flex items-center gap-1 bg-[#FFF4B3] text-[#9C7A37] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        <Sparkles size={10} strokeWidth={3} />
                        Best : {bestScore} pts
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Jamais jouée
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {story.target_words.length} mots
                    </span>
                  </div>

                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${themeMeta.accent}, ${themeMeta.accent}DD)`,
                    }}
                  >
                    <Play size={12} strokeWidth={3} fill="white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 text-center">
          <p className="text-sm text-gray-500 font-semibold">
            Aucune histoire ne correspond à ces filtres.
          </p>
        </div>
      )}

      {/* Cross-link */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/games"
          className="inline-flex items-center gap-1 text-xs text-gray-500 font-semibold hover:text-gray-900 transition"
        >
          Voir les autres jeux
          <ChevronRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: string;
  bg?: string;
}

function FilterPill({ active, onClick, label, accent, bg }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center text-[11px] font-extrabold px-3 py-1.5 rounded-full transition active:scale-95"
      style={
        active
          ? {
              backgroundColor: accent ?? '#0A0A0A',
              color: '#FFFFFF',
            }
          : {
              backgroundColor: bg ?? '#F3F4F6',
              color: accent ?? '#6B7280',
            }
      }
    >
      {label}
    </button>
  );
}
