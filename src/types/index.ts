export type QueueStatus = "active" | "paused" | "closed";

export type TicketStatus = "waiting" | "called" | "completed" | "noShow";

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
}

export interface Queue {
  id: string;
  businessId: string;
  name: string;
  serviceType: string;
  slug: string;
  status: QueueStatus;
  createdAt: string;
}

export interface Ticket {
  id: string;
  queueId: string;
  customerName: string;
  customerPhone: string | null;
  token: string;
  position: number;
  status: TicketStatus;
  joinedAt: string;
  calledAt: string | null;
  completedAt: string | null;
}

export interface Notification {
  id: string;
  ticketId: string;
  type: string;
  sentAt: string;
}

/** Payload broadcast over Supabase Realtime after queue events. */
export interface PositionUpdate {
  queueId: string;
  ticketId: string;
  position: number;
  totalWaiting: number;
  status: TicketStatus;
  estimatedMinutes: number;
}

export interface TicketStatusResponse extends PositionUpdate {
  token: string;
  queueName: string;
  queueSlug: string;
}