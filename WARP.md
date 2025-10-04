# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the official website for the Bureau des étudiants (Student Bureau) of ENCG Dakhla, a Next.js application with:

- Multi-language support (10 languages including Arabic and Berber/Tamazight)
- PostgreSQL database with Kysely ORM
- NextAuth.js authentication with Google OAuth and custom credentials (Code Massar)
- FumaDocs for MDX-based changelog/news system
- Role-based permissions system
- Tailwind CSS with Radix UI components

## Essential Commands

### Development

```bash
bun dev                     # Start development server with Turbopack
bun run build              # Build production application
bun start                  # Start production server
bun run lint               # Run Biome linter and formatter
```

### Database Operations

```bash
bun run migrate            # Run database migrations
bun run migrate reset      # Reset database (drops and recreates schema)
bun run seed help          # Show seeding options
bun run seed all           # Run all database seeds
bun run seed list          # List available seeds
```

### Content Management

```bash
fumadocs-mdx               # Process MDX files for changelog (auto-run on dev/build)
```

## Architecture & Key Concepts

### Authentication System

- **Dual Authentication**: Google OAuth (restricted to `@edu.uiz.ac.ma` domain) and custom credentials using "Code Massar" (CDM)
- **JWT Strategy**: Session data stored in JWT tokens with user metadata backfilling
- **Role System**: Users have roles (`student`, admin, etc.) with granular permissions
- **Middleware Protection**: Routes protected by segments in `middleware.ts` with permission checks

### Database Structure

- **ORM**: Kysely with TypeScript-first approach
- **Migrations**: Located in `lib/db/migrations/` with numbered files
- **Seeds**: Located in `lib/db/seeds/` for development data
- **Connection**: PostgreSQL with connection pooling

### Internationalization (i18n)

- **10 Languages**: English, French, Arabic, Spanish, German, Italian, Russian, Ukrainian, Chinese, and Berber (Tashelhit)
- **Routing**: Locale prefixes in URLs (`/en/`, `/fr/`, `/ar/`, etc.)
- **Files**: Translation files in `i18n/locales/` as JSON
- **Middleware**: Handles locale detection and routing

### Content Management

- **Changelog System**: MDX files in `changelog/content/` with frontmatter schema
- **FumaDocs**: Powers the documentation/news system with file-based routing
- **Schema**: Each changelog entry has `date`, `tags`, and optional `version` fields

### Permission System

- **Granular Permissions**: JSON-based permission maps stored per user
- **Route Protection**: Segments like `dashboard` require specific permissions (`HAS_ACCESS_TO_DASHBOARD`)
- **Helper Functions**: `hasPermission()` utility in `lib/permission.ts`

### Component Architecture

- **Design System**: Built on Radix UI primitives with custom styling
- **Data Tables**: Advanced table components with sorting, filtering, and bulk actions
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts integration for data visualization

## Development Guidelines

### Code Style

- **Formatter**: Biome with specific rules (single quotes, trailing commas, 80 char line width)
- **Import Organization**: Automatic import sorting with type imports grouped
- **Attributes**: Auto-sorted JSX attributes and object properties

### File Patterns

- **Route Structure**: Next.js 15 app router with `[locale]` dynamic segments
- **Components**: Reusable components in `/components` with TypeScript
- **Utilities**: Helper functions in `/lib` organized by concern
- **Types**: Global types in `/types` with database schema definitions

### Database Development

- **Migration Pattern**: Create numbered migration files in `lib/db/migrations/`
- **Seeding**: Use fuzzy matching seed system for development data
- **Schema Types**: Auto-generated from migrations for type safety

### Authentication Development

- **Session Extension**: User metadata automatically backfilled from database
- **Permission Checks**: Use `hasPermission()` helper for authorization
- **Route Protection**: Add new protected segments to `middleware.ts`

### Content Development

- **MDX Files**: Use frontmatter schema with required `date` field
- **Asset Handling**: S3-compatible storage for file uploads
- **Translations**: Add new keys to all locale files simultaneously

### Consistency

- Use `cn()` helper utility form `@/lib/utils` instead of conditional (ternary and logical) expressions inside a template literal when dealing with conditional rendering of classNames in JSX

## Environment Setup

Key environment variables (see `.env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_NEXT_SECRET`: NextAuth.js secret
- `AUTH_GOOGLE_ID/SECRET`: Google OAuth credentials
- `S3_*`: File storage configuration
- `SMTP_*`: Email configuration for newsletters

## Testing & Quality

- **Type Safety**: Full TypeScript with strict configuration
- **Database**: Type-safe queries with Kysely
- **Authentication**: Comprehensive session and permission testing needed
