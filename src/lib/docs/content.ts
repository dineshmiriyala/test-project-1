export interface DocArticle {
  slug: string;
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export const docsContent: DocArticle[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    summary: "Get the demo product running and understand the route map in a couple of minutes.",
    sections: [
      {
        heading: "Why this app exists",
        body: "This demo is built to help you test product analytics in a realistic app. It has a public website, a fake auth flow, a dashboard, and a dedicated analytics playground.",
      },
      {
        heading: "What to click first",
        body: "Use the demo account on the sign-in screen, complete onboarding with a new account, then move through dashboard, projects, tasks, team, settings, and the playground route.",
      },
      {
        heading: "How to wire your tracker later",
        body: "The analytics adapter already sends app-owned events to GetFluxly. The root layout also loads the official GetFluxly browser SDK globally.",
      },
    ],
  },
  {
    slug: "routing-map",
    title: "Routing Map",
    summary: "A plain English map of the fake product so you can target route-based analytics quickly.",
    sections: [
      {
        heading: "Public routes",
        body: "The public site covers the home page, pricing, about, docs, sign-in, sign-up, and forgot-password flow.",
      },
      {
        heading: "Protected routes",
        body: "The product area uses mock client-side guards for onboarding and the dashboard under the /app segment.",
      },
      {
        heading: "Stress route",
        body: "The /playground route collects lots of common UI patterns in one place so auto-capture is easy to validate.",
      },
    ],
  },
  {
    slug: "mock-data",
    title: "Mock Data",
    summary: "Understand how users, session state, and workspace data are stored in local storage.",
    sections: [
      {
        heading: "User accounts",
        body: "The app ships with a demo user and also lets you create new local-only accounts from the sign-up screen.",
      },
      {
        heading: "Workspace state",
        body: "Projects, tasks, team members, notifications, and settings are all seeded into local storage and updated in place as you interact with the app.",
      },
      {
        heading: "Reset behavior",
        body: "Signing out clears the active session only. Your mock users and workspace changes stay available for the next sign-in.",
      },
    ],
  },
  {
    slug: "analytics-hooks",
    title: "Analytics Hooks",
    summary: "See where page views and custom events pass through the shared tracking layer.",
    sections: [
      {
        heading: "Automatic page views",
        body: "The GetFluxly SDK auto-captures page views. The analytics provider also sends a route_viewed event when route or search parameters change.",
      },
      {
        heading: "Intentional custom events",
        body: "Sign-in, sign-up, sign-out, onboarding completion, project changes, task updates, teammate invites, workspace settings, notification reads, and playground actions send explicit track calls through the same client.",
      },
      {
        heading: "Global autocapture",
        body: "The root layout injects a window.__GFLUX__ config block and then loads @getfluxly/sdk-js@0.1.3 from jsDelivr so the whole app uses the latest GetFluxly browser package.",
      },
      {
        heading: "Safe startup",
        body: "The adapter waits briefly for window.gflux before it sends events. If the CDN script cannot load, it drops the queued events instead of breaking the app.",
      },
    ],
  },
];

export function getDocBySlug(slug: string) {
  return docsContent.find((article) => article.slug === slug) ?? null;
}
