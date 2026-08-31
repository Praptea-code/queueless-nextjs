import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishPositionUpdate } from "@/lib/supabase";
import { sendSms } from "@/lib/twilio";
import { dbUnavailable } from "@/lib/http";
import type { TicketStatus } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Advances the queue: marks the next waiting ticket as "called",
 * alerts them via SMS, and publishes the realtime update.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  const { queueId } = await params;

  try {
    const next = await prisma.ticket.findFirst({
      where: { queueId, status: "waiting" },
      orderBy: { position: "asc" },
    });

    if (!next) {
      return NextResponse.json(
        { error: "No customers waiting in this queue." },
        { status: 404 }
      );
    }

    const called = await prisma.ticket.update({
      where: { id: next.id },
      data: { status: "called", calledAt: new Date() },
    });

    const queue = await prisma.queue.findUnique({ where: { id: queueId } });
    const totalWaiting = await prisma.ticket.count({
      where: { queueId, status: "waiting" },
    });

    publishPositionUpdate(queueId, {
      queueId,
      ticketId: called.id,
      position: called.position,
      totalWaiting,
      estimatedMinutes: 0,
      status: "called" satisfies TicketStatus,
    });

    if (called.customerPhone) {
      await sendSms(
        called.customerPhone,
        `It's your turn at ${queue?.name ?? "our location"}! Your ticket ${called.token} is being served now — please head up.`
      );
    }

    return NextResponse.json({ ticket: called, waitingCount: totalWaiting });
  } catch (err) {
    return dbUnavailable(err);
  }
}