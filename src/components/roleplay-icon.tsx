'use client';

import { Briefcase, Coffee, FileText, Plane, Stethoscope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROLEPLAY_CATEGORIES } from '@/lib/data/roleplay';
import type { RoleplayScenario } from '@/lib/types';

export const ROLEPLAY_CATEGORY_ICONS: Record<RoleplayScenario['category'], LucideIcon> = {
  pro: Briefcase,
  daily: Coffee,
  travel: Plane,
  health: Stethoscope,
  admin: FileText,
};

export function RoleplayCategoryIcon({
  category,
  size = 18,
  strokeWidth = 2.5,
  className = '',
}: {
  category: RoleplayScenario['category'];
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = ROLEPLAY_CATEGORY_ICONS[category];
  const cat = ROLEPLAY_CATEGORIES[category];
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={{ color: cat.accent }}
    />
  );
}

export function RoleplayCategoryIconCircle({
  category,
  size = 40,
  variant = 'tint',
  className = '',
}: {
  category: RoleplayScenario['category'];
  size?: number;
  variant?: 'tint' | 'solid';
  className?: string;
}) {
  const Icon = ROLEPLAY_CATEGORY_ICONS[category];
  const cat = ROLEPLAY_CATEGORIES[category];
  const iconSize = Math.round(size * 0.5);

  if (variant === 'solid') {
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white shadow-md ${className}`}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
        }}
      >
        <Icon size={iconSize} strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{ width: size, height: size, backgroundColor: cat.bgLight }}
    >
      <Icon size={iconSize} strokeWidth={2.5} style={{ color: cat.accent }} />
    </div>
  );
}
