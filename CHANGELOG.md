# Change Notes

## 2026-04-11 12:24:18 IST

Moved Fluxly tracking to the official browser package.

Changed:

- Removed the old local copied Fluxly autocapture script
- Loaded `@getfluxly/sdk-js@0.1.1` from jsDelivr in the root layout
- Pointed Fluxly at the production API host `https://api.getfluxly.com`
- Kept the existing test API key so the project continues to send events
- Updated the README and in-app docs to match the new setup

Validated:

- The app lint still passes after switching to the CDN SDK

## 2026-04-10 16:32:21 IST

Added Fluxly autocapture for end-to-end tracking tests.

Changed:

- Injected a global `window.__FLUXLY__` config block in the root layout
- Loaded a PostHog-style Fluxly autocapture script on every route
- Added the provided test API key and host for local tracking validation
- Updated the README so the new tracking setup is easy to find

Validated:

- The app lint still passes after the script was added

## 2026-04-06 16:53:02 IST

Fixed server build and lint issues.

Changed:

- Reworded the forgot-password success message so JSX lint passes cleanly
- Moved workspace persistence into a stable callback so the hook dependency warning is resolved
- Returned the public session object explicitly so the repository no longer triggers an unused variable warning
- Replaced CSS `start` and `end` alignment values with `flex-start` and `flex-end` for cleaner autoprefixer output
- Updated the README with a clearer server run order: build first, then start
- Restored the Next.js dynamic route page param type expected by the current app-router build
- Wrapped route query tracking in a suspense-safe analytics tracker for production prerender
- Removed the sign-in page dependency on `useSearchParams` so static generation can finish cleanly

Validated:

- `npm run build` now completes successfully on Next.js `15.5.14`

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
