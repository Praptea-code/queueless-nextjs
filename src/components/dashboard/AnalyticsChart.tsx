"use client";

import { cn } from "@/lib/utils";

export interface ChartDatum {
  label: string;
  joined: number;
  served: number;
}

/**
 * Lightweight, dependency-free bar chart for the analytics page.
 * Swap for recharts when the real metrics dashboard lands.
 */
export function AnalyticsChart({
  data,
}: {
  data: ChartDatum[];
}) {
  if (data.length === 0) {
    return (
      <div className="grid h-56 place-items-center text-sm text-zinc-400">
        No data yet
      </div>
    );
  }
  const max = Math.max(1, ...data.flatMap((d) => [d.joined, d.served]));

  return (
    <div className="flex h-56 items-end justify-around gap-3 border-b border-zinc-200">
      {data.map((d) => (
        <div
          key={d.label}
          className="group flex flex-1 flex-col items-center gap-1.5"
        >
          <div className="flex w-full max-w-12 flex-col justify-end gap-1 transition-all" style={{ height: 176 }}>
            <div
              className="w-full rounded-t-md bg-cyan-200"
              style={{ height: `${Math.round((d.served / max) * 100)}%` }}
              title={`${d.served} served`}
            />
            <div
              className={cn(
                "w-full rounded-t-md bg-cyan-600",
                d.served === 0 && "rounded-md"
              )}
              style={{ height: `${Math.round((d.joined / max) * 100)}%` }}
              title={`${d.joined} joined`}
            />
          </div>
          <span className="text-xs font-medium text-zinc-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}