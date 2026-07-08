# XP Engine

> **Implementation status: Partial.** `User.xp`/`level` and `Deal.xpReleased`/`Review.xpImpact` exist as scalar fields in the schema. No award/timing logic, level-up computation, unlockables, or anti-gaming rules (§4–§8) are implemented — XP values are currently static/seeded, not earned through any live code path.

## 1. Purpose
The XP engine turns trustworthy behavior into visible progression. It should create a sense of achievement without compromising the credibility of the trust system.

## 2. XP Principles
- XP is earned only from validated events.
- No confirmation means no XP.
- XP must be auditable and reversible.
- XP should support cosmetic and discovery-based unlocks, not financial advantage.
- XP multipliers for resellers must be bounded and policy-controlled.

## 3. XP Sources
### Core sources
- Mutual deal confirmation
- Positive ratings
- High-quality reviews
- Fast response behavior
- Verified account milestones
- Seasonal achievements

### Optional sources
- Platform challenges
- Streaks for healthy activity
- Community participation events if later introduced

## 4. XP Award Timing
XP should never be granted at listing creation or message send time. It should be released only after the system validates the triggering event.

Suggested timing rules:
- Deal confirmation XP: after both parties confirm.
- Rating XP: after valid review submission and anti-abuse checks.
- Fast-response XP: aggregated and awarded periodically.
- Achievement XP: after season close or milestone completion.

## 5. Level Model
Levels should be slow enough to feel meaningful and fast enough to keep new users engaged.

Possible structure:
- Level 1 to Level 10: onboarding and early trust
- Level 11 to Level 25: active marketplace participant
- Level 26 to Level 50: power user or reseller-adjacent
- Level 51+: elite contributor

## 6. Unlockables
- Profile frames
- Badges
- Search priority boosts within policy limits
- Cosmetic identity elements
- Seasonal titles

Unlockables should not alter legal responsibility or trust score integrity.

## 7. Loss and Recalculation
XP is usually additive, but the system should support:
- manual reversals for fraudulent activity
- delayed release windows for suspicious deals
- season resets for seasonal leaderboards while preserving lifetime XP

## 8. Anti-Gaming Rules
- Cap XP from repeated deals with the same user in a short window.
- Reduce XP impact from suspiciously coordinated reviews.
- Freeze XP release for flagged deals until moderation resolves them.
- Apply multipliers only to eligible event categories, not to fraud-sensitive events.

## 9. Analytics
Track:
- XP earned per day
- XP by event type
- level distribution
- unlock adoption
- fraud reversals

## 10. Cross-References
- Trust: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- Reputation: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- User flows: [USER_JOURNEYS.md](USER_JOURNEYS.md)
- Feature scope: [FEATURE_BREAKDOWN.md](FEATURE_BREAKDOWN.md)
