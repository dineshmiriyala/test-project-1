const pillars = [
  {
    title: "Believable flow",
    body: "The route map mirrors what people expect in a project-management SaaS instead of a toy example.",
  },
  {
    title: "Local-first state",
    body: "Everything persists in browser storage so repeated visits still feel like a product in motion.",
  },
  {
    title: "Tracker-safe boundary",
    body: "The app uses a tiny analytics contract, so swapping in your real tracking client stays simple.",
  },
];

export default function AboutPage() {
  return (
    <section className="content-block page-hero">
      <p className="eyebrow">About</p>
      <h1>This app is a product analytics wind tunnel.</h1>
      <p className="lede">
        It is not trying to be a real business. It is trying to look enough like one that
        auto-capture, navigation tracking, and product events all get a proper workout.
      </p>
      <div className="card-grid three-up">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="surface-card">
            <h2>{pillar.title}</h2>
            <p>{pillar.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
