# Yograj Portfolio

A full-stack personal portfolio platform featuring an interactive terminal workspace, project showcase, technical articles, media management, and a private dashboard.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand

### Backend

* NestJS
* TypeScript
* Prisma
* PostgreSQL

### Infrastructure

* Vercel
* Render
* ImageKit

## Project Structure

```text
/
├── project/
│   └── <project-slug>
├── blogs/
│   └── <article>
├── skills.db
├── timeline.log
├── about.md
├── contact.sh
└── ...
```

The terminal uses a virtual filesystem to organize portfolio content and provide interactive commands.

### Workspace Entries

| Type      | Name     | Aliases                                            | Description               |
| --------- | -------- | -------------------------------------------------- | ------------------------- |
| directory | Projects | `project`, `projects`                              | Browse portfolio projects |
| file      | Skills   | `skills.db`, `skill`                               | Technical skills database |
| file      | Timeline | `timeline.log`, `timeline`, `career`, `experience` | Career timeline           |
| directory | Blogs    | `blog`, `blogs`, `article`, `articles`             | Technical articles        |

Terminal commands and aliases are case-insensitive.

## Terminal

The portfolio includes an interactive terminal interface.

Example commands:

```text
help
ls
ls project
cd blog
open project/grocerypro
contact
clear
```

Projects can be opened using their slug:

```text
open project/<slug>
```

## Projects

Projects are presented through the portfolio workspace and can include:

* Project descriptions
* Project media
* Technology information
* External links
* Detailed Markdown-based content

## Media Management

The dashboard provides project media management with:

* Image uploads
* General media library
* Project media assignment
* Media ordering
* Cover image management
* ImageKit integration

## Authentication

The dashboard uses email/password authentication.

Authentication is separate from the public terminal workspace.

## License

See [LICENSE](LICENSE).
