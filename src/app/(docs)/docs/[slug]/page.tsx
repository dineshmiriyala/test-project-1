import Link from "next/link";
import { notFound } from "next/navigation";

import { docsContent, getDocBySlug } from "@/lib/docs/content";

export function generateStaticParams() {
  return docsContent.map((article) => ({
    slug: article.slug,
  }));
}

export default function DocArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const article = getDocBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="doc-article">
      <p className="eyebrow">Docs / {article.slug}</p>
      <h1>{article.title}</h1>
      <p className="lede">{article.summary}</p>
      <div className="doc-section-list">
        {article.sections.map((section) => (
          <section key={section.heading} className="surface-card">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
      <div className="button-row">
        <Link href="/docs" className="button-secondary">
          Back to docs
        </Link>
        <Link href="/playground" className="button-primary">
          Open playground
        </Link>
      </div>
    </article>
  );
}
