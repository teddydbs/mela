'use client';

import { useEffect, useState } from 'react';
import { NotebookPen, Plus, Trash2 } from 'lucide-react';
import { ToolSheet } from './tool-sheet';

interface VocabEntry {
  id: string;
  en: string;
  fr: string;
  addedAt: string;
}

const STORAGE_KEY = 'mela_vocab_notebook';

function loadVocab(): VocabEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VocabEntry[]) : [];
  } catch {
    return [];
  }
}

function saveVocab(entries: VocabEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function VocabNotebookModal({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [en, setEn] = useState('');
  const [fr, setFr] = useState('');

  useEffect(() => {
    setEntries(loadVocab());
  }, []);

  const add = () => {
    const e = en.trim();
    const f = fr.trim();
    if (!e || !f) return;
    const next: VocabEntry[] = [
      { id: crypto.randomUUID(), en: e, fr: f, addedAt: new Date().toISOString() },
      ...entries,
    ];
    setEntries(next);
    saveVocab(next);
    setEn('');
    setFr('');
  };

  const remove = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveVocab(next);
  };

  return (
    <ToolSheet
      title="Carnet de vocabulaire"
      subtitle={`${entries.length} mot${entries.length > 1 ? 's' : ''} sauvegardé${
        entries.length > 1 ? 's' : ''
      }`}
      Icon={NotebookPen}
      color="#AF52DE"
      bgLight="#EFD9F7"
      onClose={onClose}
      footer={
        <button
          onClick={add}
          disabled={!en.trim() || !fr.trim()}
          className="w-full py-3.5 rounded-2xl font-extrabold text-white shadow-lg active:scale-[0.98] transition disabled:opacity-40 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #AF52DE, #C77DEC)',
            boxShadow: '0 10px 30px -10px #AF52DE80',
          }}
        >
          <Plus size={16} strokeWidth={3} />
          Ajouter au carnet
        </button>
      }
    >
      {/* Add form */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          value={en}
          onChange={(e) => setEn(e.target.value)}
          placeholder="Mot anglais"
          className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#AF52DE] transition placeholder:text-gray-400"
        />
        <input
          type="text"
          value={fr}
          onChange={(e) => setFr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') add();
          }}
          placeholder="Traduction"
          className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#AF52DE] transition placeholder:text-gray-400"
        />
      </div>

      {/* List */}
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <NotebookPen size={36} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500 font-medium">
            Aucun mot encore. Ajoute ceux que tu apprends pour les retrouver plus tard.
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-3 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold text-gray-900 leading-tight truncate">
                  {entry.en}
                </div>
                <div className="text-xs text-gray-500 truncate">{entry.fr}</div>
              </div>
              <button
                onClick={() => remove(entry.id)}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition active:scale-95"
                aria-label="Supprimer"
              >
                <Trash2 size={14} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </ToolSheet>
  );
}
