import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-600">
            <svg className="h-4 w-4 text-white" viewBox="0 0 32 32" fill="none">
              <path
                d="M9 10h14M9 16h14M9 22h8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} QueueLess. Skip the wait. Not the
            service.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-zinc-500">
          <Link href="/features" className="transition hover:text-zinc-900">
            Features
          </Link>
          <Link href="/pricing" className="transition hover:text-zinc-900">
            Pricing
          </Link>
          <Link href="/sign-up" className="transition hover:text-zinc-900">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}