# Portfolio startup loading

Implemented: 3 November 2026.

## Visitor flow

The homepage initially renders a white, CV-shaped skeleton. Hydration begins a public, credential-free GET to the configured API base plus /health. Only a successful envelope containing data.status = ok permits the complete GET /portfolio request. All CV fields are validated together before the skeleton is replaced; partial content never renders.

Cold-start/network/5xx/408/429 failures retry within a shared 150-second budget. Each HTTP request has a maximum 10-second timeout and probes pause for 2.5 seconds between attempts. A healthy backend adds no artificial waiting. Nonretryable 4xx failures and structurally incomplete content produce a retry screen. Timeout also produces that screen. Leaving the page cancels requests and retry timers. Successful data is cached for five minutes and is kept visible during background refreshes.

The skeleton has a live status message and a reduced-motion variant. The error screen provides a manual Try again button. No Render/server infrastructure details are exposed in the visitor flow.

## Backend and content ownership

GET /portfolio is a new public endpoint with a no-store response and the normal API envelope. GET /health also uses no-store. The current complete resume source has moved from client/lib/content/cv.ts to server/src/modules/portfolio/portfolio.content.ts. The client no longer bundles or independently displays the static resume content; CvDocument receives one validated response as props.

This loading task does not import CV content into PostgreSQL or alter the database schema. The endpoint is currently file-backed; replacing PortfolioService's content source with persisted CMS reads is a subsequent change that can retain the same frontend contract. Existing model CRUD endpoints remain unchanged.

Deploy the updated backend as well as the frontend: the new homepage requires GET /portfolio. With the old backend, that request returns 404 and the retry screen appears. NEXT_PUBLIC_API_URL must include the API prefix (for example https://your-api.example/api). The configured CORS origin must match the frontend origin.

## Verification scope

Focused loader tests cover healthy request ordering, temporary health/content failures, bounded startup time, immediate nonretryable errors, incomplete-data rejection, navigation cancellation and per-request timeouts. Browser checks simulate a cold backend and delayed complete data, inspect the responsive skeleton, and exercise error/retry recovery. Backend startup/health and CV response can be smoke-tested without changing stored data.

Final verification: frontend lint/type checks and 14 regression tests passed; backend build/lint and 16 unit tests passed; all 10 migrations and 8 HTTP integration tests passed on disposable PostgreSQL. The compiled backend's /health and /portfolio endpoints passed read-only smoke checks against the configured database. Browser checks confirmed skeleton-only rendering through simulated cold starts and held data responses, complete CV reveal, mobile layout and error/retry recovery. All 9 production frontend route checks passed. No database schema or portfolio data was changed by this feature.
