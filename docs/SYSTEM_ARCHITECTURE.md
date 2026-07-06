# System Architecture

## 1. Architecture Summary
Aggarha should use a modular service-oriented architecture with a clear separation between the public discovery experience, the trust/reputation domain, communication services, monetization services, moderation, and analytics. The initial deployment can start as a modular monolith, but each module must be designed as if it can later be split into independently deployable services.

## 1.1 Canonical Runtime Endpoints
- Public web application: https://www.aggarha.com
- Public API: https://api.aggarha.com
- Admin console: https://admin.aggarha.com
- Development environment: https://dev.aggarha.com

## 2. Core Runtime Domains
- Identity and access
- Listings and catalog
- Search and ranking
- Chat and messaging
- Deal confirmation
- Reputation, trust, XP, and levels
- Verification
- Subscription and monetization
- Moderation and fraud detection
- Notifications
- Analytics and event processing

## 3. Recommended Logical Topology
### Client tier
Web frontend for discovery, profile management, chat, and admin surfaces.

### API tier
A stateless backend API handling authentication, listing CRUD, search queries, reputation actions, chat orchestration, and moderation workflows.

### Async processing tier
Workers for notifications, fraud scoring, trust recalculation, search indexing, XP awarding, image processing, and scheduled tasks.

### Data tier
Primary relational database, cache, search index, object storage, and event log/stream.

## 4. Service Boundaries
### Identity Service
Manages sign-in, sessions, verification state, roles, device trust, and recovery flows.

### Listing Service
Owns item metadata, images, locations, modes, and lifecycle states.

### Search Service
Indexes listings and users, supports filters, ranking, and retrieval.

### Chat Service
Owns conversation metadata, message history, unread state, and moderation hooks.

### Deal Service
Owns confirmation workflows, timestamps, confirmation states, and no-XP-without-confirmation rules.

### Trust Service
Computes trust score and verification-linked signals. See [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md).

### Reputation Service
Manages stars, reviews, completion rate, response speed, abuse signals, and reputation snapshots. See [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md).

### XP Service
Issues XP on validated events only. See [XP_ENGINE.md](XP_ENGINE.md).

### Monetization Service
Manages plans, entitlements, boosts, featured slots, and ad inventory.

### Moderation Service
Handles reports, flags, review queues, appeals, and sanctions.

## 5. Event-Driven Backbone
Aggarha should emit domain events such as:
- user.verified
- listing.created
- listing.promoted
- message.sent
- deal.confirmed
- review.created
- trust.recalculated
- xp.awarded
- fraud.flagged
- subscription.renewed

Events allow independent scaling of trust, analytics, recommendations, and notifications.

## 6. Consistency Model
- Strong consistency for authentication, deal confirmation, and moderation actions.
- Eventual consistency for search indexing, recommendations, analytics, and notification delivery.
- Idempotent writes for all user-triggered actions that may be retried.

## 7. Deployment View
- Public frontend at https://www.aggarha.com
- Public API backend at https://api.aggarha.com
- Admin console at https://admin.aggarha.com
- Development/staging surface at https://dev.aggarha.com
- Worker pool
- Search cluster
- Relational database
- Redis or equivalent cache
- Object storage for media
- Observability stack for logs, metrics, traces

## 8. Critical Non-Functional Requirements
- Horizontal scaling for read-heavy discovery traffic
- Backpressure for chat and notifications
- Zero-downtime deploys
- Rate limiting and abuse controls
- Encryption at rest and in transit
- Auditability for all trust-sensitive actions

## 9. Cross-References
- Product scope: [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md)
- Data model: [DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md)
- API contract: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
- Security: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
- Scalability: [SCALABILITY_PLAN.md](SCALABILITY_PLAN.md)
