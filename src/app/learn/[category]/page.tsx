'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Zap } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { LESSONS } from '@/lib/data/lessons';
import { CategoryIconCircle } from '@/components/category-icon';
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
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6">
      {/* Back button */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition active:scale-95 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span className="text-sm font-bold">Retour</span>
        </button>
        <Link
          href={`/practice/${catId}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-extrabold text-white shadow-md active:scale-95 transition"
          style={{
            background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
            boxShadow: `0 6px 20px -8px ${cat.accent}80`,
          }}
        >
          <Play size={13} fill="white" />
          Exercices
        </Link>
      </div>

      {/* Featured Lesson Header (style pastel card) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl p-6 sm:p-8 mb-6 shadow-lg overflow-hidden"
        style={{ backgroundColor: cat.bgLight }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-4 right-4">
          <CategoryIconCircle catId={catId} size={48} iconSize={22} variant="solid" />
        </div>

        <div className="relative max-w-2xl">
          <div className="text-[10px] uppercase tracking-widest font-extrabold mb-2" style={{ color: cat.accent }}>
            Leçon
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight mb-3">
            {cat.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-5">{lesson.intro}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/practice/${catId}`}
              className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-gray-900 shadow-md active:scale-95 transition hover:scale-105"
            >
              <Play size={14} fill="currentColor" />
              Commencer
            </Link>
            <span className="text-xs font-semibold text-gray-600">
              {cat.exercises.length} exercices · ~{Math.ceil(cat.exercises.length * 0.7)} min
            </span>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-3">
        {lesson.sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
            className="relative bg-white border-2 border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-gray-200 transition"
          >
            {/* Section number circular badge top-right */}
            <div
              className="absolute -top-3 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md border-2 border-white"
              style={{ background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)` }}
            >
              {idx + 1}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight pr-12 mb-2 leading-snug">
              {section.title.replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{section.rule}</p>

            {/* Examples */}
            <div className="space-y-2 mb-4">
              {section.examples.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="p-3.5 rounded-2xl"
                  style={{ backgroundColor: cat.bgLight }}
                >
                  <div className="text-[14px] font-extrabold text-gray-900 mb-1 leading-snug">
                    {ex.en}
                  </div>
                  {ex.fr && (
                    <div className="text-[12px] text-gray-600 leading-relaxed">{ex.fr}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Markers */}
            {section.markers && (
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-extrabold">
                  {section.markers.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {section.markers.items.map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="text-xs px-3 py-1.5 rounded-full font-bold"
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
                className="rounded-2xl p-4 border-l-4 mt-3"
                style={{ borderColor: cat.accent, backgroundColor: '#FFFBF5' }}
              >
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-extrabold flex items-center gap-1.5">
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
      <div className="mt-8">
        <Link
          href={`/practice/${catId}`}
          className="block w-full text-center py-5 rounded-3xl font-extrabold text-white transition-all hover:opacity-95 active:scale-[0.98] shadow-lg text-base"
          style={{
            background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}DD)`,
            boxShadow: `0 12px 36px -10px ${cat.accent}80`,
          }}
        >
          Lancer les exercices →
        </Link>
      </div>
    </div>
  );
}
