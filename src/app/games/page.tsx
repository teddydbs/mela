'use client';

import { motion } from 'framer-motion';
import { Construction, Sparkles } from 'lucide-react';

export default function GamesPage() {
  const upcoming = [
    { emoji: '🃏', name: 'Memory Match', desc: 'Retourner les cartes FR ↔ EN' },
    { emoji: '⚡', name: 'Speed Translation', desc: 'Trouver le max de traductions en temps limité' },
    { emoji: '🪜', name: 'Mot à compléter', desc: 'Fill-in-the-blank rapide façon Wordle' },
    { emoji: '🧩', name: 'Sentence Builder', desc: 'Remettre une phrase dans le bon ordre' },
    { emoji: '🎯', name: 'Listening Drill', desc: 'Écouter et transcrire' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">
          Jeux
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight mb-2">
          Bientôt 🎮
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          5+ mini-jeux pour bosser l&apos;anglais en s&apos;amusant. Arrive en Phase 2.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#AF52DE] to-[#7B5DFA] text-white shadow-lg shadow-[#AF52DE]/20"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Construction size={22} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-black mb-1">En cours de fabrication</div>
            <p className="text-sm opacity-90 leading-relaxed">
              Les jeux interactifs arrivent juste après la base. Tu seras notifié quand c&apos;est
              prêt.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">
        Ce qui arrive
      </div>
      <div className="space-y-2.5">
        {upcoming.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm shadow-gray-100"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">
              {game.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-sm">{game.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{game.desc}</div>
            </div>
            <Sparkles size={14} className="text-gray-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
