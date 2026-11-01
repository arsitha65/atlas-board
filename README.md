# Atlas — your work, in motion

A private Kanban workspace built with React, TypeScript, Vite, Supabase Auth/Postgres, and dnd-kit. Use GitHub for version control and Vercel's free Hobby plan for the live demo. No separate API server is needed. Go and React Native are optional in the assessment and are not used.

**Current status:** source code is provided. Supabase setup, live database checks, your GitHub URL, deployment URL, and final personal details must be completed before submission. The local preview is deliberately not persistent and is not a substitute for the live Supabase version.

## 1. Understand the pieces

- **Frontend:** the website running in your browser. React draws the interface; TypeScript catches many coding errors.
- **Database:** Supabase stores tasks, members, labels, comments, and activity.
- **Authentication:** Supabase automatically creates a guest identity; visitors do not enter an email or password.
- **RLS:** database rules restrict each visitor to their own rows, including requests made outside the UI.
- **Git/GitHub:** Git records changes locally; GitHub hosts the repository.
- **Vercel:** builds the source code and serves the public demo over HTTPS.
- **Terminal:** the app in which you type commands. Press Enter after each command. Run each command separately.

## 2. Install your local tools

1. Install an active Node.js LTS version (22.12+ or 24 LTS) from https://nodejs.org/ . Node includes npm, the package installer.
2. Install Visual Studio Code from https://code.visualstudio.com/ .
3. Open Terminal on macOS (Command+Space, type Terminal, press Enter). On Windows use PowerShell.
4. Type `node --version`, then `npm --version`. Both should print versions. If not, close and reopen Terminal after installation.
5. Type `git --version`. On macOS follow the Command Line Tools installation prompt if shown. On Windows install Git from https://git-scm.com/downloads and reopen Terminal.
6. In VS Code choose File → Open Folder and open this `atlas-board` folder. Choose Terminal → New Terminal. That terminal should start inside this folder.

On this Mac you can also enter:

```bash
cd /Users/arsitha/Documents/Codex/2026-11-01/re/outputs/atlas-board
```

Do not type the Markdown backticks into Terminal. A command's printed output is not another command.

## 3. Run a local interface preview (optional)

```bash
npm ci
npm run dev
```

