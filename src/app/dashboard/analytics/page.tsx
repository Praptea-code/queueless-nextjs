import { prisma } from "@/lib/prisma";
import { AnalyticsChart, type ChartDatum } from "@/components/dashboard/AnalyticsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const ownerId = "demo-owner";
  let dbReady = true;
  let live: ChartDatum[] = [];
  let totals: { served: number; noShows: number } | null = null;

  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const tickets = await prisma.ticket.findMany({
      where: {
        queue: { business: { ownerId } },
        joinedAt: { gte: since },
      },
      select: { joinedAt: true, status: true },
    });

    const label = (d: Date) =>
      d.toLocaleDateString("en-US", { weekday: "short" });

    const buckets = new Map<string, ChartDatum>();
    for (let i = 0; i < 7; i++) {
      const day = new Date(since);
      day.setDate(since.getDate() + i);
      buckets.set(label(day), { label: label(day), joined: 0, served: 0 });
    }

    for (const t of tickets) {
      const key = label(new Date(t.joinedAt));
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.joined += 1;
      if (t.status === "completed" || t.status === "called") bucket.served += 1;
    }

    totals = {
      served: tickets.filter((t) => t.status === "completed" || t.status === "called").length,
      noShows: tickets.filter((t) => t.status === "noShow").length,
    };
    live = [...buckets.values()];
  } catch {
    dbReady = false;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">Last 7 days of queue activity.</p>
      </div>

      {!dbReady ? (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          Database not configured. Set <code className="font-mono">DATABASE_URL</code> to
          see live analytics.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-zinc-500">Served (7d)</p>
                <p className="mt-2 text-3xl font-extrabold text-zinc-950">
                  {totals?.served ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-zinc-500">No-shows (7d)</p>
                <p className="mt-2 text-3xl font-extrabold text-zinc-950">
                  {totals?.noShows ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily traffic</CardTitle>
              <CardDescription>
                Tickets joined (dark) vs. served (light) per day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={live} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}