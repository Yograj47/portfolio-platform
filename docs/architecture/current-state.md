# Portfolio source review — pre-redesign baseline

The findings below record the initial inspection. Backend fixes and delivered APIs are now documented in [backend completion review](backend-audit.md); use that guide for current backend status.

Reviewed: 2 November 2026. Scope: source inspection for redesign planning. No application was started and no runtime behavior or deployment was verified.

## Repository map

| Area | Observed responsibility |
| --- | --- |
| `client/` | Next.js App Router application, public terminal/workspace, admin dashboard |
| `server/` | NestJS modules, Prisma/PostgreSQL schema, authentication, content and media APIs |
| Root `src/`, `public/`, `package.json`, `vite.config.js` | Separate Vite/React portfolio source; these appear untracked in the inspected working tree |
| `docs/` | Existing topic folders; the redesign guides add a documentation entry point |

Target `client/` and `server/` for the proposed redesign. Confirm the actual deployment entry point before shipping or removing root files. Root `npm run dev` runs Vite; it does not start the Next.js client. The root README's roadmap is behind the source: authentication, an admin dashboard, and Prisma models already exist.

## What can be reused

| Capability | Evidence | Implication |
| --- | --- | --- |
| Terminal homepage | `client/app/(public)/page.tsx`, `components/public/terminal/` | Can be retained behind a future optional route |
| Public workspace shell | `client/app/(public)/(workspace)/layout.tsx` | Explorer/navbar/footer need a document-oriented replacement for CV routes |
| Project list/detail UI | `client/components/public/projects/`, `client/hooks/use-public-project.ts` | Reuse galleries, Markdown rendering, and content services |
| Skills visualization | `client/components/public/skills/skills-wheel.tsx` | Existing interaction; compact accessible labels suit the CV better |
| Timeline | `client/components/public/timeline/`, Prisma `Timeline` | Supports education, experience, certifications, achievements |
| Profile and résumé | `server/src/modules/users/users.service.ts`, Prisma `User` | Public name, role, location, links, availability, and résumé URL already selected |
| Admin CMS | `client/app/(admin)/dashboard/` | Existing profile/project/skill/timeline/media editors can remain |
| Media | Prisma `Media`/`ProjectMedia`, server media modules | Existing assets and ordered galleries can support case studies |

## Gaps and implementation implications

1. **Profile summary:** the inspected profile model and update DTO have no professional summary/bio. Add a field and update the public projection, validation, types, and admin form together, or deliberately maintain this as static content initially.
2. **Skill evidence:** `Skill` and `Project` have no relationship. Add an explicit association before implementing skill-based project filtering. Skill grouping also needs an authored field or deliberate configuration.
3. **Project presentation contract:** the schema has `excerpt`, `description`, and `featured`; detail UI also expects `overview`, `technologies`, and `isFeatured`. Normalize the API/view model instead of assuming these fields are persisted.
4. **Shareable project lookup:** the public hook resolves a slug through session storage or a project-list request, then fetches by ID. Prefer a public slug endpoint for direct links and clear not-found behavior; decide how renamed slugs are handled.
5. **Messages:** Prisma has `Message` and `MessageStatus`, but the inspected application module registers no message module. Public submission, inbox UI, access controls, and spam handling remain work.
6. **PDF downloads:** current contact actions open `resumeUrl`; they do not implement a dedicated download flow. Verify host behavior and PDF availability.
7. **Server-rendered content:** current public hooks fetch in the browser. Plan server-readable public content for the identity and initial project summaries, then add client interaction where needed. This requires implementation and verification, not just changing layout classes.

## Public API work before release

The inspected `ProjectService.findAll()` filters `deletedAt` but does not restrict results to `PUBLISHED`. It includes the complete `author` relation, whose model contains password and refresh-token hashes. The unguarded project list controller calls this service. Treat this as a release blocker: explicitly select safe public fields and keep drafts/archived projects out of public list and detail responses. This is a source finding, not a claim that a running deployment was tested.

Introduce deliberate public versus admin read contracts so the dashboard can still manage drafts while anonymous visitors receive published content only. Apply the same publication rule to direct ID and slug lookups. Test both visibility and response fields.

## Preservation notes

The working tree already contains untracked root Vite files. The planning work does not remove or change them. No terminal route, API, schema, or deployed site has been changed by these documents. Verify the development baseline and deployment configuration when implementation begins.

## Cleanup update — 2 November 2026

The obsolete root Vite source, root package manifests/configuration, root dependencies, and root build output were removed. Legacy media was preserved under `docs/reference/legacy-assets/`. The earlier repository map describes the inspection baseline; the active application remains `client/` and `server/`. Root environment configuration and Docker configuration remain in place.
