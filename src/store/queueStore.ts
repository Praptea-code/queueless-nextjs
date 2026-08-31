"use client";

import { create } from "zustand";
import type { TicketStatus } from "@/types";

export interface LiveTicketState {
  id: string | null;
  queueId: string | null;
  queueName: string | null;
  customerName: string | null;
  token: string | null;
  position: number | null;
  totalWaiting: number | null;
  estimatedMinutes: number | null;
  status: TicketStatus | null;
}

const initialTicket: LiveTicketState = {
  id: null,
  queueId: null,
  queueName: null,
  customerName: null,
  token: null,
  position: null,
  totalWaiting: null,
  estimatedMinutes: null,
  status: null,
};

interface QueueStore {
  ticket: LiveTicketState;
  setPosition: (update: {
    position: number;
    totalWaiting?: number;
    estimatedMinutes?: number;
    status?: TicketStatus;
  }) => void;
  setTicket: (partial: Partial<LiveTicketState>) => void;
  clear: () => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  ticket: initialTicket,
  setPosition: (update) =>
    set((state) => ({
      ticket: {
        ...state.ticket,
        position: update.position,
        totalWaiting: update.totalWaiting ?? state.ticket.totalWaiting,
        estimatedMinutes:
          update.estimatedMinutes ?? state.ticket.estimatedMinutes,
        status: update.status ?? state.ticket.status,
      },
    })),
  setTicket: (partial) =>
    set((state) => ({ ticket: { ...state.ticket, ...partial } })),
  clear: () => set({ ticket: initialTicket }),
}));