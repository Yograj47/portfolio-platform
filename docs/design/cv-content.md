# Initial CV content

Added: 3 November 2026.

Initial content is transcribed from the owner's supplied Yograj_Rijal_Resume.pdf. The page now includes a full summary, four skill groups, the Juno Technology experience, four projects, three education entries and contact links. The existing full-page white CV presentation remains.

Copy is now maintained in `server/src/modules/portfolio/portfolio.content.ts`, independently of JSX, and delivered through GET /portfolio after the health check. `CvDocument` renders reusable section and bullet-list components. Entries use aligned role/location/date rows on desktop and stacked rows on mobile.

This first content slice remains file-backed content served by the backend; it does not seed or update the database. Existing dashboard content, CMS integration and interactive project/skill features remain separate work. Project descriptions have no invented demo/source/case-study links. Education dates are reproduced from the supplied resume, including its expected 2026 date.

Training & Certifications is the final section. Exact AWS course/certificate titles, issue dates and verification URLs were requested and remain pending. A short pending note is shown rather than an invented credential.

Verification: lint, TypeScript, six regression tests and the production build passed. Desktop (1440px) and mobile (390px) screenshots were inspected. Checks confirmed all six sections, all supplied experience/project/education entries, the final certification section, and no horizontal overflow.

## AWS Academy badges — 3 November 2026

Replaced the pending AWS note with four training badges from the owner's screenshot: Machine Learning for Natural Language Processing (27 October 2024), Machine Learning Foundations (21 October 2024), Data Engineering (19 October 2024), and Cloud Foundations (17 October 2024). The full AWS Academy Graduate training-badge titles are retained, issued by Amazon Web Services Training and Certification.

The section links to the supplied Credly badge wallet: https://www.credly.com/users/yograj-rijal/badges/credly. The web reader could not access that user page. Dates come from the supplied screenshot; the complete NLP badge title and issuer were confirmed against Credly's issuer badge listing: https://www.credly.com/org/amazon-web-services/badge/aws-academy-graduate-machine-learning-for-natural-l. Individual earned-badge URLs, credential IDs and expiry dates were not supplied and were not invented. These are listed as training badges, not AWS professional certification exams.

AWS section verification: lint, TypeScript, six regression tests and production build passed. Desktop/mobile browser checks confirmed four entries, all four screenshot issue dates, the supplied Credly wallet URL and no horizontal overflow. Both section screenshots were visually inspected.
