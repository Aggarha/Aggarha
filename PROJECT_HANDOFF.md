# Project Handoff — Master Documentation Index

This file is the canonical entry point into Aggarha's documentation. Start here.

## 1. How the Documentation Is Organized

| Location | Purpose |
|---|---|
| `README.md` | Repo root: what the project is, stack, commands, quick status |
| `CHANGELOG.md` | Root: dated log of what shipped |
| `PROJECT_STATUS.md` | Root: current phase and immediate next steps |
| `PROJECT_HANDOFF.md` (this file) | Root: master index + cross-domain implementation status |
| `RECOVERY.md` | Root: operational rollback notes (placeholder, not yet populated) |
| `docs/` | Architecture and domain specifications (target design + current implementation status per file) |

Every file under `docs/` follows the same convention: an **Implementation status** callout directly under the title, stating whether the domain is **Implemented**, **Partial**, or **Planned**, followed by the original target-state specification. Do not delete the target-state content when it hasn't been built yet — it documents an intentional business decision, not a mistake.

## 2. Documentation Hierarchy (`docs/`)

### Product & Planning
- [PRODUCT_ARCHITECTURE.md](docs/PRODUCT_ARCHITECTURE.md) — product definition, scope, personas
- [DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) — full phased roadmap
- [ROADMAP.md](docs/ROADMAP.md) — short-form roadmap summary (moved from repo root)
- [FEATURE_BREAKDOWN.md](docs/FEATURE_BREAKDOWN.md) — feature-by-feature status
- [USER_JOURNEYS.md](docs/USER_JOURNEYS.md) — end-to-end user flows

### System & Data
- [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) — runtime topology and service boundaries (absorbed the former root `ARCHITECTURE.md`)
- [DATABASE_ARCHITECTURE.md](docs/DATABASE_ARCHITECTURE.md) — data model, target vs. as-implemented schema
- [API_ARCHITECTURE.md](docs/API_ARCHITECTURE.md) — API design principles and as-implemented route list
- [AI_BRAIN_ARCHITECTURE.md](docs/AI_BRAIN_ARCHITECTURE.md) — heuristic AI engine layer (new)
- [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — premium UI component library (new)
- [SEARCH_ARCHITECTURE.md](docs/SEARCH_ARCHITECTURE.md) — search/ranking design
- [SCALABILITY_PLAN.md](docs/SCALABILITY_PLAN.md) — scaling strategy

### Trust, Reputation & Governance
- [TRUST_SCORE_ENGINE.md](docs/TRUST_SCORE_ENGINE.md)
- [REPUTATION_SYSTEM.md](docs/REPUTATION_SYSTEM.md)
- [XP_ENGINE.md](docs/XP_ENGINE.md)
- [SECURITY_ARCHITECTURE.md](docs/SECURITY_ARCHITECTURE.md)
- [ADMIN_ARCHITECTURE.md](docs/ADMIN_ARCHITECTURE.md)

## 3. Cross-Domain Implementation Status

Legend: **Implemented** = live and reachable today · **Partial** = data model and/or logic exists, end-to-end flow does not · **Planned** = neither exists.

| Domain | Status | Notes |
|---|---|---|
| Marketplace discovery (browse/search/detail) | **Implemented** | `src/app/marketplace`, `src/app/api/marketplace/**` |
| Premium design system | **Implemented** | `src/components/premium/system.tsx`, 26 components |
| AI Brain (pricing/trust/fraud/search/recommendation heuristics) | **Implemented** | `src/lib/ai/**`, `src/app/api/ai/**`; LLM provider layer is placeholder-only |
| Database schema (PostgreSQL/Prisma) | **Implemented** | `prisma/schema.prisma`, 21 models |
| Session management | **Partial** | `src/lib/auth/session.ts` issues/reads/revokes sessions; no sign-up/login route or UI |
| Authentication (sign-up/login) | **Planned** | No route or page exists |
| Verification (phone/email/ID) | **Planned** | Schema fields exist; no verification flow |
| Listing create/edit | **Planned** | Browse/search/detail only; no write path |
| Rental availability & booking | **Partial** | Schema + read/display implemented; no booking-creation API |
| Deal confirmation | **Partial** | `Deal` model with status/timestamps; no confirmation API |
| Reviews / reputation | **Partial** | `Review` + `Profile` aggregate fields exist; no write API, no anti-abuse logic |
| Trust score | **Partial** | Stored scalar + AI heuristic scorer (`risk-engine.ts`); not the ledger/weighted-composition model in the target doc |
| XP / levels | **Partial** | Scalar fields on `User`/`Deal`/`Review`; no award/timing logic |
| Chat / messaging | **Planned** | No schema, routes, or UI |
| Monetization / subscriptions | **Planned** | No schema or code |
| Moderation / fraud console | **Partial** | `FraudReport`, `DuplicateListingSignal`, `SuspiciousUserSignal`, `RateLimitEvent` models + AI risk heuristics exist; no console/UI |
| Admin application | **Planned** | No `src/app/admin` or equivalent |
| Notifications | **Planned** | No schema or code |

## 4. Business Decisions Preserved

The following decisions from the original architecture suite remain in force and were not altered by this documentation refactor:
- No payments, escrow, or custody of funds/goods (see [PRODUCT_ARCHITECTURE.md](docs/PRODUCT_ARCHITECTURE.md) §3).
- XP and reputation must only be released after mutual deal confirmation (see [XP_ENGINE.md](docs/XP_ENGINE.md) §4, [FEATURE_BREAKDOWN.md](docs/FEATURE_BREAKDOWN.md)) — not yet enforced in code because deal confirmation itself is not yet implemented, but the rule stands as the target behavior for when it is.
- Trust and reputation must remain distinct from paid visibility ("no pay-to-win") — see [TRUST_SCORE_ENGINE.md](docs/TRUST_SCORE_ENGINE.md) §6.

## 5. Related Root Files
- [README.md](README.md) — quick start
- [CHANGELOG.md](CHANGELOG.md) — dated history
- [PROJECT_STATUS.md](PROJECT_STATUS.md) — current phase
- [RECOVERY.md](RECOVERY.md) — operational rollback notes
- [CLAUDE.md](CLAUDE.md) — operating rules for AI-assisted work in this repo
