import { prisma } from "@/lib/db";
import type { IntelligentSearchResult, SearchIntent, UserSignals } from "@/lib/ai/types";

const synonymMap: Record<string, string[]> = {
  playstation: ["ps", "ps4", "ps5", "console games"],
  camera: ["dslr", "lens", "canon", "nikon"],
  collectibles: ["rare", "collector", "limited edition"],
  car: ["vehicle", "sedan", "suv"],
  gaming: ["console", "controller", "game"],
  electronics: ["device", "gadget", "tech"]
};

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

function detectIntent(query: string): SearchIntent {
  if (query.includes("swap") || query.includes("trade")) return "swap-intent";
  if (query.includes("rent") || query.includes("daily") || query.includes("per day")) return "rent-intent";
  if (query.includes("cheap") || query.includes("price") || query.includes("budget")) return "price-intent";
  if (query.includes("near") || query.includes("nearby") || query.includes("in ")) return "location-intent";
  if (query.includes("collect") || query.includes("rare") || query.includes("edition")) return "collectibles-intent";
  if (query.includes("playstation") || query.includes("ps5") || query.includes("game")) return "gaming-intent";
  return "generic-intent";
}

function spellCorrect(query: string): string | undefined {
  const corrections: Record<string, string> = {
    playstaion: "playstation",
    camra: "camera",
    eletronics: "electronics",
    colletibles: "collectibles",
    swapp: "swap"
  };

  const corrected = query
    .split(" ")
    .map((token) => corrections[token] ?? token)
    .join(" ");

  return corrected !== query ? corrected : undefined;
}

function predictBrand(query: string): string | undefined {
  const brands = ["Sony", "Canon", "Nikon", "Apple", "Samsung", "Yamaha", "Honda"];
  const matched = brands.find((brand) => query.includes(brand.toLowerCase()));
  return matched;
}

function predictProduct(query: string): string | undefined {
  const products = ["PlayStation 5", "DSLR Camera", "Studio Light", "Gaming Controller", "Drone"];
  const lowerProducts = products.map((product) => ({ product, normalized: product.toLowerCase() }));
  return lowerProducts.find((item) => query.includes(item.normalized.split(" ")[0]))?.product;
}

function predictCategory(query: string): string | undefined {
  if (query.includes("game") || query.includes("playstation")) return "gaming";
  if (query.includes("collect") || query.includes("rare")) return "collectibles";
  if (query.includes("camera") || query.includes("photo")) return "cameras";
  if (query.includes("car") || query.includes("bike")) return "vehicles";
  return undefined;
}

export async function runIntelligentSearch(query: string, userSignals?: UserSignals): Promise<IntelligentSearchResult> {
  const normalizedQuery = normalizeQuery(query || "");
  const correctedQuery = spellCorrect(normalizedQuery);
  const effectiveQuery = correctedQuery ?? normalizedQuery;

  const [trendingRows, nearbyRows] = await Promise.all([
    prisma.listing.findMany({
      where: { status: { in: ["PUBLISHED", "RESERVED", "RENTED", "SWAPPED", "COMPLETED"] } },
      orderBy: { viewCount: "desc" },
      take: 6,
      select: { title: true }
    }),
    prisma.listing.findMany({
      where: {
        location: {
          is: {
            governorate: userSignals?.location?.governorate,
            city: userSignals?.location?.city
          }
        }
      },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { title: true }
    })
  ]);

  const synonyms = Object.entries(synonymMap)
    .filter(([root]) => effectiveQuery.includes(root))
    .flatMap(([, values]) => values)
    .slice(0, 5);

  const autocomplete = [
    `${effectiveQuery} near me`,
    `${effectiveQuery} for rent`,
    `${effectiveQuery} for swap`,
    `${effectiveQuery} premium`,
    `${effectiveQuery} trusted`
  ].filter((value) => value.trim().length > 0);

  const relatedSearches = Array.from(new Set([...synonyms, ...autocomplete.slice(0, 3)])).slice(0, 8);

  const personalizedHints = [
    ...(userSignals?.favoriteCategorySlugs ?? []).map((slug) => `Based on your favorites: ${slug}`),
    ...(userSignals?.recentKeywords ?? []).slice(0, 2).map((keyword) => `Continue exploring: ${keyword}`)
  ].slice(0, 4);

  return {
    normalizedQuery: effectiveQuery,
    intent: detectIntent(effectiveQuery),
    autocomplete,
    suggestions: autocomplete.slice(0, 3),
    relatedSearches,
    trendingSearches: trendingRows.map((row) => row.title),
    predictedCategory: predictCategory(effectiveQuery),
    predictedBrand: predictBrand(effectiveQuery),
    predictedProduct: predictProduct(effectiveQuery),
    correctedQuery,
    nearbySuggestions: nearbyRows.map((row) => row.title),
    personalizedHints
  };
}
