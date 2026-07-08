# API Architecture

> **Implementation status: Partial.** This document describes the target API (versioned, resource-oriented, separate `api.aggarha.com` origin). The current implementation is a set of unversioned Next.js route handlers under `src/app/api/**`, served from the same origin as the web app — see §9 for the as-implemented route list. No authentication/authorization is enforced on any route today, no event bus exists, and no error-envelope convention is applied yet.

## 1. API Principles
Aggarha's API should be versioned, resource-oriented, and designed around the platform's domain boundaries. The API must support future split services while keeping current implementation simple.

## 1.1 Canonical API Surface
- Public API base URL: https://api.aggarha.com
- Public web origin: https://www.aggarha.com
- Admin origin: https://admin.aggarha.com
- Development origin: https://dev.aggarha.com

## 2. API Style
- REST-style public API for core operations
- WebSocket or realtime channel for chat and presence
- Event-driven internal interfaces for trust, XP, search, and notifications
- Consistent error envelope and idempotency support

## 3. Resource Groups
### Identity
- Authentication and sessions
- Verification
- Roles and profile state

### Listings
- Create, update, archive, promote, and browse listings
- Manage images and location metadata

### Search
- Query listings and profiles
- Filter, sort, and paginate

### Chat
- Conversations
- Messages
- Read states
- Flags and blocks

### Deals
- Deal intent creation
- Confirmation requests
- Mutual confirmations
- Dispute markers

### Reputation
- Reviews
- Ratings
- Reputation summaries
- Trust score summaries

### XP and levels
- XP ledger access
- Level summaries
- Unlockable inventory

### Monetization
- Subscription plans
- Entitlements
- Boost credits
- Featured placement inventory

### Moderation
- Reports
- Cases
- Sanctions
- Review queues

## 4. Required API Properties
- Authentication for private actions
- Authorization based on role and ownership
- Idempotency keys for confirmation and moderation actions
- Pagination for list endpoints
- Filtering and sorting for search endpoints
- Rate limiting and abuse protection

## 5. Domain Event API
The backend should emit events after write operations instead of coupling downstream logic directly.
Important events include:
- listing.created
- listing.updated
- message.sent
- deal.confirmed
- review.created
- trust.recalculated
- xp.awarded
- report.created
- sanction.applied

## 6. Versioning Strategy
- Public API versioning should be explicit.
- Breaking changes require new version namespaces.
- Internal event contracts should include schema versioning.

## 7. Error Handling
Errors should be stable and machine-readable. Suggested categories:
- validation_error
- unauthorized
- forbidden
- not_found
- conflict
- rate_limited
- moderation_blocked
- fraud_suspected
- verification_required

## 8. Cross-References
- Data model: [DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md)
- Search: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Security: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
- User flows: [USER_JOURNEYS.md](USER_JOURNEYS.md)

## 9. As-Implemented Routes (current)

All routes below live under `src/app/api/` in the Next.js app, same origin as the web frontend — **Implemented**, none of the target properties in §4–§7 (auth, idempotency, versioning, error envelope) apply yet:

| Route | Method | Purpose |
|---|---|---|
| `/api/marketplace/home` | GET | Home feed data for the marketplace landing page |
| `/api/marketplace/search` | GET | Listing search/filter, backed by `src/lib/marketplace/query.ts` |
| `/api/marketplace/listings/[id]` | GET | Single listing detail, including availability and bookings |
| `/api/ai/brain` | GET | Aggregated AI Brain snapshot (feed, recommendations, market, nearby, dashboard) |
| `/api/ai/dashboard` | GET | AI dashboard insight only |
| `/api/ai/search` | GET | AI-assisted search intelligence |
| `/api/ai/listing-assistant` | POST | Generates a listing draft (title/description/pricing suggestions) |
| `/api/ai/image-analyzer` | POST | Heuristic image caption/quality analysis |
| `/api/ai/listings/[id]/intelligence` | GET | Trust/fraud/pricing intelligence for one listing |
| `/api/health/db` | GET | Database connectivity health check |

All AI routes are documented in full in [AI_BRAIN_ARCHITECTURE.md](AI_BRAIN_ARCHITECTURE.md). Identity, chat, deal, reputation, XP, monetization, and moderation resource groups from §3 have **no implemented routes** — **Planned**.
