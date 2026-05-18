'use client';

import { useState } from 'react';
import { BookA, NotebookPen, Timer, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DictionaryModal } from '@/components/tools/dictionary-modal';
import { VocabNotebookModal } from '@/components/tools/vocab-notebook-modal';
import { FocusTimerModal } from '@/components/tools/focus-timer-modal';
import { QuickQuizModal } from '@/components/tools/quick-quiz-modal';

type ToolKey = 'dictionary' | 'vocab' | 'timer' | 'quiz';

type Tool = {
  key: ToolKey;
  label: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
};

const TOOLS: Tool[] = [
  { key: 'dictionary', label: 'Dico', Icon: BookA, color: '#FF6B35', bg: '#FFE4D6' },
  { key: 'vocab', label: 'Vocab', Icon: NotebookPen, color: '#AF52DE', bg: '#EFD9F7' },
  { key: 'timer', label: 'Focus', Icon: Timer, color: '#34C759', bg: '#D6F5DD' },
  { key: 'quiz', label: 'Quiz', Icon: Zap, color: '#FFB800', bg: '#FFF4CC' },
];

export function BottomToolbar() {
  const [openTool, setOpenTool] = useState<ToolKey | null>(null);

  return (
    <>
      <div className="flex items-center gap-1.5 bg-[#0A0A0A] border-2 border-white/10 rounded-full px-3 py-2 shadow-2xl">
        {TOOLS.map((tool) => {
          const Icon = tool.Icon;
          const isActive = openTool === tool.key;
          return (
            <button
              key={tool.key}
              onClick={() => setOpenTool(tool.key)}
              className="group flex items-center gap-1.5 active:scale-90 transition pr-1"
              aria-label={tool.label}
              title={tool.label}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isActive ? tool.color : tool.bg,
                  boxShadow: isActive ? `0 4px 14px ${tool.color}80` : 'none',
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={2.5}
                  style={{ color: isActive ? 'white' : tool.color }}
                />
              </div>
              <span className="hidden sm:inline text-xs font-extrabold text-white/70 group-hover:text-white pr-2">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      {openTool === 'dictionary' && <DictionaryModal onClose={() => setOpenTool(null)} />}
      {openTool === 'vocab' && <VocabNotebookModal onClose={() => setOpenTool(null)} />}
      {openTool === 'timer' && <FocusTimerModal onClose={() => setOpenTool(null)} />}
      {openTool === 'quiz' && <QuickQuizModal onClose={() => setOpenTool(null)} />}
    </>
  );
}
