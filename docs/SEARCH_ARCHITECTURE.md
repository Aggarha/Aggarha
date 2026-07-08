# Search Architecture

> **Implementation status: Partial.** `src/lib/marketplace/query.ts` and `/api/marketplace/search` implement keyword, category, location, mode, and availability filtering directly against PostgreSQL via Prisma, plus a separate AI-assisted `/api/ai/search` endpoint (see [AI_BRAIN_ARCHITECTURE.md](AI_BRAIN_ARCHITECTURE.md)). There is no dedicated search cluster, no asynchronous indexing pipeline, and no independently scaled ranking model — filtering and sorting run as direct database queries.

## 1. Purpose
Search is a core value proposition of Aggarha. Users must be able to quickly find trustworthy rental or swap opportunities by category, geography, credibility, and availability.

## 2. Search Goals
- Fast retrieval at city scale and beyond
- Trust-aware ranking
- Strong filtering and faceting
- Excellent typo tolerance and relevance
- Independent indexing pipeline

## 3. Searchable Objects
- Listings
- Users and reseller profiles
- Categories and subcategories
- Verified badges and trust tiers
- Featured placements
- Saved searches and recommendations

## 4. Key Filters
- Category
- Subcategory
- Location radius
- Rent / Swap / Both mode
- Verification state
- Trust tier
- Level range
- Price or value guidance where applicable
- Active status
- Freshness
- Featured/promoted state

## 5. Ranking Model
A ranking model should combine:
- keyword relevance
- geo proximity
- trust score
- reputation score
- verification status
- listing quality
- freshness
- engagement signals
- paid prominence signals with bounded influence

Trust and reputation should influence ranking more than paid boosts. Paid boosts should improve visibility but never fully override relevance and safety.

## 6. Indexing Pipeline
1. Listing or profile changes are written to the primary database.
2. A domain event is emitted.
3. Search worker transforms the record into search documents.
4. Search index is updated asynchronously.
5. Relevance, popularity, and trust are recalculated on schedule.

## 7. Query Strategy
- Use indexed fields for category, location, and trust filters.
- Use text analyzers for title and description.
- Use geo index or spatial search for radius queries.
- Cache common query patterns for city and category landing pages.

## 8. Safety and Quality
- Suppress spam listings.
- Downgrade low-quality or unverifiable results.
- Hide suspended accounts.
- Prefer listings with images, verification, and recent activity.

## 9. Recommendations
Search should feed recommendation surfaces such as:
- similar listings
- trusted sellers near you
- high-confidence categories
- recently confirmed opportunities

## 10. Cross-References
- Product scope: [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md)
- Trust ranking: [TRUST_SCORE_ENGINE.md](TRUST_SCORE_ENGINE.md)
- Reputation ranking: [REPUTATION_SYSTEM.md](REPUTATION_SYSTEM.md)
- APIs: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)
