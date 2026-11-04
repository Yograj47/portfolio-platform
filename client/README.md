# Frontend

Next.js App Router client for the one-page interactive portfolio and private CMS. Projects, skills, timeline, contact, and training are on the homepage; project details have their own routes.

## Run and verify

Run commands from this directory:

```powershell
npm ci
npm run dev
npm run check
npm run build
npm run test:routes
```

The development command uses webpack with a one-second polling watcher. The native Turbopack watcher repeatedly rebuilt and reloaded pages in this OneDrive workspace, causing visible flicker. Polling keeps Fast Refresh available for actual edits. Override WATCHPACK_POLLING to change the interval. The frontend defaults explicitly to port 3000 and fails if that port is occupied instead of falling back to the API port 3001. Stop an existing preview before starting another frontend. Extra Next.js CLI arguments are forwarded, for example npm run dev -- --port 3002. Production build/start commands are unchanged.

Copy `.env.example` to `.env.local` for local settings. Configure NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY for browser uploads. Set NEXT_PUBLIC_API_URL to the backend's complete API base URL, for example http://localhost:3001/api, in .env.local. The backend CLIENT_URL must match the browser origin. Browser authentication sends credentials and relies on the backend's refresh cookie; no admin password belongs in frontend environment variables.

check runs lint, generated route types plus TypeScript, and focused regression tests. The production build fetches the existing Google Fonts and therefore needs network access. test:routes requires a completed build, temporarily starts Next.js on loopback port 3113 and stops it after checking routes. It checks server HTML/status responses, not an interactive browser login or backend data loading.

## Structure

| Area | Responsibility |
| --- | --- |
| app/ | Route pages, route groups, shared layouts and global styles |
| components/public/ | Homepage sections, contact form, and project detail presentation |
| components/admin/ | Dashboard presentation and forms |
| components/ui/, forms/, feedback/, skeletons/ | Reusable controls and feedback |
| hooks/ | Public reads, session state, and admin mutation workflows |
| services/ | HTTP endpoint calls and request payload preparation |
| types/ | Domain/response types shared by public and admin UI |
| lib/ | HTTP refresh coordination, validation, startup loading, shared icons |
| store/ | In-memory authentication state |
| test/ | Refresh/payload regression tests and production route smoke check |

Domain types belong in types/portfolio.ts rather than table column components. Public read hooks do not depend on admin mutation hooks. Forms validate user input; services prepare API payloads; components render UI. Keep these boundaries and extract shared code when duplication has a concrete cost instead of adding a generic framework around each CRUD screen.

## Routes

Public homepage: /. Project details: /projects/[slug]. Management login: /admin/login. The old /terminal, /projects, /skills, and /timeline pages have been removed.

Private dashboard: /admin/dashboard and its projects, skills, timeline, categories, profile, media and messages sections. The frontend session boundary handles redirects/loading; backend guards own data authorization. Project detail routes fetch directly by slug and do not depend on prior navigation or browser storage.

The login page uses backend email/password authentication. The unused /api/route-auth route and unsupported Blog explorer entry have been removed. Project detail URLs use the project slug.

See the [project overview](../docs/architecture/overview.md), [API contract](../docs/api/backend.md), and [deployment guide](../docs/operations/deployment.md).

## Startup loading

The homepage checks backend health, then requests the complete database-backed `GET /portfolio` response before revealing content. Cold starts show a responsive skeleton with bounded retries and manual recovery. Deploy frontend and backend together. See [startup loading](../docs/architecture/portfolio-startup.md).
