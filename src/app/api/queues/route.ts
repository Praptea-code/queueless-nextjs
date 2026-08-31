import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/http";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * List queues for a business owner.
 * Auth is not wired yet — the owner is passed via the `x-owner-id` header.
 */
export async function GET(req: NextRequest) {
  const ownerId = req.headers.get("x-owner-id");
  if (!ownerId) {
    return NextResponse.json(
      {
        error: "Missing owner. Add an x-owner-id header (auth not wired yet).",
      },
      { status: 401 }
    );
  }

  try {
    const businesses = await prisma.business.findMany({
      where: { ownerId },
      include: {
        queues: {
          include: {
            _count: {
              select: {
                tickets: { where: { status: "waiting" } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const queues = businesses.flatMap((b) =>
      b.queues.map((queue) => ({
        ...queue,
        businessName: b.name,
        createdAt: queue.createdAt.toISOString(),
      }))
    );

    return NextResponse.json({ queues });
  } catch (err) {
    return dbUnavailable(err);
  }
}

export async function POST(req: NextRequest) {
  const ownerId = req.headers.get("x-owner-id");
  if (!ownerId) {
    return NextResponse.json(
      {
        error: "Missing owner. Add an x-owner-id header (auth not wired yet).",
      },
      { status: 401 }
    );
  }

  let body: { businessName?: string; name?: string; serviceType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const businessName = body.businessName?.trim();
  const name = body.name?.trim();
  const serviceType = body.serviceType?.trim() || "general";

  if (!businessName || !name) {
    return NextResponse.json(
      { error: "businessName and name are required" },
      { status: 400 }
    );
  }

  try {
    const businessSlug = slugify(businessName);
    const business = await prisma.business.upsert({
      where: { slug: businessSlug },
      create: { name: businessName, slug: businessSlug, ownerId },
      update: {},
    });

    const queueSlug = slugify(name);
    const queue = await prisma.queue.create({
      data: {
        businessId: business.id,
        name,
        slug: queueSlug,
        serviceType,
      },
    });

    return NextResponse.json({ queue }, { status: 201 });
  } catch (err) {
    return dbUnavailable(err);
  }
}