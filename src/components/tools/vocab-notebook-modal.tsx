'use client';

import { useEffect, useState } from 'react';
import { Check, NotebookPen, Pencil, Plus, Trash2, X } from 'lucide-react';
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

interface VocabNotebookModalProps {
  onClose: () => void;
  initialWord?: string;
}

export function VocabNotebookModal({ onClose, initialWord = '' }: VocabNotebookModalProps) {
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [en, setEn] = useState(initialWord);
  const [fr, setFr] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFr, setEditFr] = useState('');

  useEffect(() => {
    setEntries(loadVocab());
  }, []);

  const incompleteCount = entries.filter((e) => !e.fr.trim()).length;

  const add = () => {
    const e = en.trim();
    if (!e) return;
    const next: VocabEntry[] = [
      {
        id: crypto.randomUUID(),
        en: e,
        fr: fr.trim(),
        addedAt: new Date().toISOString(),
      },
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

  const startEditing = (entry: VocabEntry) => {
    setEditingId(entry.id);
    setEditFr(entry.fr);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const next = entries.map((e) => (e.id === editingId ? { ...e, fr: editFr.trim() } : e));
    setEntries(next);
    saveVocab(next);
    setEditingId(null);
    setEditFr('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFr('');
  };

  return (
    <ToolSheet
      title="Carnet de vocabulaire"
      subtitle={
        entries.length === 0
          ? 'Vide pour l’instant'
          : `${entries.length} mot${entries.length > 1 ? 's' : ''}${
              incompleteCount > 0
                ? ` · ${incompleteCount} à compléter`
                : ''
            }`
      }
      Icon={NotebookPen}
      color="#AF52DE"
      bgLight="#EFD9F7"
      onClose={onClose}
      footer={
        <button
          onClick={add}
          disabled={!en.trim()}
          className="w-full py-3.5 rounded-2xl font-extrabold text-white shadow-lg active:scale-[0.98] transition disabled:opacity-40 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #AF52DE, #C77DEC)',
            boxShadow: '0 10px 30px -10px #AF52DE80',
          }}
        >
          <Plus size={16} strokeWidth={3} />
          {fr.trim() ? 'Ajouter au carnet' : 'Ajouter (sans traduction)'}
        </button>
      }
    >
      {/* Add form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <input
          type="text"
          value={en}
          onChange={(e) => setEn(e.target.value)}
          placeholder="Mot anglais *"
          className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#AF52DE] transition placeholder:text-gray-400"
        />
        <input
          type="text"
          value={fr}
          onChange={(e) => setFr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') add();
          }}
          placeholder="Traduction (optionnel)"
          className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#AF52DE] transition placeholder:text-gray-400"
        />
      </div>
      <p className="text-[11px] text-gray-400 font-semibold mb-4 leading-relaxed">
        Tu peux ajouter un mot sans traduction et revenir plus tard pour la compléter.
      </p>

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
          {entries.map((entry) => {
            const isIncomplete = !entry.fr.trim();
            const isEditing = editingId === entry.id;
            return (
              <li
                key={entry.id}
                className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 border-2 transition ${
                  isIncomplete
                    ? 'bg-[#FFF4CC] border-[#FFB800]/40'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900 leading-tight truncate">
                      {entry.en}
                    </span>
                    {isIncomplete && !isEditing && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#9C7A37] bg-white/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        à compléter
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <input
                        autoFocus
                        type="text"
                        value={editFr}
                        onChange={(e) => setEditFr(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        placeholder="Tape la traduction…"
                        className="flex-1 bg-white border-2 border-[#AF52DE] rounded-lg px-2.5 py-1 text-xs font-semibold outline-none placeholder:text-gray-400"
                      />
                      <button
                        onClick={saveEdit}
                        className="w-7 h-7 rounded-full bg-[#34C759] text-white flex items-center justify-center active:scale-90 transition flex-shrink-0"
                        aria-label="Enregistrer"
                      >
                        <Check size={12} strokeWidth={3} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center active:scale-90 transition flex-shrink-0"
                        aria-label="Annuler"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(entry)}
                      className="text-xs text-left text-gray-500 truncate hover:text-[#AF52DE] transition mt-0.5 flex items-center gap-1.5 w-full"
                    >
                      {entry.fr || (
                        <span className="italic text-[#9C7A37] font-semibold">
                          + Ajouter la traduction
                        </span>
                      )}
                      <Pencil size={10} className="text-gray-300 flex-shrink-0" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
                {!isEditing && (
                  <button
                    onClick={() => remove(entry.id)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition active:scale-95"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ToolSheet>
  );
}
