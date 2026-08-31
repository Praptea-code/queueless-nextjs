import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Publish a queue-position update to a Supabase Realtime channel.
 * Consumers subscribe in `hooks/useQueuePosition`.
 *
 * Server-to-client broadcast works on the anon key when RLS allows it;
 * for production use `SUPABASE_SERVICE_ROLE_KEY` + a service client here.
 */
export function publishPositionUpdate(
  queueId: string,
  payload: Record<string, unknown>
) {
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[queueless] Supabase not configured — skipping realtime publish",
        { queueId, event: "position-update", payload }
      );
    }
    return;
  }
  void supabase
    .channel(`queue-position:${queueId}`)
    .send({
      type: "broadcast",
      event: "position-update",
      payload,
    })
    .then((res) => {
      if (res === "error") {
        console.error("[queueless] Realtime broadcast failed", { queueId });
      }
    });
}