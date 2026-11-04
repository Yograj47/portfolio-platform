# Yograj Rijal — Portfolio

Personal portfolio with a Next.js client, NestJS API, PostgreSQL/Prisma, and an admin dashboard. The public homepage combines database-backed projects, skills, timeline, contact links, and training credentials in one interactive page. Project details have their own routes.

## Workspace

- `client/` — Next.js public portfolio and admin dashboard.
- `server/` — NestJS API, Prisma schema and migrations.
- `docs/` — design proposals, implementation roadmap, and source review.
- `docker-compose.yml` — local PostgreSQL service using root environment configuration.

## Development

Install dependencies separately with `npm ci` in `client/` and `server/`. Configure the required environment variables before starting services; do not commit secrets.

From the repository root:

```powershell
docker compose up -d
npm --prefix server run start:dev
```

In a second terminal:

```powershell
npm --prefix client run dev
```

Backend development uses `dist-dev/`, while production builds use `dist/`. This keeps `npm run build` from deleting files used by the running development watcher. Run one frontend on port 3000 and one API on port 3001.

The root is not a separate Node application. Use the package scripts in each application for builds and checks. Database migrations are managed from `server/`; inspect the target database before running them.

## Redesign documentation

Start with [documentation](docs/README.md), then the [CV concept](docs/design/cv-portfolio.md) and [roadmap](docs/design/cv-roadmap.md). These describe proposed work, not completed features.

The provided CV screenshot is the visual reference: centered identity, compact text entries, uppercase section headings, thin rules, and aligned dates. Training & Certifications will be the final content section, including verified AWS training/certification details.

Older portfolio media is preserved in [reference assets](docs/reference/README.md).
