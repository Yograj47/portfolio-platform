# Frontend

Next.js App Router client for the portfolio and private CMS. The homepage is a minimal CV document. The terminal/workspace is retained at /terminal while content layouts and interactions are redesigned.

## Run and verify

Run commands from this directory:

```powershell
npm ci
npm run dev
npm run check
npm run build
npm run test:routes
```

Set NEXT_PUBLIC_API_URL to the backend's complete API base URL, for example http://localhost:3001/api, in .env.local. The backend CLIENT_URL must match the browser origin. Browser authentication sends credentials and relies on the backend's refresh cookie; no public terminal password is used.

check runs lint, generated route types plus TypeScript, and focused regression tests. The production build fetches the existing Google Fonts and therefore needs network access. test:routes requires a completed build, temporarily starts Next.js on loopback port 3113 and stops it after checking routes. It checks server HTML/status responses, not an interactive browser login or backend data loading.

## Structure

| Area | Responsibility |
| --- | --- |
| app/ | Route pages, route groups, shared layouts and global styles |
| components/public/ | Current terminal/workspace and public content presentation |
| components/admin/ | Dashboard presentation and forms |
| components/ui/, forms/, feedback/, skeletons/ | Reusable controls and feedback |
| hooks/ | Public reads, session state, and admin mutation workflows |
| services/ | HTTP endpoint calls and request payload preparation |
| types/ | Domain/response types shared by public and admin UI |
| lib/ | HTTP refresh coordination, validation, terminal helpers, shared icons |
| store/ | In-memory authentication state |
| test/ | Refresh/payload regression tests and production route smoke check |

Domain types belong in types/portfolio.ts rather than table column components. Public read hooks do not depend on admin mutation hooks. Forms validate user input; services prepare API payloads; components render UI. Keep these boundaries and extract shared code when duplication has a concrete cost instead of adding a generic framework around each CRUD screen.

## Routes

Public homepage: /. Auxiliary routes: /terminal and /login. Existing content routes /projects, /projects/[slug], /skills and /timeline remain accessible directly but are not linked from the CV homepage. Terminal and workspace pages use noindex metadata during the transition.

Private dashboard: /dashboard and its projects, skills, timeline, categories, profile and media sections. The frontend session boundary handles redirects/loading; backend guards own data authorization. Project detail routes fetch directly by slug and do not depend on prior navigation or browser storage.

The terminal root command begins backend email/password authentication. The unused /api/route-auth route and unsupported Blog explorer entry have been removed. Existing project URLs are unchanged by renaming the dynamic folder to [slug].

See [frontend cleanup handoff](../docs/architecture/frontend-cleanup.md) for completion status and the next phase, and [backend API contract](../docs/api/backend.md) for integration requirements.

## Startup loading

The homepage checks the backend health endpoint, then requests the complete GET /portfolio response before revealing the CV. Cold starts show a responsive CV skeleton with bounded retries and manual recovery. Both frontend and backend updates must be deployed together. The complete CV response remains file-backed on the server until the PostgreSQL/CMS import. See [startup flow](../docs/architecture/portfolio-startup.md).
