# Backend completion review

Updated: 2 November 2026. Supersedes the earlier audit's remaining-server-work list. The client redesign has not started.

## Delivered

- Published-only public projects, stable slug lookup, owner-scoped admin list/detail and mutations, safe author/profile responses.
- CV data fields: summary, phone, skill group, technologies, TRAINING timeline type, credential ID/HTTPS verification URL/expiry.
- Explicit ProjectSkill associations with usage notes and published-only skill evidence. Empty arrays clear associations; omitted arrays preserve them.
- Public message submission with validation, honeypot, database-backed throttling, and protected paginated read/status/delete inbox APIs.
- Login/refresh/logout limits, configured Origin checks, configurable secure cookie policy, expiry-aligned cookies, atomic refresh rotation, stale-session logout rejection, and deleted-account rejection.
- Transactional project-media changes with parent-row locking, restore/detach cover cleanup, and a database partial unique index allowing one active cover per project.
- PDF preview/download with exact HTTPS host allowlisting, redirects disabled, timeout, size cap, PDF signature checking, and attachment headers.
- Consistent database conflict/not-found responses without leaking database details, request security headers, production Swagger disabled, database readiness endpoint and connection lifecycle hooks.
- Stronger numeric/date/string/null validation, immutable media registration metadata, and retryable provider deletion failures.
- Removed unused category/skill/timeline single-item routes and unused DTO/entity scaffolding. Removed unused Cloudinary, Resend and compression dependencies.
- Server runbook, safe configuration example and [client-facing API contract](../api/backend.md).

## Migrations

1. `20261102000100_cv_fields`: additive CV fields and training type.
2. `20261102000200_evidence_and_limits`: skill associations, rate-limit buckets and active-cover uniqueness. If legacy duplicate covers exist, the migration deterministically preserves the lowest displayOrder/id cover and clears the others before creating the index; media attachments remain intact.

All ten migrations were successfully applied from scratch to a disposable PostgreSQL 18 database. No migrations, seeds or content changes were applied to the configured portfolio database. Apply pending migrations there before starting the updated server, then generate Prisma Client. Existing refresh sessions require sign-in again.

## Operational requirements

Configure actual database credentials, distinct JWT secrets, ImageKit private key, CLIENT_URL, and CV_ALLOWED_HOSTS. Choose COOKIE_SAME_SITE for the deployment; cross-site hosting requires HTTPS and none. Set TRUST_PROXY_HOPS only for the actual trusted proxy topology. No live ImageKit deletion or externally hosted CV was requested against owner assets; provider behavior is covered with local tests/mocks and must be checked with configured assets when publishing.

Messages are stored, not emailed. REPLIED is a manual inbox status. This is a single-owner CMS with no public signup. Logout revokes refresh sessions; short-lived access JWTs expire normally. Rate limiting uses fixed windows and may allow a burst at a window boundary.

## Client phase

Build the CV layout, add controls for the new profile/skill/project/timeline fields, use published slug lookup, wire the PDF actions and contact form/inbox, and render TRAINING/CERTIFICATION in the final section. Use featured/technologies/excerpt/description from the API; isFeatured and overview are not persisted fields. No further backend feature is required for these planned flows.

## Final verification

- Prisma Client generation, server build and type-aware lint: passed with no lint errors or warnings.
- Unit suite: 16 tests across 6 suites passed.
- HTTP/PostgreSQL suite: 7 tests passed, covering real persistence, draft visibility, authored skill evidence, inbox authorization/validation, transactional covers, concurrent token rotation/logout, canonical-path rate limiting, health and binary CV download headers.
- All 10 migrations applied to a fresh isolated PostgreSQL 18 database. Test fixture/container cleanup performed afterward.
- Production dependency audit: 0 known vulnerabilities after compatible updates and scoped multer/js-yaml overrides. Prisma CLI/client/adapter aligned to 7.10.1. Nest build CLI moved to devDependencies. Some development-tool transitive advisories remain; no forced major toolchain upgrades were applied. Keep the overrides until upstream Nest packages adopt patched dependencies, then reevaluate them.

External ImageKit and owner PDF hosting remain deployment checks, not locally verified provider operations. The configured portfolio database was not changed.

## Supabase migration update

After the owner resumed the paused Supabase project, both November migrations were applied successfully to the configured portfolio database using prisma migrate deploy. A subsequent prisma migrate status check confirmed all 10 migrations are applied and the database schema is up to date. Earlier statements that the configured database was unchanged describe the audit/testing stage before this authorized migration. No reset or seed command was run.
