import { NextRequest, NextResponse } from "next/server";
import { assessNoShowRisk } from "@/lib/ai/noShowRisk";
import { prisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/http";

export const dynamic = "force-dynamic";

/**
 * AI no-show risk scoring.
 * Accepts a customer identifier (phone or a ticketId) and returns a 0..1
 * risk score with contributing factors.
 */
export async function POST(req: NextRequest) {
  let body: { ticketId?: string; customerPhone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const customerPhone: string | undefined =
    body.customerPhone ??
    (body.ticketId
      ? (
          await prisma.ticket
            .findUnique({
              where: { id: body.ticketId },
              select: { customerPhone: true },
            })
            .catch(() => null)
        )?.customerPhone ?? undefined
      : undefined);

  let priorNoShows = 0;
  let priorVisits = 0;

  if (customerPhone) {
    try {
      const history = await prisma.ticket.findMany({
        where: { customerPhone, status: { in: ["completed", "noShow"] } },
        select: { status: true },
      });
      priorNoShows = history.filter((t) => t.status === "noShow").length;
      priorVisits = history.length;
    } catch (err) {
      return dbUnavailable(err);
    }
  }

  return NextResponse.json(
    assessNoShowRisk({
      ticketId: body.ticketId,
      customerPhone,
      customerHistory: { priorNoShows, priorVisits },
    })
  );
}