Open the localhost URL printed in Terminal (normally http://127.0.0.1:5173). Click **Explore a local preview**. It contains illustrative cards and supports editing and dragging in memory. Reloading discards those changes. Stop the server with Control+C when ready to connect the real database.

## 4. Create your free Supabase project

1. Go to https://supabase.com/dashboard and sign in; using your existing GitHub account is an option.
2. Create an organization on the Free plan if prompted. Do not select a paid plan.
3. Click **New project**. Use a descriptive name, for example `atlas-board`.
4. Generate a strong database password and store it in your password manager. This password does **not** go in the frontend or GitHub.
5. Choose a nearby region and create the project. Wait for provisioning to finish.
6. Open **Authentication** and find **Sign In / Providers** (dashboard labels may vary). Enable **Anonymous Sign-Ins** and save. Leave email/password out of this app.
7. Open **SQL Editor**, create a new query, and paste the entire contents of `supabase/schema.sql`. Click **Run** once. It creates five tables, indexes, constraints, audit triggers, and policies in one transaction.
8. If a query fails, read its error before retrying. The script is for a fresh project and is not a migration to rerun over existing tables. Do not drop tables containing data just to remove an error.
9. Open **Table Editor**. Confirm `tasks`, `team_members`, `labels`, `comments`, and `task_activity` exist and RLS is enabled on all five.
10. Find the project URL (the project's **Connect** dialog or API settings). Copy the HTTPS URL ending in `.supabase.co`.
11. Open **Settings → API Keys**. For the assessment's exact terminology, copy the legacy **anon/public** key. The modern **publishable** key also works with this client; the variable below retains the assessment's `ANON_KEY` name. Never use `service_role` or `sb_secret_...`.

Supabase's official anonymous-auth guide: https://supabase.com/docs/guides/auth/auth-anonymous . API key reference: https://supabase.com/docs/guides/getting-started/api-keys . Guest sign-ins are real authenticated users, different from the unauthenticated database `anon` role.

## 5. Connect the frontend

1. In VS Code's file explorer copy `.env.example` and rename the copy `.env` (a leading dot, no `.txt`). Keep it in the same folder as `package.json`.
2. Replace the example values:

```dotenv
VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ACTUAL_PUBLIC_ANON_KEY
```

3. Save the file. Do not add spaces around `=`. Do not include database passwords or service keys.
4. Stop any running development server with Control+C.
5. Run `npm ci` if you have not already installed dependencies.
6. Run `npm run dev` and open the printed URL. No preview button should be needed now. The app creates a guest session and shows your empty real board.
7. Create a task, reload, and check that it remains. In Supabase Table Editor, check the task has a `user_id` matching the anonymous user in Authentication → Users.

The two frontend variables are public configuration and become visible in the built JavaScript. RLS, not a hidden browser key, protects rows. `.env` remains ignored by Git to prevent accidentally committing future private values.

## 6. Learn and test every feature

1. Click **New task**, enter a title, description, priority, and optional due date, then **Create task**.
2. Drag using the six-dot handle at the top right of a card into another column. Status persists when the drop succeeds. If the network request fails, the original status remains and an error appears.
3. Keyboard alternative: Tab to the drag handle, press Space, use arrow keys to move, and press Space to drop; Escape cancels. You can also open a task and change its Status dropdown. The dropdown is the most predictable alternative on small screens or assistive technology.
4. Click a card's title to edit it. Save changes, or cancel to discard the draft.
5. Click **Team members** in the sidebar, add a name and color, then reopen a task and select one or more assignees. Members are organizational profiles, not login accounts or invitations.
6. Click **Labels**, create a label, and assign one or more labels in the task editor.
7. Open a saved task. Post a comment under Comments. Check timestamps and chronological order. Switch to Activity to see server-generated history. New changes appear after saving and reopening.
8. Search is case-insensitive and matches titles. Priority/member/label filters combine with AND. Clear resets them. Summary counts describe the entire board, while column counts describe matching cards.
9. Due dates earlier than the browser's local date are overdue; today through two days ahead are due soon. Done tasks are never overdue. Dates are calendar dates, not UTC instants.
10. To delete, open a task, click Delete, then Delete permanently. Its comments and audit history are also deleted. No undo is implemented.
11. On a narrow screen swipe horizontally through columns. Scroll by touching the card body or background; the drag handle is reserved for dragging.
12. Click Refresh to load changes made in another tab. This implementation saves on drop; it does not use realtime subscriptions. Concurrent edits are rejected using `updated_at` rather than silently overwriting another tab's task changes.

## 7. Run automated checks

```bash
npm test
npm run build
npm run preview
```

Tests cover date boundaries and combined filtering. Build checks TypeScript and produces a `dist` directory. Preview serves that production build; use its printed URL. Stop with Control+C. See `docs/TESTING.md` for the security tests and remaining manual checks. A successful build does not prove live database isolation; complete those tests separately.

## 8. Put your source on GitHub

You already have a GitHub account. Use a private repository for a restrained sharing workflow; the assessment also permits a public repository. Do not include the assessment PDF in either.

1. Sign in at https://github.com/ . Click **+ → New repository**.
2. Name it `atlas-board`. Select **Private**. Do not initialize with README, license, or gitignore because these files already exist locally. Click Create repository.
3. In the VS Code terminal inside this folder run:

```bash
git init
git branch -M main
git status
git add .
git diff --cached --stat
```

4. Check the staged list. It must not contain `.env`, `node_modules`, or the assessment PDF. To inspect the list use `git diff --cached --name-only`. Stop if anything private appears.
5. Run `git commit -m "Build private Kanban workspace"`.
6. If Git asks for your identity, run `git config user.name "Your Name"` and `git config user.email "YOUR_GITHUB_EMAIL"`, then retry the commit. Use GitHub's no-reply email if preferred.
7. Copy the repository URL from the new GitHub page and use your own username below:

```bash
git remote add origin https://github.com/YOUR_USERNAME/atlas-board.git
git push -u origin main
```

8. Complete GitHub authentication in the browser if prompted. Do not paste your GitHub password into source files. If HTTPS authentication fails, use GitHub Desktop to add this existing local repository and publish it privately.
9. Refresh the GitHub page. Confirm source, SQL, README, and lockfile are present. `.env` and `node_modules` should be absent.
10. Copy the repository URL for your submission. The assessment says a private repository link can be sent directly without adding collaborators; ordinary GitHub private repositories are not readable by non-collaborators. If the reviewer cannot open yours, clarify their access process or choose a public source repository as the assessment permits. Do not claim a private URL alone grants access.

For future edits: `git add .`, `git commit -m "Describe your change"`, then `git push`.

## 9. Deploy a live demo for free

1. Sign up at https://vercel.com/ with GitHub. Choose the free Hobby plan.
2. Click **Add New → Project**, import `atlas-board`, and grant access only to the repository needed.
3. Framework preset: **Vite**. Root directory: the folder containing `package.json` (repository root if you pushed this folder).
4. Build command: `npm run build`. Output directory: `dist`. Install command: `npm ci`.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with exactly the same public values as local `.env`. Add them to Production and Preview if you want both environments functional.
6. Click **Deploy**. Wait for a successful build, then open the HTTPS demo URL.
7. If variables change later, redeploy; Vite embeds them at build time. Official deployment guide: https://vercel.com/docs/frameworks/frontend/vite .
8. In Supabase Authentication URL settings set Site URL to your production URL. No redirect-based login is used, so no OAuth callback route is needed.
9. Create a task in the live app and reload. Test a second browser profile. Run all items in `docs/TESTING.md` against the actual live project.
10. Copy the live URL. Ensure a reviewer can open it without a Vercel account; check deployment protection settings if it asks for login.
11. Check the provider dashboards still show the free plans. Free tiers have quotas and availability limits; no paid services are required by this project.

## 10. Prepare and submit the final document

1. Open `docs/SUBMISSION.md`. Replace every `REPLACE_...` field with your own details and actual URLs. Never invent deployment or test results.
2. The provided PDF is a **draft**, with conspicuous placeholders. Do not submit it unchanged. Add your final name, repository, demo URL, and verified results before exporting the final PDF.
3. Include the **entire** `supabase/schema.sql` in the final document (the draft PDF already includes it). Do not include private credentials.
4. Read the overview and tradeoffs, and ensure you understand each statement. Update anything you change in the app.
5. Export to PDF from your document editor, or ask for the supplied draft to be regenerated after your details and live checks are ready.
6. Name the final file `firstname_lastname_task_manager_assessment.pdf` using your actual name.
7. Upload that final document to Google Drive. Follow the assessment's Google Form instructions for sharing and submission. Confirm the intended reviewers can open the Drive link.
8. Keep the assessment PDF and final submission link off public profiles and public posts, per the document's stated sharing terms. Share the deliverable directly with the reviewers.

## Troubleshooting

| Symptom | What to check |
|---|---|
| `npm` not found | Install Node LTS, then reopen Terminal. |
| npm cache permission error | Use `npm ci --cache ./work/npm-cache` and add `work/` to your local ignore list; do not run npm with sudo. |
| Still shows setup screen | `.env` must be next to `package.json`; replace both placeholders; restart Vite. |
| Anonymous sign-ins disabled | Enable Anonymous Sign-Ins under Supabase Authentication. |
| Invalid API key | Use that project's public anon/publishable key and matching URL; remove accidental spaces. |
| Table or schema-cache error | Run the full schema once in the correct project; check Table Editor. |
| Permission or RLS error | Verify guest session exists; apply policies and grants; do not disable RLS as a fix. |
| Task changed in another tab | Close the editor, click Refresh, reopen and reapply your change. |
| New task seems missing | Clear search/filters and inspect the selected status column. |
| No activity in preview | Audit history is generated by Postgres only in the connected app. |
| Different tasks after clearing browser storage | Guest identity lives in browser storage. Clearing it creates a new identity; this app has no recovery/login flow. |
| Supabase request stalls/fails | Check network, dashboard status, free-project availability, and rate limits; retry. |
| Live app lacks config after changing variables | Redeploy Vercel; browser builds do not read live server env variables. |

## Project map and design

- `src/App.tsx`: workspace layout, board, drag-and-drop, dialogs, team/label forms, comments, activity.
- `src/api.ts`: Supabase client, guest session reuse, persistence, conflict checks.
- `src/domain.ts`: shared types, search/filter rules, calendar urgency.
- `src/styles.css`: responsive sage/cream visual system, focus states, motion preferences.
- `supabase/schema.sql`: full database setup and security rules.
- `tests/domain.test.ts`: deterministic domain tests.
- `tests/rls.integration.mjs`: real two-guest security smoke test (explicit opt-in).
- `docs/TESTING.md`: manual acceptance tests and evidence checklist.
- `docs/SUBMISSION.md`: editable final-document content.

All seven recommended advanced feature groups are implemented. Multiple assignees/labels use bounded UUID arrays with database validation rather than junction tables; creation-only catalogs keep references stable. A larger collaborative application would use normalized joins, catalog editing/deletion workflows, pagination, realtime subscriptions, robust abuse protection, guest-to-permanent account upgrade, and wider browser automation coverage. Task order is creation order within each column; arbitrary within-column reordering is intentionally not implemented because the assessment requires status movement, not custom ordering. Save-on-drop is intentional, and failed requests preserve the previous card state.
