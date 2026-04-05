const plans = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Good enough for fake teams and local-only product play.",
    features: ["Mock auth", "Seeded dashboard", "Client-side persistence"],
  },
  {
    name: "Growth",
    price: "$49",
    blurb: "The fake plan that the seeded demo workspace already uses.",
    features: ["Docs surface", "Analytics playground", "Invite and onboarding flows"],
  },
  {
    name: "Scale",
    price: "$129",
    blurb: "Looks expensive, feels enterprise, still does not bill anyone.",
    features: ["Release alerts", "Workspace settings", "More believable product packaging"],
  },
];

export default function PricingPage() {
  return (
    <section className="content-block page-hero">
      <p className="eyebrow">Pricing</p>
      <h1>Fake pricing that still gives you useful click and conversion events.</h1>
      <p className="lede">
        These cards are here to make the public site feel more like a real SaaS funnel, not to
        model an actual billing system.
      </p>
      <div className="card-grid three-up">
        {plans.map((plan) => (
          <article key={plan.name} className="surface-card pricing-card">
            <small>{plan.name}</small>
            <h2>{plan.price}</h2>
            <p>{plan.blurb}</p>
            <ul className="detail-list">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button className="button-primary" type="button">
              Pick {plan.name}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
