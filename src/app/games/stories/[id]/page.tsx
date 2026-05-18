'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import {
  STORIES,
  STORY_LEVEL_COLORS,
  STORY_THEMES,
  evaluateAnswer,
  getStoryById,
} from '@/lib/data/stories';
import { useUserData } from '@/lib/use-user-data';
import type { Story } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoryPlayPage({ params }: PageProps) {
  const { id } = use(params);
  const storyId = Number(id);
  const story = getStoryById(storyId);

  if (!story) {
    notFound();
  }

  return <StoryPlay story={story} />;
}

function StoryPlay({ story }: { story: Story }) {
  const router = useRouter();
  const { recordStoryResult } = useUserData();
  const themeMeta = STORY_THEMES[story.theme];
  const levelColors = STORY_LEVEL_COLORS[story.level];
  const ThemeIcon = themeMeta.icon;

  const nextStory = useMemo(() => {
    const idx = STORIES.findIndex((s) => s.id === story.id);
    return idx >= 0 && idx < STORIES.length - 1 ? STORIES[idx + 1] : null;
  }, [story.id]);

  const [answer, setAnswer] = useState('');
  const [hintsOpen, setHintsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluateAnswer> | null>(null);

  function handleSubmit() {
    if (!answer.trim()) return;
    const evalRes = evaluateAnswer(answer, story);
    setEvaluation(evalRes);
    setSubmitted(true);

    recordStoryResult({
      storyId: story.id,
      score: evalRes.score,
      matchedWords: evalRes.matchedWords,
      totalWords: evalRes.totalWords,
      similarity: evalRes.similarity,
    });

    if (evalRes.score >= 70) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#34C759', '#FFB800', '#AF52DE', '#FF6B35'],
      });
    }
  }

  function handleRetry() {
    setSubmitted(false);
    setEvaluation(null);
    setAnswer('');
  }

  const isSuccess = evaluation && evaluation.score >= 70;

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-3 mb-5"
      >
        <Link
          href="/games/stories"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition active:scale-95 flex-shrink-0 mt-1"
          aria-label="Retour aux histoires"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span
              className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: levelColors.bgLight, color: levelColors.accent }}
            >
              {story.level}
            </span>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: themeMeta.bgLight, color: themeMeta.accent }}
            >
              <ThemeIcon size={10} strokeWidth={3} />
              {themeMeta.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">
              #{String(story.id).padStart(2, '0')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {story.title_fr}
          </h1>
        </div>
      </motion.div>

      {/* French source card (featured pastel) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative rounded-3xl p-5 sm:p-6 mb-5 shadow-lg overflow-hidden"
        style={{ backgroundColor: themeMeta.bgLight }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
        <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
          <ThemeIcon size={22} style={{ color: themeMeta.accent }} strokeWidth={2.5} />
        </div>
        <div className="relative">
          <div
            className="text-[10px] uppercase tracking-widest font-extrabold mb-2"
            style={{ color: themeMeta.accent }}
          >
            Texte source · Français
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed pr-14">
            {story.fr}
          </p>
        </div>
      </motion.div>

      {/* Target words */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-2 border-gray-100 rounded-3xl p-5 mb-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-[#34C759]" strokeWidth={2.5} />
          <h2 className="text-sm font-extrabold text-gray-900">Mots à utiliser</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {story.target_words.map((w) => {
            const used = submitted && evaluation && !evaluation.missingTargets.includes(w);
            return (
              <span
                key={w}
                className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-full transition"
                style={
                  submitted
                    ? used
                      ? { backgroundColor: '#B5F0C9', color: '#1F7A3F' }
                      : { backgroundColor: '#FFEBEA', color: '#B91C1C' }
                    : { backgroundColor: '#F3F4F6', color: '#0F172A' }
                }
              >
                {submitted &&
                  (used ? (
                    <Check size={10} strokeWidth={3} />
                  ) : (
                    <X size={10} strokeWidth={3} />
                  ))}
                {w}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* Hints accordion */}
      {story.hints_fr.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="bg-white border-2 border-gray-100 rounded-3xl mb-5 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setHintsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 p-5 hover:bg-gray-50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-[#FFB800]" strokeWidth={2.5} />
              <span className="text-sm font-extrabold text-gray-900">
                Indices {hintsOpen ? '' : `(${story.hints_fr.length})`}
              </span>
            </div>
            <ChevronDown
              size={18}
              strokeWidth={2.5}
              className={`text-gray-400 transition-transform ${hintsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {hintsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-2 border-t-2 border-gray-100 pt-4">
                  {story.hints_fr.map((h, i) => (
                    <div
                      key={i}
                      className="flex gap-2 text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed"
                    >
                      <span className="text-[#FFB800] font-extrabold flex-shrink-0">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Answer textarea */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="bg-white border-2 border-gray-100 rounded-3xl p-5 mb-5 shadow-sm"
      >
        <label
          htmlFor="story-answer"
          className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-2 block"
        >
          Ta traduction · English
        </label>
        <textarea
          id="story-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          placeholder="Type your English version here..."
          rows={5}
          className="w-full text-base font-semibold text-gray-900 placeholder:text-gray-300 bg-transparent resize-none focus:outline-none disabled:opacity-70"
        />
        <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t-2 border-gray-100">
          <span className="text-[11px] text-gray-400 font-semibold tabular-nums">
            {answer.trim().split(/\s+/).filter(Boolean).length} mots
          </span>
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white rounded-full px-5 py-2.5 font-extrabold text-sm active:scale-95 transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Vérifier
              <Check size={14} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-4 py-2 font-extrabold text-sm active:scale-95 transition"
            >
              <RefreshCw size={13} strokeWidth={2.5} />
              Recommencer
            </button>
          )}
        </div>
      </motion.div>

      {/* Result panel */}
      <AnimatePresence>
        {submitted && evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Score card */}
            <div
              className="relative rounded-3xl p-5 sm:p-6 shadow-lg overflow-hidden"
              style={{
                backgroundColor: isSuccess ? '#D6F5DD' : '#FFF4B3',
              }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
              <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
                {isSuccess ? (
                  <Trophy size={22} className="text-[#34C759]" strokeWidth={2.5} />
                ) : (
                  <Sparkles size={22} className="text-[#9C7A37]" strokeWidth={2.5} />
                )}
              </div>
              <div className="relative">
                <div
                  className="text-[10px] uppercase tracking-widest font-extrabold mb-2"
                  style={{ color: isSuccess ? '#1F7A3F' : '#9C7A37' }}
                >
                  {isSuccess ? 'Bien joué' : 'À retravailler'}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-gray-900 tabular-nums leading-none">
                    {evaluation.score}
                  </span>
                  <span className="text-lg font-extrabold text-gray-500 mb-1">/100</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs font-extrabold text-gray-700">
                  <span className="inline-flex items-center gap-1">
                    <Target size={11} strokeWidth={3} />
                    {evaluation.matchedWords}/{evaluation.totalWords} mots cibles
                  </span>
                  <span className="inline-flex items-center gap-1">
                    Similarité {Math.round(evaluation.similarity * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Reference comparison */}
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-2">
                Traduction de référence
              </div>
              <p className="text-base font-semibold text-gray-900 leading-relaxed mb-4">
                {story.en_reference}
              </p>
              <div className="border-t-2 border-gray-100 pt-4">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 mb-2">
                  Ta version
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {answer}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleRetry}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl px-6 py-3 font-extrabold text-sm active:scale-95 transition"
              >
                <RefreshCw size={14} strokeWidth={2.5} />
                Réessayer
              </button>
              {nextStory ? (
                <button
                  onClick={() => router.push(`/games/stories/${nextStory.id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white rounded-full px-5 py-3 font-extrabold text-sm active:scale-95 transition shadow-md"
                >
                  Histoire suivante
                  <ArrowRight size={14} strokeWidth={3} />
                </button>
              ) : (
                <Link
                  href="/games/stories"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white rounded-full px-5 py-3 font-extrabold text-sm active:scale-95 transition shadow-md"
                >
                  Retour aux histoires
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
