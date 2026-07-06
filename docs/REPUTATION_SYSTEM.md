# Reputation System

## 1. Purpose
Aggarha's reputation system transforms deal outcomes and user feedback into a durable public credibility profile. It should be highly legible to users while remaining resistant to manipulation.

## 2. Reputation Components
- Star rating: 1 to 5 stars
- Written reviews
- Deal completion rate
- Response speed
- Cancel rate
- Repeat reliability with different users
- Verification status
- Moderation outcomes

## 3. Rating Rules
- Ratings should be tied to completed, mutually confirmed deals.
- Reviews can be submitted only after a valid deal confirmation event.
- One deal should generally create one rating opportunity per side.
- Ratings from suspicious relationships should be down-weighted or held for review.

## 4. Reputation Score Shape
Use multiple sub-scores rather than a single opaque number.
Suggested public display:
- Average rating
- Completion rate
- Response speed label
- Verified badge
- Reliability summary

Suggested internal score inputs:
- Weighted star average
- Review quality score
- Completion ratio
- Trusted counterparties ratio
- Abuse penalty

## 5. Anti-Abuse Rules
- Ignore ratings from undeclared or unmatched transactions.
- Detect review rings and repeated reciprocation patterns.
- Cap the impact of same-counterparty feedback.
- Freeze reputation updates when a deal is under moderation.
- Preserve raw feedback for audit and appeal.

## 6. Public Presentation
The public profile should show:
- trust badge state
- verification state
- reputation score summary
- completed deals count
- response speed indicator
- recent reviews

This information should be positive, concise, and confidence-building rather than noisy.

## 7. Moderation Interplay
Moderators should be able to:
- hide abusive reviews
- mark ratings as invalid
- reinstate removed feedback after appeal
- annotate reputation penalties with reason codes

## 8. Reputation vs Trust
- Reputation reflects historical user feedback and deal outcomes.
- Trust score reflects the platform's broader credibility assessment, including fraud and verification.
- The two should correlate but remain distinct.

## 9. Cross-References
- Trust logic: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- XP logic: [XP_ENGINE.md](XP_ENGINE.md)
- Search ranking: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Moderation: [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md)
