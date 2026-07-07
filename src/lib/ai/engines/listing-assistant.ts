import type { ListingAssistantInput, ListingAssistantOutput } from "@/lib/ai/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const modeLabel = {
  RENT: "rental",
  SWAP: "swap",
  BOTH: "rental and swap"
};

export function generateListingDraft(input: ListingAssistantInput): ListingAssistantOutput {
  const titleBase = input.seedTitle?.trim() || `${input.categoryHint ?? "Asset"} ${modeLabel[input.mode]} listing`;
  const title = titleBase.length > 65 ? `${titleBase.slice(0, 62)}...` : titleBase;
  const cityPart = input.city ? ` in ${input.city}` : "";

  const description =
    `${title} available${cityPart} on Aggarha. ` +
    "Maintained by trusted owners, suitable for secure rentals and transparent exchange requests. " +
    (input.userNotes ? `Additional notes: ${input.userNotes}` : "Share condition, accessories, and usage terms for better match quality.");

  const category = (input.categoryHint || "general-assets").toLowerCase();
  const tags = Array.from(new Set([category, input.mode.toLowerCase(), "trusted", input.city?.toLowerCase() ?? "egypt"]));

  const baseValue = input.mode === "RENT" ? 350 : input.mode === "SWAP" ? 1800 : 1200;

  return {
    title,
    description,
    category,
    tags,
    specifications: [
      { key: "condition", value: "good" },
      { key: "ownership", value: "verified" },
      { key: "availability", value: "flexible" }
    ],
    rentalPriceSuggestion: baseValue,
    swapValueSuggestion: Math.round(baseValue * 5.4),
    estimatedDemand: input.mode === "BOTH" ? "high" : "medium",
    seo: {
      metaTitle: `${title} | Aggarha`,
      metaDescription: description.slice(0, 150),
      slug: slugify(title)
    },
    imageCaptions: [
      `${title} primary image`,
      "Detailed angle showing condition",
      "Accessories and included parts"
    ],
    missingInformation: [
      "Upload at least 3 clear photos",
      "Add brand and model details",
      "Specify pickup area and minimum rental duration"
    ]
  };
}
