import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishPositionUpdate } from "@/lib/supabase";
import { sendSms } from "@/lib/twilio";
import { dbUnavailable } from "@/lib/http";
import type { TicketStatus } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Adds a customer to the queue and assigns them the next position.
 * Returns the created ticket plus its live-status URL.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  const { queueId } = await params;

  let body: { customerName?: string; customerPhone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const customerName = body.customerName?.trim();
  const customerPhone = body.customerPhone?.trim();
  if (!customerName) {
    return NextResponse.json(
      { error: "customerName is required" },
      { status: 400 }
    );
  }

  try {
    const queue = await prisma.queue.findUnique({ where: { id: queueId } });
    if (!queue) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }
    if (queue.status !== "active") {
      return NextResponse.json(
        { error: "This queue is not accepting customers right now." },
        { status: 409 }
      );
    }

    const last = await prisma.ticket.findFirst({
      where: { queueId },
      orderBy: { position: "desc" },
    });
    const position = (last?.position ?? 0) + 1;
    const token = `T-${position}`;

    const ticket = await prisma.ticket.create({
      data: { queueId, customerName, customerPhone, position, token },
    });

    const totalWaiting = await prisma.ticket.count({
      where: { queueId, status: "waiting" },
    });

    publishPositionUpdate(queueId, {
      queueId,
      ticketId: ticket.id,
      position,
      totalWaiting,
      estimatedMinutes: 0,
      status: "waiting" satisfies TicketStatus,
    });

    if (customerPhone) {
      await sendSms(
        customerPhone,
        `You're on the list at ${queue.name}. Your ticket is ${token}. We'll text you as your turn approaches.`
      );
    }

    return NextResponse.json(
      {
        ticket,
        ticketId: ticket.id,
        ticketUrl: `/q/${queue.slug}/ticket/${ticket.id}`,
      },
      { status: 201 }
    );
  } catch (err) {
    return dbUnavailable(err);
  }
}