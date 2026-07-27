import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, BookOpen, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateLessonFn } from "../lib/ai.functions";
import { Markdown } from "../components/Markdown";


export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "AI Lesson Generator — LingoMate AI" },
      { name: "description", content: "Generate a personalized language lesson tailored to your language, level, and topic." },
      { property: "og:title", content: "AI Lesson Generator — LingoMate AI" },
      { property: "og:description", content: "Personalized AI-generated lessons for any language." },
    ],
  }),
  component: LessonsPage,
});

const LANGUAGES = ["Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Mandarin", "Korean", "Arabic", "English"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function LessonsPage() {
  const [language, setLanguage] = useState("Spanish");
  const [level, setLevel] = useState("Beginner");
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generate = useServerFn(generateLessonFn);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setLesson(null);
    setError(null);
    try {
      const result = await generate({ data: { language, level, topic } });
      setLesson(result.lesson);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </span>
        <h1 className="text-3xl md:text-4xl font-bold">AI Lesson Generator</h1>
      </div>
      <p className="text-muted-foreground mb-8">Create a custom language lesson tailored to your needs.</p>

      <form onSubmit={handleGenerate} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Language">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Level">
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="input">
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Topic">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Ordering food at a restaurant"
            className="input"
          />
        </Field>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating..." : "Generate Lesson"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm animate-pulse">
          <div className="h-6 w-1/2 bg-muted rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-11/12" />
            <div className="h-4 bg-muted rounded w-10/12" />
          </div>
        </div>
      )}

      {lesson && !loading && (
        <article className="mt-8 rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <Markdown>{lesson}</Markdown>
        </article>
      )}

      <style>{`
        .input { width: 100%; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0.625rem 0.75rem; font-size: 0.875rem; outline: none; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

