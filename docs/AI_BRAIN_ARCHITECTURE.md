# AI Brain Architecture

> **Implementation status: Implemented** (heuristic engines and API surface are live). The LLM provider layer is a **placeholder** — no real OpenAI/Gemini/Claude/Ollama calls are wired up yet. This document did not exist before this refactor; it documents `src/lib/ai/**` and `src/app/api/ai/**`, added in commit `00df8e9` ("build Aggarha AI Brain foundation") with no prior documentation.

## 1. Purpose
The AI Brain is a deterministic, heuristic intelligence layer over marketplace data — pricing, trust/fraud scoring, search assistance, recommendations, and market/business insight — built to run without a live LLM, with a provider abstraction ready to swap in real model calls later.

## 2. Provider Layer — `src/lib/ai/providers.ts`
- `getLLMService()` returns a `PlaceholderLLMService` whose `complete()`/`embed()` methods return deterministic stub output (e.g. `` `placeholder:${provider}:${prompt}` ``), not real model calls.
- Provider selection (`AI_PROVIDER` env var: `OPENAI` | `GEMINI` | `CLAUDE` | `OLLAMA`, default `LOCAL`) is implemented, but every branch resolves to the same placeholder implementation today.
- `runAIBrainSnapshot()` reports `llmConnectors` as `"placeholder-ready"` for OpenAI, Gemini, Claude, Ollama, LocalLLM, Embeddings, and VectorDatabase — an explicit signal in the code itself that these are not yet live integrations.

## 3. Engines — `src/lib/ai/engines/`
All engines are pure heuristic functions (no network calls), each with one responsibility:

| Engine | File | Purpose |
|---|---|---|
| Pricing | `pricing-engine.ts` | Estimates rental/swap/market value and demand from trust score, level, views, category |
| Risk | `risk-engine.ts` | `calculateTrustScore` and `calculateFraudRisk` heuristics from deal history, reviews, response/cancellation rate, fraud reports |
| Recommendation | `recommendation-engine.ts` | Builds home feed, matches, and recommendation sets from `UserSignals` |
| Market Intelligence | `market-intelligence.ts` | Marketplace-wide, business, dashboard, and notification insight |
| Search Intelligence | `search-intelligence.ts` | Query normalization, intent detection, autocomplete, suggestions |
| Domain Intelligence | `domain-intelligence.ts` | Collectibles/PlayStation-specific and nearby-discovery insight |
| Image Analyzer | `image-analyzer.ts` | Heuristic condition/brand/damage captioning from image references |
| Listing Assistant | `listing-assistant.ts` | Generates a listing draft (title, description, tags, pricing, SEO) from partial input |

Orchestration lives in `src/lib/ai/ai-brain.ts`, which composes engines into higher-level operations (e.g. `runTrustAndFraudForListing` loads a listing + owner history from Prisma, then feeds it to the risk engine).

## 4. API Routes — `src/app/api/ai/`
| Route | Method | Engine(s) used |
|---|---|---|
| `/api/ai/brain` | GET | `runAIBrainSnapshot` (aggregates feed, recommendations, market, nearby, dashboard) |
| `/api/ai/dashboard` | GET | `runAIDashboard` → market-intelligence |
| `/api/ai/search` | GET | `runSearchIntelligence` → search-intelligence |
| `/api/ai/listing-assistant` | POST | `runListingAssistant` → listing-assistant + image-analyzer |
| `/api/ai/image-analyzer` | POST | image-analyzer |
| `/api/ai/listings/[id]/intelligence` | GET | `runTrustAndFraudForListing` + `runPricingForListing` |

## 5. Dashboard UI — `src/app/ai/dashboard`
A page rendering `runAIDashboard()` output (marketplace health, demand heatmap, fraud alerts, recommendation/trust/pricing analytics).

## 6. Relationship to Other Domains
- Feeds trust-score display in [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md) (heuristic scorer, not the target weighted model in that doc).
- Feeds fraud-signal detection referenced in [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md) and [ADMIN_ARCHITECTURE.md](ADMIN_ARCHITECTURE.md) (no moderation console consumes it yet).
- Search assistance complements, but is separate from, the direct-query search in [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md).

## 7. Cross-References
- Data model: [DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md)
- API surface: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
- Master status index: [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md)
