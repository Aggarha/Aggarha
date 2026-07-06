# Feature Breakdown

## 1. Platform Layers
### Discovery
Search, listing browse, categories, maps/radius, featured placements, trust-aware ranking, saved searches, and recommendations.

### Identity
Authentication, verification, roles, device trust, session management, and account recovery.

### Communication
One-to-one chat, listing inquiries, offer negotiation, media attachments, and moderation hooks.

### Trust and Progression
Reputation, trust score, XP, level progression, badges, profile frames, and unlockables.

### Monetization
Reseller subscription, boosts, featured trader placement, paid verification, and ad inventory.

### Governance
Reports, moderation queue, sanctions, and fraud controls.

## 2. Core Feature Set
### Listings
- Create, edit, pause, archive, and relist
- Modes: Rent, Swap, Both
- Media gallery and metadata
- Location and availability

### Search
- Keyword search
- Category filters
- Distance radius
- Trust score sorting
- Verification filter
- Level filter
- Price or value guidance filters if allowed by policy

### Chat
- Direct messaging
- Thread per listing and per user pair
- Read state and unread counts
- Report message and block user

### Deal Confirmation
- Dual confirmation
- Deal completion timestamp
- XP and reputation unlock only after consensus
- Dispute escalation path

### Reputation
- 1–5 star ratings
- Written reviews
- Completion rate
- Response speed
- Reliability signals

### XP and Levels
- Earn XP from confirmed deals and positive trust behaviors
- Level unlocks for cosmetics and priority boosts
- Seasonal achievements and streaks

### Verification
- Mandatory phone verification
- Email verification
- Optional ID verification
- Verified badge and ranking impact

### Reseller Plan
- Monthly subscription
- Higher exposure
- Featured profile styling
- Monthly boost credits
- Analytics dashboard
- XP multiplier

### Moderation
- Listing review
- User reports
- Fraud signals
- Manual sanctions
- Appeals handling

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
