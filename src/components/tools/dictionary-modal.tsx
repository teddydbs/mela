'use client';

import { useEffect, useRef, useState } from 'react';
import { BookA, Search, Volume2 } from 'lucide-react';
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

export function DictionaryModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const lookup = async () => {
    const term = query.trim().toLowerCase();
    if (!term) return;
    setLoading(true);
    setError(null);
    setEntry(null);
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`,
      );
      if (!res.ok) {
        setError('Mot introuvable. Vérifie l’orthographe (anglais uniquement).');
        return;
      }
      const data: DictionaryEntry[] = await res.json();
      setEntry(data[0]);
    } catch {
      setError('Erreur réseau. Réessaie dans un instant.');
    } finally {
      setLoading(false);
    }
  };

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
          placeholder="Tape un mot anglais…"
          className="bg-transparent text-sm outline-none flex-1 font-medium placeholder:text-gray-400"
        />
        <button
          onClick={lookup}
          disabled={loading || !query.trim()}
          className="px-3 py-1.5 rounded-full bg-[#FF6B35] text-white text-xs font-extrabold transition active:scale-95 disabled:opacity-40"
        >
          {loading ? '...' : 'OK'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3 mb-3 font-medium">
          {error}
        </div>
      )}

      {!entry && !error && !loading && (
        <div className="text-center py-8">
          <BookA size={36} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500 font-medium">
            Tape un mot pour voir la définition, la prononciation et des exemples.
          </p>
        </div>
      )}

      {entry && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">{entry.word}</h3>
            {ipa && <span className="text-sm text-gray-500 font-mono">{ipa}</span>}
            <button
              onClick={() => (audioUrl ? playAudio(audioUrl) : speak(entry.word))}
              className="w-9 h-9 rounded-full bg-[#FFE4D6] flex items-center justify-center text-[#FF6B35] hover:bg-[#FFD0BB] transition active:scale-95"
              aria-label="Écouter"
            >
              <Volume2 size={16} strokeWidth={2.5} />
            </button>
          </div>

          {entry.meanings.map((m, i) => (
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
                      <div className="text-xs text-gray-500 italic mt-1 ml-5">
                        “{d.example}”
                      </div>
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
                        setEntry(null);
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
