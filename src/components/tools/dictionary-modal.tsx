'use client';

import { useEffect, useRef, useState } from 'react';
import { BookA, NotebookPen, Search, Volume2 } from 'lucide-react';
import { ToolSheet } from './tool-sheet';

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
    synonyms?: string[];
  }[];
}

const VOCAB_STORAGE_KEY = 'mela_vocab_notebook';

interface VocabEntry {
  id: string;
  en: string;
  fr: string;
  addedAt: string;
}

function addToVocab(en: string, fr: string) {
  if (typeof window === 'undefined' || !en.trim()) return;
  try {
    const raw = window.localStorage.getItem(VOCAB_STORAGE_KEY);
    const list: VocabEntry[] = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: crypto.randomUUID(),
      en: en.trim(),
      fr: fr.trim(),
      addedAt: new Date().toISOString(),
    });
    window.localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

interface DictionaryModalProps {
  onClose: () => void;
  initialQuery?: string;
}

export function DictionaryModal({ onClose, initialQuery = '' }: DictionaryModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedConfirm, setSavedConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTranslation = async (term: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=en|fr`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      const t = data?.responseData?.translatedText;
      if (typeof t !== 'string' || !t.trim()) return null;
      // Ignore "PLEASE SELECT TWO DIFFERENT LANGUAGES" etc.
      if (t.toUpperCase() === term.toUpperCase()) return null;
      return t;
    } catch {
      return null;
    }
  };

  const lookup = async (term?: string) => {
    const t = (term ?? query).trim().toLowerCase();
    if (!t) return;
    setLoading(true);
    setError(null);
    setEntry(null);
    setTranslation(null);

    // Run both calls in parallel
    const [defRes, fr] = await Promise.allSettled([
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(t)}`),
      fetchTranslation(t),
    ]);

    // Translation result (best-effort, doesn't block)
    if (fr.status === 'fulfilled' && fr.value) {
      setTranslation(fr.value);
    }

    if (defRes.status === 'rejected') {
      setError('Erreur réseau. Réessaie dans un instant.');
    } else if (!defRes.value.ok) {
      // Even if no English definition, we might still have a translation
      if (fr.status === 'fulfilled' && fr.value) {
        setError(null); // No error if we got at least a translation
      } else {
        setError('Mot introuvable. Vérifie l’orthographe (anglais uniquement).');
      }
    } else {
      try {
        const data: DictionaryEntry[] = await defRes.value.json();
        setEntry(data[0] ?? null);
      } catch {
        setError('Erreur lors de la lecture de la définition.');
      }
    }

    setLoading(false);
  };

  // Auto-lookup if initialQuery is provided, otherwise focus input
  useEffect(() => {
    if (initialQuery.trim()) {
      void lookup(initialQuery);
    } else {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const handleSaveToVocab = () => {
    const word = entry?.word ?? query.trim();
    if (!word) return;
    addToVocab(word, translation ?? '');
    setSavedConfirm(true);
    setTimeout(() => setSavedConfirm(false), 2000);
  };

  const audioUrl = entry?.phonetics.find((p) => p.audio)?.audio;
  const ipa = entry?.phonetic || entry?.phonetics.find((p) => p.text)?.text;

  return (
    <ToolSheet
      title="Dictionnaire"
      subtitle="Anglais · définitions, exemples, prononciation"
      Icon={BookA}
      color="#FF6B35"
      bgLight="#FFE4D6"
      onClose={onClose}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 mb-4">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') lookup();
          }}
          placeholder="Tape ou colle un mot anglais…"
          className="bg-transparent text-sm outline-none flex-1 font-medium placeholder:text-gray-400"
        />
        <button
          onClick={() => lookup()}
          disabled={loading || !query.trim()}
          className="px-3 py-1.5 rounded-full bg-[#FF6B35] text-white text-xs font-extrabold transition active:scale-95 disabled:opacity-40"
        >
          {loading ? '...' : 'OK'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3 mb-3 font-medium space-y-2">
          <p>{error}</p>
          {query.trim() && (
            <button
              onClick={handleSaveToVocab}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white border-2 border-red-200 text-red-700 font-extrabold hover:bg-red-50 transition active:scale-95"
            >
              <NotebookPen size={12} strokeWidth={2.5} />
              Sauver “{query.trim()}” dans le carnet quand même
            </button>
          )}
        </div>
      )}

      {!entry && !error && !loading && (
        <div className="text-center py-8">
          <BookA size={36} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500 font-medium">
            Tape un mot pour voir la définition, la prononciation et des exemples.
          </p>
          <p className="text-[11px] text-gray-400 font-semibold mt-3 max-w-xs mx-auto leading-relaxed">
            Astuce : sélectionne un mot dans une page avant d’ouvrir le dico, il sera pré-rempli.
          </p>
        </div>
      )}

      {(entry || translation) && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {entry?.word ?? query.trim()}
            </h3>
            {ipa && <span className="text-sm text-gray-500 font-mono">{ipa}</span>}
            <button
              onClick={() =>
                audioUrl ? playAudio(audioUrl) : speak(entry?.word ?? query.trim())
              }
              className="w-9 h-9 rounded-full bg-[#FFE4D6] flex items-center justify-center text-[#FF6B35] hover:bg-[#FFD0BB] transition active:scale-95"
              aria-label="Écouter"
            >
              <Volume2 size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleSaveToVocab}
              className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition active:scale-95 ${
                savedConfirm
                  ? 'bg-[#34C759] text-white'
                  : 'bg-[#EFD9F7] text-[#AF52DE] hover:bg-[#E5C8E8]'
              }`}
              aria-label="Sauver dans le carnet de vocab"
            >
              <NotebookPen size={12} strokeWidth={2.5} />
              {savedConfirm ? 'Sauvé !' : 'Sauver dans vocab'}
            </button>
          </div>

          {/* French translation block */}
          {translation && (
            <div className="bg-gradient-to-br from-[#EFD9F7] to-[#F8EDFD] rounded-2xl p-4 border-2 border-[#AF52DE]/20">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#AF52DE] mb-1">
                Traduction française
              </div>
              <div className="text-lg font-extrabold text-gray-900 leading-tight">
                {translation}
              </div>
            </div>
          )}

          {entry?.meanings.map((m, i) => (
            <div key={i}>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-[#FF6B35] mb-2">
                {m.partOfSpeech}
              </div>
              <ol className="space-y-2.5">
                {m.definitions.slice(0, 3).map((d, j) => (
                  <li key={j} className="text-sm leading-relaxed">
                    <div className="text-gray-800 font-medium">
                      <span className="text-gray-400 font-bold tabular-nums mr-1.5">
                        {j + 1}.
                      </span>
                      {d.definition}
                    </div>
                    {d.example && (
                      <div className="text-xs text-gray-500 italic mt-1 ml-5">“{d.example}”</div>
                    )}
                  </li>
                ))}
              </ol>
              {m.synonyms && m.synonyms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.synonyms.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setQuery(s);
                        void lookup(s);
                      }}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFE4D6] text-[#FF6B35] font-bold hover:bg-[#FFD0BB] transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ToolSheet>
  );
}
