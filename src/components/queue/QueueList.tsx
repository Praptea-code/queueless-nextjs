"use client";

import { cn } from "@/lib/utils";

interface PublicTicket {
  id: string;
  customerName: string;
  token: string;
  position: number;
  status: "waiting" | "called";
}

/**
 * Public "who's in line" list for the join page.
 * Customer names are shortened to maintain a little privacy.
 */
export function QueueList({ tickets }: { tickets: PublicTicket[] }) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
        The queue is empty right now — be the first to join!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-sm">
      {tickets.map((ticket, index) => (
        <li
          key={ticket.id}
          className={cn(
            "flex items-center justify-between px-5 py-4",
            index === 0 && "rounded-t-xl bg-cyan-50/50"
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                index === 0
                  ? "bg-cyan-600 text-white"
                  : "bg-zinc-100 text-zinc-600"
              )}
            >
              {shortName(ticket.customerName)}
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {ticket.customerName}
              </p>
              <p className="text-xs text-zinc-400">{ticket.token}</p>
            </div>
          </div>
          {ticket.status === "called" ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Being served
            </span>
          ) : (
            <span className="text-sm font-semibold text-zinc-400">
              #{ticket.position}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}