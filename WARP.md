# Project Rules — BDE Dakhla

These rules guide Warp agents working in this repository. They codify our stack, conventions, and safety preferences so changes remain consistent and predictable.

Scope
- This file lives at the repo root and applies project-wide.
- If a subdirectory defines its own WARP.md, subdirectory rules take precedence there.

Tech stack and key libraries
- Framework: Next.js 15 (App Router) with Turbopack
- Language: TypeScript 5, React 19
- Styling/UI: Tailwind CSS v4, shadcn/ui components
- i18n: next-intl (locale segment as app/[locale]/...)
- Auth: next-auth v5
- Data: Kysely (PostgreSQL), zod validation, SWR for client fetching
- Build scripts: see package.json (dev/build/start)

General principles
- Ask before performing destructive or irreversible actions (deleting data, dropping tables, etc.).
- Prefer small, focused diffs with clear rationale. Avoid broad refactors unless requested.
- Keep changes aligned with existing code patterns and component architecture.

Paths, routing, and i18n
- New UI routes must respect the locale segment app/[locale]/... (e.g., app/[locale]/dashboard/...)
- Prefer server components by default; add 'use client' only when needed (hooks, event handlers, browser APIs).
- When adding or removing dashboard entries, update components/dashboard-sidebar.tsx accordingly.

Newsletter and email policy
- Emails captured to local files have been removed from the project. Do NOT reintroduce file-based email capture or dev-emails.
- The Inbox is the single source of truth for viewing emails in the dashboard.
- If real outbound email is required, use the SMTP abstractions and environment-driven configuration, and never log or expose secrets.

Database and migrations
- Use getDb() with Kysely for all DB access; do not write raw SQL unless absolutely necessary.
- Place migrations in lib/db/migrations with sequential numbering (e.g., 004_feature_name.ts).
- Keep migrations forward-only and idempotent where possible; provide a safe down() when practical.
- Typical commands: bun run lib/db/migrate.ts and bun run lib/db/seed.ts (confirm before running against anything non-local).

Security and secrets
- Never print secrets to logs or terminal output. Use env accessors (from lib/env) where available.
- If a command requires a secret, have the agent store it in an environment variable and reference it (never inline the value).
- Avoid introducing endpoints that expose sensitive internals; follow existing patterns for validation (zod) and auth checks.

Terminal commands policy
- Non-interactive commands only. Avoid commands that enter full-screen or interactive modes.
- Prefer absolute paths to avoid changing directories. If needed, explicitly cd and explain why.
- For git and similar tools, disable pagers to avoid truncated output (e.g., git --no-pager log).

Version control guidelines
- Use Conventional Commits (e.g., feat:, fix:, chore:, refactor:, docs:, test:).
- Do not commit or push without explicit confirmation from the user.
- Keep commits scoped to a single concern; include context in the message body when non-obvious.

Type checking, formatting, and build
- After code edits, run a type check: npx -y tsc -noEmit.
- Format and lint using Biome if applicable: npx biome check --write . (or the project’s configured formatter).
- Validate builds with npm run build (uses Turbopack). Address type/build errors introduced by your changes.

Frontend conventions
- File names use kebab-case (e.g., users-action-dialog.tsx).
- Use the shared UI components under components/ui when possible; follow existing patterns.
- Use lucide-react for icons (already present in the project). Keep icon sets consistent.

API and server rules
- Use Next.js Route Handlers in app/api with runtime = 'nodejs' where server features are needed.
- Validate inputs with zod and return typed responses where appropriate.
- Respect rate limiting, auth, and permission checks following existing patterns (see lib/permission and next-auth usage).

Internationalization
- Keep translations in i18n/locales/*.json and avoid hard-coding strings where these files are used.
- New features in localized routes should display localized content and keys; add missing keys to both fr.json and en.json.

Housekeeping
- Do not introduce the dev-emails directory, related scripts, or file-based email capture utilities.
- Keep .gitignore up to date, but never commit secrets or local-only artifacts.

When to ask for clarification
- Any task that may remove data, alter DB schema, or change core flows (auth, i18n, routing, newsletter).
- Ambiguous acceptance criteria or conflicting conventions.

Output formatting (for agents)
- Prefer concise explanations. Include commands users can copy-paste when relevant.
- When showing code, ensure snippets are complete enough to compile and reference the correct paths. If illustrating, clearly mark as example.

Thank you for following these project rules to keep contributions safe, consistent, and aligned with our conventions.