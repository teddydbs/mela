'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Home,
  Menu,
  MessagesSquare,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUserData } from '@/lib/use-user-data';

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}[] = [
  { href: '/', label: 'Accueil', icon: Home, color: '#FF6B35', bg: '#FFE4D6' },
  { href: '/plan', label: 'Plan', icon: Calendar, color: '#007AFF', bg: '#D7E8FF' },
  { href: '/games', label: 'Jeux', icon: Gamepad2, color: '#34C759', bg: '#D6F5DD' },
  { href: '/roleplay', label: 'Roleplay', icon: MessagesSquare, color: '#FFB800', bg: '#FFF4CC' },
  { href: '/stats', label: 'Stats', icon: BarChart3, color: '#AF52DE', bg: '#EFD9F7' },
];

export function TopBar() {
  const pathname = usePathname();
  const { data } = useUserData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="relative bg-[#0A0A0A] text-white px-3 sm:px-6 py-4 flex items-center justify-between gap-3">
        {/* Mobile only: logo absolutely centered */}
        <Link
          href="/"
          className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 active:scale-95 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center shadow-md shadow-[#FF6B35]/40">
            <span className="text-sm font-black text-white tracking-tighter">M</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight">MELA</span>
        </Link>

        {/* Left: burger (mobile) + logo (desktop) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition"
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} strokeWidth={2.5} />
          </button>
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center shadow-md shadow-[#FF6B35]/40">
              <span className="text-sm font-black text-white tracking-tighter">M</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight">MELA</span>
          </Link>
        </div>

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
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-white tabular-nums">{data.totalXP}</span>
            <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">XP</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full pl-1 pr-2 sm:pr-3 py-1">
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

      {/* Mobile menu drawer */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-label="Fermer le menu"
          />

          {/* Slide-in drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-[82%] max-w-[320px] bg-white flex flex-col rounded-r-3xl shadow-2xl"
          >
            {/* Drawer header */}
            <div className="bg-[#0A0A0A] text-white p-5 flex items-center justify-between rounded-tr-3xl">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center shadow-md shadow-[#FF6B35]/40">
                  <span className="text-sm font-black text-white tracking-tighter">M</span>
                </div>
                <div>
                  <div className="text-lg font-extrabold tracking-tight leading-none">MELA</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold mt-1">
                    Navigation
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition"
                aria-label="Fermer"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {NAV_ITEMS.map((item, i) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition active:scale-[0.98] ${
                        isActive ? 'shadow-md' : 'hover:bg-gray-50'
                      }`}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${item.color}, ${item.color}DD)`,
                              color: 'white',
                            }
                          : undefined
                      }
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : item.bg,
                          color: isActive ? 'white' : item.color,
                        }}
                      >
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <span
                        className={`flex-1 font-extrabold text-base ${
                          isActive ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.label}
                      </span>
                      <ChevronRight
                        size={16}
                        strokeWidth={2.5}
                        className={isActive ? 'text-white' : 'text-gray-300'}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed text-center">
                A2 → B1 en 12 semaines · Cap sur Sydney
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
