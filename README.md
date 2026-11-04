# Yograj Rijal — Portfolio

An interactive developer portfolio with a Next.js frontend, a NestJS API, PostgreSQL/Prisma and a private admin CMS. The homepage presents projects, skills, experience, credentials and contact in one place; project write-ups have their own pages.

The former terminal interface has been retired. The CV inspired the visual theme, while public content is managed through the database-backed CMS.

## Workspace

| Directory | Purpose |
| --- | --- |
| `client/` | Public portfolio and admin interface |
| `server/` | API, migrations, owner seed and optional content import |
| `docs/` | Current architecture, behavior, API and deployment guides |

## Development

Use Node.js 24. Run `npm ci` separately in `client/` and `server/`. Copy each app's environment example to its local environment file and replace placeholders; keep secrets out of Git.

Use an existing PostgreSQL instance or the root Docker Compose service, configured with POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB and POSTGRES_PORT. Inspect the target database, then apply committed migrations with `npm run prisma:deploy` from `server/`.

Run one API with `npm --prefix server run start:dev` and one frontend with `npm --prefix client run dev`. The API uses port 3001; the frontend uses 3000 and refuses to fall back onto the API port. Backend development writes `dist-dev/`; production builds use `dist/`, so verification builds do not remove files used by the watcher.

## Checks and deployment

Run `npm run check` in each application. Frontend release checks also include `npm run build` and `npm run test:routes`. Backend HTTP tests require the isolated local TEST_DATABASE_URL fixture described in the [server runbook](server/README.md).

Deploy the frontend to Vercel and the API to Render using [the deployment guide](docs/operations/deployment.md). The current candidate is `codex/pre-deploy`; hosted verification and the planned 1.5.0 release remain pending.

See the [documentation index](docs/README.md), [frontend runbook](client/README.md), and [server runbook](server/README.md).
