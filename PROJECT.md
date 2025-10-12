# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Official website for the Bureau des étudiants (Student Union) of ENCG Dakhla. A Next.js 15 application featuring campus news/events powered by FumaDocs (MDX), user authentication, newsletter management, analytics, and sponsor management.

**Stack**: Next.js 15 (App Router), TypeScript, PostgreSQL (Kysely ORM), NextAuth.js, next-intl (i18n), Biome (linting/formatting), TailwindCSS, Radix UI

## Development Commands

### Environment Setup
```bash
# Copy environment template and configure
cp .env.example .env

# Start Docker services (PostgreSQL, MinIO, MailHog for dev)
docker compose --profile dev up -d

# Install dependencies
bun install

# Run database migrations
bun run migrate

# Seed database with initial data
bun run seed          # Run all seeds
bun run seed -- list  # List available seeds
bun run seed -- sponsors  # Run specific seed (fuzzy match)

# Reset database (drops schema and re-runs migrations)
bun run migrate reset
```

### Development Workflow
```bash
# Start development server with Turbopack
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Generate MDX types after adding/modifying content
fumadocs-mdx
```

### Code Quality
```bash
# Format code (Biome)
bunx @biomejs/biome format --write .

# Lint code (Biome)
bunx @biomejs/biome lint --write .

# Check code (combines formatting and linting)
bunx @biomejs/biome check --write .
```

## Architecture

### Application Structure

**App Router Layout**: Next.js 15 App Router with internationalized routes under `app/[locale]/`

**Core Directories**:
- `app/[locale]/` - Internationalized pages and layouts
- `app/api/` - API routes (newsletter, sponsors, upload-url)
- `components/` - React components (UI primitives, dashboard components, design system)
- `lib/` - Business logic, utilities, database operations
- `changelog/content/` - MDX content for news/events (FumaDocs)
- `i18n/locales/` - Translation files (JSON)
- `types/` - TypeScript type definitions

### Database Architecture

**ORM**: Kysely with PostgreSQL, migrations in `lib/db/migrations/`

**Key Tables**:
- `User` - Extended NextAuth users with `cdm` (Code Massar), `role`, `permissions`, `password`
- `subscribers`, `campaigns`, `campaignRecipients` - Newsletter system
- `sponsors` - Partner/sponsor management with approval workflow
- `analytics_visitors`, `analytics_sessions`, `analytics_events` - Custom analytics tracking

**Migrations**: Numbered files in `lib/db/migrations/` (e.g., `001_auth.ts`), run sequentially via `bun run migrate`

**Seeds**: Located in `lib/db/seeds/`, run via `bun run seed`

### Authentication & Authorization

**Provider**: NextAuth.js v5 with dual authentication:
- **Credentials**: Code Massar (CDM) + password (bcrypt hashed)
- **OAuth**: Google (restricted to `@edu.uiz.ac.ma` email domain)

**Session**: JWT-based with custom claims (`role`, `permissions`, `username`, `cdm`)

**Roles**: `developer`, `teacher`, `student`, `contributor`, `administrator`

**Permissions**: Key-value map (`PermissionMap`) stored on User, checked via `hasPermission(perms, key)`

**Middleware**: `middleware.ts` handles i18n routing + permission-based guards
- `AUTH_ONLY_SEGMENTS`: Requires login (e.g., `syllabus`)
- `PERMISSION_KEYS_BY_SEGMENT`: Maps route segments to required permission keys (e.g., `dashboard` requires `HAS_ACCESS_TO_DASHBOARD`)

### Internationalization (i18n)

**Library**: next-intl with locale prefix routing

**Locales**: Primary: `fr` (French), `en` (English); others disabled but configured (es, zh, it, de, ru, ar, shi, uk)

**Default Locale**: Configurable via `NEXT_PUBLIC_DEFAULT_LANG`, falls back to French

**Translation Files**: `i18n/locales/{locale}.json`

**Routing**: Locale-prefixed paths (e.g., `/fr/dashboard`, `/en/dashboard`) via `i18n/routing.ts`

### Content Management

**System**: FumaDocs with MDX for news/events

**Content Location**: `changelog/content/` (MDX files)

**Configuration**: `source.config.ts` defines docs structure with frontmatter schema (date, tags, version)

**Custom Components**: `changelog/mdx-components.tsx` provides MDX component overrides

### Storage

**Provider**: S3-compatible (MinIO in development, configurable endpoint for production)

**Upload Flow**: Pre-signed URLs generated via `/api/upload-url`

**Configuration**: Environment variables `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`

### Email & Newsletter

**SMTP**: Configurable via environment variables (`SMTP_HOST`, `SMTP_PORT`, etc.)

**Development**: MailHog on port 8025 (web UI) / 1025 (SMTP)

**Production**: Postfix (Docker profile `production`)

**Campaign System**: Supports subscriber management, token-based confirmation, tracking (opens, clicks)

### Analytics

**System**: Custom first-party analytics tracking visitors, sessions, events

**Privacy**: Uses visitor keys and IP hashing (no PII stored directly)

**Metrics**: Device category, country code, User Agent Client Hints (UACH), pageviews, events

**UI**: Dashboard with charts (recharts), maps (react-simple-maps), metrics tables

## Code Style

**Formatter/Linter**: Biome (configured in `biome.json`)

**Key Settings**:
- Single quotes for JS/JSX, line width 80
- Semicolons "as needed", trailing commas "all"
- Import organization with type imports grouped
- Sorted JSX attributes and object properties
- Next.js domain rules enabled

**File Naming**: Use kebab-case for component files, directories

## Environment Variables

Required variables documented in `.env.example`:
- `DATABASE_URL` - PostgreSQL connection string
- `APP_BASE_URL` - Application base URL
- `AUTH_NEXT_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` - NextAuth configuration
- `S3_*` - Storage configuration
- `SMTP_*` - Email configuration
- `CRON_SECRET`, `APP_HMAC_SECRET` - Security tokens

## Docker Services

Development: `docker compose --profile dev up -d`
- PostgreSQL (pgvector/pg17) on port 5433
- MinIO (S3-compatible storage) on ports 9000 (API), 9001 (Console)
- MailHog (email testing) on ports 1025 (SMTP), 8025 (Web UI)

Production: `docker compose --profile production up -d`
- Includes Postfix for email delivery

## Key Technical Patterns

**Path Aliases**: `@/*` maps to project root (configured in `tsconfig.json`)

**Server-Only Code**: Auth logic uses `'server-only'` directive

**Database Access**: Always use `getDb()` from `lib/db/instance.ts` to get singleton Kysely instance

**Permission Checks**: Server-side via `lib/permission.server.ts`, client/middleware via `lib/permission.ts`

**Responsive Design**: Tailwind with container queries (`@7xl/content` variants)

**Component Library**: Radix UI primitives wrapped in `components/ui/`

**Animation**: Framer Motion, tsparticles, canvas-confetti

**Forms**: react-hook-form + Zod validation

## Common Tasks

**Adding a new migration**: Create `lib/db/migrations/00X_description.ts` with Kysely migration, then run `bun run migrate`

**Adding a new permission**: Update `PERMISSION_KEYS_BY_SEGMENT` in `middleware.ts`, add permission key to User's permissions map

**Adding MDX content**: Place `.mdx` files in `changelog/content/`, follow frontmatter schema from `source.config.ts`

**Adding a new locale**: Add JSON file in `i18n/locales/`, update `LANGS` array in `i18n/routing.ts`, set `disabled: false` when ready

**Modifying authentication flow**: Update `auth.ts` callbacks (jwt, session, signIn) and providers array
