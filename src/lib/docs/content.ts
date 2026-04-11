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
        body: "Swap the export in the analytics adapter file with your real client if you want app-owned events. This repo also loads the official Fluxly browser SDK globally from the root layout.",
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
        body: "The analytics provider watches route and search parameter changes, then emits page calls through the adapter.",
      },
      {
        heading: "Intentional custom events",
        body: "Onboarding completion, project creation, task updates, and teammate invites already send explicit capture calls through the same client.",
      },
      {
        heading: "Global autocapture",
        body: "The root layout injects a Fluxly config block and then loads @getfluxly/sdk-js from jsDelivr so the whole app uses the official Fluxly browser package.",
      },
      {
        heading: "Safe default",
        body: "The app-owned analytics adapter still only logs to the console. That keeps the built-in custom event layer safe while you test the external Fluxly SDK.",
      },
    ],
  },
];

export function getDocBySlug(slug: string) {
  return docsContent.find((article) => article.slug === slug) ?? null;
}
