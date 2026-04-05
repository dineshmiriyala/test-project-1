import Link from "next/link";

const productSignals = [
  "Page transitions across public, docs, auth, onboarding, and product routes",
  "Button clicks, link clicks, form changes, checkbox toggles, and modal open or close flows",
  "Seeded project data that changes over time so your tracker sees realistic state transitions",
];

const highlightCards = [
  {
    title: "Marketing surface",
    body: "Hero, pricing, social proof, docs entry points, and multiple conversion prompts.",
  },
  {
    title: "Product surface",
    body: "Dashboard, projects, tasks, team, settings, and one route made purely for interaction stress-testing.",
  },
  {
    title: "Tracking surface",
    body: "A stub analytics adapter, page view hooks, and custom event calls for the highest-signal product actions.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Signal Lab Demo</p>
          <h1>A fake SaaS product built to stress-test product analytics.</h1>
          <p className="lede">
            This project looks like a real project-management platform, but every part of it exists
            to give your analytics pipeline a rich, messy, believable stream of product behavior.
          </p>
          <div className="button-row">
            <Link href="/signup" className="button-primary">
              Start the fake onboarding
            </Link>
            <Link href="/signin" className="button-secondary">
              Use the demo account
            </Link>
          </div>
          <div className="inline-note">
            Demo login: <strong>alex@horizon.io</strong> / <strong>password123</strong>
          </div>
        </div>
        <div className="hero-panel">
          <div className="metric-panel">
            <small>Autocapture target areas</small>
            <strong>38+</strong>
            <span>click-heavy and form-heavy interface moments</span>
          </div>
          <div className="metric-list">
            {productSignals.map((signal) => (
              <article key={signal} className="metric-chip">
                {signal}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block">
        <div className="section-heading">
          <p className="eyebrow">Why this exists</p>
          <h2>Most analytics tests fail because the app surface is too clean.</h2>
          <p>
            Signal Lab gives you a believable mix of marketing pages, auth flow, dashboard state,
            and messy UI controls so you can see whether your tracker behaves like it would in a
            real product.
          </p>
        </div>
        <div className="card-grid three-up">
          {highlightCards.map((card) => (
            <article key={card.title} className="surface-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block split-block">
        <div>
          <p className="eyebrow">Routes included</p>
          <h2>Public pages, docs, auth, onboarding, dashboard, and one deliberate stress route.</h2>
          <p>
            The structure covers the normal path from discovery to activation, then keeps going into
            team workflows, settings, and repeated actions that are useful for analytics validation.
          </p>
        </div>
        <div className="route-list">
          <div>
            <strong>Public</strong>
            <p>/, /pricing, /about, /docs</p>
          </div>
          <div>
            <strong>Auth</strong>
            <p>/signin, /signup, /forgot-password, /onboarding</p>
          </div>
          <div>
            <strong>Product</strong>
            <p>/app, /app/projects, /app/tasks, /app/team, /app/settings, /playground</p>
          </div>
        </div>
      </section>

      <section className="content-block cta-band">
        <div>
          <p className="eyebrow">Next step</p>
          <h2>Walk the fake product like a real user would.</h2>
          <p>
            Start from sign-up, finish onboarding, create a project, change a task, invite a
            teammate, and then hammer the playground page to see what your analytics module catches.
          </p>
        </div>
        <div className="button-row">
          <Link href="/docs/quickstart" className="button-secondary">
            Read quickstart
          </Link>
          <Link href="/playground" className="button-primary">
            Open playground
          </Link>
        </div>
      </section>
    </>
  );
}
