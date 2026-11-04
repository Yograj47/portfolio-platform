# One-page interactive portfolio

Current direction: 3 November 2026. Supersedes the CV document and three-section sidebar proposals.

The CV is visual inspiration: restrained typography, white background, thin rules, and a 70rem content width. The homepage is an interactive portfolio with anchor navigation, category-filtered project cards, a skill explorer, expandable and filterable timeline entries, contact links, and training credentials last.

## Routes

- `/`: all public portfolio sections.
- `/projects/[slug]`: project gallery and detailed write-up, with a back-to-portfolio link.
- `/login` and `/dashboard`: retain management access.
- `/projects`, `/skills`, `/timeline`, and `/terminal`: removed; return 404.

The terminal components, commands, contact-terminal output, types, and virtual filesystem have been removed.

## Data

`GET /api/portfolio` now aggregates the safe public profile, published projects, skills, and timeline records using the existing CMS services. No hardcoded resume fallback runs in the application. The frontend validates the whole aggregate after `/health` succeeds, preserving cold-start retries, cancellation, timeout, and manual retry.

The supplied resume transcription is preserved in `docs/reference/resume-import-source.ts` only as an import reference. Run `node scripts/import-resume.cjs` from `server` with its configured environment to add missing profile values, education institutions, and AWS training entries. Existing profile edits and matching timeline entries are preserved. The import was applied to the configured database during implementation. Year-only education dates use January 1 for sorting; the original supplied date wording remains in the description and the interface must not imply a precise month or graduation.

Published projects come from existing project records. Resume-only projects without full CMS records are not fabricated as published projects. A View CV link appears when a resume URL is configured and opens that hosted document directly. The current Google Drive viewer provides its own download control; the unconfigured PDF proxy is not promoted. Contact actions use the profile email, phone, and social URLs.

Deploy backend and frontend together because the portfolio response contract has changed.


Verification: frontend lint/type checks and 14 tests passed; backend build/lint and 18 tests passed. Production build and all nine route checks passed. Browser checks passed for section rendering, project filters, timeline filters/expansion, four AWS badges, project detail navigation, removed-route 404s, mobile overflow, and browser errors. Desktop/mobile screenshots were reviewed.

Final browser pass also verified keyboard selection in the skills wheel. The current production preview is running on port 3000.


Final interaction update: responsive horizontal project scrolling (1 / 2 / 3 cards), compact skill count in the detail header, and a contact message form. Admin follow-up: [Admin handoff](admin-handoff.md).
