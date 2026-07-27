import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NotebookPen, Plus, Trash2, Check } from "lucide-react";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "Vocabulary Notebook — LingoMate AI" },
      { name: "description", content: "Save vocabulary words, mark them as learned, and grow your language skills." },
      { property: "og:title", content: "Vocabulary Notebook — LingoMate AI" },
      { property: "og:description", content: "Your personal vocabulary notebook." },
    ],
  }),
  component: VocabPage,
});

type Word = {
  id: string;
  word: string;
  translation: string;
  learned: boolean;
};

const STORAGE_KEY = "lingomate:vocabulary";

function VocabPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWords(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words, hydrated]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    setWords((w) => [
      { id: crypto.randomUUID(), word: word.trim(), translation: translation.trim(), learned: false },
      ...w,
    ]);
    setWord("");
    setTranslation("");
  }

  function toggle(id: string) {
    setWords((w) => w.map((x) => (x.id === id ? { ...x, learned: !x.learned } : x)));
  }
  function remove(id: string) {
    setWords((w) => w.filter((x) => x.id !== id));
  }

  const learnedCount = words.filter((w) => w.learned).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <NotebookPen className="h-5 w-5" />
        </span>
        <h1 className="text-3xl md:text-4xl font-bold">Vocabulary Notebook</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Saved in your browser. {words.length > 0 && `${learnedCount}/${words.length} learned.`}
      </p>

      <form onSubmit={add} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Word (e.g. Bonjour)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation (e.g. Hello)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add word
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {words.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <NotebookPen className="h-10 w-10 mx-auto opacity-40 mb-3" />
            <p>No words yet. Add your first one above!</p>
          </div>
        )}
        {words.map((w) => (
          <div
            key={w.id}
            className={`flex items-center gap-3 rounded-xl border p-4 transition ${
              w.learned ? "border-green-500/40 bg-green-500/5" : "border-border bg-card"
            }`}
          >
            <button
              onClick={() => toggle(w.id)}
              className={`h-6 w-6 shrink-0 grid place-items-center rounded-md border-2 transition ${
                w.learned ? "bg-green-500 border-green-500 text-white" : "border-border hover:border-primary"
              }`}
              aria-label={w.learned ? "Mark as not learned" : "Mark as learned"}
            >
              {w.learned && <Check className="h-4 w-4" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold truncate ${w.learned ? "line-through text-muted-foreground" : ""}`}>
                {w.word}
              </div>
              <div className="text-sm text-muted-foreground truncate">{w.translation}</div>
            </div>
            <button
              onClick={() => remove(w.id)}
              className="h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
