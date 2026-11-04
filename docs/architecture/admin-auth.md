# Admin authentication and route access

Implemented: 4 November 2026.

## Entry points

- `/admin/login`: unlinked admin sign-in page.
- `/admin/dashboard` and its child routes: management pages.
- `/login` and `/dashboard` are removed and return 404.
- The whole admin area has noindex/nofollow metadata. There is no admin link in the public portfolio navigation.

The URL is not a secret or an authorization mechanism. Anyone who knows it can see the sign-in page. Backend authentication protects data and writes.

## Verification and redirects

The client verifies `/users/me` on entry, restores an expired/missing in-memory access token through the HttpOnly refresh cookie, and verifies again before showing management content. A stored client-side signed-in flag is not sufficient. The sidebar, mobile menu, and child screens remain unmounted until the session is verified.

Unauthorized sessions go to `/admin/login?next=...`. Only paths inside `/admin/dashboard` are accepted as destinations; absolute URLs, protocol-relative URLs, backslashes, and paths escaping that subtree are rejected. A signed-in visitor to login is redirected to the requested safe destination.

An unavailable backend shows a retry state instead of rendering management content or declaring a valid session expired. Login failures remain on the form. Logout is not reported as successful unless the backend confirms it; failures show an error and allow retry. Successful logout clears authentication and cached queries and returns to login, which may retain a safe next destination.

Access tokens remain in memory. Refresh requests are shared across simultaneous 401 responses. A client session version prevents a delayed refresh from restoring logged-out state or overwriting a newer login. Cancelled session checks do not publish a stale user.

## Backend enforcement

There is no public signup flow. The seeded owner account is the administrative model. The profile's `role` is a professional title, not an authorization role.

Bearer JWTs must have a valid signature, expiry, subject, and current database `authVersion`. A new login increments that version and conditionally stores its refresh hash; logout atomically clears the hash and increments the version. Older access and refresh tokens are rejected even if their JWT expiry has not passed. Refresh rotation retains the session version and uses compare-and-swap to reject concurrent replay. Account deletion also invalidates access.

Protected responses use `Cache-Control: private, no-store`. Auth responses and `/users/me` are also no-store. Refresh cookies are HttpOnly, scoped to `/`, and Secure in production. SameSite and exact allowed frontend origin are configured through the backend environment; cross-origin authenticated requests require the correct credentialed CORS and cookie configuration. Existing origin checks and persistent login/refresh rate limits remain active.

## Migration and rollout

`20261104000100_auth_session_version` adds `User.authVersion` with default zero. It has been applied to the configured database after passing isolated tests. Deploy the backend and frontend together, applying migrations first. Old tokens without the version claim are rejected, so existing sessions must sign in again.

## Validation

Frontend redirect and refresh-race regression tests cover unsafe destinations, concurrent refresh, transient failures, logout races, and newer-login races. Backend tests use disposable PostgreSQL and test credentials, checking wrong credentials, absent/forged bearer tokens, cookie-only access rejection, HttpOnly/SameSite cookies, refresh replay, logout revocation, and newer-login revocation. Browser authentication scenarios use mocked responses, so no owner password is used or changed.
