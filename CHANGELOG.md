# Release notes

## v1.5.0

Released November 5, 2026.

### Why the portfolio was redesigned

The terminal layout asked visitors to discover commands before they could see the work. This release replaces that flow with a one-page portfolio that puts projects, skills, experience, credentials, and contact information directly on screen. Project links open dedicated pages for details and screenshots. The CV still informs the visual style, and the portfolio copy now lives in the database so it can be edited through the admin dashboard.

### What changed

- Added a responsive project carousel, an interactive skills view, a filterable timeline, and a contact form.
- Added an admin overview, searchable inbox, and drag-to-reorder lists for projects, skills, and timeline entries.
- Added a shared media library for project images, profile photos, and resume PDFs. Files can be reused, and files still in use are protected from deletion.
- Simplified admin navigation and added a separate startup state while the portfolio API becomes available.
- Removed the terminal interface and consolidated the public sections onto the homepage. Project details remain at `/projects/[slug]`, and admin sign-in is at `/admin/login`.

The owner confirmed successful deployment to Vercel and Render. See the [deployment guide](docs/operations/deployment.md) for configuration and checks.
