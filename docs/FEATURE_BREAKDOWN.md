# Feature Breakdown

> **Implementation status legend:** Implemented = live and reachable via the app/API today. Partial = data model and/or backend logic exists but the end-to-end flow does not. Planned = neither exists. Full cross-domain table: [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md).

## 1. Platform Layers
### Discovery — **Partial**
Search, listing browse, categories, maps/radius, featured placements, trust-aware ranking, saved searches, and recommendations. Implemented: search, browse, categories, saved searches (data model), AI recommendation heuristics. Planned: real map/radius UI, live featured-placement ranking.

### Identity — **Partial**
Authentication, verification, roles, device trust, session management, and account recovery. Implemented: session issuance/lookup/revocation, role/verification-level schema fields. Planned: sign-up/login UI, device trust, account recovery.

### Communication — **Planned**
One-to-one chat, listing inquiries, offer negotiation, media attachments, and moderation hooks. Nothing implemented.

### Trust and Progression — **Partial**
Reputation, trust score, XP, level progression, badges, profile frames, and unlockables. Implemented: trust/XP/level scalar fields, review schema, heuristic trust/fraud scoring (AI Brain). Planned: badges, frames, unlockables, ledger-based XP/trust history.

### Monetization
Reseller subscription, boosts, featured trader placement, paid verification, and ad inventory.

### Governance
Reports, moderation queue, sanctions, and fraud controls.

## 2. Core Feature Set
### Listings — **Partial**
- Create, edit, pause, archive, and relist — **Planned** (no write API/UI; seed data only)
- Modes: Rent, Swap, Both — **Implemented** (`ListingMode` enum, filterable)
- Media gallery and metadata — **Partial** (single `imageUrl` field, not a gallery)
- Location and availability — **Implemented** (`Location`, `AvailabilityRule`, `AvailabilityDate`)

### Search — **Partial**
- Keyword search — **Implemented**
- Category filters — **Implemented**
- Distance radius — **Planned** (no geo/radius query yet)
- Trust score sorting — **Implemented**
- Verification filter — **Partial** (schema supports it; not confirmed wired into query API)
- Level filter — **Implemented** (`SavedSearch.minLevel`, query filters)
- Price or value guidance filters — **Implemented** (min/max price)

### Chat — **Planned**
Nothing implemented (no schema, routes, or UI).

### Deal Confirmation — **Partial**
- Dual confirmation — **Partial** (`Deal.ownerConfirmedAt`/`renterConfirmedAt` fields exist; no API to set them)
- Deal completion timestamp — **Partial** (`Deal.completedAt` field exists)
- XP and reputation unlock only after consensus — **Planned** (no enforcement logic)
- Dispute escalation path — **Planned**

### Reputation — **Partial**
- 1–5 star ratings — **Partial** (`Review.rating` field exists; no write API)
- Written reviews — **Partial** (`Review.comment` field exists; no write API)
- Completion rate — **Partial** (`Profile.completionRate` field exists; not computed by any job)
- Response speed — **Partial** (`User.responseSpeedMinutes` field exists; not computed)
- Reliability signals — **Planned**

### XP and Levels — **Partial**
- Earn XP from confirmed deals and positive trust behaviors — **Planned** (no award logic)
- Level unlocks for cosmetics and priority boosts — **Planned**
- Seasonal achievements and streaks — **Planned**

### Verification — **Partial**
- Mandatory phone verification — **Planned** (no verification flow; `phoneVerifiedAt` field only)
- Email verification — **Planned** (`emailVerifiedAt` field only)
- Optional ID verification — **Planned** (`idVerifiedAt` field only)
- Verified badge and ranking impact — **Partial** (`VerificationBadgePill` UI component exists; ranking impact not confirmed)

### Reseller Plan — **Planned**
No subscription schema or code exists.

### Moderation — **Partial**
- Listing review — **Planned**
- User reports — **Partial** (`FraudReport` model; no UI)
- Fraud signals — **Implemented** (heuristic scoring in AI risk-engine; see [AI_BRAIN_ARCHITECTURE.md](AI_BRAIN_ARCHITECTURE.md))
- Manual sanctions — **Planned**
- Appeals handling — **Planned**

## 3. Feature Priority
### Phase 1
- Identity and verification
- Listings
- Search and discovery
- Chat
- Deal confirmation
- Reputation, trust, XP
- Basic moderation

### Phase 2
- Reseller subscriptions
- Boosts and featured slots
- Analytics
- Recommendations
- Expanded moderation tooling

### Phase 3
- Advanced anti-fraud
- Vertical expansion into events and pro equipment
- Deeper personalization
- Community status systems

## 4. Feature Interactions
- A verified account should discover more relevant results.
- A completed deal should affect reputation, trust, and XP simultaneously.
- Subscription should not override trust; it can only boost visibility within policy limits.
- Moderation should be able to suppress visibility without deleting evidence.

## 5. Cross-References
- User flows: [USER_JOURNEYS.md](USER_JOURNEYS.md)
- Trust: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- Reputation: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- XP: [XP_ENGINE.md](XP_ENGINE.md)
- Search: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Admin: [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md)
