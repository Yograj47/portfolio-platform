# Deployment: Vercel and Render

Status: local verification complete; hosted verification pending. The candidate branch is `codex/pre-deploy`. The interactive portfolio has already been merged into `main`. No 1.5.0 release branch or tag is created until both hosted applications pass verification.

## Service configuration

Use the same candidate commit for both applications. Use Node.js 24 to match the verified local runtime. There is no root npm application.

| Setting | Vercel frontend | Render API web service |
| --- | --- | --- |
| Repository root directory | `client` | `server` |
| Framework/runtime | Next.js | Node |
| Install | `npm ci` | Included in the build command below |
| Build | `npm run build` | `npm ci --include=dev && npm run build` |
| Start | Vercel's Next.js default | `npm run start:prod` |
| Health path | Homepage smoke test | `/api/health` |

These commands run relative to each service's configured root. Render excludes files outside that root, so operational resume import data now lives inside `server/scripts/data/`. See [Render monorepos](https://render.com/docs/monorepo-support) and [Vercel monorepos](https://vercel.com/docs/monorepos/monorepo-faq).

Set environment variables before building. Frontend NEXT_PUBLIC values are embedded in the client build, so changing the API URL requires rebuilding/redeploying that frontend. Configure the environment used by the actual candidate deployment, including Preview when using a non-production Git branch. See [Vercel environment variables](https://vercel.com/docs/environment-variables).

## Vercel environment

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_API_URL | `https://YOUR-API-HOST/api` |
| NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY | Public key from the configured ImageKit account |

Never put database credentials, JWT secrets or the ImageKit private key in frontend variables. Keep Next.js's default output configuration; this application is not a static export. The existing image configuration permits `ik.imagekit.io` and `images.unsplash.com`; a custom image CDN host needs an explicit code/config update.

## Render environment

Use `server/.env.example` as the complete local template. For hosting, set:

| Name | Hosting value |
| --- | --- |
| NODE_ENV | `production` |
| API_PREFIX | `api` |
| DATABASE_URL | Intended PostgreSQL connection URL, with provider-required TLS settings |
| CLIENT_URL | Exact Vercel/custom frontend origin, e.g. `https://portfolio.example.com`, without a path or trailing slash |
| JWT_ACCESS_SECRET | Unique random secret, at least 32 characters |
| JWT_REFRESH_SECRET | A different unique random secret, at least 32 characters |
| JWT_ACCESS_EXPIRES_IN | `15m` unless deliberately changed |
| JWT_REFRESH_EXPIRES_IN | `7d` unless deliberately changed |
| COOKIE_SAME_SITE | `none` for separate `vercel.app` and `onrender.com` sites; see cookie note below |
| TRUST_PROXY_HOPS | Match the actual trusted proxy chain; do not assume local `0` is the hosted value |
| IMAGEKIT_PRIVATE_KEY | Server-only private key for the same account as the frontend public key |
| CV_ALLOWED_HOSTS | Exact trusted PDF hosts, comma separated, e.g. `ik.imagekit.io` |

Allow the host to supply PORT; the API reads it. Use `npm run start:prod`, not the development watcher. Swagger is disabled in production. `/api/health` checks database availability, so a paused/unreachable database correctly fails readiness.

CORS and write-origin validation accept one configured frontend origin. A generated Vercel preview URL and a stable production/custom domain are different origins: choose the URL you will actually test and set CLIENT_URL accordingly.

For cross-site deployments, refresh cookies require SameSite=None and HTTPS; this API sets Secure in production. Browser third-party-cookie restrictions may still block session restoration. Verify login followed by a full page reload in the target browser. Same-site frontend/API custom subdomains or a deliberately configured same-origin proxy can avoid dependence on third-party cookies; neither is provisioned by this branch. See [MDN third-party cookies](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies).

## Database migration and owner

Apply committed migrations before the new API accepts traffic. If your service supports a pre-deploy command, use `npm run prisma:deploy`; otherwise run it once against the intended database before enabling the new API. Use the committed migrations, not `prisma migrate dev` or a reset. A successful application build does not apply migrations. Render runs build, optional pre-deploy and start as separate steps; availability depends on service configuration. See [Render deployment steps](https://render.com/docs/deploys).

If the database already contains the portfolio owner/content, keep it. Only seed when creating the owner or intentionally rotating its password: configure ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD, then run `npx prisma db seed` from `server/` with the intended environment. Seeding changes an existing owner's password and revokes sessions. Never make seeding an automatic deployment step.

The optional `node scripts/import-resume.cjs` is a manual additive content import from `scripts/data/resume.json`, not an application startup step. Review it before using it on a new database. Normal public content comes from the CMS, not that file.

## Hosted verification

Before confirming the deployment:

- API `/api/health` and `/api/portfolio` return 200, with actual profile/projects/skills/timeline content.
- The homepage completes its loading state, project detail links load directly, and mobile navigation/layout works.
- `/admin/login` signs in; a full reload restores the session; logout returns to login and private endpoints reject the revoked session.
- Admin summary matches data. A test draft can be created, reordered and edited without becoming public until published.
- Images and a PDF can upload/register, be reused in profile/project editors, and show correct usage. Detach preserves the file; deletion of used files is blocked. Remove only deliberate test fixtures afterward.
- A deliberate contact test reaches the inbox. Read/unread/replied/search/delete work. Reply opens the email application; it does not send server email.
- CV opens the configured document. If the PDF proxy is used, the host serves actual PDF bytes and is explicitly allowed.
- `/terminal`, `/projects`, `/skills`, `/timeline`, `/login` and `/dashboard` remain 404. No localhost API URL appears in the deployed browser's requests.

Do not point the automated HTTP integration suite at a hosted portfolio database. It is restricted to a disposable local fixture.

## Release gate

After the owner confirms Vercel and Render are working, merge the verified pre-deploy changes into main, prepare `release/v1.5.0`, update version metadata and lockfiles, then create the `v1.5.0` tag on the verified release commit. Release notes should explain the move from command-driven terminal discovery to the direct one-page portfolio, revision of resume content into editable CMS records, and the completed admin/media/inbox work. These artifacts remain pending until hosted verification succeeds.
