# Aggarha

Aggarha is a reputation-based rental and swap marketplace. This repository currently implements the discovery experience (browse, search, listing detail), a premium design system, a database/auth foundation, and a heuristic AI intelligence layer. See [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md) for the full documentation index and implementation status.

## Stack
- Next.js 16 (App Router), React 19, TypeScript
- PostgreSQL via Prisma ORM
- Zod for validation
- Tailwind CSS
- ESLint + Prettier
- PWA support
- Docker build/runtime

## What's implemented
- Marketplace discovery: home feed, search/filter, listing detail (`src/app/marketplace`, `src/app/api/marketplace`)
- Premium design system: 26-component UI library (`src/components/premium/system.tsx`, see [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md))
- AI Brain: heuristic pricing/trust/fraud/search/recommendation engines (`src/lib/ai`, see [docs/AI_BRAIN_ARCHITECTURE.md](docs/AI_BRAIN_ARCHITECTURE.md))
- Database + session primitives: PostgreSQL schema via Prisma, session issuance (`prisma/schema.prisma`, `src/lib/auth/session.ts`)

Not yet implemented: sign-up/login UI, chat, deal confirmation flow, XP/trust award logic, monetization, admin console. Full status: [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md).

## Environment
Copy `.env.local.example` to `.env.local` for local development. Requires a running PostgreSQL instance matching `DATABASE_URL` (see `docker-compose.yml`).

## Commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run format:check`
- `npm run db:generate` / `npm run db:migrate` / `npm run db:seed`

## Documentation
Full documentation hierarchy: [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md).
