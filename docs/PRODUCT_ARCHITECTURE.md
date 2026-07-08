# Product Architecture

> **Implementation status: Partial.** Discovery (browse/search/listing detail) and a premium visual design system are implemented, backed by a real PostgreSQL schema and an AI heuristics layer. Chat, deal confirmation, monetization, and moderation — all named in-scope below — are not yet built. See [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md) for the full cross-domain status table.

## 1. Product Definition
Aggarha is a reputation-based rental and swap discovery platform. It helps people find, evaluate, and contact other users to arrange rentals or swaps outside the platform. Aggarha is not a payment processor, not a contractual party, and not a custody layer for goods or funds.

## 1.1 Canonical URLs
- Production: https://www.aggarha.com
- API: https://api.aggarha.com
- Admin: https://admin.aggarha.com
- Development: https://dev.aggarha.com

## 2. Product Principles
- Discovery first: the product exists to help users find items, people, and opportunities quickly.
- Trust first: reputation, verification, and deal confirmation shape ranking and visibility.
- Minimal liability: no payments, no escrow, no ownership transfer, no contract enforcement.
- Premium interaction: the UX should feel curated, fast, and highly responsive, inspired by Airbnb, Apple, Stripe, Discord, and Steam.
- Modular growth: every capability must be independently scalable and replaceable.

## 3. Business Scope
### In scope
- Listings for Rent, Swap, or Both
- Search, filters, and ranking
- User profiles, verification, reputation, XP, and levels
- In-app chat and negotiation
- Mutual deal confirmation
- Boosts, featured placement, and reseller subscriptions
- Moderation, reporting, and fraud monitoring

### Out of scope
- Payments or escrow
- Shipping label generation
- Legal contract execution
- Product custody or dispute arbitration
- Logistics orchestration beyond discovery and communication

## 4. Primary Personas
- Regular user: lists items, searches, chats, confirms deals, and builds reputation.
- Reseller: pays for higher visibility, analytics, boosts, and search priority.
- Moderator: reviews reports, flags, disputes, and abuse patterns.
- Admin: oversees monetization, policy, trust systems, and platform health.

## 5. Product Modules
### Discovery Layer
Listing creation, search, category pages, map/radius search, trust-aware ranking, recommended results, and featured slots.

### Trust Layer
Phone verification, email verification, optional ID verification, seller badges, trust score, level progression, repeat-deal protection, and anti-fraud signals. See [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md), [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md), and [XP_ENGINE.md](XP_ENGINE.md).

### Communication Layer
Direct chat, listing inquiries, negotiation threads, read receipts, and deal confirmation prompts. See [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) and [API_ARCHITECTURE.md](API_ARCHITECTURE.md).

### Monetization Layer
Monthly reseller subscriptions, listing boosts, featured trader slots, paid verification, and promotional placements.

### Governance Layer
Moderation queues, fraud monitoring, user reporting, audit logs, and admin tooling. See [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md) and [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md).

## 6. Experience Model
Aggarha should feel like a premium marketplace directory rather than a classifieds board. The interface language should emphasize:
- curated cards
- high-quality imagery
- strong whitespace
- confidence indicators
- elegant motion
- low-friction decision making

## 7. Success Model
The product is successful when it grows:
- active listings
- confirmed deals
- repeat usage
- trust scores
- reseller conversion
- retention in a single city before expansion

## 8. Architectural Cross-References
- System design: [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
- Data model: [DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md)
- APIs: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
- User flows: [USER_JOURNEYS.md](USER_JOURNEYS.md)
- Search: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Trust and reputation: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md), [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md), [XP_ENGINE.md](XP_ENGINE.md)
