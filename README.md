# BDE Dakhla

Official website of the Student Office of Dakhla - a modern web platform for campus life management.

## Quick Start

**Prerequisites:** Node.js 20+, Bun, Docker

```bash
# Clone and install
git clone https://github.com/BDE-Dakhla/bde-dakhla.git
cd bde-dakhla
bun install

# Setup environment
cp .env.example .env
# Generate secrets: openssl rand -base64 32

# Start services and database
docker compose up -d
bun run migrate
bun run seed

# Run development server
bun run dev
```

Visit `http://localhost:3000`

## Key Commands

```bash
bun run dev              # Development server
bun run build            # Production build
bun run test             # Run tests
bun run migrate          # Database migrations
docker compose up -d     # Start all services
```

## Features

**Public Portal:** i18n support • News & updates • Team directory • Sponsors showcase • Newsletter subscription • Google OAuth & Code Massar authentication

**Student Portal:** Class schedules • Academic calendar • Contacts directory • Account settings

**Admin Dashboard:** Real-time analytics with geo visualization • Newsletter management • User management with RBAC • Sponsors management with S3 storage

**Tech Stack:** Next.js 15 + Turbopack • TypeScript • PostgreSQL + Kysely • NextAuth • shadcn/ui • Framer Motion • Fumadocs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and how to submit contributions.

## Security

Report security vulnerabilities to <walid.korchi@edu.uiz.ac.ma>. See [SECURITY.md](SECURITY.md) for details.

## License

**Code:** [PolyForm Noncommercial 1.0.0](LICENSE) © 2025 Walid Korchi  
**Content:** [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) © 2025 Walid Korchi

Noncommercial use only. See [LICENSE](LICENSE) for full terms. School trademarks remain property of respective owners.
