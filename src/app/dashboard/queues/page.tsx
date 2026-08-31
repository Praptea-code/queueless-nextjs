import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function QueuesPage() {
  const ownerId = "demo-owner";
  let rows: {
    id: string;
    name: string;
    slug: string;
    serviceType: string;
    status: "active" | "paused" | "closed";
    _count: { tickets: number };
  }[] = [];
  let dbReady = true;

  try {
    const businesses = await prisma.business.findMany({
      where: { ownerId },
      include: {
        queues: {
          include: { _count: { select: { tickets: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    rows = businesses.flatMap((b) => b.queues);
  } catch {
    dbReady = false;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Queues</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Every queue people can join right now.
          </p>
        </div>
        <Link
          href="/dashboard/queues/new"
          className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
        >
          New queue
        </Link>
      </div>

      {!dbReady && (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          Database not configured. Set <code className="font-mono">DATABASE_URL</code> to
          list your queues.
        </div>
      )}

      {dbReady && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center">
          <p className="text-sm text-zinc-500">
            You haven&apos;t created any queues yet.
          </p>
          <Link
            href="/dashboard/queues/new"
            className="mt-4 inline-block rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Create the first one
          </Link>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {rows.map((queue, index) => (
            <li
              key={queue.id}
              className={`flex items-center justify-between p-5 ${index > 0 ? "border-t border-zinc-100" : ""}`}
            >
              <div>
                <p className="font-semibold text-zinc-900">{queue.name}</p>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {queue.serviceType} · /q/{queue.slug}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">
                  {queue._count.tickets} tickets
                </span>
                <Badge variant="secondary">{queue.status}</Badge>
                <Link
                  href={`/dashboard/queues/${queue.id}`}
                  className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  Manage
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}