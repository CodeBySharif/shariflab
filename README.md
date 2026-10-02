# Sharif Lab

A private project hub to catalog your deployed websites and open them from one place.

## Features

- **Project catalog**: add, edit, and remove sites with website URL, GitHub link, deploy platform, tech stack, and notes
- **Thumbnails**: live screenshot previews on project cards
- **Private hub**: each user owns their projects (Supabase Auth + RLS)
- **Auth**: Google OAuth via Supabase
- **Optional visitor tracking**: embed script for sites that need it (off by default; the hub works without it)

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite, TypeScript, MUI, Tailwind, React Query, Recharts |
| Backend | Node.js, Express, TypeScript, Drizzle ORM |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (Google) |
| Storage | Supabase Storage (thumbnails) |
| Deploy | GCP Cloud Run |

## Local development

### Prerequisites

- Node.js 20+
- Docker (optional, for local Postgres)
- Supabase project (or local Postgres)

### 1. Database

**Option A, Supabase (recommended):**

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial.sql` via the SQL editor
3. Create a public storage bucket named `thumbnails`
4. Enable Google OAuth in Authentication → Providers
5. Copy connection pooling URL (port 6543), anon key, and service role key

**Option B, Local Postgres:**

```bash
docker compose up -d
```

Then run the migration SQL against `postgresql://postgres:postgres@localhost:5432/sharif_lab` (remove `auth.users` FK or create a stub).

### 2. Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in Supabase URL, keys, and database URL in each file.

### 3. Run the API

```bash
cd backend
npm install
npm run dev
```

API runs at http://localhost:3001

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Optional tracking script

Tracking is optional. When you enable it on a project, generate a secret in the Tracking tab and copy the embed snippet (shown once):

```html
<script async src="https://your-api-url/track.js"
  data-site-key="SITE_KEY"
  data-site-secret="SITE_SECRET"></script>
```

Place it before `</body>` on every page you want to track. Set `PUBLIC_API_URL` on the API so `/track.js` points at your real backend.

## API overview

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /health` | — | Health check |
| `GET /track.js` | — | Tracking bundle |
| `POST /api/ingest/events` | Site key + secret | Analytics ingest |
| `GET/POST /api/projects` | Supabase JWT | List / create projects |
| `PATCH/DELETE /api/projects/:id` | JWT + owner | Update / delete |
| `POST /api/projects/:id/thumbnail/refresh` | JWT + owner | Regenerate screenshot |
| `GET /api/projects/:id/analytics/*` | JWT + owner | Optional dashboard data |

## Deploy to GCP + Supabase

1. Create a Supabase project and run migrations
2. Store secrets in GCP Secret Manager:
   - `sharif-lab-db-url`: Supabase connection pooling URL
   - `sharif-lab-service-role`: Supabase service role key
3. Update `cloudbuild.yaml` substitution variables with your URLs and keys
4. Deploy:

```bash
gcloud builds submit --config cloudbuild.yaml
```

5. Add Cloud Run URLs to Supabase Auth redirect allow list

## Project structure

```
sharif-lab/
├── frontend/          React hub
├── backend/           Node.js API
├── supabase/          SQL migrations
├── docker-compose.yml
└── cloudbuild.yaml
```
