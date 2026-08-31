"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QueueTicketCard } from "@/components/queue/QueueTicketCard";
import { LivePositionBadge } from "@/components/queue/LivePositionBadge";
import { useQueuePosition } from "@/hooks/useQueuePosition";
import { useNotifications } from "@/hooks/useNotifications";
import { useQueueStore } from "@/store/queueStore";
import type { PositionUpdate } from "@/types";

export default function TicketPage({
  params,
}: {
  params: Promise<{ queueSlug: string; ticketId: string }>;
}) {
  const { queueSlug, ticketId } = use(params);
  const setTicket = useQueueStore((s) => s.setTicket);
  const ticket = useQueueStore((s) => s.ticket);
  const [error, setError] = useState<string | null>(null);
  const notifiedRef = useRef(false);
  const { notify, requestPermission } = useNotifications(true);

  // Hydrate the initial ticket snapshot from the API once.
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`);
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          if (!cancelled) setError(data.error ?? "Ticket not found.");
          return;
        }
        const data = (await res.json()) as PositionUpdate & {
          token: string;
          queueName: string;
          customerName: string;
          queueId: string;
        };
        if (cancelled) return;
        setTicket({
          id: ticketId,
          queueId: data.queueId,
          queueName: data.queueName,
          customerName: data.customerName,
          token: data.token,
          position: data.position,
          totalWaiting: data.totalWaiting,
          estimatedMinutes: data.estimatedMinutes,
          status: data.status,
        });
      } catch {
        if (!cancelled) setError("Could not load your ticket right now.");
      }
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [ticketId, setTicket]);

  const live = useQueuePosition(ticket.queueId, ticketId);

  // Toast + browser notification the moment the customer is called.
  useEffect(() => {
    if (live.status === "called" && !notifiedRef.current) {
      notifiedRef.current = true;
      notify(`It's your turn, ${live.customerName ?? "there"}!`, {
        body: "Head up to the front now — your spot is ready.",
        icon: "/icons/logo.svg",
      });
    }
  }, [live.status, live.customerName, notify]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-zinc-900">{error}</p>
          <p className="mt-2 text-sm text-zinc-500">
            <Link href={`/q/${queueSlug}`} className="text-cyan-600 hover:underline">
              Back to the queue
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#fafafa] bg-dots px-6 py-16">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-500">{queueSlug}</p>
          <button
            onClick={() => void requestPermission()}
            className="mt-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
          >
            Enable notifications
          </button>
        </div>

        <LivePositionBadge
          position={live.position}
          totalWaiting={live.totalWaiting}
          isCalled={live.status === "called"}
        />

        <QueueTicketCard />

        <p className="text-center text-xs text-zinc-400">
          Keep this page open — it updates automatically.
        </p>
      </div>
    </div>
  );
}