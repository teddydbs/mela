'use client';

import type {
  UserData,
  CategoryId,
  MemoryGameResult,
  MemoryTheme,
  MemoryThemeStats,
} from '@/lib/types';

const STORAGE_KEY = 'mela_data_v1';

export const DEFAULT_DATA: UserData = {
  streak: 0,
  lastActive: null,
  totalXP: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  categoryProgress: {
    tenses: { correct: 0, attempts: 0, completed: [] },
    modals: { correct: 0, attempts: 0, completed: [] },
    conditionals: { correct: 0, attempts: 0, completed: [] },
    gerunds: { correct: 0, attempts: 0, completed: [] },
    prepositions: { correct: 0, attempts: 0, completed: [] },
  },
};

export function loadUserData(): UserData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<UserData>;
    return {
      ...DEFAULT_DATA,
      ...parsed,
      categoryProgress: {
        ...DEFAULT_DATA.categoryProgress,
        ...(parsed.categoryProgress ?? {}),
      },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveUserData(data: UserData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data', e);
  }
}

export function resetUserData(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export interface AnswerOutcome {
  category: CategoryId;
  exerciseIdx: number;
  correct: boolean;
}

export function applyAnswer(data: UserData, outcome: AnswerOutcome): UserData {
  const next: UserData = {
    ...data,
    categoryProgress: {
      ...data.categoryProgress,
      [outcome.category]: { ...data.categoryProgress[outcome.category] },
    },
  };
  const today = todayISO();

  if (next.lastActive !== today) {
    if (next.lastActive && daysBetween(next.lastActive, today) === 1) {
      next.streak += 1;
    } else if (!next.lastActive || daysBetween(next.lastActive, today) > 1) {
      next.streak = 1;
    }
    next.lastActive = today;
  }

  next.totalAttempts += 1;
  next.categoryProgress[outcome.category].attempts += 1;

  if (outcome.correct) {
    next.totalCorrect += 1;
    next.totalXP += 10;
    next.categoryProgress[outcome.category].correct += 1;
    if (!next.categoryProgress[outcome.category].completed.includes(outcome.exerciseIdx)) {
      next.categoryProgress[outcome.category].completed = [
        ...next.categoryProgress[outcome.category].completed,
        outcome.exerciseIdx,
      ];
    }
  } else {
    next.totalXP += 2;
  }

  return next;
}

export function estimatedCurrentWeek(data: UserData): number {
  return Math.min(12, Math.max(1, Math.floor(data.totalAttempts / 25) + 1));
}

export function overallAccuracy(data: UserData): number {
  return data.totalAttempts > 0 ? Math.round((data.totalCorrect / data.totalAttempts) * 100) : 0;
}

export function totalCompletedExercises(data: UserData): number {
  return Object.values(data.categoryProgress).reduce((sum, c) => sum + c.completed.length, 0);
}

export function applyMemoryResult(data: UserData, result: MemoryGameResult): UserData {
  const today = todayISO();
  const games = data.games ?? {};
  const memory = games.memory ?? {};
  const existing = memory[result.theme];

  const nextThemeStats: MemoryThemeStats = {
    bestTimeMs:
      existing && existing.bestTimeMs > 0
        ? Math.min(existing.bestTimeMs, result.durationMs)
        : result.durationMs,
    bestMoves:
      existing && existing.bestMoves > 0
        ? Math.min(existing.bestMoves, result.moves)
        : result.moves,
    plays: (existing?.plays ?? 0) + 1,
    lastPlayed: today,
  };

  const next: UserData = {
    ...data,
    games: {
      ...games,
      memory: { ...memory, [result.theme]: nextThemeStats },
    },
  };

  if (next.lastActive !== today) {
    if (next.lastActive && daysBetween(next.lastActive, today) === 1) {
      next.streak += 1;
    } else if (!next.lastActive || daysBetween(next.lastActive, today) > 1) {
      next.streak = 1;
    }
    next.lastActive = today;
  }

  // XP: 5 per pair matched + 20 bonus if new best time
  const xpEarned = result.pairsCount * 5;
  const newBestTime = !existing || result.durationMs < existing.bestTimeMs;
  next.totalXP += xpEarned + (newBestTime ? 20 : 0);

  return next;
}

export function getMemoryStats(data: UserData, theme: MemoryTheme): MemoryThemeStats | undefined {
  return data.games?.memory?.[theme];
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}
