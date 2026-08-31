import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface QueueSummary {
  id: string;
  name: string;
  slug: string;
  serviceType: string;
  status: "active" | "paused" | "closed";
}

async function loadOverview(ownerId: string) {
  const businesses = await prisma.business.findMany({
    where: { ownerId },
    include: { queues: true },
  });
  const queueIds = businesses.flatMap((b) => b.queues.map((q) => q.id));

  const [totalTickets, waitingNow, servedToday] = await Promise.all([
    prisma.ticket.count({
      where: { queue: { business: { ownerId } } },
    }),
    prisma.ticket.count({
      where: { queueId: { in: queueIds }, status: "waiting" },
    }),
    prisma.ticket.count({
      where: {
        queue: { business: { ownerId } },
        status: { in: ["completed", "called"] },
        joinedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  return { queueCount: queueIds.length, totalTickets, waitingNow, servedToday };
}

export default async function DashboardPage() {
  // TODO: replace with the authenticated owner id from Supabase Auth.
  const ownerId = "demo-owner";

  let metrics: Awaited<ReturnType<typeof loadOverview>> | null = null;
  let queues: QueueSummary[] = [];
  let dbReady = true;

  try {
    metrics = await loadOverview(ownerId);
    const businesses = await prisma.business.findMany({
      where: { ownerId },
      include: { queues: true },
    });
    queues = businesses.flatMap((b) => b.queues);
  } catch {
    dbReady = false;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          How your queues are doing today.
        </p>
      </div>

      {!dbReady && (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          Database not configured. Set <code className="font-mono">DATABASE_URL</code> in
          .env.local and run <code className="font-mono">npm run db:push</code> to connect
          this dashboard.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Active queues" value={metrics?.queueCount ?? 0} />
        <Metric label="Waiting now" value={metrics?.waitingNow ?? 0} />
        <Metric label="Served today" value={metrics?.servedToday ?? 0} />
        <Metric label="All-time tickets" value={metrics?.totalTickets ?? 0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your queues</CardTitle>
        </CardHeader>
        <CardContent>
          {queues.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No queues yet.{" "}
              <Link href="/dashboard/queues/new" className="font-semibold text-cyan-600 hover:underline">
                Create your first queue
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {queues.map((queue) => (
                <li key={queue.id}>
                  <Link
                    href={`/dashboard/queues/${queue.id}`}
                    className="flex items-center justify-between py-3 transition hover:bg-zinc-50"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{queue.name}</p>
                      <p className="text-xs text-zinc-400">{queue.serviceType}</p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                      {queue.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <p className="mt-2 text-3xl font-extrabold text-zinc-950">{value}</p>
      </CardContent>
    </Card>
  );
}