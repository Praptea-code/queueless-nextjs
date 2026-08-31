import { NextRequest, NextResponse } from "next/server";
import { parseCheckInMessage } from "@/lib/ai/checkInAgent";

export const dynamic = "force-dynamic";

/**
 * SMS webhook handler.
 *
 * STUB — Twilio integration is not wired yet. When configured, Twilio posts
 * inbound customer replies here as form-encoded data (`From`, `Body`). The
 * handler parses the message with the check-in agent and can update the
 * matched ticket.
 *
 * TODO:
 *  - Add a Twilio phone number, point its incoming webhook at this route.
 *  - Look up the waiting ticket by the customer's phone number (`From`).
 *  - Apply the parsed intent (cancel → noShow, etc.).
 *  - Respond with TwiML (empty <Response/> is fine for no reply).
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  let from: string | null = null;
  let bodyText: string | null = null;

  if (contentType.includes("application/json")) {
    const data = (await req.json()) as { From?: string; Body?: string };
    from = data.From ?? null;
    bodyText = data.Body ?? null;
  } else {
    const form = await req.formData();
    from = String(form.get("From") ?? "");
    bodyText = String(form.get("Body") ?? "");
  }

  const message = bodyText?.trim() ?? "";
  if (!message) {
    return NextResponse.json(
      { error: "No message body" },
      { status: 400 }
    );
  }

  const result = parseCheckInMessage(message);

  return new NextResponse(
    "<Response></Response>",
    {
      status: 200,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "X-Queueless-Intent": result.intent,
      },
    }
  );
}