import type { FraudInsight, TrustInsight } from "@/lib/ai/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateTrustScore(input: {
  completedDeals: number;
  reviews: number;
  avgRating: number;
  responseRate: number;
  responseSpeedMinutes: number;
  cancellationRate: number;
  accountAgeDays: number;
  fraudReports: number;
  verified: boolean;
}): TrustInsight {
  const factors = [
    { name: "completed-deals", weight: 0.2, value: clamp(input.completedDeals / 40, 0, 1) },
    { name: "reviews", weight: 0.1, value: clamp(input.reviews / 80, 0, 1) },
    { name: "rating", weight: 0.2, value: clamp(input.avgRating / 5, 0, 1) },
    { name: "response-rate", weight: 0.12, value: clamp(input.responseRate / 100, 0, 1) },
    { name: "response-speed", weight: 0.08, value: clamp(1 - input.responseSpeedMinutes / 1440, 0, 1) },
    { name: "cancellation", weight: 0.12, value: clamp(1 - input.cancellationRate / 100, 0, 1) },
    { name: "account-age", weight: 0.08, value: clamp(input.accountAgeDays / 365, 0, 1) },
    { name: "fraud-reports", weight: 0.06, value: clamp(1 - input.fraudReports / 20, 0, 1) },
    { name: "verification", weight: 0.04, value: input.verified ? 1 : 0.35 }
  ];

  const weighted = factors.reduce((acc, item) => acc + item.weight * item.value, 0);
  const aiTrustScore = Number((weighted * 100).toFixed(2));

  return {
    aiTrustScore,
    confidence: clamp(0.55 + input.accountAgeDays / 2000, 0.55, 0.97),
    factors,
    notes: [
      "Future chat sentiment and behavior embeddings are reserved as extension points.",
      "Fraud history receives stronger weight for high-volume accounts."
    ]
  };
}

export function calculateFraudRisk(input: {
  suspiciousPricing: boolean;
  duplicateImageSignal: boolean;
  spamSignal: boolean;
  repeatedScamSignal: boolean;
  abnormalActivitySignal: boolean;
  fakeAccountSignal: boolean;
}): FraudInsight {
  const flags = [
    input.suspiciousPricing && "Suspicious pricing anomaly",
    input.duplicateImageSignal && "Duplicate image signal",
    input.spamSignal && "Spam pattern detected",
    input.repeatedScamSignal && "Repeated scam pattern",
    input.abnormalActivitySignal && "Abnormal activity burst",
    input.fakeAccountSignal && "Fake account indicators"
  ].filter(Boolean) as string[];

  const fraudProbability = clamp(flags.length * 0.18 + (input.repeatedScamSignal ? 0.22 : 0), 0.03, 0.99);

  return {
    fraudProbability: Number(fraudProbability.toFixed(2)),
    severity: fraudProbability > 0.74 ? "high" : fraudProbability > 0.45 ? "medium" : "low",
    flags,
    moderationActions:
      fraudProbability > 0.74
        ? ["Hold listing visibility", "Require manual moderation", "Ask for re-verification"]
        : fraudProbability > 0.45
          ? ["Boost verification checks", "Lower recommendation weight"]
          : ["Continue monitoring"]
  };
}
