# Development Roadmap

## 1. Roadmap Intent
This roadmap turns the BRD and PRD into an implementation sequence. It prioritizes product safety, trust integrity, and scalable foundations before feature expansion.

## 1.1 Canonical Environment Targets
- Production: https://www.aggarha.com
- Public API: https://api.aggarha.com
- Admin: https://admin.aggarha.com
- Development: https://dev.aggarha.com

## 2. Phase 1: Foundation
### Goals
- Establish product and system architecture
- Define the domain model and data architecture
- Define authentication, verification, trust, reputation, XP, and moderation rules
- Define search and API contracts
- Define security, scalability, and observability expectations

### Deliverables
- Architecture documentation suite
- Domain glossary
- Entity and event map
- API contract draft
- Trust and reputation rulebooks
- Moderation policy baseline

### Dependencies
- BRD and PRD only
- No implementation code required

## 3. Phase 2: Core Platform Build
### Goals
- Build identity and verification flows
- Build listings and discovery surfaces
- Build search and filtering
- Build chat and deal confirmation
- Build trust, reputation, and XP ledgers

### Critical order
1. Authentication and verification
2. Listings
3. Search indexing
4. Chat
5. Deal confirmation
6. Reputation and XP release
7. Basic moderation

## 4. Phase 3: Monetization and Operations
### Goals
- Launch reseller subscriptions
- Launch boosts and featured placement
- Add analytics dashboarding
- Add admin controls for monetization and trust review

### Notes
Monetization must never weaken trust ranking or safety rules. Paid visibility should remain bounded and transparent.

## 5. Phase 4: Growth Features
### Goals
- Recommendation engine
- Seasonal achievements
- Badge and frame unlocks
- Advanced fraud detection
- Vertical expansion into events and pro equipment

## 6. Phase 5: Multi-City Scale
### Goals
- Expand city coverage
- Tune search ranking by locality
- Localize policies and onboarding
- Improve operational automation and moderation capacity

## 7. Phase Gates
Each phase should advance only if:
- trust and reputation rules are stable
- search performance is acceptable
- moderation workflows are operational
- data retention and audit logging are complete
- legal positioning remains intact

## 8. Release Metrics
- Search latency and browse engagement
- Verification completion rate
- Confirmed deal rate
- Report and fraud rate
- Reseller conversion
- Retention by cohort

## 9. Cross-References
- Product foundation: [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md)
- System design: [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
- Data model: [DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md)
- Trust: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- XP: [XP_ENGINE.md](XP_ENGINE.md)
- Reputation: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- Search: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Security: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
- Admin: [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md)
