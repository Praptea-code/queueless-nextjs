"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const queueStatuses = ["active", "paused", "closed"] as const;

export default function QueueSettingsPage({
  params,
}: {
  params: Promise<{ queueId: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"active" | "paused" | "closed">("active");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const current = await params;
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/queues/${current.queueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not update the queue.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-zinc-950">Queue settings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pause or close a queue to stop new joins.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>
            <span className="font-medium text-zinc-700">active</span> accepts new
            customers · <span className="font-medium text-zinc-700">paused</span>{" "}
            holds the line · <span className="font-medium text-zinc-700">closed</span>{" "}
            ends the queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex gap-2">
              {queueStatuses.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition ${
                    status === option
                      ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {saved && <p className="text-sm text-emerald-600">Saved.</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}