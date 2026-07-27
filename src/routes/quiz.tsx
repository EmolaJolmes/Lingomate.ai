import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Loader2, Sparkles, Check, X } from "lucide-react";
import { generateQuiz, type QuizQuestion } from "../lib/ai";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "AI Quiz Generator — LingoMate AI" },
      { name: "description", content: "Generate AI-powered language quizzes at any difficulty to test your skills." },
      { property: "og:title", content: "AI Quiz Generator — LingoMate AI" },
      { property: "og:description", content: "Test your language skills with AI-generated quizzes." },
    ],
  }),
  component: QuizPage,
});

const LANGUAGES = ["Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Mandarin", "Korean", "Arabic", "English"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function QuizPage() {
  const [language, setLanguage] = useState("Spanish");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions(null);
    setAnswers({});
    setSubmitted(false);
    const q = await generateQuiz({ language, topic, difficulty });
    setQuestions(q);
    setLoading(false);
  }

  const score = questions
    ? questions.reduce((n, q, i) => (answers[i] === q.answerIndex ? n + 1 : n), 0)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Brain className="h-5 w-5" />
        </span>
        <h1 className="text-3xl md:text-4xl font-bold">AI Quiz Generator</h1>
      </div>
      <p className="text-muted-foreground mb-8">Test yourself with quizzes generated on demand.</p>

      <form onSubmit={handleGenerate} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Language">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Difficulty">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input">
              {DIFFICULTIES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Topic">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Verb conjugation" className="input" />
        </Field>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>

      {questions && (
        <div className="mt-8 space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="font-semibold mb-4">
                <span className="text-primary mr-2">Q{i + 1}.</span>{q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[i] === oi;
                  const correct = submitted && oi === q.answerIndex;
                  const wrong = submitted && selected && oi !== q.answerIndex;
                  return (
                    <label
                      key={oi}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${
                        correct ? "border-green-500 bg-green-500/10" :
                        wrong ? "border-red-500 bg-red-500/10" :
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        disabled={submitted}
                        checked={selected}
                        onChange={() => setAnswers({ ...answers, [i]: oi })}
                        className="accent-primary"
                      />
                      <span className="flex-1 text-sm">{opt}</span>
                      {correct && <Check className="h-4 w-4 text-green-600" />}
                      {wrong && <X className="h-4 w-4 text-red-600" />}
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
                  <strong className="text-foreground">Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length !== questions.length}
              className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="rounded-2xl bg-primary text-primary-foreground p-6 text-center">
              <p className="text-lg font-semibold">You scored {score} / {questions.length}</p>
              <button
                onClick={() => { setSubmitted(false); setAnswers({}); }}
                className="mt-3 rounded-lg bg-background text-foreground px-4 py-2 text-sm font-semibold"
              >
                Try again
              </button>
            </div>
          )}
        </div>
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
