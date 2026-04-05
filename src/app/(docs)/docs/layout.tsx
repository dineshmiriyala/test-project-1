import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { docsContent } from "@/lib/docs/content";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicShell>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <p className="eyebrow">Docs</p>
          <h2>Signal Lab</h2>
          <div className="docs-sidebar-links">
            {docsContent.map((article) => (
              <Link key={article.slug} href={`/docs/${article.slug}`}>
                {article.title}
              </Link>
            ))}
          </div>
        </aside>
        <div className="docs-content">{children}</div>
      </div>
    </PublicShell>
  );
}
