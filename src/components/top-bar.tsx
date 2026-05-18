'use client';

import Link from 'next/link';
import { useUserData } from '@/lib/use-user-data';
import { StreakBadge, XPBadge } from '@/components/streak-xp-badges';

export function TopBar() {
  const { data, loaded } = useUserData();

  return (
    <div className="sticky top-0 z-20 bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 active:scale-95 transition">
          <span className="text-2xl" aria-hidden>🇦🇺</span>
          <span className="text-base font-black tracking-tight text-gray-900">MELA</span>
        </Link>
        <div className="flex items-center gap-2">
          {loaded ? (
            <>
              <StreakBadge streak={data.streak} />
              <XPBadge xp={data.totalXP} />
            </>
          ) : (
            <div className="h-7 w-32" />
          )}
        </div>
      </div>
    </div>
  );
}
