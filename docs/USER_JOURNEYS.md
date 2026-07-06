# User Journeys

## 1. Journey Principles
Aggarha journeys must feel lightweight and trustworthy. Every path should reduce uncertainty, surface reputation early, and keep the user in control. Because the platform does not handle money, the journey should focus on discovery, communication, and confirmation.

## 2. New User Journey
1. User lands on home or category page.
2. User searches by category, location, and trust filters.
3. User opens a listing and reviews the seller profile, verification state, and trust indicators.
4. User signs up or logs in to start messaging.
5. User completes phone verification immediately.
6. User chats with the listing owner.
7. User confirms whether the deal is complete after the transaction happens externally.
8. User receives XP, reputation updates, and possible level progress.

## 3. Regular Listing Journey
1. User creates a listing with title, description, images, category, mode, location, and optional price guidance.
2. Listing enters a moderation and indexing pipeline.
3. Listing becomes discoverable once valid.
4. Other users search, filter, and message the owner.
5. The owner responds, negotiates, and later confirms completion.
6. Both parties submit reviews and ratings.

## 4. Reseller Journey
1. User upgrades to reseller subscription.
2. User receives higher visibility, boosts, analytics access, and optional XP multiplier.
3. User creates high-intent listings and featured placements.
4. User monitors views, messages, confirmations, and conversion.
5. Subscription renewal is tracked with entitlement state.

## 5. Swap Journey
1. User searches for a matching item to swap.
2. The user filters by category, location, trust score, and verification.
3. Both parties negotiate in chat.
4. One side proposes a swap outline.
5. The deal is confirmed by both sides after completion.
6. Mutual confirmation unlocks reputation and XP updates.

## 6. Deal Confirmation Journey
This is the most important trust flow.
1. Deal is initiated in chat or external arrangement.
2. User taps Confirm Deal Completed.
3. The other party receives a confirmation request.
4. If both confirm, the deal is finalized and events are emitted.
5. If one party declines or ignores the request, the deal remains incomplete.
6. XP, rating, and reputation changes only apply after dual confirmation.

## 7. Verification Journey
1. Phone verification is mandatory before core participation.
2. Email verification strengthens account trust.
3. ID verification is optional but unlocks a stronger trust badge.
4. Verified state influences search ranking and conversion.

## 8. Reporting Journey
1. User reports a listing, profile, or chat thread.
2. Report is triaged by severity and trust risk.
3. Moderators review supporting evidence.
4. Platform can warn, limit, suspend, or shadow-limit accounts.

## 9. Edge Cases
- User abandons deal confirmation: no XP is released.
- One party disputes completion: move to moderation queue and freeze trust updates for that deal.
- Suspicious repeated exchanges between same users: trigger anti-fraud review.
- Unverified users: can browse but may have reduced messaging or listing privileges until verified.
- Spam or low-quality listings: reduce visibility and require moderation.

## 10. Cross-References
- Feature hierarchy: [FEATURE_BREAKDOWN.md](FEATURE_BREAKDOWN.md)
- Reputation rules: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- XP rules: [XP_ENGINE.md](XP_ENGINE.md)
- Trust rules: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- Security and fraud: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
