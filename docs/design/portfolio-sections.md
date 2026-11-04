# Portfolio section layout

Projects, Skills, and Timeline share a separate portfolio layout. Desktop uses a sticky sidebar; smaller screens use a horizontal navigation row. Only these three sections appear in this navigation. Project detail routes keep Projects active.

The layout uses Yograj Rijal’s identity, section descriptions, a skip link, and active navigation states. The previous terminal navbar, sidebar, footer, and unused workspace context have been removed.

The homepage remains at `/`, inside the `(home)` route group. Its CV loading boundary now lives in that group, so it cannot appear on other public routes.

Each portfolio route has its own `loading.tsx`, reusing the same skeleton as its client-side data request:

- Projects: category filters and project cards.
- Project detail: gallery, summary, actions, and article.
- Skills: radial wheel and skill details.
- Timeline: year headings and milestone cards.

Existing data fetching, filtering, and interactive content remain in their section components. These routes retain their existing noindex metadata.

## Public request recovery

Public reads use a separate Axios client without auth cookies or token refresh. Requests allow 75 seconds for a cold start, pass the query cancellation signal, and disable automatic query retries. A failed request therefore reaches the retry UI instead of waiting indefinitely. Projects handles category errors as well as project errors, and its retry action retries both queries.

During local verification, stale Next.js chunks produced router initialization and chunk-load errors. Clearing the generated `client/.next` directory with the dev server stopped and restarting repaired that local state. Live API checks returned two projects, eleven skills, and two timeline entries; browser checks verified the content on the corresponding pages.
