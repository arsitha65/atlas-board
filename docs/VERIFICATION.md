# Verification record — November 1, 2026

## Passed locally

- `npm run build`: TypeScript and production Vite build pass.
- `npm test`: 9 tests pass. Local calendar dates, year boundaries, urgency window, completed/undated cases, case-insensitive search and combined filters covered.
- Exact setup SQL executed in embedded PostgreSQL (PGlite) with a small simulated Supabase `auth` schema and authenticated/anon roles. Own inserts/updates, activity creation, two-user RLS isolation, foreign comment denial, impersonated task insert denial, immutable ownership, invalid assignment rejection and child cascades passed. This validates SQL behavior under PostgreSQL but does not validate Supabase provisioning, Auth, REST grants or deployment.
- In-app browser local preview: created a task, reopened and updated status, searched by title, cleared filter, created member and label, selected both in task editor, posted comment, saved edits, and confirmed deletion of generated preview task.
- Pointer drag moved a task from To Do to In Progress. Keyboard Space/ArrowRight/Space moved it from In Progress to In Review. Browser accessibility state confirmed column counts and successful drop announcements.
- Desktop checked at 1440x1000; mobile checked at 390x844. Mobile document width equals viewport width (390px), with horizontal scrolling restricted to the board. Screenshots included in this folder.
- Browser developer log reported no error entries at the end of preview verification.
- Draft submission PDF rendered and visually reviewed across all four pages, including full schema appendix.

## Pending before submission

- Real Supabase project, enabled anonymous auth, schema installation, persistence and complete two-guest API/manual security checks.
- Test network failure, stale writes across real tabs, and actual touch devices against the connected app.
- GitHub repository creation/upload and reviewer access.
- Vercel free-tier deployment and public HTTPS availability.
- Actual candidate name, repository URL, demo URL, verified live test results and final filename in submission PDF.

## Limits

Local preview has in-memory data only; comments reset on closing a task. Screenshots are preview evidence, not a hosted demo. No claim is made that a live Supabase or hosting test has passed. The production build reports a roughly 528kB JS chunk (about 153kB gzip); splitting vendors would improve first-load caching in future work.
