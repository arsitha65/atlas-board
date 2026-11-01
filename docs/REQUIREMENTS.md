# Assessment requirement map

The source assessment is not included in this repository. This map is an implementation checklist, not evidence of live deployment.

| Requirement | Implementation | Remaining validation |
|---|---|---|
| Supabase free database/auth | `src/api.ts`, `supabase/schema.sql` | Create free project, run schema |
| GitHub | Ready-to-push source, gitignore, lockfile, README instructions | User repository/upload/access |
| Four exact status columns | `columns` in `src/domain.ts` | Live smoke test |
| Drag-and-drop, update on drop | dnd-kit pointer/keyboard sensors; API writes | Real persistence and touch checks |
| Required task fields | UUID, title, status, user_id, created_at | Supabase Table Editor review |
| Guest sign-in on launch | Session reuse then signInAnonymously | Enable anonymous provider |
| Each user only accesses own rows | Policies on all five tables; ownership validation | Run two-real-guest API test |
| Create/view task board | App board and editor | Live smoke test |
| Loading/errors/empty states | Boot spinner, retry, error banners, empty columns | Slow/offline live checks |
| Design quality/responsiveness | Sage/cream visual system, desktop/mobile styles | User visual review |
| Team/assignees | Member creation, colors/initials, multiple assignments | Real persistence |
| Comments | Separate comments table, chronological detail list | Real persistence |
| Activity history | Postgres trigger, read-only audit table, detail timeline | Real API validation |
| Labels | Creation, multiple assignment, filter | Real persistence |
| Due indicators | Local-date overdue and 2-day window | Check target timezone |
| Search and filtering | Title, priority, assignee, label; combined AND | Live smoke test |
| Board summary | Total/completed/overdue/completion ratio | Live smoke test |
| Hosted frontend | Vercel instructions and Vite build | Deployment pending |
| No frontend service keys | Only public URL/anon-key variables | Review actual configuration |
| Final PDF/document | Draft PDF plus editable content and full SQL | Candidate details, URLs, live results |
| Setup/features/tradeoffs | README and submission draft | Review against final code |
| Drive/Form submission | README final steps | User submits final document |

The optional single `assignee_id` bonus field is implemented as `assignee_ids` UUID array to support the advanced multiple-assignee feature. A trigger verifies every member/label UUID belongs to the same guest; arbitrary foreign UUIDs cannot be assigned. No custom backend, Go server or React Native client is required by the assessment.
