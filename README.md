# Sharif Lab

## Project description

Sharif Lab is a personal project portfolio hub. Owners write structured case studies for their work; visitors browse published projects at a public username URL. The stack is React (Vite, TypeScript, MUI) on the frontend, Express and Drizzle on the backend, and PostgreSQL for data. Deploy with Docker Compose on a VPS.

## Problem statement

Builders ship real projects, but explaining them well is hard. A GitHub repo or a one-line link dump does not capture the problem, audience, tradeoffs, stack, or how it was deployed. Portfolio sites often force a generic template or leave case studies as unstructured blobs that visitors cannot scan.

## How the project solves the problem

Owners register, then create and edit projects in a private dashboard. Each project is a case study with problem, solution, target users, use cases, tech stack, deploy details, status, diagrams, and an optional snapshot. Publishing makes the work available on a public hub (`/u/:username`) and a per-project page (`/u/:username/p/:slug`) so visitors can read the story without logging in.

## Target user

- Developers and indie builders who want a shareable case-study hub under their username
- Anyone who prefers structured project write-ups (problem → solution → stack → deploy) over a flat project list

## Use case

1. You finish a side project and want a public page that explains what it solves, who it is for, and how it runs.
2. You keep several projects in one place, mark some WIP or archived, and only publish the ones ready for a portfolio link.
3. A hiring manager or collaborator opens `/u/yourname`, browses cards, and opens a full case study with diagrams and links to the live site or GitHub.
4. You self-host on a VPS with Docker Compose so uploads and the database stay on your machine.

## Key features

- Register and log in with username, email, and password (JWT)
- Private project dashboard: create, edit, delete, and publish case studies
- Case study fields: problem, solution, target users, use cases, key features, lessons learned, role, timeline
- Tech stack tags, status (`wip` / `live` / `archived`), website / GitHub / demo URLs
- Deploy location and platform notes
- Snapshot (thumbnail) and titled diagram image uploads
- Public hub at `/u/:username` and public case study at `/u/:username/p/:slug`
- Light/dark theme in the owner UI
- Docker Compose deploy with Postgres, API, and nginx-served frontend; uploads under `./data/uploads`

## How to pull and run the code

### Prerequisites

- Git
- Docker and Docker Compose (recommended), **or** Node.js 20+ for local API/UI development

### Clone

```bash
git clone <your-repo-url> sharif-lab
cd sharif-lab
```

### Option A: Docker Compose (full stack)

```bash
cp .env.example .env
# Edit JWT_SECRET, POSTGRES_PASSWORD, CORS_ORIGINS, and PUBLIC_API_URL

mkdir -p data/uploads
docker compose up -d --build
```

- Hub UI: http://localhost:8080
- API (direct): http://localhost:3001
- Migrations run when the API starts
- Uploads persist in `./data/uploads` on the host

For a public VPS, put a reverse proxy (Caddy/nginx) in front for HTTPS and set `PUBLIC_API_URL` and `CORS_ORIGINS` to your public origin.

### Option B: Local development

**1. Database**

```bash
docker compose up -d postgres
```

**2. Environment**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**3. API**

```bash
cd backend
npm install
npm run dev
```

API: http://localhost:3001 (runs migrations on start)

**4. Frontend**

```bash
cd frontend
npm install
npm run dev
```

UI: http://localhost:5173

### Project layout

```
sharif-lab/
├── frontend/          React hub + public pages
├── backend/           Express API + Drizzle migrations
├── data/uploads/      Persisted images (bind mount in Compose)
├── docker-compose.yml
└── .env.example
```
