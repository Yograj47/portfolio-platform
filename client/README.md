# Yograj Portfolio

A full-stack personal portfolio platform with an interactive terminal workspace, project showcase, technical articles, and a private dashboard for content management.

## Status

🚧 Development Done For this Version

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

## Development

### Prerequisites

* Node.js
* npm

### Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

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

The terminal uses a virtual filesystem to organize portfolio content and interactive commands.

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

Dynamic project entries can be opened using their project slug:

```text
open project/<slug>
```

## Media Management

The dashboard includes media management for portfolio projects.

* Image uploads
* Project media assignment
* General media library
* Project media ordering
* Cover image management
* ImageKit integration

## Authentication

The dashboard uses email/password authentication.

Authentication is handled separately from the public terminal workspace.

## License

See [LICENSE](LICENSE).
