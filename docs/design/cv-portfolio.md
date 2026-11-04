# CV portfolio concept

Status: proposed direction for discussion. Reviewed: 2 November 2026.

## Recommendation

Make the main portfolio look like a thoughtfully typeset CV, with selected interactive details. A visitor should immediately understand who Yograj is, what he builds, and where to see his work. The page should still be useful if the visitor never opens an interactive element.

Keep the existing terminal as an optional experience at `/terminal`, linked discreetly near the footer. This preserves the personality and work already invested without making commands the entrance to the portfolio. Moving it is a later implementation task; nothing has been moved yet.

The distinctive feature should be **evidence behind the CV**: project entries open real case studies, and skills point to the projects where they were used. Animation supports those actions.

## First impression and visual direction

- A warm white document surface, dark readable text, thin rules, generous margins, and one restrained accent color.
- A document-width layout, approximately 900–1050 px on desktop, with natural page scrolling. Avoid forcing the website into a literal A4 height or a PDF viewer.
- Strong name and role, clear section headings, compact dates, and consistent alignment. Use a readable body font; a serif name or heading font can give the page a personal editorial feel.
- Light mode first. Dark mode can follow after the light design is settled.
- A small action bar outside the document: section links, Open CV, Download CV, and Contact. On mobile, wrap or simplify it so it never covers content.
- Small, visible interaction cues such as “View case study” and an arrow. Text should not secretly behave like a button.

The result should feel recognizably like a CV at first glance, with enough breathing room for comfortable web reading.

## Page sketch

```text
        About   Projects   Skills   Experience     Open CV  Download
  -----------------------------------------------------------------
  YOGRAJ RIJAL                                      Location
  Full-Stack Developer                             Email / GitHub
  Short, specific professional summary              LinkedIn
  Availability                                     Contact
  -----------------------------------------------------------------
  SELECTED PROJECTS
  ChatCord                                    View case study ->
  What it does, your contribution, and a concrete result
  Technology labels                          Live demo | Source

  Another selected project                    View case study ->
  -----------------------------------------------------------------
  SKILLS
  Frontend       React · Next.js · TypeScript
  Backend        NestJS · ...
  Data & tools   PostgreSQL · ...
  Select a skill to see related work
  -----------------------------------------------------------------
  EXPERIENCE / EDUCATION
  Role or qualification       Organization              Dates
  Concise contribution or learning outcome
  -----------------------------------------------------------------
  CONTACT
  Brief invitation                 Email me | Send a message
  -----------------------------------------------------------------
  Last updated                     Explore terminal version
```

Technology names above illustrate layout; publish only verified skills and project facts. If education is more relevant than work experience, place it first. Use projects as the primary proof of ability rather than inventing employment entries.

On mobile, stack the identity/contact columns, keep dates next to their entries, and let skill labels wrap. The page should feel like a readable document, not a scaled-down desktop sheet.

## Interaction specification

| Section | Default content | Useful interaction |
| --- | --- | --- |
| Identity | Name, role, location, summary, social links | Copy email with confirmation and an ordinary email link |
| Projects | 2–4 selected entries with a useful summary | Open a shareable case-study route; expose Live demo and Source separately |
| Skills | Compact groups of named skills | Select a skill to reveal related project links and a short usage note |
| Experience/education | Dates, organization, title, key outcome | Optional expansion for longer supporting detail |
| CV actions | Open CV and Download CV | Preview the PDF in a new tab; download a clearly named PDF |
| Contact | Email and a short invitation | Expand a compact form with clear submission feedback |

### Projects: make these the main event

Each selected project should explain the problem, your role, and one concrete contribution in a few lines. Opening the case study should reveal:

1. Problem and intended users.
2. Your responsibilities and contribution, especially for team work.
3. Screenshots with captions and descriptive alternative text.
4. Important features and how they work.
5. Architecture and one or two engineering decisions, including tradeoffs.
6. A challenge, how you addressed it, and what you learned.
7. Current status, known limitations, and working demo/source links where available.

Use existing full project pages first. A desktop side panel can be added later if it preserves direct URLs, browser Back, focus handling, and mobile usability. Do not make a modal the only place a case study exists.

### Skills: motion plus proof

