# Security Architecture

> **Implementation status: Partial.** Session issuance/lookup/revocation exists (`src/lib/auth/session.ts`, `Session` model with random-token + expiry), and fraud/rate-limit data models exist (`FraudReport`, `SuspiciousUserSignal`, `RateLimitEvent`). No route currently enforces authentication or role-based access control, no rate limiting is wired up, and no verification, encryption-at-rest, or incident-response tooling is implemented — those remain **Planned**.

## 1. Security Goals
Aggarha must protect users, listings, conversations, and trust signals while keeping the product simple and legally safe. The platform must assume malicious actors will try to game ranking, impersonate users, manipulate deal confirmations, or abuse messaging.

## 1.1 Canonical Origins
- Public application origin: https://www.aggarha.com
- Public API origin: https://api.aggarha.com
- Admin origin: https://admin.aggarha.com
- Development origin: https://dev.aggarha.com

## 2. Threat Model
- Account takeover
- Fake listings and spam
- Review and confirmation collusion
- Spam messaging and phishing
- Enumeration of user identities
- Abuse of paid visibility
- Fraudulent verification attempts
- Rate-limit evasion
- Data scraping and bulk harvesting

## 3. Identity Security
- Mandatory phone verification before core actions
- Email verification as a secondary trust step
- Optional ID verification for stronger badge state
- Session expiration and refresh token hygiene
- Device and IP risk scoring
- Login alerting for suspicious sign-ins

## 4. Access Control
- Role-based access control for users, resellers, moderators, and admins
- Principle of least privilege
- Separate admin surfaces from public user surfaces
- Sensitive actions require reauthentication or step-up verification

## 5. Data Protection
- Encryption in transit for all traffic
- Encryption at rest for databases, backups, and object storage
- Secrets stored outside source control
- Pseudonymize analytics wherever possible
- Minimize exposed personal data on public profiles

## 6. Abuse Prevention
- Rate limits on sign-in, listing creation, messaging, and reporting
- Anti-automation checks for suspicious bursts
- Content filtering for spam and scam patterns
- Duplicate and near-duplicate listing detection
- Reputation penalties for confirmed abuse

## 7. Fraud Controls
- Flag repeated high-frequency deal pairs
- Detect confirmation rings
- Delay XP for suspicious deals
- Freeze trust and reputation updates during review
- Maintain immutable audit logs for moderation actions

## 8. Audit and Compliance
- Record who changed what and when
- Preserve moderation decisions and appeal outcomes
- Keep trust score and XP adjustment history
- Support deletion requests without destroying required audit trails where legally necessary

## 9. Incident Response
- Triage suspicious account clusters
- Temporarily quarantine flagged accounts or listings
- Preserve evidence snapshots
- Review, resolve, and communicate outcomes through support workflows

## 10. Cross-References
- Trust logic: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- Reputation logic: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- Moderation: [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md)
- API protection: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
