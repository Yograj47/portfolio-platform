# Dashboard overview

The management overview at `/admin/dashboard` reads `GET /api/dashboard/summary`. The endpoint is protected by the current-version bearer-token guard and uses private/no-store response headers.

## Summary contract

The normal response envelope contains:

- `generatedAt`: timestamp of the successful database snapshot.
- `projects`: total, published, draft, and archived counts, scoped to the authenticated owner and excluding soft-deleted projects.
- `media`: owned file count and sum of recorded file sizes in bytes. This is not a provider quota or external storage measurement.
- `content`: skill, category, timeline-entry, and training/certification counts.
- `messages`: total, unread, read, and replied counts.
- `recentProjects`: the owner's five most recently updated nondeleted projects, with category names and publication status.
- `recentMessages`: the five latest enquiry headers: sender, email, subject, status, and date. Message bodies are not included.

A repeatable-read transaction keeps the counts and recent lists consistent. Skills, categories, timeline, and enquiries are shared administrative content in the current single-owner model; projects and media have explicit ownership filters.

## Interface

The overview provides responsive metric cards, project publication distribution, content totals, recent project and enquiry panels, and links to existing editors. Only published projects receive public detail links. Email links open the sender's address; they do not send an email or change enquiry status.

Data is validated before rendering. The initial state has a dashboard-specific skeleton. Initial failures and invalid payloads show retry; refresh failures retain the previous snapshot with a warning. Empty records are shown as zero counts and useful empty states. The query refreshes every minute and on returning to the overview; a manual Refresh action is also available.

No database migration is needed for this endpoint. Deploy the backend update with the frontend so the new summary route exists.

See [project checks](overview.md#checks) for the current verified baseline and [deployment](../operations/deployment.md) for hosted verification.
