import { NextRequest, NextResponse } from "next/server";
import { parseCheckInMessage } from "@/lib/ai/checkInAgent";
import { prisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/http";
import type { TicketStatus } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Conversational check-in.
 * Accepts a free-text customer message + ticketId, returns the parsed intent,
 * and applies the equivalent ticket-status change.
 */
export async function POST(req: NextRequest) {
  let body: { ticketId?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const result = parseCheckInMessage(message);

  let updatedTicket = null;
  if (result.intent === "cancel" && body.ticketId) {
    try {
      updatedTicket = await prisma.ticket.update({
        where: { id: body.ticketId },
        data: { status: "noShow" satisfies TicketStatus },
      });
    } catch (err) {
      return dbUnavailable(err);
    }
  }

  return NextResponse.json({ ...result, updatedTicket });
}