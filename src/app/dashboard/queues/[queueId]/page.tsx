import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CallNextButton } from "@/components/dashboard/CallNextButton";
import { QueueTable } from "@/components/dashboard/QueueTable";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

export const dynamic = "force-dynamic";

type RowTicket = {
  id: string;
  customerName: string;
  token: string;
  position: number;
  status: "waiting" | "called" | "completed" | "noShow";
  joinedAt: string;
  calledAt: string | null;
};

export default async function QueueDetailPage({
  params,
}: {
  params: Promise<{ queueId: string }>;
}) {
  const { queueId } = await params;

  let queue: {
    id: string;
    name: string;
    slug: string;
    serviceType: string;
    status: "active" | "paused" | "closed";
  } | null = null;
  let tickets: RowTicket[] = [];
  let dbReady = true;

  try {
    const found = await prisma.queue.findUnique({
      where: { id: queueId },
      select: {
        id: true,
        name: true,
        slug: true,
        serviceType: true,
        status: true,
        tickets: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            customerName: true,
            token: true,
            position: true,
            status: true,
            joinedAt: true,
            calledAt: true,
          },
        },
      },
    });
    if (found) {
      queue = found;
      tickets = found.tickets.map((t) => ({
        ...t,
        joinedAt: t.joinedAt.toISOString(),
        calledAt: t.calledAt?.toISOString() ?? null,
      }));
    }
  } catch {
    dbReady = false;
  }

  if (!queue) {
    return (
      <div>
        <p className="text-sm text-zinc-500">
          {dbReady
            ? "Queue not found."
            : "Database not configured — set DATABASE_URL to view queues."}
        </p>
        <Link href="/dashboard/queues" className="text-sm font-semibold text-cyan-600 hover:underline">
          ← Back to queues
        </Link>
      </div>
    );
  }

  const waiting = tickets.filter((t) => t.status === "waiting");
  const publicUrl = `/q/${queue.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-950">{queue.name}</h1>
            <Badge variant={queue.status === "active" ? "success" : "secondary"}>
              {queue.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {queue.serviceType} · {tickets.length} total tickets · {waiting.length} waiting
          </p>
          <button
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
            onClick={() => void navigator.clipboard?.writeText(window.location.origin + publicUrl)}
          >
            <Copy className="h-3 w-3" />
            {publicUrl}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <CallNextButton key={queue.id} queueId={queue.id} disabled={waiting.length === 0} />
          <Link
            href={`/dashboard/queues/${queue.id}/settings`}
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Settings
          </Link>
        </div>
      </div>

      <QueueTable queueId={queue.id} tickets={tickets} />
    </div>
  );
}