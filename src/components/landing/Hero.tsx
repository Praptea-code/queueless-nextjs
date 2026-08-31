import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-10">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-600">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M9 10h14M9 16h14M9 22h8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-zinc-950">
              QueueLess
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-500 sm:flex">
            <Link href="/features" className="transition hover:text-zinc-900">
              Features
            </Link>
            <Link href="/pricing" className="transition hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="/sign-in" className="transition hover:text-zinc-900">
              Sign in
            </Link>
          </div>
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <div className="mx-auto mt-24 max-w-3xl text-center sm:mt-32">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            Skip the wait.
            <br />
            Not the service.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
            Join your favorite clinic, salon, restaurant or repair shop from
            your phone. Track your spot live and get a text the moment you're
            up — no more hovering by the counter.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full bg-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-600/30 transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-8 py-4 text-base font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-8 text-sm text-zinc-400">
            Free for your first queue · No app download needed
          </p>
        </div>
      </div>
    </div>
  );
}