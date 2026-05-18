'use client';

import { motion } from 'framer-motion';
import { Check, Target } from 'lucide-react';
import { PHASE_COLORS, WEEKLY_PLAN } from '@/lib/data/weekly-plan';
import { useUserData } from '@/lib/use-user-data';
import { estimatedCurrentWeek } from '@/lib/storage';

const RESOURCES = [
  { emoji: '🎙️', name: 'Preply / italki', desc: 'Prof natif en visio (15-25 €/h)' },
  { emoji: '📝', name: 'Gymglish', desc: '10 min/jour de grammaire ciblée' },
  { emoji: '✅', name: 'EF SET', desc: 'Test gratuit reconnu (50 min)' },
  { emoji: '🎧', name: 'Podcasts', desc: 'Hard Fork, Lex Fridman, NPR' },
  { emoji: '🤖', name: 'Conversation IA', desc: '30 min/jour avec Claude/ChatGPT vocal' },
];

export default function PlanPage() {
  const { data } = useUserData();
  const currentWeek = estimatedCurrentWeek(data);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">
          Roadmap
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight mb-2">
          Plan 12 semaines
        </h1>
        <p className="text-sm text-gray-500 font-medium">A2 → B1 certifié. Direction l&apos;Australie.</p>
      </motion.div>

      {/* Card semaine actuelle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-6 relative overflow-hidden rounded-3xl shadow-lg shadow-[#007AFF]/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] to-[#5856D6]" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative p-6 text-white">
          <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2">
            Semaine estimée
          </div>
          <div className="text-5xl font-black mb-4 tabular-nums leading-none">
            {currentWeek}
            <span className="text-2xl opacity-60">/12</span>
          </div>
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentWeek / 12) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {(['Fondations', 'Construction', 'Accélération'] as const).map((phase, phaseIdx) => {
        const colors = PHASE_COLORS[phase];
        return (
          <div key={phase} className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
              <div
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: colors.accent }}
              >
                {phase}
              </div>
            </div>
            <div className="space-y-2.5">
              {WEEKLY_PLAN.filter((w) => w.phase === phase).map((week, i) => {
                const isCurrent = week.week === currentWeek;
                const isPast = week.week < currentWeek;
                return (
                  <motion.div
                    key={week.week}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + phaseIdx * 0.05 + i * 0.04,
                    }}
                    className={`relative bg-white rounded-2xl p-4 border-2 transition ${
                      isCurrent ? 'shadow-md' : 'border-gray-100'
                    }`}
                    style={isCurrent ? { borderColor: colors.accent } : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                        style={{
                          background:
                            isPast || isCurrent
                              ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)`
                              : colors.bg,
                          color: isPast || isCurrent ? 'white' : colors.accent,
                        }}
                      >
                        {isPast ? <Check size={16} strokeWidth={3} /> : `W${week.week}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm leading-tight">
                            {week.title}
                          </span>
                          {isCurrent && (
                            <span
                              className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: colors.accent }}
                            >
                              en cours
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                          {week.goal}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 italic flex items-start gap-1">
                          <Target size={11} className="mt-0.5 flex-shrink-0" />
                          <span>{week.milestone}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Ressources */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-2 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm shadow-gray-100"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#34C759] to-[#4ADB6F] flex items-center justify-center text-white text-base">
            💎
          </div>
          <div className="text-base font-black text-gray-900">Ressources bonus</div>
        </div>
        <div className="space-y-2.5 text-sm">
          {RESOURCES.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
            >
              <span className="text-lg">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
