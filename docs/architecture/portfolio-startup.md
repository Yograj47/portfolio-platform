# Portfolio startup loading

The homepage first shows its own responsive skeleton, then requests the configured API base plus `/health`. Only a valid successful response with `data.status = "ok"` permits the `/portfolio` request. The complete aggregate is validated before revealing the page.

The API reads safe public profile fields, published/nondeleted projects, skills and timeline records from PostgreSQL. It is not file-backed, and the frontend has no hardcoded resume fallback. Both endpoints use no-store responses.

Cold-start/network/5xx/408/429 failures retry within a shared 150-second budget. Requests time out after 10 seconds; retries pause for 2.5 seconds. A healthy backend adds no artificial delay. Nonretryable errors, malformed content and an exhausted budget produce a retry screen. Navigation away aborts requests and timers. Successful content is cached for five minutes and remains visible during background refreshes.

The skeleton has live status text and reduced-motion support. Project details and admin screens use their own loading states rather than the homepage skeleton.

NEXT_PUBLIC_API_URL must contain the deployed API prefix, such as `https://api.example.com/api`. Backend CLIENT_URL must match the exact browser origin. Deploy both applications together; an older API without `/portfolio` cannot serve this homepage.

Loader regression tests cover request ordering, retry budgets, cancellation, malformed content and per-request timeouts. See [deployment](../operations/deployment.md) for hosted smoke checks.
