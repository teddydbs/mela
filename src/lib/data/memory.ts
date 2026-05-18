import type { LucideIcon } from 'lucide-react';
import { Briefcase, Plane, Siren, Sun, UtensilsCrossed } from 'lucide-react';
import type { MemoryPair, MemoryTheme, MemoryThemeData } from '@/lib/types';
import foodSeed from '../../../seed/food.json';
import workSeed from '../../../seed/work.json';
import travelSeed from '../../../seed/travel.json';
import dailySeed from '../../../seed/daily.json';
import emergenciesSeed from '../../../seed/emergencies.json';

const SEED_BY_THEME: Record<MemoryTheme, MemoryThemeData> = {
  food: foodSeed as MemoryThemeData,
  work: workSeed as MemoryThemeData,
  travel: travelSeed as MemoryThemeData,
  daily: dailySeed as MemoryThemeData,
  emergencies: emergenciesSeed as MemoryThemeData,
};

export interface MemoryThemeMeta {
  id: MemoryTheme;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  bgLight: string;
}

export const MEMORY_THEMES: Record<MemoryTheme, MemoryThemeMeta> = {
  food: {
    id: 'food',
    name: 'Food & cuisine',
    description: 'Cuisine, courses, restaurant',
    icon: UtensilsCrossed,
    accent: '#FF6B35',
    bgLight: '#FFE4D6',
  },
  work: {
    id: 'work',
    name: 'Work & bureau',
    description: 'Réunions, mails, projets',
    icon: Briefcase,
    accent: '#007AFF',
    bgLight: '#D7E8FF',
  },
  travel: {
    id: 'travel',
    name: 'Travel & voyages',
    description: 'Aéroport, hôtel, transport',
    icon: Plane,
    accent: '#AF52DE',
    bgLight: '#EFD9F7',
  },
  daily: {
    id: 'daily',
    name: 'Daily life',
    description: 'Quotidien, maison, routine',
    icon: Sun,
    accent: '#FFB800',
    bgLight: '#FFF4CC',
  },
  emergencies: {
    id: 'emergencies',
    name: 'Emergencies',
    description: 'Urgences, santé, sécurité',
    icon: Siren,
    accent: '#FF3B30',
    bgLight: '#FFEBEA',
  },
};

export const MEMORY_THEME_IDS: MemoryTheme[] = [
  'food',
  'work',
  'travel',
  'daily',
  'emergencies',
];

export function getMemoryPairs(theme: MemoryTheme): MemoryPair[] {
  return SEED_BY_THEME[theme].pairs;
}

export function isMemoryTheme(value: string): value is MemoryTheme {
  return MEMORY_THEME_IDS.includes(value as MemoryTheme);
}
