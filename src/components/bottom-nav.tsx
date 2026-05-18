'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Calendar, Gamepad2, Home, MessagesSquare } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil', icon: Home, color: '#FF6B35', bg: '#FFE4D6' },
  { href: '/plan', label: 'Plan', icon: Calendar, color: '#007AFF', bg: '#D7E8FF' },
  { href: '/games', label: 'Jeux', icon: Gamepad2, color: '#34C759', bg: '#D6F5DD' },
  { href: '/roleplay', label: 'Roleplay', icon: MessagesSquare, color: '#FFB800', bg: '#FFF4CC' },
  { href: '/stats', label: 'Stats', icon: BarChart3, color: '#AF52DE', bg: '#EFD9F7' },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      aria-label="Navigation"
    >
      <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0A0A0A] rounded-full px-3 py-2.5 shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="active:scale-90 transition"
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isActive ? item.color : item.bg,
                  boxShadow: isActive ? `0 4px 14px ${item.color}80` : 'none',
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={2.5}
                  style={{ color: isActive ? 'white' : item.color }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
