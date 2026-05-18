import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Layers,
  Plane,
  Siren,
  Sun,
  UtensilsCrossed,
} from 'lucide-react';
import type { StoriesData, Story, StoryLevel, StoryTheme } from '@/lib/types';
import storiesSeed from '../../../seed/mela-translation-stories.json';

const DATA = storiesSeed as StoriesData;

export const STORIES: Story[] = DATA.stories;
export const STORIES_INSTRUCTIONS = DATA.instructions_fr;

export interface StoryThemeMeta {
  id: StoryTheme;
  name: string;
  icon: LucideIcon;
  accent: string;
  bgLight: string;
}

export const STORY_THEMES: Record<StoryTheme, StoryThemeMeta> = {
  food: {
    id: 'food',
    name: 'Food',
    icon: UtensilsCrossed,
    accent: '#FF6B35',
    bgLight: '#FFE4D6',
  },
  work: {
    id: 'work',
    name: 'Work',
    icon: Briefcase,
    accent: '#007AFF',
    bgLight: '#D7E8FF',
  },
  travel: {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    accent: '#AF52DE',
    bgLight: '#EFD9F7',
  },
  daily: {
    id: 'daily',
    name: 'Daily',
    icon: Sun,
    accent: '#FFB800',
    bgLight: '#FFF4CC',
  },
  emergencies: {
    id: 'emergencies',
    name: 'Emergencies',
    icon: Siren,
    accent: '#FF3B30',
    bgLight: '#FFEBEA',
  },
  mixed: {
    id: 'mixed',
    name: 'Mixed',
    icon: Layers,
    accent: '#34C759',
    bgLight: '#D6F5DD',
  },
};

export const STORY_LEVELS: StoryLevel[] = ['A2', 'B1', 'B2', 'C1'];

export const STORY_LEVEL_COLORS: Record<StoryLevel, { accent: string; bgLight: string }> = {
  A2: { accent: '#34C759', bgLight: '#D6F5DD' },
  B1: { accent: '#FFB800', bgLight: '#FFF4CC' },
  B2: { accent: '#FF6B35', bgLight: '#FFE4D6' },
  C1: { accent: '#AF52DE', bgLight: '#EFD9F7' },
};

export function getStoryById(id: number): Story | undefined {
  return STORIES.find((s) => s.id === id);
}

const PUNCT_RE = /[.,!?;:"'’()\[\]{}—–-]/g;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(PUNCT_RE, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean);
}

export function countMatchedTargets(answer: string, targets: string[]): number {
  const normalized = normalize(answer);
  return targets.reduce((sum, target) => {
    const t = normalize(target);
    return normalized.includes(t) ? sum + 1 : sum;
  }, 0);
}

export function similarityScore(answer: string, reference: string): number {
  const a = new Set(tokenize(answer));
  const b = new Set(tokenize(reference));
  if (b.size === 0) return 0;
  let inter = 0;
  for (const word of a) if (b.has(word)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export interface StoryEvaluation {
  score: number;
  matchedWords: number;
  totalWords: number;
  similarity: number;
  missingTargets: string[];
}

export function evaluateAnswer(answer: string, story: Story): StoryEvaluation {
  const matchedWords = countMatchedTargets(answer, story.target_words);
  const totalWords = story.target_words.length;
  const similarity = similarityScore(answer, story.en_reference);
  const missingTargets = story.target_words.filter(
    (w) => !normalize(answer).includes(normalize(w)),
  );

  const targetScore = totalWords > 0 ? (matchedWords / totalWords) * 60 : 0;
  const similarityBonus = similarity * 40;
  const score = Math.round(targetScore + similarityBonus);

  return {
    score,
    matchedWords,
    totalWords,
    similarity,
    missingTargets,
  };
}
