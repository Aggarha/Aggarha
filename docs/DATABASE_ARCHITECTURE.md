# Database Architecture

## 1. Database Strategy
Aggarha should use a relational source of truth for users, listings, chat metadata, deals, reputation, XP, verification, and monetization. High-volume derived capabilities such as search, ranking, recommendations, and analytics should be offloaded to specialized stores or materialized views.

## 2. Core Design Principles
- Normalize canonical business entities.
- Store event timestamps for every trust-sensitive transition.
- Preserve auditability over destructive updates.
- Use soft deletion where regulatory and moderation needs require retention.
- Separate raw event history from current-state projections.

## 3. Core Entities
### Identity and profile
- users
- user_profiles
- sessions
- roles
- verification_states
- device_trust_records

### Commerce discovery
- categories
- listings
- listing_images
- listing_locations
- listing_tags
- saved_searches
- favorites

### Communication
- conversations
- conversation_participants
- messages
- message_reads
- message_flags

### Deal lifecycle
- deal_intents
- deal_confirmations
- deal_disputes
- deal_audit_events

### Reputation and growth
- reviews
- reputation_snapshots
- trust_score_snapshots
- xp_ledger
- level_history
- badges
- unlockables

### Monetization
- subscriptions
- subscription_entitlements
- boost_purchases
- featured_slots
- ad_placements
- invoices_or_billing_refs if later needed for reseller accounting only, not payments

### Safety and governance
- reports
- moderation_cases
- sanctions
- fraud_signals
- audit_log

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
