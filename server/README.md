# Portfolio server

NestJS + Prisma/PostgreSQL backend for Yograj's CV portfolio and private CMS.

## Local setup

1. Run `npm ci` in this directory.
2. Copy `.env.example` to `.env` and replace placeholders. The server defaults to port 3001; the Next.js client uses 3000.
3. Start PostgreSQL using the root Docker Compose configuration, or configure a separate instance.
4. Inspect `npx prisma migrate status`, then apply migrations with `npm run prisma:deploy` against the intended database. Back up existing data first. Do not reset a populated database.
5. Run `npm run prisma:generate` and `npm run start:dev`.

The API prefix defaults to `/api`. `/api/health` checks database readiness. Swagger is available at `/docs` outside production. `npm run start:prod` runs the compiled application after `npm run build`.

To create/update the single portfolio owner, configure ADMIN_NAME, ADMIN_EMAIL and an 8–72 UTF-8 byte ADMIN_PASSWORD, then run `npx prisma db seed`. Seeding updates the owner password and revokes the saved refresh session; it does not publish sample credentials or portfolio content.

## API contract and checks

See [backend API contract](../docs/api/backend.md) for endpoint, validation, and client integration details. See [backend audit](../docs/architecture/backend-audit.md) for completed fixes and migration context.

```powershell
npm run check
npm run test:e2e
```

The HTTP integration suite requires TEST_DATABASE_URL, with a safety check restricting it to a disposable PostgreSQL database named portfolio_test at localhost:55439. Apply migrations there first. Tests create and remove their own fixtures; never point them at the portfolio database.

## Hosting configuration

CLIENT_URL must identify the actual client origin. Browser auth requests use credentials and Origin. COOKIE_SAME_SITE defaults to strict; choose none for a cross-site HTTPS client/API deployment. Cookies are HttpOnly and Secure in production (also Secure whenever SameSite=None), and their lifetime follows the minted refresh JWT. Cookie clearing uses the same attributes. Cross-origin writes are rejected; cookie-bearing auth calls without Origin are rejected too. CLI auth clients must send the configured Origin when using refresh cookies.

TRUST_PROXY_HOPS defaults to 0. Set it only to the number of trusted reverse proxy hops and ensure the API cannot be reached around those proxies; this controls the IP used for rate limits. Limits are stored atomically in PostgreSQL across API instances. Old expired buckets are cleaned during subsequent limited requests.

CV_ALLOWED_HOSTS is a comma-separated list of exact trusted HTTPS file hostnames for resumeUrl. `/api/users/resume` previews the PDF and `?download=true` downloads it with attachment headers. Redirects are disabled; upstream requests time out after 10 seconds and PDFs are capped at 10 MiB. The host must serve the actual PDF, not an HTML sharing page. Configure only trusted public asset hosts.

Messages are saved to the admin inbox; there is no outgoing email service. REPLIED is a manually managed status. No raw visitor IP or user agent is stored on messages. The public form accepts an optional empty website honeypot, while limits use hashed IP/route/time buckets.

A single seeded owner is the administrative model; there is no public signup or multi-role account system. Access tokens remain valid until their short expiry after logout, but deleted accounts are rejected. Refresh sessions rotate atomically, and login replaces the account's previous refresh session.
