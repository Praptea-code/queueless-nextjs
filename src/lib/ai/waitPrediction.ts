export interface WaitPredictionInput {
  queueId?: string;
  /** Number of waiting customers ahead of the subject. */
  currentDepth: number;
  /** Minutes each customer typically spends in service for this queue. */
  averageServiceMinutes: number;
  history?: {
    joinedAt: string;
    calledAt: string | null;
  }[];
}

export interface WaitPredictionResult {
  estimatedMinutes: number;
  confidence: number;
}

/**
 * STUB predictor.
 *
 * TODO: wire up a real AI provider (OpenAI or Anthropic).
 * Set OPENAI_API_KEY / ANTHROPIC_API_KEY, then call the provider with:
 *   - recent join/call deltas (the `history` array),
 *   - current queue depth,
 *   - and return a JSON-shaped { estimatedMinutes, confidence }.
 *
 * Current placeholder math: depth × average service time.
 */
export function predictWait(input: WaitPredictionInput): WaitPredictionResult {
  const { currentDepth, averageServiceMinutes, history } = input;

  const measured =
    history && history.length > 0
      ? history
          .map((h) => {
            if (!h.joinedAt || !h.calledAt) return null;
            const delta =
              new Date(h.calledAt).getTime() - new Date(h.joinedAt).getTime();
            return delta / 60000;
          })
          .filter((m): m is number => m !== null)
      : [];

  const avg = measured.length > 0
    ? measured.reduce((a, b) => a + b, 0) / measured.length
    : averageServiceMinutes;

  return {
    estimatedMinutes: Math.max(1, Math.round(currentDepth * avg)),
    confidence: measured.length > 0 ? 0.7 : 0.35,
  };
}