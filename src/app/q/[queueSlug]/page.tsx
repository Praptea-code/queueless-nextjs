import { prisma } from "@/lib/prisma";
import { JoinQueueForm } from "@/components/queue/JoinQueueForm";
import { QueueList } from "@/components/queue/QueueList";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function PublicQueuePage({
  params,
}: {
  params: Promise<{ queueSlug: string }>;
}) {
  const { queueSlug } = await params;

  let queue: {
    id: string;
    name: string;
    serviceType: string;
    status: "active" | "paused" | "closed";
  } | null = null;
  let waitingTickets: {
    id: string;
    customerName: string;
    token: string;
    position: number;
    status: "waiting" | "called";
  }[] = [];
  let dbReady = true;

  try {
    const found = await prisma.queue.findUnique({
      where: { slug: queueSlug },
      select: {
        id: true,
        name: true,
        serviceType: true,
        status: true,
        tickets: {
          where: { status: { in: ["waiting", "called"] } },
          select: {
            id: true,
            customerName: true,
            token: true,
            position: true,
            status: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });
    if (found) queue = found;
    waitingTickets = (found?.tickets ?? []).map((t) => ({
      ...t,
      status: t.status as "waiting" | "called",
    }));
  } catch {
    dbReady = false;
  }

  return (
    <div className="bg-dots min-h-screen">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
              {queue?.name ?? "Join the queue"}
            </h1>
            {queue?.status !== "active" && (
              <Badge variant="warning">
                {queue?.status === "paused" ? "Paused" : "Closed"}
              </Badge>
            )}
          </div>
          <p className="mt-2 text-zinc-500">
            {queue?.serviceType ?? "Virtual queue"} — get a ticket from anywhere,
            watch your spot, and we&apos;ll text you when it&apos;s time.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
            {!dbReady ? (
              <p className="text-sm text-amber-700">
                This queue hasn&apos;t been connected to a database yet. The owner
                needs to set <code className="font-mono">DATABASE_URL</code>.
              </p>
            ) : queue && queue.status === "active" ? (
              <>
                <p className="mb-4 text-sm font-medium text-zinc-700">
                  Take a ticket ·
                  <span className="text-zinc-400"> no app needed</span>
                </p>
                <JoinQueueForm
                  queueId={queue.id}
                  queueName={queue.name}
                  queueSlug={queueSlug}
                />
              </>
            ) : (
              <p className="text-sm text-zinc-500">
                {queue?.status === "paused"
                  ? "This queue is paused right now. Check back soon."
                  : "This queue is closed for today."}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Currently in line
          </h2>
          <QueueList tickets={waitingTickets} />
        </div>
      </div>
    </div>
  );
}