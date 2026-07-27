import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children, compact = false }: { children: string; compact?: boolean }) {
  return (
    <div className={compact ? "md-content md-compact" : "md-content"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-3xl font-bold mt-2 mb-4" {...props} />,
          h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary" {...props} />,
          h3: (props) => <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />,
          h4: (props) => <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />,
          p: (props) => <p className="my-2 leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 space-y-1 my-3" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 space-y-1 my-3" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-3" {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) {
              return (
                <pre className="my-3 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                  <code className={className} {...props}>{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em] font-mono" {...props}>
                {children}
              </code>
            );
          },
          a: (props) => <a className="text-primary underline underline-offset-2 hover:opacity-80" target="_blank" rel="noreferrer" {...props} />,
          hr: () => <hr className="my-6 border-border" />,
          table: (props) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          th: (props) => <th className="border border-border bg-muted px-3 py-2 text-left font-semibold" {...props} />,
          td: (props) => <td className="border border-border px-3 py-2" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
