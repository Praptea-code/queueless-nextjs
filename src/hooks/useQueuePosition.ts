"use client";

import { useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useQueueStore } from "@/store/queueStore";
import type { PositionUpdate, TicketStatusResponse } from "@/types";

/**
 * Live position tracking for a given ticket.
 * Subscribes to Supabase Realtime when configured; otherwise falls back
 * to polling the ticket status endpoint every 15s.
 */
export function useQueuePosition(
  queueId: string | null | undefined,
  ticketId: string | null | undefined
) {
  const setPosition = useQueueStore((s) => s.setPosition);
  const ticket = useQueueStore((s) => s.ticket);

  useEffect(() => {
    if (!queueId || !ticketId) return;

    if (!isSupabaseConfigured) {
      let pollTimer: ReturnType<typeof setInterval> | undefined;

      const poll = async () => {
        try {
          const res = await fetch(`/api/tickets/${ticketId}`);
          if (!res.ok) return;
          const data = (await res.json()) as TicketStatusResponse;
          setPosition({
            position: data.position,
            totalWaiting: data.totalWaiting,
            estimatedMinutes: data.estimatedMinutes,
            status: data.status,
          });
        } catch {
          // network hiccup — next poll will retry
        }
      };

      void poll();
      pollTimer = setInterval(poll, 15000);
      return () => clearInterval(pollTimer);
    }

    const channel = supabase!
      .channel(`queue-position:${queueId}`)
      .on(
        "broadcast",
        { event: "position-update" },
        (msg) => {
          const update = msg.payload as PositionUpdate;
          if (update.ticketId !== ticketId) return;
          setPosition({
            position: update.position,
            totalWaiting: update.totalWaiting,
            estimatedMinutes: update.estimatedMinutes,
            status: update.status,
          });
        }
      )
      .subscribe();

    return () => {
      void supabase!.removeChannel(channel);
    };
  }, [queueId, ticketId, setPosition]);

  return ticket;
}