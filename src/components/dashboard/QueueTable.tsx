"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "./formatRelative";

interface QueueTicket {
  id: string;
  customerName: string;
  token: string;
  position: number;
  status: "waiting" | "called" | "completed" | "noShow";
  joinedAt: string;
  calledAt: string | null;
}

export function QueueTable({
  queueId,
  tickets,
}: {
  queueId: string;
  tickets: QueueTicket[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function markNoShow(ticketId: string) {
    setBusyId(ticketId);
    try {
      await fetch(`/api/queues/${queueId}/no-show`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
        No customers yet. Share your queue link to get people on the list.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Ticket</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className={ticket.status === "called" ? "bg-emerald-50/40" : undefined}>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-zinc-700">
                {ticket.token}
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900">
                {ticket.customerName}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {formatDistanceToNow(ticket.joinedAt)}
              </td>
              <td className="px-4 py-3 text-right">
                {ticket.status === "waiting" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === ticket.id}
                    onClick={() => markNoShow(ticket.id)}
                  >
                    No-show
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: QueueTicket["status"];
}) {
  const map: Record<QueueTicket["status"], "outline" | "success" | "secondary" | "destructive"> = {
    waiting: "outline",
    called: "success",
    completed: "secondary",
    noShow: "destructive",
  };
  const label = {
    waiting: "Waiting",
    called: "Called",
    completed: "Completed",
    noShow: "No-show",
  }[status];
  return <Badge variant={map[status]}>{label}</Badge>;
}