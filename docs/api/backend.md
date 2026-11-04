# Backend API contract

Updated: 2 November 2026. Paths below are relative to `/api`. All JSON endpoints use `{ success, statusCode, message, data, timestamp }`. Errors add path and contain no database details. The PDF endpoint streams binary PDF instead of a JSON envelope.

## Public reads

| Method / route | Result |
| --- | --- |
| GET /health | Database readiness, status ok; 503 on unavailable database |
| GET /users/profile | Public identity, summary, phone, location, availability and social/CV links |
| GET /users/resume?download=true | PDF attachment; omit download or use false for inline preview |
| GET /projects | Published, nondeleted projects only |
| GET /projects/:id | Published project by ID |
| GET /projects/slug/:slug | Published project by stable slug |
| GET /skills | Ordered skills with authored usageNote and linked published project summaries |
| GET /categories | Category list |
| GET /timelines | Ordered experience, education, training, certification and achievement entries |

Project JSON uses featured, excerpt, description, technologies, skills, category and media. There is no persisted isFeatured or overview field. Each skills entry contains skillId, projectId, usageNote and a nested skill. Gallery entries contain their nested media. Skill evidence excludes drafts and deleted projects. Slugs are generated on creation and preserved when titles change so shared links remain valid.

The CV endpoint requires an uploaded resumeUrl and CV_ALLOWED_HOSTS configuration. Missing CV returns 404, missing host configuration 503, and invalid/unavailable upstream PDF 502. It accepts only download=true/false. It does not generate a CV from CMS content.

## Admin content and authentication

All admin routes require Authorization: Bearer ACCESS_TOKEN, except login and cookie-authenticated refresh/logout.

| Method / route | Behavior |
| --- | --- |
| POST /auth/login | email/password; returns accessToken and sets refresh cookie |
| POST /auth/refresh | Rotates refresh cookie and returns new accessToken |
| POST /auth/logout | Validates current refresh session, revokes it and clears cookie |
| GET/PATCH /users/me | Owner profile with credential hashes excluded |
| GET /projects/admin | Authenticated author's projects including drafts |
| GET /projects/admin/:id | Authenticated author's draft/published detail |
| POST /projects | Create draft by default |
| PATCH/DELETE /projects/:id | Owner-only update/soft delete |
| POST /skills, /categories, /timelines | Create content |
| PATCH/DELETE /skills/:id, /categories/:id, /timelines/:id | Update/delete content |
| GET /media/upload-auth | ImageKit browser-upload credentials |
| GET/POST /media | Owner's media library / register uploaded media |
| GET/PATCH/DELETE /media/:id | Read, edit alt/description, or delete owned media |
| POST /project-media | Attach or reattach owned media to owned project |
| GET /project-media/project/:projectId | Ordered active attachments |
| GET/PATCH/DELETE /project-media/:id | Read, update order/cover, or detach |
| PATCH /project-media/:id/restore | Restore detached attachment without cover status |

Project write values: title, excerpt, description, categoryId; optional githubUrl/liveUrl, featured, status (DRAFT/PUBLISHED/ARCHIVED), displayOrder, technologies array, skills array. Evidence format: `skills: [{ skillId, usageNote }]`. Omit skills to leave associations unchanged; send [] to clear them. Missing/duplicate skill IDs are rejected. Project create/update association changes are atomic nested writes.

Profile additions: summary (up to 3000 characters) and optional phone. Skill additions: group and optional hex color; level remains an integer 0–100 for terminal compatibility. displayOrder is a nonnegative integer.

Timeline values: title, organization, type, startDate, optional location/description/endDate/current/displayOrder/credentialId/credentialUrl/expiresAt. Use TRAINING for courses and CERTIFICATION for credentials; render both in the final CV section. credentialUrl must use HTTPS. Dates use ISO date strings; end/expiry cannot precede start. Setting current=true clears endDate. Nullable optional fields can be cleared using null; required/defaulted values reject null.

Media registration accepts HTTPS URLs, images (PNG/JPEG/WebP/GIF/AVIF) or PDF documents, and a positive size up to 10 MiB. Media metadata is registered after browser upload; alt and description are the editable fields. Failed provider deletion preserves the database record so the administrator can retry. Cover writes lock the project row and a partial unique database index ensures one active cover per project.

## Contact and inbox

POST /messages is public. Body:

```json
{
  "name": "Visitor",
  "email": "visitor@example.com",
  "subject": "Project enquiry",
  "message": "I would like to discuss a project.",
  "website": ""
}
```

Name: 1–100 characters, email: valid and at most 254, subject: optional and at most 200, message: 10–5000. Text is trimmed. website is an optional honeypot and must remain empty. Success means durable database storage: data is `{ received: true }`; it does not mean an email was sent. No message ID or visitor content is returned publicly.

Protected inbox routes:

- GET /messages?page=1&limit=20&status=UNREAD returns `{ items, total, page, limit }`. Maximum limit: 100. Status is optional.
- GET /messages/:id reads one message; it does not implicitly change status.
- PATCH /messages/:id accepts `{ status: "READ" }`, UNREAD or REPLIED.
- DELETE /messages/:id permanently removes a message.

All auth POST routes allow 15 attempts per IP/route per fixed minute. Public messages allow 5 attempts per IP per fixed ten-minute window, including invalid/spam attempts. CV requests allow 30 per minute. Exceeding limits returns 429 and Retry-After seconds. Configure trusted proxy hops accurately. The frontend should disable duplicate submits and preserve entered text on error.

## Integration notes

Unknown body/query properties are rejected where DTOs apply. JSON booleans must be actual booleans and numeric body values actual numbers. Optional query pagination numbers are explicitly converted. Use browser credentials for auth cookies and the configured client Origin; frontend SSR refresh calls must deliberately forward a trusted Origin, not an arbitrary incoming header. PDF delivery and inbox integration are ready for the client phase; their client controls are not implemented here.

Deploy the two November migrations before starting this version against an existing database, then generate Prisma Client. Existing refresh sessions from the previous hashing implementation require sign-in again. Production Swagger is disabled. See the [server runbook](../../server/README.md).

## Complete CV response

GET /portfolio returns the complete CV view model in the normal public API envelope, with Cache-Control: no-store. This endpoint is initially backed by the migrated server-side resume content file; it is not yet a PostgreSQL/CMS projection. The frontend checks /health first, then validates this complete snapshot before showing the homepage. Deploy this new endpoint together with the startup-gated frontend. See [startup loading](../architecture/portfolio-startup.md) for timeout, retry and data-source details.

## One-page portfolio aggregate

GET /api/portfolio returns data.profile (safe public fields), data.projects (published only), data.skills, and data.timelines. This replaces the earlier file-backed CV response. The frontend validates the full aggregate before revealing the homepage. Deploy the frontend and backend together.

## Dashboard summary

GET /api/dashboard/summary requires a valid current-session bearer token. Returns project publication counts, recorded media bytes/file count, content totals, enquiry status counts, and bounded recent project/enquiry lists. Projects and media are scoped to the authenticated owner; deleted projects are excluded. It uses a consistent database snapshot and private/no-store headers. See [Dashboard overview](../architecture/dashboard-overview.md) for the response contract.
