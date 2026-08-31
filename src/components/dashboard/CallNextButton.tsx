"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BellRing, Loader2 } from "lucide-react";

/**
 * Calls the next waiting customer for a queue and triggers their SMS alert.
 */
export function CallNextButton({
  queueId,
  disabled = false,
}: {
  queueId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function callNext() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/queues/${queueId}/call-next`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Could not call next customer.");
        return;
      }
      setMessage(
        `Called ${data.ticket?.customerName} (${data.ticket?.token}).`
      );
      router.refresh();
    } catch {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={callNext} disabled={loading || disabled} size="lg">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <BellRing className="h-4 w-4" />
        )}
        Call next
      </Button>
      {message && <span className="text-sm text-zinc-500">{message}</span>}
    </div>
  );
}