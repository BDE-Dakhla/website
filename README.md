# 🐬 Getting Started

- [🐬 Getting Started](#-getting-started)
  - [📦 Setup \& Installation](#-setup--installation)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Configuration](#environment-configuration)
    - [Database Setup](#database-setup)
    - [S3 Storage Setup](#s3-storage-setup)
    - [Running the Application](#running-the-application)
    - [Database Management](#database-management)
  - [✨ Features](#-features)
    - [Public Features](#public-features)
    - [Student Portal (Syllabus)](#student-portal-syllabus)
    - [Admin Dashboard](#admin-dashboard)
      - [📊 Analytics](#-analytics)
      - [📬 Newsletter Management](#-newsletter-management)
      - [👤 User Management](#-user-management)
      - [🤝 Sponsors Management](#-sponsors-management)
    - [Technical Features](#technical-features)
  - [🎨 UI Resources](#-ui-resources)
  - [📜 License](#-license)

## 📦 Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher
- **Bun**: Latest version (recommended) or npm/yarn
- **Docker & Docker Compose**: For running PostgreSQL, MinIO, and email services
- **Git**: For version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/BDE-Dakhla/bde-dakhla.git
cd bde-dakhla
```

2. **Install dependencies**

```bash
bun install
```

### Environment Configuration

1. **Copy the example environment file**

```bash
cp .env.example .env
```

2. **Configure environment variables**

Open `.env` and update the following variables:

```env
# Database (default works with Docker setup)
DATABASE_URL="postgres://postgres:bdedakhlapwd@localhost:5433/bde-dakhla-db"
APP_BASE_URL="http://localhost:3000"

# Newsletter (for production, use postfix; for dev, use mailhog)
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_SECURE="false"
SMTP_FROM_EMAIL="no-reply@example.com"
SMTP_FROM_NAME="BDE Dakhla"
CRON_SECRET="your-secret-here"
APP_HMAC_SECRET="generate-a-random-secret"

# Next Auth - Configure OAuth providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_NEXT_SECRET="generate-with: openssl rand -base64 32"

# S3 Storage (works with Docker MinIO setup)
S3_ENDPOINT="http://127.0.0.1:9000"
S3_ACCESS_KEY="minio"
S3_SECRET_KEY="minio12345"
S3_BUCKET="assets"

NEXT_PUBLIC_S3_ENDPOINT="http://127.0.0.1:9000"
NEXT_PUBLIC_S3_BUCKET="assets"

# Admin seed email (for initial setup)
SEED_ADMIN_EMAIL="your-email@example.com"
```

**Important secrets to generate:**

- `AUTH_NEXT_SECRET`: Run `openssl rand -base64 32`
- `APP_HMAC_SECRET`: Run `openssl rand -base64 32`
- `CRON_SECRET`: Run `openssl rand -base64 32`

**Google OAuth Setup:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env`

### Database Setup

1. **Start PostgreSQL with Docker**

```bash
docker compose up -d database
```

This will start a PostgreSQL database with pgvector extension on port 5433.

2. **Run migrations**

```bash
bun run migrate
```

3. **Seed the database (optional)**

```bash
bun run seed
```

This will create an admin user with the email specified in `SEED_ADMIN_EMAIL`.

### S3 Storage Setup

1. **Start MinIO (local S3-compatible storage)**

```bash
docker compose up -d minio
```

2. **Access MinIO Console**

- URL: `http://localhost:9001`
- Username: `minio`
- Password: `minio12345`

3. **Create the bucket**

- Login to MinIO console
- Create a new bucket named `assets` (or the name specified in `.env`)
- Set bucket policy to allow public read access for images

### Running the Application

**Development mode:**

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

**Development with email testing (MailHog):**

```bash
docker compose --profile dev up -d
bun run dev
```

Access MailHog UI at `http://localhost:8025` to view captured emails.

**Production build:**

```bash
bun run build
bun run start
```

**Production with email service:**

```bash
docker compose --profile production up -d
bun run build
bun run start
```

### Database Management

**Run migrations:**

```bash
bun run migrate
```

**Seed the database:**

```bash
bun run seed
```

**Connect to PostgreSQL:**

```bash
docker compose exec database psql -U postgres -d bde-dakhla-db
```

**Stop all services:**

```bash
docker compose down
```

**Stop and remove volumes (⚠️ deletes all data):**

```bash
docker compose down -v
```

## ✨ Features

### Public Features

- 🌐 **Internationalization**: Multi-language support (French, Arabic, English)
- 🏠 **Home Page**: Dynamic landing page with school info and animated partners marquee
- 📰 **News Section**: Campus news and updates
- 👥 **Team Directory**: Meet the BDE team members
- 🤝 **Partners Showcase**: Sponsors and partners with animated logo carousel
- 🏛️ **Clubs Section**: Student clubs and organizations
- 📧 **Newsletter**: Email subscription with double opt-in confirmation
- 🔐 **Authentication**: Secure login with Google OAuth and Code Massar credentials
- 🌓 **Theme Switcher**: Dark/Light mode support

### Student Portal (Syllabus)

- 📅 **Class Schedule**: Interactive timetable with room management
- 🗓️ **Academic Calendar**: Important dates and events
- 📞 **Contacts Directory**: Student and faculty contacts
- ⚙️ **Account Settings**: Profile management and preferences

### Admin Dashboard

#### 📊 Analytics

- Real-time visitor tracking with live counter
- Interactive charts with multiple time ranges (24h, 7d, 30d, 90d)
- Browser, OS, and device statistics
- Geographic data visualization with interactive world map
- Custom events tracking and metrics

#### 📬 Newsletter Management

- Subscribers management with advanced data table
- Bulk actions (export, delete, email)
- Newsletter inbox for managing incoming messages
- Campaign creation and scheduling (API)
- Automated email sending with cron jobs
- Email open tracking
- Unsubscribe management

#### 👤 User Management

- User data table with sorting and filtering
- Bulk delete operations
- Role-based access control (Admin, Moderator, User)
- Granular permission system
- Profile editing and avatar management

#### 🤝 Sponsors Management

- CRUD operations for sponsors/partners
- Logo upload with S3 integration
- Drag-and-drop logo reordering
- Visibility controls

### Technical Features

- ⚡ **Next.js 15**: Server-side rendering with Turbopack
- 🎨 **Modern UI**: Built with shadcn/ui and Radix UI primitives
- 🗄️ **PostgreSQL**: Type-safe database with Kysely ORM
- ☁️ **S3 Integration**: Cloud storage for media files
- 🔒 **NextAuth**: Secure authentication with multiple providers
- 📱 **Responsive Design**: Mobile-first approach
- 🎭 **Animations**: Smooth transitions with Framer Motion
- 📝 **MDX Documentation**: Content management with Fumadocs
- 🎯 **TypeScript**: Full type safety across the stack

## 🎨 UI Resources

- <https://mynaui.com/>
- <https://ui.aceternity.com/>
- <https://magicui.design/>
- <https://shadcnuikit.com/>
- <https://ui.shadcn.com/>
- <https://blocks.mvp-subha.me/>
- <https://www.launchuicomponents.com/>

## 📜 License

- Code: PolyForm Noncommercial License 1.0.0 © 2025 Walid Korchi  
  <https://polyformproject.org/licenses/noncommercial/1.0.0/>

- Content (text, images, media): CC BY-NC 4.0 © 2025 Walid Korchi  
  <https://creativecommons.org/licenses/by-nc/4.0/>

- Trademarks/branding: School names, logos, and trademarks are not covered by these licenses and remain the property of their respective owners.

Preferred credit:

- Content: “© 2025 Walid Korchi — used under CC BY-NC 4.0”
- Code: “Includes code by Walid Korchi (PolyForm Noncommercial 1.0.0)”
