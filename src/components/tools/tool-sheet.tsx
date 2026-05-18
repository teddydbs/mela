'use client';

import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ToolSheetProps {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  color: string;
  bgLight: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function ToolSheet({
  title,
  subtitle,
  Icon,
  color,
  bgLight,
  onClose,
  children,
  footer,
}: ToolSheetProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative p-5 flex items-center gap-3 border-b-2"
            style={{ backgroundColor: bgLight, borderColor: `${color}30` }}
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}DD)` }}
            >
              <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight text-gray-900 leading-tight">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-gray-600 font-semibold mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 transition active:scale-95 shadow-sm"
              aria-label="Fermer"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {footer && <div className="border-t border-gray-100 p-4 bg-white">{footer}</div>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
