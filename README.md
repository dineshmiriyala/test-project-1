# Signal Lab Demo

Signal Lab Demo is a fake project-management SaaS app made for testing product analytics.

It gives you:

- Public website pages
- Docs pages
- Mock sign-in and sign-up flow
- Onboarding flow
- Dashboard pages with local state
- A dedicated analytics playground page
- A small analytics adapter wired to GetFluxly custom events
- The official GetFluxly browser SDK loaded from jsDelivr on every page

## What this project is for

This project is not trying to be a real business app.

It is trying to look and behave enough like one that you can test:

- page views
- button clicks
- link clicks
- form typing
- checkbox and radio changes
- modal open and close behavior
- tab and accordion use
- task and project state changes
- onboarding completion
- teammate invite flow

## Route map

Public routes:

- `/`
- `/pricing`
- `/about`
- `/docs`
- `/docs/quickstart`
- `/docs/routing-map`
- `/docs/mock-data`
- `/docs/analytics-hooks`

Auth routes:

- `/signin`
- `/signup`
- `/forgot-password`
- `/onboarding`

Product routes:

- `/app`
- `/app/projects`
- `/app/tasks`
- `/app/team`
- `/app/settings`

Stress route:

- `/playground`

## Demo account

Use this account on the sign-in page:

- Email: `alex@horizon.io`
- Password: `password123`

You can also create new local-only accounts from the sign-up page.

## How mock auth works

- There is no real backend auth provider.
- Accounts are stored in browser local storage.
- Sign-out clears the active session only.
- Signed-up users stay in local storage so you can sign back in later.
- Protected product routes use a client-side guard.

## How mock product state works

- Workspace data is seeded the first time a user signs in or signs up.
- Projects, tasks, teammates, notifications, and settings are stored in browser local storage.
- Changes survive reloads in the same browser.
- The data layer lives in one local repository file so it is easy to swap later.

Main files:

- Analytics adapter: [`src/lib/analytics/adapter.ts`](/Users/dineshmiriyala/projects/test-project-1/src/lib/analytics/adapter.ts)
- Analytics types: [`src/lib/analytics/types.ts`](/Users/dineshmiriyala/projects/test-project-1/src/lib/analytics/types.ts)
- Local storage repository: [`src/lib/mock/repository.ts`](/Users/dineshmiriyala/projects/test-project-1/src/lib/mock/repository.ts)
- App providers: [`src/components/providers/app-providers.tsx`](/Users/dineshmiriyala/projects/test-project-1/src/components/providers/app-providers.tsx)

## How analytics is wired

The app already has a small tracking contract:

- `page(name?, props?)`
- `identify(userId, traits?)`
- `capture(event, props?)`
- `reset()`
- `destroy()`

What is already hooked up:

- Route changes call `page(...)`, which sends `route_viewed`
- Session changes call `identify(...)` and `reset()`
- Sign-in, sign-up, and sign-out actions send explicit tracking events
- Onboarding completion calls `capture("onboarding_completed", ...)`
- Project creation calls `capture("project_created", ...)`
- Project archive and restore actions call `capture("project_archive_toggled", ...)`
- Task changes call `capture("task_status_changed", ...)`
- Team invites call `capture("teammate_invited", ...)`
- Workspace settings changes call `capture("workspace_settings_updated", ...)`
- Notification reads call `capture("notification_marked_read", ...)`
- Playground controls send custom events for tabs, modal open and close, toasts, inputs, pagination, and reorder actions
- GetFluxly loads globally from the root layout through the official `@getfluxly/sdk-js` browser package

GetFluxly test setup in this repo:

- Config is injected in [`src/app/layout.tsx`](/Users/dineshmiriyala/projects/test-project-1/src/app/layout.tsx)
- The SDK script comes from `https://cdn.jsdelivr.net/npm/@getfluxly/sdk-js@0.1.3/dist/gflux.iife.js`
- The current API host is `https://api.getfluxly.com`
- The current test key is `pk_test_9xyqsogP_RAcYr86w1wwoXxzVnP0uU0gHtMffDM3s`
- The SDK global is `window.gflux`
- The config global is `window.__GFLUX__`

How the local adapter maps to GetFluxly:

- `page(...)` sends `gflux.track("route_viewed", ...)`
- `identify(...)` sends `gflux.identify(...)`
- `capture(...)` sends `gflux.track(...)`
- `reset()` sends `gflux.reset()`
- `destroy()` clears queued local calls and sends `gflux.destroy()` if the SDK is loaded
- Calls wait briefly for the CDN SDK so early page and auth events are not lost during startup

To test GetFluxly tracking:

1. Start the app with `npm run dev`
2. Open the site in a browser that can reach `https://api.getfluxly.com`
3. Move through pages, click buttons and links, and submit forms
4. Check your GetFluxly project for `page_view`, `autocapture_click`, `autocapture_form`, `page_leave`, `route_viewed`, and the custom app events listed above

## Run locally

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Open `http://localhost:3000`

You can also use:

- `npm run build`
- `npm run start`
- `npm run lint`

For a server or production-style run:

1. Run `npm run build`
2. Then run `npm run start`

## Best test flow

If you want a quick analytics test run, do this:

1. Visit `/`
2. Open `/pricing` and `/docs`
3. Sign in with the demo account
4. Create a project
5. Change a few task states
6. Invite a teammate
7. Open `/playground`
8. Click through tabs, modal, accordion, toasts, pagination, and reorder controls

## Last updated

- Initial implementation documented on `2026-04-05 20:42:20 IST`
- Server build and lint fixes documented on `2026-04-06 16:53:02 IST`
- Production build verified locally on `2026-04-06 16:56:45 IST`
- Fluxly autocapture script added on `2026-04-10 16:32:21 IST`
- Fluxly tracking moved to the official CDN package on `2026-04-11 12:24:18 IST`
- GetFluxly SDK upgraded and adapter tracking documented on `2026-04-13 21:56:01 IST`
