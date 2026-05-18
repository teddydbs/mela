'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, Hash, RotateCcw, Timer, Trophy } from 'lucide-react';
import { MemoryCard, type MemoryCardData } from './memory-card';
import { MEMORY_THEMES, getMemoryPairs } from '@/lib/data/memory';
import { formatDuration, getMemoryStats } from '@/lib/storage';
import { useUserData } from '@/lib/use-user-data';
import type { MemoryTheme } from '@/lib/types';

const PAIRS_PER_GAME = 8;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildDeck(theme: MemoryTheme): MemoryCardData[] {
  const pool = getMemoryPairs(theme);
  const picked = shuffle(pool).slice(0, PAIRS_PER_GAME);
  const cards = picked.flatMap((pair, idx) => {
    const pairId = `${idx}`;
    return [
      { cardId: `${pairId}-en`, pairId, side: 'en' as const, value: pair.en },
      { cardId: `${pairId}-fr`, pairId, side: 'fr' as const, value: pair.fr },
    ];
  });
  return shuffle(cards);
}

interface Props {
  theme: MemoryTheme;
}

export function MemoryGame({ theme }: Props) {
  const meta = MEMORY_THEMES[theme];
  const Icon = meta.icon;
  const { data, loaded, recordMemoryResult } = useUserData();

  const [deck, setDeck] = useState<MemoryCardData[]>(() => buildDeck(theme));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);
  const [won, setWon] = useState(false);
  const [finalDuration, setFinalDuration] = useState<number>(0);
  const resultSavedRef = useRef(false);

  // Timer tick
  useEffect(() => {
    if (!startedAt || won) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [startedAt, won]);

  const elapsedMs = startedAt ? (won ? finalDuration : Math.max(0, now - startedAt)) : 0;

  const handleCardClick = useCallback(
    (index: number) => {
      if (locked || won) return;
      if (flipped.includes(index)) return;
      const card = deck[index];
      if (matched.has(card.pairId)) return;

      if (!startedAt) {
        const t = Date.now();
        setStartedAt(t);
        setNow(t);
      }

      const nextFlipped = [...flipped, index];

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = nextFlipped.map((i) => deck[i]);

        if (a.pairId === b.pairId && a.side !== b.side) {
          // Match found
          setFlipped(nextFlipped);
          window.setTimeout(() => {
            setMatched((prev) => {
              const next = new Set(prev);
              next.add(a.pairId);
              return next;
            });
            setFlipped([]);
          }, 250);
        } else {
          setFlipped(nextFlipped);
          setLocked(true);
          window.setTimeout(() => {
            setFlipped([]);
            setLocked(false);
          }, 850);
        }
      } else {
        setFlipped(nextFlipped);
      }
    },
    [locked, won, flipped, matched, deck, startedAt],
  );

  // Win detection
  useEffect(() => {
    if (matched.size === PAIRS_PER_GAME && !won && startedAt && !resultSavedRef.current) {
      const duration = Date.now() - startedAt;
      setFinalDuration(duration);
      setWon(true);
      resultSavedRef.current = true;
      recordMemoryResult({
        theme,
        durationMs: duration,
        moves,
        pairsCount: PAIRS_PER_GAME,
      });
      // Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: [meta.accent, '#FFB800', '#34C759', '#FFFFFF'],
      });
    }
  }, [matched, won, startedAt, moves, theme, recordMemoryResult, meta.accent]);

  const handleRestart = useCallback(() => {
    setDeck(buildDeck(theme));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setStartedAt(null);
    setWon(false);
    setFinalDuration(0);
    resultSavedRef.current = false;
  }, [theme]);

  const stats = useMemo(() => (loaded ? getMemoryStats(data, theme) : undefined), [
    loaded,
    data,
    theme,
  ]);

  const isNewBestTime = won && stats && finalDuration === stats.bestTimeMs;

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <Link
          href="/games/memory"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition active:scale-95"
          aria-label="Retour"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: meta.bgLight, color: meta.accent }}
            >
              <Icon size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 truncate">
              {meta.name}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition active:scale-95"
          aria-label="Recommencer"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        <StatPill
          icon={<Timer size={14} strokeWidth={2.5} />}
          label="Temps"
          value={formatDuration(elapsedMs)}
          accent={meta.accent}
          bgLight={meta.bgLight}
        />
        <StatPill
          icon={<Hash size={14} strokeWidth={2.5} />}
          label="Coups"
          value={String(moves)}
          accent={meta.accent}
          bgLight={meta.bgLight}
        />
        <StatPill
          icon={<Trophy size={14} strokeWidth={2.5} />}
          label="Paires"
          value={`${matched.size}/${PAIRS_PER_GAME}`}
          accent={meta.accent}
          bgLight={meta.bgLight}
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
        {deck.map((card, idx) => (
          <MemoryCard
            key={card.cardId}
            card={card}
            isFlipped={flipped.includes(idx)}
            isMatched={matched.has(card.pairId)}
            isLocked={locked}
            accent={meta.accent}
            bgLight={meta.bgLight}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>

      {/* Best record hint */}
      {stats && !won && (
        <div className="mt-6 text-center text-xs text-gray-500 font-semibold">
          Record :{' '}
          <span className="font-extrabold text-gray-700">{formatDuration(stats.bestTimeMs)}</span> ·{' '}
          <span className="font-extrabold text-gray-700">{stats.bestMoves} coups</span>
        </div>
      )}

      {/* Win modal */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center px-5 bg-black/40 backdrop-blur-sm"
            onClick={handleRestart}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: meta.bgLight }}
              />
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}DD)`,
                  }}
                >
                  <Trophy size={28} strokeWidth={2.5} className="text-white" fill="white" />
                </div>

                <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-1">
                  {isNewBestTime ? 'Nouveau record' : 'Bien joué'}
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                  Partie terminée
                </h2>
                <p className="text-sm text-gray-500 font-semibold mb-5">
                  {PAIRS_PER_GAME} paires {meta.name.toLowerCase()} matchées
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-2xl py-3">
                    <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-0.5">
                      Temps
                    </div>
                    <div className="text-xl font-extrabold tabular-nums text-gray-900">
                      {formatDuration(finalDuration)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl py-3">
                    <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-0.5">
                      Coups
                    </div>
                    <div className="text-xl font-extrabold tabular-nums text-gray-900">{moves}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/games/memory"
                    className="flex-1 py-3 rounded-full bg-gray-100 text-gray-700 font-extrabold text-sm active:scale-95 transition"
                  >
                    Thèmes
                  </Link>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="flex-1 py-3 rounded-full text-white font-extrabold text-sm active:scale-95 transition"
                    style={{
                      background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}DD)`,
                      boxShadow: `0 8px 20px -8px ${meta.accent}80`,
                    }}
                  >
                    Rejouer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  bgLight: string;
}

function StatPill({ icon, label, value, accent, bgLight }: StatPillProps) {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgLight, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 leading-none">
          {label}
        </div>
        <div className="font-extrabold tabular-nums text-sm text-gray-900 leading-tight mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}
