# ODG Algeria — Digital Platform

National digital portal for Algeria’s youth institutions network (Office des Établissements des Jeunes — 69 wilayas). React + Vite SPA with Arabic RTL support and mock data (frontend-only demo).

See [docs/PROJECT_DESCRIPTION.md](docs/PROJECT_DESCRIPTION.md) for a full project overview.

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
cd odej-platform
npm install
npm run dev
```

Open http://localhost:5173

### AI assistant (Groq)

1. Copy `.env.example` to `.env` or `.env.local` and set `GROQ_API_KEY` from [Groq Console](https://console.groq.com).
2. **Local:** `npm run dev` — Vite serves `/api/chat` via dev middleware (key never exposed to the browser).
3. **Vercel:** add `GROQ_API_KEY` in Project → Settings → Environment Variables (Production and Preview), then redeploy. Serverless handlers live in `api/chat.ts` and `api/chat/health.ts`.
4. Use the floating chat button on public pages.

## Demo accounts

| Email | Password | Role |
|-------|----------|------|
| admin@odejbejaia.dz | admin123 | Admin |
| youth@odejbejaia.dz | youth123 | Youth user |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run typecheck` — TypeScript check

## Stack

- React 19, Vite 6, TypeScript
- Tailwind CSS v4, shadcn/ui
- Wouter (routing), TanStack Query
- react-i18next (Arabic / French / English / Kabyle)

## ECOHACK '26 deliverables (pitch docs)

| Document | Description |
|----------|-------------|
| [docs/ECOHACK_System_Architecture_and_Efficiency_Report.md](docs/ECOHACK_System_Architecture_and_Efficiency_Report.md) | Architecture, Supabase → private Postgres, AI chatbot, accuracy, maintainability |
| [docs/ECOHACK_Eco_Efficiency_Practices.md](docs/ECOHACK_Eco_Efficiency_Practices.md) | Green-tech checklist for the platform |
