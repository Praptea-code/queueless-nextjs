export type CheckInIntent =
  | "on-my-way"
  | "arrived"
  | "cancel"
  | "reschedule"
  | "unknown";

export interface CheckInResult {
  intent: CheckInIntent;
  confidence: number;
  message: string;
}

/**
 * STUB conversational check-in parser.
 *
 * TODO: wire up an AI provider for robust intent parsing. With an
 * OPENAI_API_KEY / ANTHROPIC_API_KEY, send the raw customer text and
 * constrain the model to the CheckInIntent union. The regex below is a
 * placeholder covering common phrasings.
 */
export function parseCheckInMessage(message: string): CheckInResult {
  const text = message.toLowerCase();

  if (/cancel|can't make|can not make|skip me|take me off/i.test(text)) {
    return { intent: "cancel", confidence: 0.85, message };
  }
  if (/reschedule|later|another day|move me|different time/i.test(text)) {
    return { intent: "reschedule", confidence: 0.75, message };
  }
  if (/arrived|here|waiting outside|parking lot|i'?m in/i.test(text)) {
    return { intent: "arrived", confidence: 0.7, message };
  }
  if (/on (my|the) way|coming now|en route|\d+ min|on my way/i.test(text)) {
    return { intent: "on-my-way", confidence: 0.7, message };
  }

  return { intent: "unknown", confidence: 0.15, message };
}