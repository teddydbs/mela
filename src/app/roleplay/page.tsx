'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, Play } from 'lucide-react';
import { ROLEPLAY_CATEGORIES, ROLEPLAY_SCENARIOS } from '@/lib/data/roleplay';
import type { RoleplayScenario } from '@/lib/types';
import { ScenarioModal } from '@/components/scenario-modal';
import {
  RoleplayCategoryIcon,
  RoleplayCategoryIconCircle,
} from '@/components/roleplay-icon';

type FilterKey = 'all' | keyof typeof ROLEPLAY_CATEGORIES;

export default function RoleplayPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [openScenario, setOpenScenario] = useState<RoleplayScenario | null>(null);

  const filtered =
    filter === 'all'
      ? ROLEPLAY_SCENARIOS
      : ROLEPLAY_SCENARIOS.filter((s) => s.category === filter);

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
          Roleplay IA
          <MessageCircle
            size={26}
            className="text-[#AF52DE]"
            fill="#EFD9F7"
            strokeWidth={2.5}
          />
        </h1>
        <p className="text-sm text-gray-500 font-semibold mt-1 max-w-lg leading-relaxed">
          Copie un prompt, colle-le dans ChatGPT/Claude, joue le rôle. L&apos;IA reste dans le perso
          et corrige tes fautes.
        </p>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative bg-[#EFD9F7] rounded-3xl p-6 mb-6 shadow-lg overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
        <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
          <MessageCircle size={22} className="text-[#AF52DE]" strokeWidth={2.5} />
        </div>
        <div className="relative">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-purple-900/80 mb-2">
            Comment ça marche
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-3">
            4 étapes simples
          </h3>
          <ol className="space-y-1.5 text-sm font-semibold text-gray-700 max-w-md">
            <li className="flex gap-2">
              <span className="font-extrabold text-purple-900">1.</span>
              <span>Choisis un scénario</span>
            </li>
            <li className="flex gap-2">
              <span className="font-extrabold text-purple-900">2.</span>
              <span>Copie le prompt complet</span>
            </li>
            <li className="flex gap-2">
              <span className="font-extrabold text-purple-900">3.</span>
              <span>Colle dans ChatGPT, Claude ou Gemini</span>
            </li>
            <li className="flex gap-2">
              <span className="font-extrabold text-purple-900">4.</span>
              <span>Réponds en anglais, l&apos;IA te corrige</span>
            </li>
          </ol>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <FilterChip label="Tous" active={filter === 'all'} onClick={() => setFilter('all')} />
        {(
          Object.entries(ROLEPLAY_CATEGORIES) as [
            keyof typeof ROLEPLAY_CATEGORIES,
            (typeof ROLEPLAY_CATEGORIES)[keyof typeof ROLEPLAY_CATEGORIES],
          ][]
        ).map(([key, cat]) => (
          <FilterChip
            key={key}
            label={cat.label}
            categoryKey={key}
            active={filter === key}
            accent={cat.accent}
            onClick={() => setFilter(key)}
          />
        ))}
      </div>

      {/* Scenarios grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((scenario, i) => {
          const cat = ROLEPLAY_CATEGORIES[scenario.category];
          return (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
              onClick={() => setOpenScenario(scenario)}
              className="text-left bg-white rounded-3xl p-5 border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all active:scale-[0.99] shadow-sm group relative"
            >
              <div className="absolute -top-3 right-5">
                <RoleplayCategoryIconCircle
                  category={scenario.category}
                  size={42}
                  variant="tint"
                  className="shadow-md border-2 border-white"
                />
              </div>

              <h3 className="text-base font-extrabold text-gray-900 leading-tight mb-1 pr-14">
                {scenario.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {scenario.context}
              </p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider"
                    style={{ backgroundColor: cat.bgLight, color: cat.accent }}
                  >
                    {scenario.level}
                  </span>
                  <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                    <Clock size={10} strokeWidth={2.5} />
                    {scenario.duration}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center group-hover:bg-gray-800 transition active:scale-90">
                  <Play size={12} fill="currentColor" className="ml-0.5" />
                </div>
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
  categoryKey,
  onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  categoryKey?: keyof typeof ROLEPLAY_CATEGORIES;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-extrabold transition active:scale-95 flex items-center gap-1.5 ${
        active ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      style={active ? { background: `linear-gradient(135deg, ${accent}, ${accent}DD)` } : {}}
    >
      {categoryKey && (
        <RoleplayCategoryIcon
          category={categoryKey}
          size={14}
          strokeWidth={2.5}
          className={active ? '!text-white' : ''}
        />
      )}
      {label}
    </button>
  );
}
