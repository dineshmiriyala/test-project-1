import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="content-block page-hero">
        <p className="eyebrow">404</p>
        <h1>That route is not part of the demo product.</h1>
        <p className="lede">
          Use the route map or jump back to the home page to keep testing analytics flows.
        </p>
        <div className="button-row">
          <Link href="/" className="button-primary">
            Back home
          </Link>
          <Link href="/docs/routing-map" className="button-secondary">
            Open route map
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
