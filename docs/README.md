# Portfolio documentation

Reviewed: 4 November 2026.

This documentation follows the focused-guide approach used in ChatCord. The one-page portfolio and admin CMS are implemented; older CV guides record the original design direction.

| Guide | Purpose |
| --- | --- |
| [CV portfolio concept](design/cv-portfolio.md) | Recommended direction, page layout, interactions, and feature priorities |
| [Current repository review](architecture/current-state.md) | Existing implementation, reusable parts, and gaps discovered in source |
| [Implementation roadmap](design/cv-roadmap.md) | Delivery phases, content requirements, and acceptance checks |

Start with the concept. Use the repository review when deciding what to reuse, and the roadmap when implementation begins. Existing documentation folders are retained.

Backend changes and migration notes: [Backend audit](architecture/backend-audit.md).

Client integration reference: [Backend API contract](api/backend.md).

Frontend structure and next-phase handoff: [Frontend cleanup](architecture/frontend-cleanup.md).

T1 implementation: [CV homepage and route separation](design/t1-cv-homepage.md).

Initial homepage copy: [CV content](design/cv-content.md).

Startup loading flow: [Portfolio startup](architecture/portfolio-startup.md).

Section layout and route-specific loading: [Portfolio sections](design/portfolio-sections.md).

Current direction (supersedes earlier layout proposals): [One-page interactive portfolio](design/one-page-portfolio.md).

Next session: [Admin handoff](design/admin-handoff.md).

Admin authentication and secure entry flow: [Admin auth](architecture/admin-auth.md).

Real-data dashboard and summary contract: [Dashboard overview](architecture/dashboard-overview.md).

Media lifecycle, profile relationships and inbox: [Admin media and inbox](architecture/admin-media-inbox.md).
