import { Link } from "@tanstack/react-router";
import { Languages, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/lessons", label: "Lessons" },
  { to: "/quiz", label: "Quiz" },
  { to: "/chat", label: "Chat" },
  { to: "/vocabulary", label: "Vocabulary" },
  { to: "/about", label: "About" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Languages className="h-5 w-5" />
            </span>
            <span>LingoMate <span className="text-primary">AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/60 bg-background">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Languages className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} LingoMate AI. Learn languages smarter.</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/lessons" className="hover:text-foreground">Lessons</Link>
            <Link to="/chat" className="hover:text-foreground">Chat</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
