# Admin handoff

Updated: 4 November 2026. Admin content and media work is implemented; the next phase is deployment configuration and verification.

## Available screens

All management routes live below `/admin/dashboard`: overview, projects, media, categories, skills, timeline, profile and messages. Each uses the verified session gate and responsive hamburger navigation. The unused locked Settings entry was removed; public profile settings are accessible directly in the sidebar.

- Overview uses the protected real-data summary endpoint. Successful CMS mutations invalidate overview and public content caches.
- Projects support publication, technologies, related skills and usage notes, existing/uploaded images, cover selection, ordering and safe detach.
- Media supports image/PDF uploads, filename/alt search, usage filters, usage labels, metadata editing and protected permanent deletion.
- Profile supports summary, phone, availability, social links, a linked library avatar and a linked resume PDF or external resume URL.
- Skills include groups. Timeline includes credential ID, verification URL and expiry for certificates/training.
- Messages include pagination, status filters, server-side search, read/unread/replied controls, email-app reply links and confirmed deletion. Opening an unread enquiry marks it read. Marking replied records a status; it does not send mail.
- Shared table search now filters records, toolbars display result counts, and load failures offer retry rather than presenting an empty dataset.

See [Admin media and inbox](../architecture/admin-media-inbox.md) for file lifecycle, relationships, migration and deployment notes. Existing authentication remains documented in [Admin auth](../architecture/admin-auth.md); overview details are in [Dashboard overview](../architecture/dashboard-overview.md).
