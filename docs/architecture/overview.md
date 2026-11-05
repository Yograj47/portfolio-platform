# Project overview

The repository contains a Next.js App Router frontend and a NestJS API using Prisma/PostgreSQL. ImageKit stores image/PDF bytes. The application is an interactive portfolio with a private single-owner CMS.

## Routes

| Surface | Routes |
| --- | --- |
| Public portfolio | `/` with projects, skills, timeline, training and contact anchors |
| Project details | `/projects/[slug]` |
| Admin entry | `/admin/login` |
| Admin management | `/admin/dashboard` plus projects, media, categories, skills, timeline, messages and profile |

The former `/terminal`, `/projects`, `/skills`, `/timeline`, `/login` and `/dashboard` routes return 404. Admin URLs are unlinked publicly and excluded from indexing; backend authentication protects the actual data.

## Data and boundaries

- PostgreSQL owns profile, published/draft projects, skills, timeline/credentials, categories, media metadata and enquiries. `/api/portfolio` aggregates safe public records; no static resume fallback runs in the application.
- Projects and media are owned by the authenticated user. Skills, timeline, categories and inbox are shared within the current single-owner administrative model.
- ImageKit owns file storage; database relations track project, avatar and resume use. See [media lifecycle](admin-media-inbox.md).
- New projects, skills and timeline entries receive the first vacant positive order. Dragging list rows saves a complete validated order atomically. Search must be cleared before reordering.
- Route pages own composition, components own presentation, hooks own query/mutation workflows, services own HTTP calls, and shared types/validation define contracts.

## Local development

Use Node.js 24 for parity with the verified development runtime. Install each application's lockfile with `npm ci` inside `client/` and `server/`. There is no root Node package.

Start one frontend with `npm run dev` from `client/` (port 3000) and one API with `npm run start:dev` from `server/` (port 3001). Backend development writes `dist-dev/`; production builds write `dist/`. The frontend's development watcher uses webpack polling for this OneDrive workspace and refuses to fall back onto port 3001.

Use PostgreSQL from an existing configured instance or the root Docker Compose service. The Docker example needs root environment values for POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB and POSTGRES_PORT. Apply committed migrations with `npm run prisma:deploy` in `server/`; never reset a populated portfolio database.

## Checks

- `client/`: `npm run check`, `npm run build`, then `npm run test:routes`.
- `server/`: `npm run check`.
- HTTP integration tests require an isolated PostgreSQL database named `portfolio_test` on localhost port 55439, supplied as TEST_DATABASE_URL, with migrations already applied. Run `npm run test:e2e` from `server/`. These tests must never use portfolio data.

Current verified baseline: 20 frontend tests, 31 backend tests, 13 HTTP integration tests and 15 production route checks. Browser checks cover responsive pages, auth, media, inbox and mouse/keyboard ordering. The owner confirmed successful deployment to Vercel and Render.
