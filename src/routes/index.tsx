import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Brain, MessageCircle, NotebookPen, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LingoMate AI — Learn a new language with AI" },
      { name: "description", content: "Personalized AI lessons, quizzes, conversation practice, and a vocabulary notebook to help students master any language." },
      { property: "og:title", content: "LingoMate AI" },
      { property: "og:description", content: "Learn a new language with AI-powered tools built for students." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: BookOpen, title: "AI Lesson Generator", desc: "Get a full lesson tailored to your language, level, and topic in seconds.", to: "/lessons" },
  { icon: Brain, title: "AI Quiz Generator", desc: "Test yourself with quizzes generated on demand at any difficulty.", to: "/quiz" },
  { icon: MessageCircle, title: "Conversation Practice", desc: "Chat with an AI tutor to build fluency and confidence.", to: "/chat" },
  { icon: NotebookPen, title: "Vocabulary Notebook", desc: "Save new words, mark them as learned, and grow your vocabulary.", to: "/vocabulary" },
] as const;

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by AI
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            Learn any language <span className="text-primary">faster</span>, with AI.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            LingoMate AI is your personal language tutor. Generate lessons, take quizzes,
            practice real conversations, and build vocabulary — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/lessons" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition">
              Start learning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted transition">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to learn</h2>
          <p className="mt-3 text-muted-foreground">Four powerful tools, one language learning companion.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to become fluent?</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Jump into your first AI-generated lesson — no signup required.
          </p>
          <Link to="/lessons" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background text-foreground px-5 py-3 text-sm font-semibold hover:bg-background/90 transition">
            Generate a lesson <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