Recommend grouped skill labels with a subtle entry animation and a selected-state transition. Selecting “React,” for example, can reveal “Used in ChatCord” with a link to its case study, once that relationship is authored and verified.

The current skills wheel can remain in the optional terminal experience. In the CV, compact labels fit the reading flow better. Avoid making percentage proficiency the central claim; project evidence and honest usage notes are more informative. Existing percentage values do not establish an objective ability rating.

Do not infer project/skill associations from text matches. The current schema does not store this relationship; it needs an explicit model and admin editing flow if this feature is included.

### Open, download, and print

Treat these as separate actions:

- **Open CV:** opens the current PDF; this is distinct from the interactive webpage.
- **Download CV:** saves the same approved PDF with a name such as `Yograj-Rijal-CV.pdf`.
- **Print page:** optional later action with a dedicated print stylesheet, hiding controls and expanding essential text.

Start with an uploaded, curated PDF using the existing résumé URL. Check the actual file host: a cross-origin `download` attribute alone may open the PDF instead of saving it. Use suitable response headers or a controlled download endpoint when required. Hide unavailable CV actions rather than linking to an empty URL.

Automatic PDF generation from CMS content can follow later. For the first release, add a publishing checklist so the downloadable CV and webpage stay consistent.

### Contact

Keep email visible even if a form is added. Start with name, email, optional subject, and message. Show pending, success, and failure states; preserve entered text on failure. Say “Message received” only after successful storage, and do not imply email delivery unless that exists.

For a working form, add a message API and protected admin inbox, server validation, length limits, rate limiting, and spam handling. The existing database model is a starting point, not a complete message feature. In-app replies and a live chat widget are unnecessary for the first release.

## Motion and accessibility

Use short fades or small translations, approximately 150–250 ms, for interactive feedback. Keep all text visible without waiting for animation. Avoid a boot screen, continuous skill rotation, mandatory typing animation, page-flip effects, and scroll hijacking.

Respect reduced-motion preferences. Every action must work with keyboard and touch, with visible focus, readable contrast, and clear labels. No important content should depend on hover. Expanded sections need correct disclosure semantics; any future dialog must manage focus and restore it on close.

## Scope and additional ideas

| Priority | Feature | Reason |
| --- | --- | --- |
| First release | CV homepage, selected projects, existing case studies | Delivers the core direction |
| First release | Grouped skills, timeline, CV actions, email | Makes the page useful without extra interaction |
| First release polish | Small transitions, responsive layout, metadata, clear loading/error states | Completes the experience |
| Next | Skill-to-project evidence | Adds meaningful exploration; requires data work |
| Next | Contact form and admin inbox | Useful if you will regularly check messages |
| Later | Print stylesheet, project-linked message subject, dark mode | Practical conveniences after the core is stable |
| Optional | Terminal at `/terminal` | Retains the original creative concept |
| Defer | Blog, chatbot, live GitHub feed, visitor counters, multiple CV themes | Adds maintenance and distracts from the first redesign |

Two worthwhile personal touches: a short “Currently building” note that you update manually, and one small architecture diagram inside each substantial case study. Add these only when there is useful content to show. Never invent impact metrics; describe concrete behavior or verified outcomes instead.

## Proposed decisions

These are defaults for implementation, not decisions already approved by the owner:

1. CV homepage becomes the primary public route.
2. Terminal stays available as an optional route after the core redesign.
3. Light document design with restrained motion.
4. Full-page case studies before a panel interaction.
5. Curated PDF before generated PDF.
6. Visible email in the first release; message form after its backend and inbox exist.

Next: [implementation roadmap](cv-roadmap.md), supported by the [source review](../architecture/current-state.md).

## Owner-provided CV reference — 2 November 2026

Use the supplied CV screenshot as the primary visual reference: centered name and contact header, uppercase section headings with thin horizontal rules, compact typographic hierarchy, and right-aligned dates/location. Adapt spacing and font sizes for readable web and mobile use.

Content order: Professional Summary, Technical Skills, Professional Experience, Selected Projects, Education, then **Training & Certifications** as the final content section. Keep contact actions accessible from the header/action bar.

Include the owner's AWS training and certificate entries in the final section. Exact course/certificate titles, issuer, dates, and verification links are still to be provided or verified. Distinguish course completion certificates from AWS certification credentials; do not infer an AWS certification title from training attendance.
