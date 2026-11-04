# Admin handoff

Next session: improve the admin experience for the database-backed one-page portfolio.

## Current public UI

- Responsive horizontal project list: one item on mobile, two on medium screens, three on wide screens; native swipe/scroll and previous/next controls. Two actual projects fill the desktop strip evenly.
- Skill details and total count share one panel header; keyboard selection remains available.
- Contact includes a message form using `POST /api/messages`, with a honeypot, validation, pending state, retained draft on failure, rate-limit feedback, and confirmation on success.
- Project details remain on `/projects/[slug]`. Other public section routes and terminal are removed.

## Admin work to prioritize

- Build the message inbox UI using the existing protected `GET /api/messages`, `GET /api/messages/:id`, `PATCH /api/messages/:id`, and `DELETE /api/messages/:id` endpoints.
- Support pagination and UNREAD / READ / REPLIED status filters. Marking REPLIED records a status; the backend does not send an email reply.
- Review profile, project, skill, education, and training editors against the homepage data model.
- Preserve existing content and credentials; improve editor feedback and navigation as needed.

The frontend and backend must be deployed together for the new `/portfolio` aggregate contract. The current resume source is a Google Drive viewer; View CV links to it directly.

Final checks passed: frontend lint/type checks, 14 regression tests, production build, and nine production route checks. Browser fixtures verified 3 / 2 / 1 project cards at 1440 / 800 / 390 pixels, arrow scrolling, inline skill count, no horizontal page overflow, retained message draft after a simulated 429, and confirmation/reset after simulated success. No real inbox messages were created by these browser checks.

Authentication update: management now lives under /admin/login and /admin/dashboard. See [Admin auth](../architecture/admin-auth.md) for verification, redirects, session revocation, and rollout notes.

Responsive navigation: below 1024px the admin header provides an accessible hamburger drawer reusing the desktop sidebar. It closes after section selection, Escape, backdrop click, or resizing to desktop. The content region supports vertical scrolling and narrow layouts. Verified at 320px, 390px, 800px, and 1280px, including focus trapping/restoration, active links, navigation, and no horizontal page overflow. Targeted lint, TypeScript, and production build passed.

Dashboard overview is now implemented with real database totals and recent activity via the protected /api/dashboard/summary endpoint. See [Dashboard overview](../architecture/dashboard-overview.md). The next inbox UI can reuse the existing message endpoints; recent enquiry previews currently do not change message status.
