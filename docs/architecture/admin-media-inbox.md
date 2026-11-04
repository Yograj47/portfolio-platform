# Admin media and inbox

Updated: 4 November 2026.

## Media relationships

ImageKit stores file bytes; PostgreSQL stores verified file metadata and usage. A Media record belongs to its uploader. A ProjectMedia join allows one owned image to appear in several owned projects with independent order/cover state. The profile has nullable `avatarMediaId` and `resumeMediaId` foreign keys. Their URLs are resolved by the server and retained in public responses for compatibility.

The migration `20261104000200_profile_media_relations` adds restrictive foreign keys and indexes. Matching owned image/PDF URLs are backfilled; external links remain unchanged. No content or upload is removed by this migration.

## Expected file behavior

1. Upload a supported image or PDF, maximum 10 MB. The backend verifies it with the configured provider before recording URL, MIME, filename, dimensions and bytes.
2. Reuse files using **Choose existing** in profile and project editors, or **Attach to project** in the media library. Uploading alone never publishes or attaches a file.
3. Each library card shows every active project use and whether it is the profile image or resume. Search and filters include all files, projects, profile, PDFs and unused files.
4. Project galleries accept images only. The first attachment becomes cover; removing a cover promotes the next ordered image. Cover selection and detachment are serialized per project. Images can be reordered with pointer or keyboard controls.
5. Clearing a profile selection changes the form draft; save the profile to persist it. Detaching a project image removes its relationship immediately. Neither action deletes the original file.
6. Delete is permanent and available only for unused files. Both UI and API protect referenced files. The API also checks legacy URL usage and excludes soft-deleted projects from active usage. A provider deletion failure keeps the record for retry; an already missing provider file can have its stale database record removed.
7. If upload succeeds but registration fails, keep the editor/page open and use **Retry saving upload**. Registration is idempotent for the owner, so it does not upload a duplicate. Recovery is kept in the current component's memory; closing/navigating away loses that pending step. Unregistered uploads are never automatically deleted, to avoid deleting a file after an ambiguous successful request; provider-library reconciliation is a future maintenance operation.

File metadata editing supports alternative text and description. Changes invalidate the library and relevant project/overview/public content caches. Recorded storage usage means the sum of database file sizes, not a hosting quota or complete provider-account usage. The media library and profile links are public assets, not private document storage.

## Inbox behavior

`/admin/dashboard/messages` is available from the sidebar and overview. It uses the existing protected message endpoints with server pagination (12 per page), optional status filtering and case-insensitive search. Search is submitted deliberately rather than sending a request on every keystroke. The API caps search at 100 characters and page size at 100.

Opening unread messages marks them read; failed updates retain the visible message and show an error. Mark read/unread and mark replied are explicit actions. Reply opens the configured email application with an encoded recipient and subject. It does not automatically mark a message replied or send mail from the server. Deletion requires confirmation. Dashboard counters refresh after inbox changes; inbox data refreshes every minute.

The inbox is shared within this single-owner CMS. It is not a multi-tenant mailbox. Credentials and message content remain behind the session gate/API token guards. Message bodies render as plain text, preserving line breaks.

## Deployment and checks

Apply committed migrations before starting the updated API. See [deployment](../operations/deployment.md) for configuration and hosted checks, and [project overview](overview.md#checks) for the current local verification baseline.
