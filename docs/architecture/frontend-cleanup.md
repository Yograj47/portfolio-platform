# Frontend cleanup handoff

Updated: 3 November 2026. This completes the structural cleanup started on 2 November. The CV visual redesign is the next phase.

## Delivered

- Thin route pages under the public/workspace and dashboard route groups. Dynamic project folder renamed from [id] to [slug] without changing public URLs.
- Working /login page using the existing backend-authenticated form. Removed unused /api/route-auth and public-environment terminal password checks; root starts email/password authentication.
- Direct project detail queries by slug, with no session-storage ID lookup or project-list prerequisite.
- Domain types centralized in types/portfolio.ts; public rendering no longer imports table-column models. Shared icon registry moved to lib/skill-icons.ts.
- Read-only skill/timeline hooks shared by public and admin consumers. Public sections do not initialize admin mutation workflows. Project filters select from one cached public list.
- Shared table skeleton; removed unused skeleton, query-client instance, section-header component and starter SVG assets.
- Coordinated token refresh for concurrent requests and late stale-token responses. Auth endpoints do not recursively refresh; failed refresh clears auth and leaves navigation to the route/session boundary.
- Logout clears cached data; profile edits invalidate the public profile query; the dashboard does not render child screens after session failure.
- Backend-compatible optional-field payload preparation: empty optional URLs/dates clear to null, while omitted PATCH fields remain omitted. Training/certification entries can omit an end date.
- TRAINING and ACHIEVEMENT enum support; project detail uses real featured/excerpt/technologies fields. Public content errors show retry feedback instead of empty success states.
- Removed unsupported Blog explorer links and debug navigation logging. Skill percentages and the terminal layout remain for compatibility until the redesign.
- Repeatable lint/type/test scripts and a production route smoke helper that starts its own loopback server and stops it afterward.

## Boundaries

app owns routing/layout; components own presentation; hooks own query/mutation workflows; services own endpoint calls and payload preparation; types owns domain contracts; lib owns reusable helpers. Existing feature-based component folders remain. No generic CRUD framework, repository wrapper or class hierarchy was added: these would add indirection without resolving a concrete duplication problem here.

## Next phase

Use the supplied CV reference to implement the new homepage and keep the terminal as an optional route. Add admin controls for summary/phone, skill groups and authored project evidence, technologies and AWS credential metadata. Wire the contact form/admin inbox and CV preview/download endpoints. Render training/certifications last. Continue from the [CV concept](../design/cv-portfolio.md) and [backend API contract](../api/backend.md).

Browser interaction and real backend login/content flows have not been exercised by the route smoke helper; those belong to the UI integration phase. No backend code, database migration or content change was required for this cleanup completion.

## Verification completed — 3 November 2026

- ESLint: passed without warnings or errors.
- Next.js route type generation and TypeScript: passed.
- Six focused regression tests: passed (refresh coordination, late responses, failure cleanup, retry recursion prevention, optional-field clearing and partial update preservation).
- Production Next.js build: passed using the existing Google Fonts.
- Production route smoke: six public HTML routes returned 200; removed /api/route-auth and unsupported /blogs returned 404. The temporary loopback server was stopped by the smoke helper.
- Git whitespace check and documentation link checks: passed.

The previous session ended before route smoke verification and the handoff document were complete. Those steps are now finished. UI/backend integration testing and the visual CV work remain the explicitly separate next phase.
