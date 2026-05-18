'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Calendar, ChevronDown, Gamepad2, Home, MessagesSquare } from 'lucide-react';
import { useUserData } from '@/lib/use-user-data';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/plan', label: 'Plan', icon: Calendar },
  { href: '/games', label: 'Jeux', icon: Gamepad2 },
  { href: '/roleplay', label: 'Roleplay', icon: MessagesSquare },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
] as const;

export function TopBar() {
  const pathname = usePathname();
  const { data } = useUserData();

  return (
    <div className="bg-[#0A0A0A] text-white px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0 active:scale-95 transition">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center shadow-md shadow-[#FF6B35]/40">
          <span className="text-sm font-black text-white tracking-tighter">M</span>
        </div>
        <span className="text-lg font-extrabold tracking-tight">MELA</span>
      </Link>

      {/* Nav center (desktop only) */}
      <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur rounded-full px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition active:scale-95 ${
                isActive ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon size={15} strokeWidth={2.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* XP pill (compact) */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
          <span className="text-xs font-bold text-white tabular-nums">{data.totalXP}</span>
          <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">XP</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full pl-1 pr-3 py-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center text-white text-sm font-extrabold">
            T
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-bold text-white">Teddy</div>
            <div className="text-[10px] text-white/60">{data.streak}d streak</div>
          </div>
          <ChevronDown size={14} className="text-white/60 hidden sm:block" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
