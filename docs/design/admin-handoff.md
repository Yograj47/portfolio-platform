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
