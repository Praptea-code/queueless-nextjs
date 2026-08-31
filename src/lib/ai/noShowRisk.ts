export interface NoShowRiskInput {
  ticketId?: string;
  customerPhone?: string;
  customerHistory: {
    priorNoShows: number;
    priorVisits: number;
    phoneAnswered?: boolean;
  };
}

export interface NoShowRiskResult {
  score: number;
  tier: "low" | "medium" | "high";
  factors: string[];
}

/**
 * STUB risk scorer.
 *
 * TODO: wire up an AI provider. Get an OPENAI_API_KEY / ANTHROPIC_API_KEY,
 * feed the customer's RFM-style history + queue context, and return a
 * calibrated 0..1 score. Current math is a weighted heuristic.
 */
export function assessNoShowRisk(
  input: NoShowRiskInput
): NoShowRiskResult {
  const { priorNoShows, priorVisits, phoneAnswered } = input.customerHistory;
  const factors: string[] = [];

  const noShowRate = priorVisits > 0 ? priorNoShows / priorVisits : 0.05;
  if (noShowRate > 0.3) factors.push("historically high no-show rate");

  if (phoneAnswered === false) factors.push("did not answer check-in");

  let score = Math.max(0, Math.min(1, noShowRate * 0.8));
  if (phoneAnswered === false) score = Math.min(1, score + 0.25);
  if (priorVisits === 0 && priorNoShows === 0) score = 0.3;

  const tier: NoShowRiskResult["tier"] =
    score > 0.6 ? "high" : score > 0.3 ? "medium" : "low";

  return { score: Math.round(score * 100) / 100, tier, factors };
}