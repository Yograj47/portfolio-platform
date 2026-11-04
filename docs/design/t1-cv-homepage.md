# T1 — CV homepage and route separation

Implemented: 3 November 2026.

The main route `/` now renders a minimal CV document inspired by the supplied résumé screenshot: centered serif name/role/location, a short summary, a compact skills line, and ruled section headings. Experience, projects and education are reserved for later content work. Training & certifications is the final section; no AWS credential details have been invented.

The former homepage is preserved at `/terminal`. The CV homepage does not link to the terminal or legacy workspace pages. Those pages remain directly accessible and are marked noindex during the transition. This is visibility/navigation control, not access control; the dashboard still relies on its existing authentication and backend guards.

The public route-group layout is now neutral so the CV page can scroll naturally. The terminal owns its full-height viewport, and the existing workspace retains its own navbar/sidebar/footer. The CV styles are isolated in a CSS module and do not change dashboard or workspace styling. Root/home metadata now describes Yograj's portfolio rather than a terminal platform.

Content layout redesign, live CMS integration, project interactions, CV file actions and contact UI are intentionally later work. This slice only establishes the new landing page and route separation.

The production route smoke check asserts that `/` renders the CV, excludes the terminal and legacy navigation links, and that `/terminal` still renders its own page. Existing content/admin routes are retained.

Verification: lint, generated route types, TypeScript, six regression tests, production build, and all nine production route checks passed. The smoke helper confirmed the homepage contains the CV document without legacy navigation links.

## Full-page presentation update — 3 November 2026

The owner supplied the actual resume PDF and clarified that the website itself should be the CV. The viewport now uses one white background, with a full-width content area and responsive document margins. The separate paper-card border, shadow, gray surround and outer caption were removed. Typography follows the reference's Times-style serif treatment, centered identity/contact header and uppercase ruled headings. Content remains minimal for this initial route slice; training/certifications stays last.

Full-page verification: lint, TypeScript, six regression tests and production build passed. Desktop (1440px) and mobile (390px) browser screenshots were inspected; computed layout confirmed full viewport width, white background, zero border/shadow and no horizontal overflow.
