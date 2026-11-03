# CV portfolio implementation roadmap

Status: backend implementation completed; client design and implementation phases remain pending. See [backend completion review](../architecture/backend-audit.md) and [API contract](../api/backend.md). Reviewed: 2 November 2026.

See [concept](cv-portfolio.md) for intended behavior and [current source review](../architecture/current-state.md) for evidence and gaps.

## Phase 0: establish the baseline

Backend validation and API fixes are completed. Deployment entry-point confirmation and final portfolio content selection remain part of client preparation.

- Confirm that the deployed product should use `client/` plus `server/`; identify what the root Vite source is for before any cleanup.
- Record current client/server build and lint results using their own package scripts.
- Fix public project publication filtering and explicit response selection; verify no private author fields escape.
- Confirm profile, timeline, project media, and résumé availability using actual API responses.
- Choose the content for 2–4 selected projects and a short professional summary.

Done when: the correct application is identified, baseline issues are recorded, and public data contracts are safe and understood.

## Phase 1: CV page foundation

- Build the public document shell and identity/summary area with section anchors.
- Add selected project summaries, grouped skills, timeline, and visible contact information.
- Reuse the admin CMS and content services. Add summary/grouping data deliberately where required.
- Render meaningful initial public content on the server where practical; keep interactive controls in small client components.
- Adapt public workspace layouts so project routes share the new document design without changing admin layout ownership.
- Plan `/terminal` for the preserved terminal. Verify its navigation helpers and command links under that route before exposing it.

Done when: desktop and phone visitors can read the full CV, reach projects and contact information, and navigate without commands or animation.

## Phase 2: projects and CV actions

- Restyle existing project detail pages around case-study content and working galleries.
- Normalize frontend project fields against actual API responses.
- Support direct project URLs in a fresh browser session, including loading, not-found, and API error states.
- Add Open CV and Download CV using the same approved PDF; verify the actual host/download behavior.
- Add page titles, descriptions, social previews, and canonical URLs appropriate to the confirmed deployment.
- Add restrained motion, keyboard focus styles, and reduced-motion handling.

Done when: a recruiter can scan the page, open a project, inspect source/demo links, and open or download the CV on desktop and mobile.

## Phase 3: evidence-based skills

- Add an explicit project/skill relationship and an editing flow in the admin dashboard.
- Add a short usage note where needed; avoid automatically claiming expertise from a skill name.
- Selecting a skill reveals related published projects; provide Clear selection and an honest empty state.
- Keep selected project summaries readable when no skill is selected. Avoid silently hiding the whole CV.

Done when: selecting a skill yields authored evidence, works with keyboard/touch, and never reveals unpublished projects.

## Phase 4: optional message workflow

- Implement public message submission with DTO validation, length limits, spam handling, and rate limiting.
- Persist valid messages using the existing model. Subject can be optional in the UI with a documented server default, or the model can be adjusted deliberately.
- Add a protected admin inbox for unread/read/replied status. Define “replied” as a manual status until an actual sending workflow exists.
- Show pending/success/error states; prevent duplicate clicks and preserve text after failed submission.
- Keep email available as a fallback. Add email notification only if there is a configured delivery service and someone will monitor failures.

Done when: a real submission persists once, appears only to an authorized admin, and feedback matches the actual outcome.

## Later polish

Print stylesheet; dark mode; project-context message subjects; manually maintained “Currently building”; optional terminal refinements. Automatic PDF generation is a separate feature requiring its own layout and content checks.

## Content checklist

| Content | Required preparation |
| --- | --- |
| Summary | Two or three specific sentences about focus and strengths |
| Projects | Problem, personal contribution, technology, screenshots, limitations, demo/source links |
| Skills | Honest names/groups and explicit project associations when introduced |
| Timeline | Accurate dates, organizations, titles, and outcomes |
| CV PDF | Current, selectable-text document consistent with the website |
| Contact | Working public email and only the availability commitments you intend to maintain |

Do not publish invented metrics, empty case studies, placeholder social links, or employment implied by personal projects.

## Release acceptance checks

- The first screen communicates identity, role, and CV actions without waiting for animation.
- At narrow phone widths there is no horizontal page overflow; long links and skill labels wrap.
- Keyboard navigation reaches all actions with visible focus; touch never requires hover.
- Reduced motion leaves all content available and readable.
- Project URLs work on direct load and refresh, without a prior session-storage entry.
- Draft, archived, and deleted projects stay private through list and direct lookups; author secrets never appear in public payloads.
- Empty lists, missing résumé, broken media, and API failures have readable states with useful fallback actions.
- PDF open/download actions work on the chosen hosting setup and the PDF matches published content.
- If messaging ships, verify validation, throttling, persistence, failure recovery, and admin authorization.
- Verify project publication and response contracts with focused backend tests; use frontend interaction tests where they cover meaningful behavior, plus manual responsive/accessibility checks.
- Run the applicable client/server lint and build scripts. Record pre-existing failures separately from new failures.
- Update the root README to describe the implemented product and correct startup paths when the redesign actually ships.

## Suggested first implementation slice

Start with the public API fixes and a static visual CV shell backed by real profile/project/timeline data. Settle typography, spacing, and mobile reading first. Then add project and PDF actions, followed by skill evidence and messaging. This makes each increment reviewable without requiring all proposed features at once.
