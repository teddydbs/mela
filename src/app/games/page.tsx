'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  BookOpenCheck,
  Construction,
  Ear,
  Gamepad2,
  Grid3x3,
  Lock,
  Play,
  Sparkles,
  Trophy,
  Type,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUserData } from '@/lib/use-user-data';
import { formatDuration } from '@/lib/storage';
import { MEMORY_THEME_IDS } from '@/lib/data/memory';

type GameTile = {
  Icon: LucideIcon;
  name: string;
  desc: string;
  bg: string;
  color: string;
  href?: string;
};

const ACTIVE_GAMES: GameTile[] = [
  {
    Icon: Grid3x3,
    name: 'Memory Match',
    desc: 'Retourner les cartes FR ↔ EN',
    bg: '#FFE4D6',
    color: '#FF6B35',
    href: '/games/memory',
  },
  {
    Icon: BookOpenCheck,
    name: 'Translation Stories',
    desc: 'Réécrire des mini-histoires en anglais',
    bg: '#D6F5DD',
    color: '#34C759',
    href: '/games/stories',
  },
];

const UPCOMING_GAMES: GameTile[] = [
  {
    Icon: Type,
    name: 'Fill the blank',
    desc: 'Tape le mot manquant façon Wordle',
    bg: '#FFF4CC',
    color: '#FFB800',
  },
  {
    Icon: ArrowUpDown,
    name: 'Sentence Builder',
    desc: 'Remettre une phrase dans l’ordre',
    bg: '#EFD9F7',
    color: '#AF52DE',
  },
  {
    Icon: Ear,
    name: 'Listening Drill',
    desc: 'Écouter et transcrire',
    bg: '#D7E8FF',
    color: '#007AFF',
  },
];

export default function GamesPage() {
  const { data, loaded } = useUserData();
  const memoryStats = data.games?.memory;
  const memoryPlaysTotal = loaded && memoryStats
    ? MEMORY_THEME_IDS.reduce((sum, t) => sum + (memoryStats[t]?.plays ?? 0), 0)
    : 0;
  const memoryBestTime = loaded && memoryStats
    ? MEMORY_THEME_IDS.reduce<number | null>((best, t) => {
        const time = memoryStats[t]?.bestTimeMs;
        if (!time) return best;
        return best === null ? time : Math.min(best, time);
      }, null)
    : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
          Jeux
          <Gamepad2 size={26} className="text-[#34C759]" strokeWidth={2.5} />
        </h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">
          5 mini-jeux pour bosser l&apos;anglais en s&apos;amusant.
        </p>
      </motion.div>

      {/* Featured Memory Match card */}
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
            Disponible maintenant
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            Memory Match · 5 thèmes
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Food, work, travel, daily, emergencies. 8 paires par partie, FR ↔ EN. Bats ton record.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/games/memory"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white rounded-full px-5 py-2.5 font-extrabold text-sm active:scale-95 transition shadow-md"
            >
              <Play size={13} fill="white" />
              Jouer
            </Link>
            {memoryPlaysTotal > 0 && (
              <span className="inline-flex items-center gap-1 bg-white/60 backdrop-blur-sm text-[#1F7A3F] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                <Trophy size={11} strokeWidth={3} />
                {memoryPlaysTotal} partie{memoryPlaysTotal > 1 ? 's' : ''}
                {memoryBestTime !== null && ` · ${formatDuration(memoryBestTime)}`}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active games */}
      <h2 className="text-lg font-extrabold text-gray-900 mb-3">Disponibles</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-7">
        {ACTIVE_GAMES.map((game, i) => {
          const Icon = game.Icon;
          return (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <Link
                href={game.href!}
                className="relative block bg-white border-2 border-gray-100 hover:border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
              >
                <div className="absolute -top-3 right-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border-2 border-white"
                    style={{ backgroundColor: game.bg, color: game.color }}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="pr-14 mb-3">
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                    {game.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{game.desc}</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 bg-[#B5F0C9] text-[#1F7A3F] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    <Sparkles size={10} strokeWidth={3} />
                    Disponible
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}DD)` }}
                  >
                    <Play size={12} strokeWidth={3} fill="white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-extrabold text-gray-900">Bientôt</h2>
        <Construction size={16} className="text-gray-400" strokeWidth={2.5} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {UPCOMING_GAMES.map((game, i) => {
          const Icon = game.Icon;
          return (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="relative bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 opacity-70"
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: game.bg, color: game.color }}
              >
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-gray-900 text-base leading-tight">
                  {game.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{game.desc}</div>
              </div>
              <Lock size={14} className="text-gray-300 flex-shrink-0" strokeWidth={2.5} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
