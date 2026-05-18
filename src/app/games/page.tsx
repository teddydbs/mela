'use client';

import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  ArrowUpDown,
  Construction,
  Ear,
  Gamepad2,
  Grid3x3,
  Sparkles,
  Type,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type UpcomingGame = {
  Icon: LucideIcon;
  name: string;
  desc: string;
  bg: string;
  color: string;
};

const UPCOMING_GAMES: UpcomingGame[] = [
  {
    Icon: Grid3x3,
    name: 'Memory Match',
    desc: 'Retourner les cartes FR ↔ EN',
    bg: '#FFE4D6',
    color: '#FF6B35',
  },
  {
    Icon: ArrowRightLeft,
    name: 'Speed Translation',
    desc: 'Max de traductions en temps limité',
    bg: '#D6F5DD',
    color: '#34C759',
  },
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
          5+ mini-jeux pour bosser l&apos;anglais en s&apos;amusant. Arrive en Phase 2.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative bg-[#D6F5DD] rounded-3xl p-6 mb-6 shadow-lg overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
        <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
          <Construction size={22} className="text-[#34C759]" strokeWidth={2.5} />
        </div>
        <div className="relative max-w-md">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#1F7A3F] mb-2">
            En cours de fabrication
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-2">
            Les jeux arrivent bientôt
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            5 mini-jeux interactifs pour bosser le vocabulaire et la grammaire en s&apos;amusant.
            Toutes les data sont déjà prêtes dans le seed.
          </p>
        </div>
      </motion.div>

      <h2 className="text-lg font-extrabold text-gray-900 mb-3">Ce qui arrive</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {UPCOMING_GAMES.map((game, i) => {
          const Icon = game.Icon;
          return (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="relative bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4"
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
              <Sparkles size={16} className="text-gray-300 flex-shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
