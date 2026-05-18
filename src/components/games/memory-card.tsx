'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export type CardSide = 'en' | 'fr';

export interface MemoryCardData {
  cardId: string;
  pairId: string;
  side: CardSide;
  value: string;
}

interface Props {
  card: MemoryCardData;
  isFlipped: boolean;
  isMatched: boolean;
  isLocked: boolean;
  accent: string;
  bgLight: string;
  onClick: () => void;
}

export function MemoryCard({ card, isFlipped, isMatched, isLocked, accent, bgLight, onClick }: Props) {
  const showFace = isFlipped || isMatched;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked || isMatched || isFlipped}
      aria-label={showFace ? `${card.value} (${card.side === 'en' ? 'anglais' : 'français'})` : 'Carte cachée'}
      className="relative w-full aspect-[3/4] [perspective:1000px] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl"
      style={{ ['--ring-color' as string]: accent }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: showFace ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — hidden face */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-gray-100 bg-white flex items-center justify-center shadow-sm"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: bgLight, color: accent }}
          >
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
        </div>

        {/* Back — value face */}
        <div
          className="absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center px-2 text-center transition-colors"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: isMatched ? '#E8F8EC' : 'white',
            borderColor: isMatched ? '#34C759' : accent,
          }}
        >
          <span
            className="absolute top-1.5 right-2 text-[9px] uppercase tracking-widest font-extrabold opacity-60"
            style={{ color: isMatched ? '#1F7A3F' : accent }}
          >
            {card.side}
          </span>
          <span
            className="font-extrabold text-xs sm:text-sm leading-tight break-words text-gray-900"
            style={{ color: isMatched ? '#1F7A3F' : undefined }}
          >
            {card.value}
          </span>
        </div>
      </motion.div>
    </button>
  );
}
