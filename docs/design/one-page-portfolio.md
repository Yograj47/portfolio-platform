# Portfolio experience

The current homepage is a portfolio, with the CV used only as a visual starting point: white background, clear typography, thin dividers and a maximum content width of 70rem.

## Why the earlier content changed

The terminal interface required visitors to discover commands before seeing the work. The new direction makes projects, skills, experience and contact immediately visible through conventional navigation and accessible controls. The terminal feature was removed rather than maintained as a second presentation; a separate shell course project can demonstrate command-line work independently.

The original resume copy provided verified identity, education and AWS training information. It was moved into database-backed CMS records so public content can be edited without rebuilding static resume data. Existing project records provide real project descriptions and galleries; missing resume-only projects are not fabricated as published projects. Training badges are described as training, without inventing certification claims.

## Current interactions

- One homepage contains all main sections, with anchor navigation.
- Projects scroll horizontally: one card on mobile, two at medium widths and three on wide screens, with native scrolling and previous/next controls. Full write-ups and galleries use `/projects/[slug]`.
- Skills support pointer and keyboard exploration with inline detail/count presentation.
- Timeline entries can be filtered and expanded. Training and credentials appear in their own final content section with verification links where available.
- Contact combines profile links with a validated message form. Successful submission means the enquiry was stored in the private inbox; it does not send email.
- View CV opens the configured hosted document. The API can stream an actual PDF from an explicitly allowed host; it does not generate a PDF from page content.
- Initial loading checks backend health and fetches the full validated portfolio before revealing content. Failures have bounded retries and manual recovery.

## Editing

The admin sidebar owns navigation, Profile and footer logout. Desktop has no account header; mobile retains a menu button. Content editors manage published data, credentials, media and enquiries. New list positions are automatic, and projects/skills/timeline are reordered directly by dragging rows.

The optional import `node scripts/import-resume.cjs` from `server/` reads `scripts/data/resume.json` and adds missing profile/education/training values. It is a manual recovery/import tool, not an automatic deploy step. Do not run it against edited production content without reviewing its source and target database. Year-only education dates use January 1 for sorting while the supplied wording remains in descriptions.
