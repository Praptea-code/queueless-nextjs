import { NextRequest, NextResponse } from "next/server";
import { publishPositionUpdate } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Supabase Realtime webhook receiver.
 *
 * When a database insert/update happens on the `Ticket` table, Supabase can
 * POST the change here (via Database Webhooks). This route re-broadcasts the
 * change as a `position-update` event so browsers subscribed to
 * `queue-position:<queueId>` update instantly.
 *
 * TODO:
 *  - Configure a Supabase Database Webhook on `tickets` (INSERT/UPDATE).
 *  - Point it at `${APP_URL}/api/webhooks/realtime`.
 *  - Verify the webhook secret in the `x-supabase-webhook-secret` header.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-supabase-webhook-secret");
  const expected = process.env.SUPABASE_WEBHOOK_SECRET;

  if (expected && secret !== expected) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const event = (await req.json()) as {
    table?: string;
    type?: "INSERT" | "UPDATE" | "DELETE";
    record?: Record<string, unknown>;
    new?: Record<string, unknown>;
  };

  const row = event.new ?? event.record;
  const queueId = row?.queueId;
  const ticketId = row?.id;
  const status = row?.status as "waiting" | "called" | "completed" | "noShow";

  if (queueId && ticketId && (event.type === "INSERT" || event.type === "UPDATE")) {
    publishPositionUpdate(String(queueId), {
      queueId: String(queueId),
      ticketId: String(ticketId),
      position: Number(row.position),
      totalWaiting: 0,
      status,
      estimatedMinutes: 0,
      source: "webhook",
    });
  }

  return NextResponse.json({ ok: true });
}