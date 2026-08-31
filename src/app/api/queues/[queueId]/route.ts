import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  const { queueId } = await params;
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: {
        tickets: {
          select: {
            id: true,
            customerName: true,
            token: true,
            position: true,
            status: true,
            joinedAt: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });
    if (!queue) {
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }
    return NextResponse.json(queue);
  } catch (err) {
    return dbUnavailable(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  const { queueId } = await params;
  let body: { status?: "active" | "paused" | "closed" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status || !["active", "paused", "closed"].includes(body.status)) {
    return NextResponse.json(
      { error: "status must be one of active, paused, closed" },
      { status: 400 }
    );
  }

  try {
    const queue = await prisma.queue.update({
      where: { id: queueId },
      data: { status: body.status },
    });
    return NextResponse.json({ queue });
  } catch (err) {
    return dbUnavailable(err);
  }
}