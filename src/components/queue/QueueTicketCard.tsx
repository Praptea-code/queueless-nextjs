"use client";

import { Badge } from "@/components/ui/badge";
import { formatWaitTime } from "@/lib/utils";
import { useQueueStore } from "@/store/queueStore";
import type { TicketStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<TicketStatus, string> = {
  waiting: "Waiting",
  called: "You're up",
  completed: "Done",
  noShow: "Missed",
};

const statusVariant: Record<
  TicketStatus,
  "outline" | "success" | "warning" | "destructive" | "secondary"
> = {
  waiting: "outline",
  called: "success",
  completed: "secondary",
  noShow: "destructive",
};

export function QueueTicketCard() {
  const ticket = useQueueStore((s) => s.ticket);

  if (!ticket.token || !ticket.position) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-zinc-900/5">
        <p className="text-sm text-zinc-400">No ticket loaded yet.</p>
      </div>
    );
  }

  const called = ticket.status === "called";

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#fafafa]" />
      <div className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#fafafa]" />

      <div
        className={cn(
          "rounded-2xl bg-white p-6 pt-8 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22)] ring-1 ring-zinc-900/5 transition-all",
          called && "ring-2 ring-emerald-400"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              {ticket.queueName ?? "Queue"}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-600">
              {ticket.customerName}
            </p>
          </div>
          <Badge variant={statusVariant[ticket.status ?? "waiting"]}>
            {statusLabel[ticket.status ?? "waiting"]}
          </Badge>
        </div>

        {/* perforation */}
        <div className="relative my-6 flex items-center gap-2">
          <span className="h-0.5 flex-1 border-t-2 border-dashed border-zinc-200" />
          <span className="text-xs font-mono text-zinc-300">~</span>
          <span className="h-0.5 flex-1 border-t-2 border-dashed border-zinc-200" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-zinc-500">Your ticket</p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-tight text-zinc-950">
            {ticket.token}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-zinc-50 p-4 text-center">
            <p className="text-xs font-medium text-zinc-400">
              {called ? "Called" : "Spot in line"}
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold",
                called ? "text-emerald-600" : "text-zinc-900"
              )}
            >
              {called ? "Now" : `#${ticket.position}`}
            </p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-4 text-center">
            <p className="text-xs font-medium text-cyan-700">
              {called ? "Head up" : "Est. wait"}
            </p>
            <p className="mt-1 text-2xl font-bold text-cyan-700">
              {called ? "Please!" : formatWaitTime(ticket.estimatedMinutes ?? 0)}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {ticket.totalWaiting
            ? `${ticket.totalWaiting} ${ticket.totalWaiting === 1 ? "person" : "people"} still waiting`
            : "Updates arrive here automatically."}
        </p>
      </div>
    </div>
  );
}