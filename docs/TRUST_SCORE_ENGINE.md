# Trust Score Engine

## 1. Purpose
The trust score is the platform's primary credibility signal. It should rank users and listings based on a blend of verification, historical deal quality, responsiveness, completion behavior, and fraud risk.

## 2. Design Goals
- Reward reliable behavior.
- Penalize suspicious or abandoned behavior.
- Remain explainable to users and moderators.
- Be resilient to gaming and collusion.
- Update quickly enough to influence search and discovery.

## 3. Inputs
### Identity and verification
- Phone verification status
- Email verification status
- Optional ID verification status
- Account age
- Device trust

### Behavioral signals
- Deal completion rate
- Mutual confirmations
- Response speed
- Cancel/abandon frequency
- Listing quality and freshness
- Report volume and report outcomes

### Reputation signals
- Average star rating
- Review sentiment
- Repeated counterparty satisfaction
- Dispute rate

### Risk signals
- Repeated deals with same counterparties
- Suspicious location patterns
- Rapid profile changes
- Report clusters
- Device/account link analysis

## 4. Score Model
Use a normalized score in the range 0 to 100.

Suggested composition:
- Verification: 20%
- Completion behavior: 25%
- Reputation quality: 20%
- Responsiveness: 10%
- Account maturity: 5%
- Risk penalty: 20%

The score should be recalculated asynchronously after important events and also on a periodic schedule.

## 5. Trust Tiers
- Tier 0: New or unverified
- Tier 1: Basic verified
- Tier 2: Active and reliable
- Tier 3: Strong track record
- Tier 4: Elite trust

These tiers influence ranking, badge presentation, and moderation thresholds.

## 6. Ranking Usage
Trust score should influence:
- Search ordering
- Profile highlight eligibility
- Featured trader qualification
- Messaging confidence indicators
- Fraud review priority

Trust should not create a pay-to-win dynamic. Paid visibility can exist, but trust score must remain a distinct quality signal.

## 7. Abuse Resistance
- Down-weight repeat interactions between the same pair of users.
- Detect confirmation rings and rating collusion.
- Freeze score changes during active fraud review.
- Preserve a full audit trail of score changes.
- Allow manual override only for admins with recorded reason codes.

## 8. Explainability
Users should be able to see simple reason labels such as:
- Phone verified
- High completion rate
- Fast responder
- Limited disputes
- Needs more activity

## 9. Cross-References
- Reputation details: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- XP and levels: [XP_ENGINE.md](XP_ENGINE.md)
- Search ranking: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Fraud controls: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
