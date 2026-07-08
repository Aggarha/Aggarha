# Database Architecture

> **Implementation status: Partial.** `prisma/schema.prisma` implements a real subset of the model below on PostgreSQL, plus a Rental Availability & Booking domain and a Trust/Fraud-signal domain that this document did not originally describe (added in §3.1). Conversation, reputation-ledger, XP-ledger, and monetization tables are not yet implemented — those fields exist only as scalar columns on `User`/`Deal`/`Review` (see §3.1), not as the ledger/snapshot tables described in §3–§4. See [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md) for the cross-domain status table.

## 1. Database Strategy
Aggarha should use a relational source of truth for users, listings, chat metadata, deals, reputation, XP, verification, and monetization. High-volume derived capabilities such as search, ranking, recommendations, and analytics should be offloaded to specialized stores or materialized views.

## 2. Core Design Principles
- Normalize canonical business entities.
- Store event timestamps for every trust-sensitive transition.
- Preserve auditability over destructive updates.
- Use soft deletion where regulatory and moderation needs require retention.
- Separate raw event history from current-state projections.

## 3. Core Entities (target model)

Status tags reflect whether the concept exists in `prisma/schema.prisma` today. See §3.1 for the exact implemented model, which uses different names/shapes than this conceptual list in several places.

### Identity and profile
- users — **Implemented** (`User`)
- user_profiles — **Implemented** (`Profile`)
- sessions — **Implemented** (`Session`, plus `Account`/`VerificationToken` for OAuth-style auth, unused by any route today)
- roles — **Implemented** as an enum field (`User.role`), not a separate table
- verification_states — **Implemented** as enum + timestamp fields on `User`, not a separate table
- device_trust_records — **Planned**

### Commerce discovery
- categories — **Implemented** (`Category`, self-referential tree)
- listings — **Implemented** (`Listing`)
- listing_images — **Planned** (`Listing.imageUrl` is a single scalar field today, not a gallery table)
- listing_locations — **Implemented** (`Location`)
- listing_tags — **Planned**
- saved_searches — **Implemented** (`SavedSearch`)
- favorites — **Implemented** (`Favorite`, plus `SavedListing` and `RecentlyViewed`)

### Communication
- conversations — **Planned**
- conversation_participants — **Planned**
- messages — **Planned**
- message_reads — **Planned**
- message_flags — **Planned**

### Deal lifecycle
- deal_intents / deal_confirmations — **Partial** (`Deal` model has status + confirmation timestamps; no API/UI exercises it yet)
- deal_disputes — **Partial** (`Deal.disputedAt` field exists; no dispute workflow)
- deal_audit_events — **Planned**

### Rental availability and booking *(implemented, not originally in this document — see §3.1)*
- `AvailabilityRule`, `AvailabilityDate`, `Booking` — **Implemented** (read/display on listing detail page; no booking-creation API yet)

### Reputation and growth
- reviews — **Implemented** (`Review`, with `rating`, `comment`, `trustImpact`, `xpImpact` fields)
- reputation_snapshots — **Planned** (no snapshot table; `Profile` holds running aggregate fields instead)
- trust_score_snapshots — **Partial** (`User.trustScore`/`trustTier` and `Listing.trustScoreSnapshot` are scalar fields, not an append-only snapshot ledger)
- xp_ledger — **Partial** (`User.xp`/`level` are scalar fields; no ledger of individual XP events)
- level_history — **Planned**
- badges / unlockables — **Planned**

### Monetization
- subscriptions — **Planned**
- subscription_entitlements — **Planned**
- boost_purchases — **Planned** (`Listing.boostedUntil`/`featuredUntil` scalar fields exist as a placeholder, no purchase/entitlement flow)
- featured_slots — **Partial** (`Listing.featuredUntil` field only)
- ad_placements — **Planned**
- invoices_or_billing_refs — **Planned**

### Safety and governance
- reports — **Partial** (`FraudReport` implements user/listing reporting; no general content-report table)
- moderation_cases / sanctions — **Planned**
- fraud_signals — **Implemented** (`FraudReport`, `DuplicateListingSignal`, `SuspiciousUserSignal`, `RateLimitEvent` — data layer only, no moderation console consumes them yet)
- audit_log — **Planned**

## 3.1 As-Implemented Schema (current)

The actual Prisma models today, for reference against the target model above:

`User`, `Profile`, `Category`, `Location`, `Listing`, `AvailabilityRule`, `AvailabilityDate`, `Booking`, `Deal`, `Review`, `Favorite`, `SavedListing`, `SavedSearch`, `RecentlyViewed`, `FraudReport`, `DuplicateListingSignal`, `SuspiciousUserSignal`, `RateLimitEvent`, `Account`, `Session`, `VerificationToken`.

Notable implementation details not covered by the target model:
- Trust, XP, level, response-rate, and cancellation-rate are **scalar columns on `User`** (`trustScore`, `trustTier`, `xp`, `level`, `responseRate`, `responseSpeedMinutes`, `cancellationRate`, `accountAgeDays`, `fraudReportsCount`, `aiFraudScore`), not the ledger/snapshot tables in §3. This means current values are directly mutable rather than derived from a replayable event history — the auditability goal in §2 is not yet met for these fields.
- `Account`/`Session`/`VerificationToken` follow a NextAuth-style shape but no NextAuth (or any auth route/UI) is wired up yet — only `src/lib/auth/session.ts` reads/writes `Session` directly.
- Rental availability and booking (`AvailabilityRule`, `AvailabilityDate`, `Booking`) is a full domain not mentioned anywhere in the original target model; it backs the listing detail page's availability calendar and booking-pipeline stats.

## 4. Suggested Data Patterns
### Event ledger tables
Use append-only ledgers for XP, trust changes, moderation actions, and confirmations.

### Snapshot tables
Store current reputation and trust scores as snapshots for fast reads, derived from ledgers.

### Projection tables
Materialize search, recommendations, and analytics dimensions for performance.

## 5. Indexing Strategy
- Users: unique indexes on phone, email, and public handle
- Listings: composite indexes on category, city, status, freshness, trust tier, and featured state
- Messages: indexes on conversation and created_at
- Deals and reviews: indexes on participants and status
- Reports and sanctions: indexes on moderation status and severity

## 6. Integrity Rules
- One verified phone per active account.
- One active conversation thread per user pair per listing or negotiated context, if desired by product policy.
- One confirmation event per deal participant unless a correction workflow exists.
- XP adjustments must reference a source event.
- Reputation changes must reference a completed, eligible deal.

## 7. Scaling Considerations
- Partition high-write ledgers by time or tenant/city when needed.
- Archive old message bodies or media references separately if volume becomes large.
- Use read replicas for discovery-heavy traffic.
- Keep mutable state small and authoritative.

## 8. Cross-References
- Backend APIs: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
- Search indexes: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- XP rules: [XP_ENGINE.md](XP_ENGINE.md)
- Trust rules: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- Reputation rules: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
