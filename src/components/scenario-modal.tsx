'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock, Copy, ExternalLink, Target, X } from 'lucide-react';
import { ROLEPLAY_CATEGORIES } from '@/lib/data/roleplay';
import type { RoleplayScenario } from '@/lib/types';
import { RoleplayCategoryIconCircle } from '@/components/roleplay-icon';

interface ScenarioModalProps {
  scenario: RoleplayScenario;
  onClose: () => void;
}

export function ScenarioModal({ scenario, onClose }: ScenarioModalProps) {
  const [copied, setCopied] = useState(false);
  const cat = ROLEPLAY_CATEGORIES[scenario.category];

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scenario.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="bg-white w-full sm:max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header gradient */}
          <div
            className="relative p-6 text-white overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
            }}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition active:scale-95"
              aria-label="Fermer"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            <div className="relative">
              <div className="mb-3">
                <RoleplayCategoryIconCircle
                  category={scenario.category}
                  size={52}
                  variant="tint"
                  className="bg-white/90"
                />
              </div>
              <h2 className="text-2xl font-extrabold leading-tight mb-2">{scenario.title}</h2>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-full font-extrabold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                  {scenario.level}
                </span>
                <span className="opacity-90 font-semibold flex items-center gap-1">
                  <Clock size={11} strokeWidth={2.5} />
                  {scenario.duration}
                </span>
                <span className="opacity-90 font-semibold">· {cat.label}</span>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">
                Contexte
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{scenario.context}</p>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">
                Tes objectifs
              </div>
              <ul className="space-y-2">
                {scenario.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: cat.bgLight }}
                    >
                      <Target size={11} style={{ color: cat.accent }} strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 font-semibold leading-snug">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-2">
                Le prompt à coller dans ton IA
              </div>
              <div className="rounded-2xl bg-gray-50 border-2 border-gray-100 p-4 max-h-48 overflow-y-auto">
                <pre className="text-[11px] text-gray-600 font-mono leading-relaxed whitespace-pre-wrap break-words">
                  {scenario.prompt}
                </pre>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-4 space-y-2 bg-white">
            <button
              onClick={handleCopy}
              className="w-full py-4 rounded-2xl font-extrabold text-white transition active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
              style={{
                background: copied
                  ? 'linear-gradient(135deg, #34C759, #4ADB6F)'
                  : `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
                boxShadow: copied
                  ? '0 10px 30px -10px #34C75980'
                  : `0 10px 30px -10px ${cat.accent}80`,
              }}
            >
              {copied ? (
                <>
                  <Check size={18} strokeWidth={3} />
                  Copié ! Va le coller dans ton IA
                </>
              ) : (
                <>
                  <Copy size={18} strokeWidth={2.5} />
                  Copier le prompt
                </>
              )}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://claude.ai/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-extrabold text-gray-700 bg-gray-50 hover:bg-gray-100 transition active:scale-95"
              >
                Claude <ExternalLink size={12} />
              </a>
              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-extrabold text-gray-700 bg-gray-50 hover:bg-gray-100 transition active:scale-95"
              >
                ChatGPT <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
