import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Brain, MessageCircle, NotebookPen, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LingoMate AI" },
      { name: "description", content: "LingoMate AI is a free, AI-powered platform helping students learn any language through lessons, quizzes, conversation, and vocabulary tools." },
      { property: "og:title", content: "About LingoMate AI" },
      { property: "og:description", content: "Our mission is to make language learning accessible with AI." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold">About LingoMate AI</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        LingoMate AI is a free, AI-powered language learning companion built for students.
        We believe that learning a new language should be personal, engaging, and accessible
        to everyone — no accounts, no fees, no barriers.
      </p>

      <section className="mt-12 rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Heart className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-bold">Our mission</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Traditional language courses can be rigid, slow, and one-size-fits-all. LingoMate AI
          uses artificial intelligence to build lessons around <em>you</em> — your level, your
          goals, and the topics you actually care about. Whether you're preparing for a trip,
          a class, or a career opportunity, LingoMate AI is here to help you make real progress.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6">What you can do</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card icon={BookOpen} title="Generate lessons" desc="Get a full lesson tailored to your language, level, and topic." />
          <Card icon={Brain} title="Take quizzes" desc="Test your understanding with adaptive AI-generated quizzes." />
          <Card icon={MessageCircle} title="Practice conversations" desc="Chat with an AI tutor to build real speaking confidence." />
          <Card icon={NotebookPen} title="Track vocabulary" desc="Save words to your personal notebook — all stored on your device." />
        </div>
      </section>

      <section className="mt-12 rounded-2xl bg-primary text-primary-foreground p-8 text-center shadow-lg">
        <h2 className="text-2xl font-bold">Start learning today</h2>
        <p className="mt-2 opacity-90">No signup. No tracking. Just learning.</p>
        <Link to="/lessons" className="mt-6 inline-flex rounded-lg bg-background text-foreground px-5 py-3 font-semibold hover:bg-background/90 transition">
          Generate my first lesson
        </Link>
      </section>
    </div>
  );
}

function Card({ icon: Icon, title, desc }: { icon: typeof BookOpen; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
