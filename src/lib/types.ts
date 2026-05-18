export type CategoryId = 'tenses' | 'modals' | 'conditionals' | 'gerunds' | 'prepositions';

export interface Exercise {
  q: string;
  o: string[];
  c: number;
  e: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  emoji: string;
  description: string;
  accent: string;
  bgLight: string;
  exercises: Exercise[];
}

export interface LessonExample {
  en: string;
  fr: string;
}

export interface LessonSection {
  title: string;
  rule: string;
  examples: LessonExample[];
  markers?: { label: string; items: string[] };
  warning?: string;
}

export interface Lesson {
  intro: string;
  sections: LessonSection[];
}

export type Phase = 'Fondations' | 'Construction' | 'Accélération';

export interface WeeklyPlanItem {
  week: number;
  phase: Phase;
  title: string;
  focus: CategoryId[];
  goal: string;
  milestone: string;
}

export interface CategoryProgress {
  correct: number;
  attempts: number;
  completed: number[];
}

export interface UserData {
  streak: number;
  lastActive: string | null;
  totalXP: number;
  totalCorrect: number;
  totalAttempts: number;
  categoryProgress: Record<CategoryId, CategoryProgress>;
  games?: GameStats;
}

export type GameId =
  | 'memory'
  | 'speed-translation'
  | 'fill-blank'
  | 'sentence-builder'
  | 'listening';

export type MemoryTheme = 'food' | 'work' | 'travel' | 'daily' | 'emergencies';

export interface MemoryPair {
  en: string;
  fr: string;
  level: Level | 'A1';
}

export interface MemoryThemeData {
  theme: MemoryTheme;
  pairs: MemoryPair[];
}

export interface MemoryThemeStats {
  bestTimeMs: number;
  bestMoves: number;
  plays: number;
  lastPlayed: string;
}

export interface MemoryGameResult {
  theme: MemoryTheme;
  durationMs: number;
  moves: number;
  pairsCount: number;
}

export interface GameStats {
  memory?: Partial<Record<MemoryTheme, MemoryThemeStats>>;
}

export type Level = 'A2' | 'B1' | 'B2';

export interface RoleplayScenario {
  id: string;
  title: string;
  emoji: string;
  level: Level;
  duration: string;
  context: string;
  prompt: string;
  goals: string[];
  category: 'pro' | 'daily' | 'travel' | 'health' | 'admin';
}
