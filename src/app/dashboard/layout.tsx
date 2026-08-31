import Link from "next/link";
import { BarChart3, ListOrdered, LayoutDashboard } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/queues", label: "Queues", icon: ListOrdered },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-zinc-200 bg-white px-5 py-6 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-600">
            <svg className="h-4 w-4 text-white" viewBox="0 0 32 32" fill="none">
              <path
                d="M9 10h14M9 16h14M9 22h8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="font-bold tracking-tight text-zinc-950">
            QueueLess
          </span>
        </Link>

        <div className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Icon className="h-4.5 w-4.5 h-5 w-5 text-zinc-400" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-1">
          <Link
            href="/sign-in"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Sign out
          </Link>
        </div>
      </nav>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur lg:px-8">
          <p className="text-sm text-zinc-500">
            Business owner dashboard
          </p>
          <Link
            href="/dashboard/queues/new"
            className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
          >
            New queue
          </Link>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}