'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Grid3x3, Play, Sparkles, Trophy } from 'lucide-react';
import { MEMORY_THEMES, MEMORY_THEME_IDS, getMemoryPairs } from '@/lib/data/memory';
import { formatDuration, getMemoryStats } from '@/lib/storage';
import { useUserData } from '@/lib/use-user-data';

export default function MemoryHomePage() {
  const { data, loaded } = useUserData();

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
            Memory Match
            <Grid3x3 size={26} className="text-[#FF6B35]" strokeWidth={2.5} />
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Retourne les cartes pour matcher chaque mot FR avec son équivalent EN.
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
        <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
          <Sparkles size={22} className="text-[#34C759]" strokeWidth={2.5} />
        </div>
        <div className="relative max-w-md">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#1F7A3F] mb-2">
            Comment jouer
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            8 paires, 16 cartes, 1 chrono
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Choisis un thème, retourne deux cartes par tour. Si elles forment une paire FR/EN,
            elles restent visibles. Minimise les coups, bats ton record.
          </p>
        </div>
      </motion.div>

      {/* Theme grid */}
      <h2 className="text-lg font-extrabold text-gray-900 mb-3">Choisis un thème</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {MEMORY_THEME_IDS.map((id, i) => {
          const meta = MEMORY_THEMES[id];
          const Icon = meta.icon;
          const stats = loaded ? getMemoryStats(data, id) : undefined;
          const totalPairs = getMemoryPairs(id).length;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <Link
                href={`/games/memory/${id}`}
                className="relative block bg-white border-2 border-gray-100 hover:border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
              >
                {/* Floating icon */}
                <div className="absolute -top-3 right-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border-2 border-white"
                    style={{ backgroundColor: meta.bgLight, color: meta.accent }}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="pr-14 mb-3">
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                    {meta.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{meta.description}</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: meta.bgLight, color: meta.accent }}
                    >
                      {totalPairs} paires
                    </span>
                    {stats ? (
                      <span className="inline-flex items-center gap-1 bg-[#B5F0C9] text-[#1F7A3F] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        <Trophy size={10} strokeWidth={3} />
                        {formatDuration(stats.bestTimeMs)} · {stats.bestMoves} coups
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Jamais joué
                      </span>
                    )}
                  </div>

                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}DD)`,
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
