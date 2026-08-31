import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishPositionUpdate } from "@/lib/supabase";
import { dbUnavailable } from "@/lib/http";
import type { TicketStatus } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Marks a ticket as a no-show (customer didn't show when called).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  const { queueId } = await params;

  let body: { ticketId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.ticketId) {
    return NextResponse.json({ error: "ticketId is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.ticket.findUnique({
      where: { id: body.ticketId },
    });
    if (!existing || existing.queueId !== queueId) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    if (existing.status !== "called") {
      return NextResponse.json(
        { error: "Only a called ticket can be marked as a no-show." },
        { status: 409 }
      );
    }

    const ticket = await prisma.ticket.update({
      where: { id: body.ticketId },
      data: { status: "noShow" },
    });

    const totalWaiting = await prisma.ticket.count({
      where: { queueId, status: "waiting" },
    });

    publishPositionUpdate(queueId, {
      queueId,
      ticketId: ticket.id,
      position: ticket.position,
      totalWaiting,
      estimatedMinutes: 0,
      status: "noShow" satisfies TicketStatus,
    });

    return NextResponse.json({ ticket });
  } catch (err) {
    return dbUnavailable(err);
  }
}