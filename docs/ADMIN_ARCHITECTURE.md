# Admin Architecture

> **Implementation status: Planned.** No admin application, routes, or roles-based console exist in the codebase (`src/app` has no `admin` directory). `User.role` supports `MODERATOR`/`ADMIN` values at the schema level, but no admin surface reads or acts on them yet.

## 1. Purpose
The admin layer exists to maintain platform trust, protect the community, manage monetization, and provide operational control. It should be fully auditable, permissioned, and separated from public product logic.

## 1.1 Admin Surface
- Canonical admin origin: https://admin.aggarha.com
- Supporting public origin: https://www.aggarha.com
- Supporting API origin: https://api.aggarha.com
- Development origin: https://dev.aggarha.com

## 2. Admin Roles
- Super Admin: platform-wide configuration and emergency actions
- Moderator: reports, content review, sanctions, and appeals
- Trust Analyst: trust score review, fraud investigations, and review integrity
- Monetization Manager: subscriptions, boosts, placements, and ad inventory
- Support Agent: user-facing support with restricted access

## 3. Admin Modules
### Moderation Queue
Review listings, users, messages, and reports.

### Fraud Console
Investigate suspicious behavior, deal rings, fake reviews, and repeated pair abuse.

### Verification Console
Review optional ID verification requests and exception handling.

### Monetization Console
Manage plans, boosts, featured slots, promo campaigns, and entitlement issues.

### Analytics Console
Track active listings, confirmed deals, conversion rates, retention, and revenue per active user.

### Audit Console
Inspect all trust, reputation, XP, and moderation changes.

## 4. Moderation Actions
- Approve or reject listings
- Hide or unhide content
- Suspend or limit accounts
- Remove invalid reviews
- Freeze XP release on suspicious deals
- Mark a trust review as escalated
- Restore content after appeal

## 5. Sanctions Model
- Warning
- Temporary visibility reduction
- Messaging restriction
- Listing creation restriction
- Verification hold
- Temporary suspension
- Permanent suspension

## 6. Review Workflows
1. Signal is created from user report, risk model, or manual audit.
2. Item enters moderation queue.
3. Moderator reviews evidence and history.
4. Action is applied with reason code and audit trail.
5. User receives a notification where policy permits.
6. Appeal may be opened and reviewed separately.

## 7. Admin Safety
- Strong authentication for all admin users
- Step-up auth for destructive actions
- Separate permissions for view vs action
- Logging for every admin click that changes state

## 8. KPI Ownership
Admins should monitor:
- active listings
- confirmed deals
- confirmed-deal rate
- trust distribution
- subscription conversion
- fraud incidence
- average response times

## 9. Cross-References
- Security: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
- Search: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Reputation: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- Trust: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
