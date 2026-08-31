import { NextRequest, NextResponse } from "next/server";
import { predictWait } from "@/lib/ai/waitPrediction";
import { prisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/http";

export const dynamic = "force-dynamic";

/**
 * AI wait-time prediction.
 * Accepts queue context (optionally loading live stats from the DB) and
 * returns { estimatedMinutes, confidence }.
 */
export async function POST(req: NextRequest) {
  let body: {
    queueId?: string;
    currentDepth?: number;
    averageServiceMinutes?: number;
    history?: { joinedAt: string; calledAt: string | null }[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let currentDepth = body.currentDepth;
  let history = body.history;
  const averageServiceMinutes = body.averageServiceMinutes ?? 10;

  if (body.queueId && currentDepth === undefined) {
    try {
      currentDepth = await prisma.ticket.count({
        where: { queueId: body.queueId, status: "waiting" },
      });
    } catch (err) {
      return dbUnavailable(err);
    }
  }

  const estimate = predictWait({
    queueId: body.queueId,
    currentDepth: currentDepth ?? 0,
    averageServiceMinutes,
    history,
  });

  return NextResponse.json({
    estimatedMinutes: estimate.estimatedMinutes,
    confidence: estimate.confidence,
  });
}