# Sharif Lab

Personal project portfolio hub. Owners manage case studies; visitors browse published work at `/u/:username`.

## Features

- **Auth**: register and login with username, email, and password (JWT)
- **Case studies**: problem, solution, users, use cases, tech stack, deploy info, diagrams, snapshot
- **Public hubs**: read-only `/u/:username` and `/u/:username/p/:slug`
- **Uploads**: snapshots and diagrams stored on the VPS under `./data/uploads`

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite, TypeScript, MUI, React Query |
| Backend | Node.js, Express, TypeScript, Drizzle ORM |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Deploy | Docker Compose on a VPS |

## Quick start (Docker Compose)

```bash
cp .env.example .env
# edit JWT_SECRET, POSTGRES_PASSWORD, CORS_ORIGINS, PUBLIC_API_URL

mkdir -p data/uploads
docker compose up -d --build
```

- Hub UI: http://localhost:8080
- API (direct): http://localhost:3001
- Migrations run automatically when the API starts
- Uploads persist in `./data/uploads` on the host

Put a reverse proxy (Caddy/nginx) in front for HTTPS if needed. Point `PUBLIC_API_URL` and `CORS_ORIGINS` at your public origin.

## Local development

### Prerequisites

- Node.js 20+
- Docker (for Postgres)

### 1. Database

```bash
docker compose up -d postgres
```

### 2. Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. API

```bash
cd backend
npm install
npm run dev
```

API: http://localhost:3001 (runs migrations on start)

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: http://localhost:5173

## API overview

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /health` | — | Health check |
| `POST /api/auth/register` | — | Create account |
| `POST /api/auth/login` | — | Login (email or username) |
| `GET /api/auth/me` | JWT | Current user |
| `GET/POST /api/projects` | JWT | List / create |
| `GET/PATCH/DELETE /api/projects/:id` | JWT + owner | Read / update / delete |
| `POST /api/projects/:id/thumbnail` | JWT + owner | Upload snapshot |
| `POST /api/projects/:id/diagrams` | JWT + owner | Upload diagram |
| `GET /api/public/u/:username` | — | Public hub |
| `GET /api/public/u/:username/p/:slug` | — | Public case study |

## Project structure

```
sharif-lab/
├── frontend/          React hub + public pages
├── backend/           Express API + Drizzle migrations
├── data/uploads/      VPS-persisted images (bind mount)
├── docker-compose.yml
└── .env.example
```
