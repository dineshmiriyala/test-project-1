import Link from "next/link";

import { docsContent } from "@/lib/docs/content";

export default function DocsIndexPage() {
  return (
    <section className="content-block page-hero">
      <p className="eyebrow">Documentation</p>
      <h1>Simple docs for understanding the fake app quickly.</h1>
      <p className="lede">
        These pages explain what the project is for, how the mock state behaves, and where the
        analytics adapter lives.
      </p>
      <div className="card-grid two-up">
        {docsContent.map((article) => (
          <article key={article.slug} className="surface-card">
            <small>{article.slug}</small>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <Link href={`/docs/${article.slug}`} className="button-secondary">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
