# Acceptance and security checks

Record the actual date and result beside each check. These are instructions, not a claim that live tests have passed. Automated unit tests and compilation cannot replace testing the deployed database.

## Board and persistence

- [ ] Fresh visitor automatically becomes an anonymous Supabase user without a login form.
- [ ] All four exact columns are present: To Do, In Progress, In Review, Done.
- [ ] Create a minimal title-only task; reload; task is retained.
- [ ] Create with description, all priority values, due dates, multiple members and labels.
- [ ] Create directly in every column using its plus button.
- [ ] Drag each direction including into an empty column; reload confirms new status.
- [ ] Drop outside a column, cancel with Escape, and drop into the same column: status stays unchanged.
- [ ] Move using keyboard; also move via editor Status dropdown.
- [ ] Edit title, description, priority, date, assignments, labels, and status.
- [ ] Remove a date and all assignments/labels, save, and reload.
- [ ] Empty/whitespace titles rejected. Test 160-character title and 10,000-character description; database rejects longer direct requests.
- [ ] Long words, Unicode, emoji, quotes, and `<script>alert(1)</script>` display as text, never HTML.
- [ ] Duplicate exact member/label names rejected; UI also checks case-insensitive duplicates.
- [ ] Select up to 20 assignees/labels; UI and database reject more.
- [ ] Empty boards and empty filtered results explain the state.
- [ ] Search ignores case and outer spaces. Filters combine with AND; Clear restores board.
- [ ] Stats stay for whole board while filtered column counts change.
- [ ] Yesterday is overdue, today and next two days due soon, later neutral; Done never overdue.
- [ ] Post comments, reload, check chronology/timestamps. Whitespace-only rejected; max 2,000 chars.
- [ ] Every task edit type creates correct activity. No-op saves do not produce misleading edits.
- [ ] Delete confirmation can be cancelled. Confirm deletes task and cascades comments/activity.

## Errors and concurrency

- [ ] Disable network after loading, attempt a move/save/comment: error visible, no false success.
- [ ] Retry after restoring network; clear error; refresh loads current records.
- [ ] Slow connection: initial loading visible and duplicate saves are prevented.
- [ ] Bad URL/key and disabled anonymous auth produce actionable error and retry.
- [ ] Missing schema causes load failure, not an empty successful board.
- [ ] In two tabs open same task; save in tab A then save stale version in B: B rejects instead of overwriting. Close, Refresh, reopen to resolve.
- [ ] Delete in A, then save/move in B: B reports conflict; refresh removes stale record.
- [ ] Multiple tabs may each bootstrap at first launch; Supabase browser auth locking protects persisted sessions. Check same-browser session behavior on target browsers.

## Two-user RLS — mandatory live validation

Use two separate browser profiles, or normal plus incognito. Two tabs in one normal browser share one session and are not two users.

1. In A create a distinctive task, member, label, and comment. Check that A can read/update/delete its own tasks.
2. Open B. It must start with an empty board; create a different task. Reload both: neither sees the other's records.
3. Inspect database rows in Supabase dashboard; verify different user IDs. The dashboard has admin privileges and is not proof of client RLS.
4. Run the opt-in API test below to exercise direct cross-owner requests.
5. Verify all five tables have RLS enabled and no broad public policies were added later.

```bash
RUN_RLS_TESTS=1 node --env-file=.env tests/rls.integration.mjs
```

On PowerShell set `$env:RUN_RLS_TESTS="1"` first, then run `node --env-file=.env tests/rls.integration.mjs`.

The script creates two real anonymous users and temporary rows in your configured project. It deletes the temporary tasks at the end, but cannot delete auth users without admin privileges; remove these two users via Authentication → Users afterward. It prints their IDs for cleanup. Use a test project when possible. It must fail if cross-owner data is exposed, foreign child inserts or forged activity writes are accepted, or user ownership can be changed. No service key is used.

## UI/accessibility/deployment

- [ ] Desktop (1440px), tablet (768px), mobile (390px), and 200% browser zoom.
- [ ] Horizontal board scroll on mobile, vertical page scroll, touch dragging.
- [ ] All form fields have labels, focus visible, dialogs contain focus, Escape closes when idle, focus returns to triggering control.
- [ ] Keyboard users can create, edit, assign, filter, comment, delete and move status using dropdown.
- [ ] Screen reader announces errors, loading, and saved notifications.
- [ ] Reduced-motion preference respected; no horizontal whole-page overflow.
- [ ] Production `npm run build` and `npm run preview` work.
- [ ] Live HTTPS URL opens without hosting-provider authentication.
- [ ] Live tasks persist after reload; live A/B security tests pass.
- [ ] No service key/database password committed; `.env` ignored; only intended public browser config in bundle.
- [ ] Full SQL, actual demo/repo URLs, personal filename, tradeoffs, setup instructions present in final PDF.

## Known bounds

No account recovery after guest storage deletion, shared multi-user teams, invitations, offline queue, arbitrary card reordering, realtime push, pagination, or catalog deletion/editing. Comments are append-only and audit rows are immutable from the client. Local preview comments disappear when the dialog closes; only the Supabase version persists them. Date urgency recomputes on UI render; reload after midnight if leaving the app open overnight.
