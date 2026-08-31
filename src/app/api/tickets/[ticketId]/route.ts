import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictWait } from "@/lib/ai/waitPrediction";
import { dbUnavailable } from "@/lib/http";
import type { TicketStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { queue: { select: { name: true, slug: true, id: true } } },
    });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const totalWaiting = await prisma.ticket.count({
      where: { queueId: ticket.queueId, status: "waiting" },
    });
    const ahead = await prisma.ticket.count({
      where: {
        queueId: ticket.queueId,
        status: "waiting",
        position: { lt: ticket.position },
      },
    });

    const prediction = predictWait({
      queueId: ticket.queueId,
      currentDepth: ahead,
      averageServiceMinutes: 10,
    });

    return NextResponse.json({
      ...ticket,
      queueId: ticket.queueId,
      queueName: ticket.queue.name,
      queueSlug: ticket.queue.slug,
      totalWaiting: ticket.status === "waiting" ? totalWaiting : 0,
      position: ticket.position,
      estimatedMinutes: ticket.status === "waiting" ? prediction.estimatedMinutes : 0,
      status: ticket.status,
    });
  } catch (err) {
    return dbUnavailable(err);
  }
}

/**
 * Update a ticket's status. Used by the check-in flow and manual overrides.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;

  let body: { status?: TicketStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !body.status ||
    !["waiting", "called", "completed", "noShow"].includes(body.status)
  ) {
    return NextResponse.json(
      { error: "status must be one of waiting, called, completed, noShow" },
      { status: 400 }
    );
  }

  try {
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: body.status,
        calledAt: body.status === "called" ? new Date() : undefined,
        completedAt: body.status === "completed" ? new Date() : undefined,
      },
      include: { queue: { select: { name: true, slug: true } } },
    });

    return NextResponse.json({ ticket });
  } catch (err) {
    return dbUnavailable(err);
  }
}