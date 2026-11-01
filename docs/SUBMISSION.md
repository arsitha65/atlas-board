# Atlas — Kanban Task Manager

DRAFT — replace placeholders and verify the deployed app before submission.

Candidate: REPLACE_FIRSTNAME REPLACE_LASTNAME
Live demo: REPLACE_LIVE_DEMO_URL
GitHub repository: REPLACE_GITHUB_REPOSITORY_URL
Final filename: firstname_lastname_task_manager_assessment.pdf

## Overview and design decisions

Atlas is a responsive, private task board built with React, TypeScript and Vite. Supabase supplies anonymous authentication and Postgres persistence. GitHub hosts the source and Vercel's free tier is the intended deployment target. A separate backend is unnecessary because Supabase provides a client API protected by row-level security.

The cream and sage palette, consistent typography, compact cards and four clear status columns create a calm workspace. Empty states explain what to do next; loading, failure and success messages make state visible. Task dialogs support keyboard focus containment and status changes without dragging. On small screens, columns scroll horizontally.

## Core functionality

Visitors automatically receive a Supabase anonymous identity, reused in the same browser. Tasks contain a required title, optional description and due date, priority, status, creation timestamp, owner and arrays of assignee/label UUIDs. Tasks move between To Do, In Progress, In Review and Done. Successful drops persist to Supabase; failed drops preserve the previous state. The editor supports creating, updating and deleting tasks.

## Advanced features implemented

1. Team profiles with names, colors and initials; multiple assignees per task. Profiles organize a single guest's work and do not represent invited login accounts.
2. Comments stored separately, shown in chronological order with timestamps.
3. Server-generated immutable activity records for creation, status changes, content edits, priority, due dates, assignments and labels.
4. Custom colored labels, multiple labels per task, label filter.
5. Overdue and due-soon card indicators using local calendar dates; completed tasks excluded from overdue counts.
6. Case-insensitive title search plus priority, assignee and label filters combined with AND.
7. Total, completed, overdue and completion-percentage summary for the full board.

## Security and data integrity

RLS is enabled on all five tables and scoped to the authenticated guest's auth.uid(). Child inserts validate task ownership. Task triggers reject foreign or duplicate member/label references and prevent ownership changes. Audit writes occur only through a narrowly scoped server trigger; clients can read their own audit records but cannot forge them. Foreign keys cascade comments and activity when a task is deleted. Only the public browser key is used; no service-role key belongs in the frontend. updated_at checks reject stale task edits instead of silently overwriting changes.

## Local setup

1. Install Node.js 22.12+ or Node 24 LTS and Git; clone the repository.
2. Run npm ci in the project folder.
3. Create a free Supabase project and enable Anonymous Sign-Ins.
4. Run the complete SQL schema in supabase/schema.sql once in a fresh project.
5. Copy .env.example to .env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to that project's public values.
6. Run npm run dev and open the printed local URL.
7. Run npm test and npm run build. For a production preview, run npm run preview.
8. Deploy to Vercel with Vite preset, build command npm run build, output dist, and both public environment variables.

## Verification

Completed locally: TypeScript/production build; nine domain tests covering filtering and local calendar urgency. The SQL schema executes in embedded PostgreSQL, where guest isolation, child ownership, audit triggers, immutable task ownership and deletion cascades pass checks. These checks do not substitute for a real deployed Supabase test.

REPLACE_LIVE_TEST_RESULTS: run the two-guest API script and manual acceptance checklist in docs/TESTING.md; record actual results and date here. Browser UI verification details are recorded separately in docs/VERIFICATION.md.

## Tradeoffs and next improvements

Saves occur on drop; remote tabs refresh manually rather than through realtime subscriptions. Member and label catalogs are creation-only, and bounded UUID arrays simplify multiple assignments; normalized join tables and catalog lifecycle controls would suit a larger app. Card order is creation order within each column. Anonymous browser identities cannot be recovered after browser storage is cleared. Comments are append-only. The app does not queue offline changes or paginate large boards. Add guest-to-permanent account conversion, abuse protection/CAPTCHA integration, realtime updates, pagination, normalized joins and broader automated browser coverage for production use.

## Full database schema

Include every line from supabase/schema.sql below this heading. The draft PDF includes the full schema automatically.
