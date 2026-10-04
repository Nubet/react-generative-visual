import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./docs.css";

const sources = import.meta.glob("../docs/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;
const documents = Object.entries(sources)
  .map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "index";
    const title = content.match(/^#\s+(.+)$/m)?.[1] ?? slug;
    return { slug, title, content };
  })
  .sort((a, b) => (a.slug === "index" ? -1 : b.slug === "index" ? 1 : a.title.localeCompare(b.title)));

export function DocsApp() {
  const requestedSlug = new URLSearchParams(window.location.search).get("page") ?? "index";
  const current = documents.find((document) => document.slug === requestedSlug) ?? documents[0];

  return <div className="docs-shell">
    <header className="docs-header">
      <a className="docs-brand" href="../" aria-label="Back to Generative Visual playground">Generative Visual <span>/ docs</span></a>
      <a className="docs-back" href="../">Back to playground <span>↗</span></a>
    </header>
    <div className="docs-layout">
      <aside className="docs-sidebar" aria-label="Documentation navigation">
        <p className="docs-kicker">Reference</p>
        <nav>
          {documents.map((document) => <a key={document.slug} href={document.slug === "index" ? "./" : `./?page=${document.slug}`} aria-current={document.slug === current.slug ? "page" : undefined}>{document.title}</a>)}
        </nav>
      </aside>
      <main className="docs-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{current.content}</ReactMarkdown>
      </main>
    </div>
  </div>;
}
