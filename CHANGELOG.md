# Release notes

## v1.5.0

Released November 5, 2026.

### Why I redesigned my portfolio

My terminal layout asked visitors to learn commands before they could see my work. I rebuilt the portfolio as a single page so people can find my projects, skills, experience, credentials, and contact information right away. Each project has a dedicated page for details and screenshots. I kept the visual style of my CV and moved the portfolio content into the database so I can update it from the admin dashboard.

### What changed

- Added a responsive project carousel, an interactive skills view, a filterable timeline, and a contact form.
- Added an admin overview, searchable inbox, and drag-to-reorder lists for projects, skills, and timeline entries.
- Added a shared media library for project images, profile photos, and resume PDFs. Files can be reused, and files still in use are protected from deletion.
- Simplified admin navigation and added a separate startup state while the portfolio API becomes available.
- Removed the terminal interface and consolidated the public sections onto the homepage. Project details remain at `/projects/[slug]`, and admin sign-in is at `/admin/login`.

I deployed the frontend to Vercel and the API to Render. The setup and verification steps are in the [deployment guide](docs/operations/deployment.md).
