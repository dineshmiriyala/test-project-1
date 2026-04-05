import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Signal Lab</strong>
        <p>Fake product. Realistic flows. Useful analytics surface.</p>
      </div>
      <div className="site-footer-links">
        <Link href="/docs/quickstart">Quickstart</Link>
        <Link href="/docs/analytics-hooks">Analytics hooks</Link>
        <Link href="/playground">Playground</Link>
      </div>
    </footer>
  );
}
