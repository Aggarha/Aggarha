# Roadmap (Summary)

> This file was moved here from the repository root (former `ROADMAP.md`) and refreshed to reflect actual progress. For the full phased plan, see [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md).

## Original Near Term Items (as first written)
- Establish project architecture baseline
- Define modules and service boundaries
- Start implementation tracks

## Current Status
- Architecture baseline — **Done.** The `/docs` architecture suite defines product, system, data, API, security, and domain-engine specs.
- Module/service boundaries — **Partial.** Boundaries are documented (see [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) §4); the codebase is currently one Next.js application, not yet split by service.
- Implementation tracks started — **Done.** Database + auth foundation, marketplace discovery (browse/search/detail), the premium UI/design system, and the AI Brain heuristics engine are all implemented. See [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md) for the full status table.

## Next Near-Term Items
- Authentication UI/routes (sign-up, login) on top of the existing session primitives
- Listing creation/edit flow (currently browse/search/detail only)
- Deal confirmation API on top of the existing `Deal` model
- Chat (not yet started in any form)

## Cross-References
- Full phased roadmap: [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md)
- Master status index: [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md)
