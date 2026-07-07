import type { ImageInsight } from "@/lib/ai/types";

const colorHints: Record<string, string> = {
  black: "black",
  white: "white",
  red: "red",
  blue: "blue",
  green: "green",
  silver: "silver"
};

export function analyzeListingImages(imageUrls: string[]): ImageInsight {
  const urlBlob = imageUrls.join(" ").toLowerCase();

  const detectedColor = Object.entries(colorHints).find(([key]) => urlBlob.includes(key))?.[1] ?? "mixed";
  const productType =
    (urlBlob.includes("playstation") && "gaming console") ||
    (urlBlob.includes("camera") && "camera gear") ||
    (urlBlob.includes("car") && "vehicle") ||
    "general asset";

  const hasDamageHint = /scratch|damage|broken|crack/.test(urlBlob);

  return {
    productType,
    condition: hasDamageHint ? "fair" : "good",
    color: detectedColor,
    brand: urlBlob.includes("sony") ? "Sony" : undefined,
    model: urlBlob.includes("ps5") ? "PS5" : undefined,
    accessories: ["charger", "manual"],
    damage: hasDamageHint ? ["visible damage indicators from filename hints"] : [],
    scratches: hasDamageHint,
    missingParts: hasDamageHint ? ["needs manual verification"] : [],
    estimatedQualityScore: hasDamageHint ? 61 : 82,
    moderationFlag: hasDamageHint ? "review-needed" : "clean"
  };
}
