'use client';

import {
  AlertTriangle,
  BookOpen,
  Clock,
  Combine,
  Compass,
  HelpCircle,
  Hash,
  Layers,
  Link2,
  Pilcrow,
  Quote,
  Repeat2,
  Scale,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react';
import type { CategoryId } from '@/lib/types';
import { CATEGORIES } from '@/lib/data/categories';

const ICON_MAP = {
  tenses: Clock,
  modals: Target,
  conditionals: Sparkles,
  gerunds: BookOpen,
  prepositions: Compass,
  articles: Pilcrow,
  quantifiers: Hash,
  comparatives: Scale,
  passive: Repeat2,
  reported: Quote,
  relatives: Link2,
  tags: HelpCircle,
  connectors: Workflow,
  phrasalVerbs: Layers,
  collocations: Combine,
  falseFriends: AlertTriangle,
} as const;

interface CategoryIconProps {
  catId: CategoryId;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const FALLBACK_ACCENT = '#6B7280';
const FALLBACK_BG = '#F3F4F6';

export function CategoryIcon({
  catId,
  size = 22,
  strokeWidth = 2.5,
  className = '',
}: CategoryIconProps) {
  const Icon = ICON_MAP[catId];
  const cat = CATEGORIES[catId];
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={{ color: cat?.accent ?? FALLBACK_ACCENT }}
    />
  );
}

export function CategoryIconCircle({
  catId,
  size = 40,
  iconSize,
  variant = 'tint',
  className = '',
}: {
  catId: CategoryId;
  size?: number;
  iconSize?: number;
  variant?: 'tint' | 'solid';
  className?: string;
}) {
  const Icon = ICON_MAP[catId];
  const cat = CATEGORIES[catId];
  const accent = cat?.accent ?? FALLBACK_ACCENT;
  const bgLight = cat?.bgLight ?? FALLBACK_BG;
  const iSize = iconSize ?? Math.round(size * 0.5);

  if (variant === 'solid') {
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white shadow-md ${className}`}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${accent}, ${accent}DD)`,
          boxShadow: `0 6px 16px -6px ${accent}80`,
        }}
      >
        <Icon size={iSize} strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{ width: size, height: size, backgroundColor: bgLight }}
    >
      <Icon size={iSize} strokeWidth={2.5} style={{ color: accent }} />
    </div>
  );
}

export { ICON_MAP as CATEGORY_ICON_MAP };
