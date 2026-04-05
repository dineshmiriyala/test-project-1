# Change Notes

## 2026-04-05 20:42:20 IST

Initial build of the Signal Lab Demo app.

Added:

- Next.js app structure with marketing, docs, auth, onboarding, dashboard, and playground routes
- Mock auth with local browser session storage
- Mock workspace data with seeded projects, tasks, teammates, notifications, and settings
- Client-side guards for protected routes
- Analytics contract with a stub console-backed adapter
- Custom event hooks for onboarding completion, project creation, task changes, and teammate invites
- Simple docs that explain the route map, local data model, and analytics adapter

Notes:

- The app is made for analytics testing, not real business logic
- The default analytics adapter is safe to replace later
