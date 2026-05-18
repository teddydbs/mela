'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ROLEPLAY_CATEGORIES, ROLEPLAY_SCENARIOS } from '@/lib/data/roleplay';
import type { RoleplayScenario } from '@/lib/types';
import { ScenarioModal } from '@/components/scenario-modal';

type FilterKey = 'all' | keyof typeof ROLEPLAY_CATEGORIES;

export default function RoleplayPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [openScenario, setOpenScenario] = useState<RoleplayScenario | null>(null);

  const filtered =
    filter === 'all'
      ? ROLEPLAY_SCENARIOS
      : ROLEPLAY_SCENARIOS.filter((s) => s.category === filter);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">
          Conversation
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight mb-2">
          Roleplay IA
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          Copie un prompt, colle-le dans ChatGPT ou Claude, et joue le rôle. L&apos;IA reste dans
          le perso et corrige tes fautes en temps réel.
        </p>
      </motion.div>

      {/* Comment ça marche */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#7B5DFA] to-[#AF52DE] text-white shadow-lg shadow-[#AF52DE]/20"
      >
        <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2">
          Comment ça marche
        </div>
        <ol className="space-y-1.5 text-sm font-medium">
          <li className="flex gap-2">
            <span className="font-black opacity-80">1.</span>
            <span>Choisis un scénario qui te tente</span>
          </li>
          <li className="flex gap-2">
            <span className="font-black opacity-80">2.</span>
            <span>Copie le prompt complet (un seul clic)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-black opacity-80">3.</span>
            <span>Colle-le dans ChatGPT, Claude, Gemini, ou n&apos;importe quelle IA</span>
          </li>
          <li className="flex gap-2">
            <span className="font-black opacity-80">4.</span>
            <span>Réponds en anglais — l&apos;IA reste dans le rôle et te corrige</span>
          </li>
        </ol>
      </motion.div>

      {/* Filtres */}
      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <FilterChip label="Tous" active={filter === 'all'} onClick={() => setFilter('all')} />
        {(Object.entries(ROLEPLAY_CATEGORIES) as [keyof typeof ROLEPLAY_CATEGORIES, typeof ROLEPLAY_CATEGORIES[keyof typeof ROLEPLAY_CATEGORIES]][]).map(
          ([key, cat]) => (
            <FilterChip
              key={key}
              label={`${cat.emoji} ${cat.label}`}
              active={filter === key}
              accent={cat.accent}
              onClick={() => setFilter(key)}
            />
          ),
        )}
      </div>

      {/* Liste des scénarios */}
      <div className="space-y-3">
        {filtered.map((scenario, i) => {
          const cat = ROLEPLAY_CATEGORIES[scenario.category];
          return (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
              onClick={() => setOpenScenario(scenario)}
              className="w-full text-left bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all active:scale-[0.99] shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
                    boxShadow: `0 6px 16px -8px ${cat.accent}80`,
                  }}
                >
                  {scenario.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-base leading-tight mb-1">
                    {scenario.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{ backgroundColor: cat.bgLight, color: cat.accent }}
                    >
                      {scenario.level}
                    </span>
                    <span className="text-gray-400 font-medium">{scenario.duration}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-medium">{cat.label}</span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-300 group-hover:text-gray-500 transition"
                  strokeWidth={2.5}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {openScenario && (
        <ScenarioModal scenario={openScenario} onClose={() => setOpenScenario(null)} />
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  accent = '#FF6B35',
  onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition active:scale-95 ${
        active ? 'text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200'
      }`}
      style={active ? { background: `linear-gradient(135deg, ${accent}, ${accent}DD)` } : {}}
    >
      {label}
    </button>
  );
}
