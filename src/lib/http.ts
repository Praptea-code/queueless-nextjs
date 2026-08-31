import { NextResponse } from "next/server";

export function dbUnavailable(err: unknown) {
  const detail = err instanceof Error ? err.message : String(err);
  return NextResponse.json(
    {
      error:
        "Database not configured. Set DATABASE_URL in .env.local and run `npm run db:push`.",
      detail:
        process.env.NODE_ENV === "development" ? detail : undefined,
    },
    { status: 503 }
  );
}