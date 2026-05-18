'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Check,
  Headphones,
  Hammer,
  Layers,
  Lock,
  Mic,
  Rocket,
  Sparkles,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PHASE_COLORS, WEEKLY_PLAN } from '@/lib/data/weekly-plan';
import { useUserData } from '@/lib/use-user-data';
import { estimatedCurrentWeek } from '@/lib/storage';
import type { Phase } from '@/lib/types';

const PHASE_ICONS: Record<Phase, LucideIcon> = {
  Fondations: Layers,
  Construction: Hammer,
  Accélération: Rocket,
};

export default function PlanPage() {
  const { data } = useUserData();
  const currentWeek = estimatedCurrentWeek(data);

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 grid lg:grid-cols-[1fr_300px] gap-6">
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
            My Roadmap
            <Calendar size={26} className="text-[#007AFF]" strokeWidth={2.5} />
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            12 semaines · 3 phases · A2 → B1 certifié
          </p>
        </motion.div>

        {/* Featured: current week */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative bg-[#D7E8FF] rounded-3xl p-6 mb-6 shadow-lg overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
          <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
            <Calendar size={22} className="text-[#007AFF]" strokeWidth={2.5} />
          </div>
          <div className="relative">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#0044AA]/80 mb-2">
              Cette semaine
            </div>
            <div className="text-5xl font-extrabold tabular-nums leading-none text-gray-900 mb-3">
              W{currentWeek}<span className="text-2xl opacity-60 ml-1">/12</span>
            </div>
            <div className="text-base font-extrabold text-gray-900 mb-1">
              {WEEKLY_PLAN[currentWeek - 1].title}
            </div>
            <p className="text-xs text-gray-700 mb-4 max-w-md leading-relaxed">
              {WEEKLY_PLAN[currentWeek - 1].goal}
            </p>
            <div className="w-full h-2.5 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentWeek / 12) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Phases */}
        {(['Fondations', 'Construction', 'Accélération'] as const).map((phase, phaseIdx) => {
          const colors = PHASE_COLORS[phase];
          const weeks = WEEKLY_PLAN.filter((w) => w.phase === phase);
          const PhaseIcon = PHASE_ICONS[phase];
          return (
            <div key={phase} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}DD)`,
                  }}
                >
                  <PhaseIcon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div
                    className="text-xs uppercase tracking-widest font-extrabold"
                    style={{ color: colors.accent }}
                  >
                    Phase {phaseIdx + 1}
                  </div>
                  <div className="text-lg font-extrabold text-gray-900 leading-tight">{phase}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {weeks.map((week, i) => {
                  const isCurrent = week.week === currentWeek;
                  const isPast = week.week < currentWeek;
                  return (
                    <motion.div
                      key={week.week}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + phaseIdx * 0.05 + i * 0.04 }}
                      className={`relative bg-white border-2 rounded-3xl p-4 shadow-sm transition ${
                        isCurrent
                          ? 'shadow-md'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                      style={isCurrent ? { borderColor: colors.accent } : undefined}
                    >
                      {/* Floating week badge top-right */}
                      <div
                        className="absolute -top-3 right-4 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs shadow-md border-2 border-white"
                        style={{
                          background:
                            isPast || isCurrent
                              ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)`
                              : '#F3F4F6',
                          color: isPast || isCurrent ? 'white' : '#9CA3AF',
                        }}
                      >
                        {isPast ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          `W${week.week}`
                        )}
                      </div>

                      <div className="pr-12">
                        <h3 className="text-base font-extrabold text-gray-900 leading-tight mb-2">
                          {week.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed mb-3">{week.goal}</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                          <Target size={11} />
                          <span className="line-clamp-1">{week.milestone}</span>
                        </div>
                        {isCurrent && (
                          <span
                            className="flex-shrink-0 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: colors.accent }}
                          >
                            en cours
                          </span>
                        )}
                        {!isCurrent && !isPast && (
                          <Lock size={11} className="text-gray-300" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-4 space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2 mb-3">
            Ressources
            <Sparkles size={18} className="text-[#34C759]" fill="#B5F0C9" />
          </h2>
          {RESOURCES.map((r, i) => {
            const ResIcon = r.Icon;
            return (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm hover:border-gray-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: r.bg, color: r.color }}
                  >
                    <ResIcon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-gray-900 text-sm leading-tight">
                      {r.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

const RESOURCES = [
  {
    Icon: Mic,
    name: 'Preply / italki',
    desc: 'Prof natif en visio (15-25€/h)',
    bg: '#FFE4D6',
    color: '#FF6B35',
  },
  {
    Icon: BookOpen,
    name: 'Gymglish',
    desc: '10 min/jour de grammaire',
    bg: '#D7E8FF',
    color: '#007AFF',
  },
  {
    Icon: Check,
    name: 'EF SET',
    desc: 'Test gratuit reconnu (50 min)',
    bg: '#D6F5DD',
    color: '#34C759',
  },
  {
    Icon: Headphones,
    name: 'Podcasts',
    desc: 'Hard Fork, Lex Fridman, NPR',
    bg: '#FFF4CC',
    color: '#9C7A37',
  },
  {
    Icon: Sparkles,
    name: 'Conversation IA',
    desc: '30 min/jour avec Claude/ChatGPT',
    bg: '#EFD9F7',
    color: '#AF52DE',
  },
];
