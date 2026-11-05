# Portfolio documentation

Current implementation and deployment reference. Older terminal/CV proposals, session handoffs and unused reference assets have been removed; Git history retains them.

| Guide | Purpose |
| --- | --- |
| [Project overview](architecture/overview.md) | Applications, routes, data ownership and development workflow |
| [Portfolio experience](design/one-page-portfolio.md) | Current design, interactions and why the terminal was retired |
| [API contract](api/backend.md) | Public/admin endpoints, validation and ordering |
| [Startup loading](architecture/portfolio-startup.md) | Health probe, data loading and recovery |
| [Admin authentication](architecture/admin-auth.md) | Session verification, redirects, cookies and revocation |
| [Dashboard overview](architecture/dashboard-overview.md) | Real-data metrics and activity |
| [Media and inbox](architecture/admin-media-inbox.md) | Reusable uploads, profile/project relationships and messages |
| [Deployment](operations/deployment.md) | Vercel/Render configuration, verification and release gate |

Start with deployment when preparing hosting. Portfolio copy is managed in PostgreSQL through the admin CMS. The optional one-time resume import reads `server/scripts/data/resume.json`; it is not a runtime content fallback.

See the [v1.5.0 release notes](../CHANGELOG.md#v150) for the redesign rationale and changes.
