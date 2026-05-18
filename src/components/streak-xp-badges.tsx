'use client';

import { Flame, Star } from 'lucide-react';

export function StreakBadge({ streak }: { streak: number }) {
  const active = streak > 0;
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
        active
          ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] shadow-sm shadow-[#FF6B35]/30'
          : 'bg-gray-100'
      }`}
    >
      <Flame
        size={14}
        className={active ? 'text-white' : 'text-gray-400'}
        fill={active ? 'white' : 'none'}
      />
      <span
        className={`text-sm font-bold tabular-nums ${
          active ? 'text-white' : 'text-gray-500'
        }`}
      >
        {streak}
      </span>
    </div>
  );
}

export function XPBadge({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#FFB800] to-[#FFCB42] rounded-full shadow-sm shadow-[#FFB800]/30">
      <Star size={13} className="text-white" fill="white" />
      <span className="text-sm font-bold text-white tabular-nums">{xp}</span>
    </div>
  );
}
