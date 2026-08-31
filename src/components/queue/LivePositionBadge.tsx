"use client";

import { cn } from "@/lib/utils";

/**
 * Big animated "position in line" badge used on the live ticket page.
 */
export function LivePositionBadge({
  position,
  totalWaiting,
  isCalled = false,
}: {
  position: number | null;
  totalWaiting: number | null;
  isCalled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "grid h-28 w-28 place-items-center rounded-full shadow-lg ring-4",
          isCalled
            ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
            : "bg-white text-zinc-950 ring-cyan-100"
        )}
      >
        {isCalled ? (
          <span className="animate-pulse-soft text-2xl font-extrabold">
            NOW
          </span>
        ) : (
          <div className="text-center">
            <span className="block text-4xl font-extrabold leading-none">
              #{position ?? "—"}
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              in line
            </span>
          </div>
        )}
      </div>
      {!isCalled && totalWaiting != null && (
        <p className="text-xs text-zinc-400">
          {totalWaiting} more {totalWaiting === 1 ? "person" : "people"} ahead
        </p>
      )}
    </div>
  );
}