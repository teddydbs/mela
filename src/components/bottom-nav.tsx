'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Calendar, Gamepad2, Home, MessagesSquare } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/plan', label: 'Plan', icon: Calendar },
  { href: '/games', label: 'Jeux', icon: Gamepad2 },
  { href: '/roleplay', label: 'Roleplay', icon: MessagesSquare },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      aria-label="Navigation principale"
    >
      <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-full px-2 py-2 shadow-xl shadow-gray-300/30">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-full transition-all active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white shadow-md shadow-[#FF6B35]/30'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={2.5} />
              <span className={`text-xs font-bold ${isActive ? '' : 'hidden'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
