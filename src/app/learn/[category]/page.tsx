'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { LESSONS } from '@/lib/data/lessons';
import type { CategoryId } from '@/lib/types';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function LessonPage({ params }: PageProps) {
  const { category } = use(params);
  const router = useRouter();

  if (!(category in CATEGORIES)) {
    notFound();
  }
  const catId = category as CategoryId;
  const cat = CATEGORIES[catId];
  const lesson = LESSONS[catId];

  return (
    <div className="text-gray-900 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <Link
            href={`/practice/${catId}`}
            className="text-sm font-bold hover:opacity-80 transition active:scale-95 px-3 py-1.5 rounded-full"
            style={{ color: cat.accent, backgroundColor: cat.bgLight }}
          >
            Exercices →
          </Link>
        </div>
      </div>

      {/* Hero coloré */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-95"
          style={{ background: `linear-gradient(135deg, ${cat.accent} 0%, ${cat.accent}DD 100%)` }}
        />
        <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full mb-4">
            <span className="text-xs font-bold tracking-wider uppercase">Leçon</span>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-3 leading-none"
          >
            {cat.emoji}
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight mb-3 leading-tight">{cat.name}</h1>
          <p className="text-base text-white/90 leading-relaxed max-w-md">{lesson.intro}</p>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        {lesson.sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
            className="bg-white rounded-3xl p-6 shadow-sm shadow-gray-200/40 border border-gray-100"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center text-white font-black text-sm"
                style={{ background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}CC)` }}
              >
                {idx + 1}
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight pt-1 leading-snug">
                {section.title.replace(/^\d+\.\s*/, '')}
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-5 ml-12">{section.rule}</p>

            {/* Examples */}
            <div className="space-y-2 mb-4 ml-12">
              {section.examples.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: cat.bgLight }}
                >
                  <div className="text-[15px] font-semibold text-gray-900 mb-1 leading-snug">
                    {ex.en}
                  </div>
                  {ex.fr && (
                    <div className="text-[13px] text-gray-500 leading-relaxed">{ex.fr}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Markers */}
            {section.markers && (
              <div className="mb-4 ml-12">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">
                  {section.markers.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {section.markers.items.map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ backgroundColor: cat.bgLight, color: cat.accent }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warning */}
            {section.warning && (
              <div
                className="ml-12 p-4 rounded-2xl border-l-4"
                style={{ borderColor: cat.accent, backgroundColor: '#FFFBF5' }}
              >
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold flex items-center gap-1.5">
                  <Zap size={11} style={{ color: cat.accent }} fill={cat.accent} />
                  À retenir
                </div>
                <div className="text-sm text-gray-800 leading-relaxed font-medium">
                  {section.warning}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA bottom */}
      <div className="max-w-2xl mx-auto px-5 pt-2 pb-8">
        <Link
          href={`/practice/${catId}`}
          className="block w-full text-center py-5 rounded-3xl font-bold text-white transition-all hover:opacity-95 active:scale-[0.98] shadow-lg text-base"
          style={{
            background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
            boxShadow: `0 10px 30px -10px ${cat.accent}80`,
          }}
        >
          Lancer les exercices →
        </Link>
        <p className="text-xs text-gray-400 text-center mt-3">
          Tu peux relire ce cours à tout moment.
        </p>
      </div>
    </div>
  );
}
