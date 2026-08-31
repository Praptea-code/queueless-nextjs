import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  rotation: string;
  ticket: string;
}

const features: Feature[] = [
  {
    icon: MapPin,
    title: "Join from anywhere",
    description:
      "No need to show up early or hover by the counter. Get on the list the moment you're ready.",
    rotation: "-rotate-1",
    ticket: "T-104",
  },
  {
    icon: Clock,
    title: "Live position tracking",
    description:
      "Watch your spot in the queue tick down in real time as people get served.",
    rotation: "rotate-1",
    ticket: "T-105",
  },
  {
    icon: Bell,
    title: "Smart SMS alerts",
    description:
      "We text you when you're up next — step away freely and we'll give you a heads-up.",
    rotation: "-rotate-1",
    ticket: "T-106",
  },
  {
    icon: CheckCircle2,
    title: "Predictable wait times",
    description:
      "AI-powered estimates sized from how the queue has actually been moving today.",
    rotation: "rotate-2",
    ticket: "T-107",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="mb-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">
          Why QueueLess
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          A better way to wait
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500">
          Paper tickets, endless loops and jammed waiting rooms are a thing of
          the past. Here&apos;s what you get instead.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <TicketCard key={feature.ticket} feature={feature} />
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <Link
          href="/sign-up"
          className="rounded-full bg-zinc-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-zinc-800"
        >
          Start for free
        </Link>
      </div>
    </section>
  );
}

function TicketCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div
      className={`relative ${feature.rotation} transition-transform duration-300 hover:rotate-0`}
    >
      {/* ticket notches */}
      <div className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#fafafa]" />
      <div className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#fafafa]" />

      <div
        className="relative flex h-full flex-col gap-5 rounded-2xl bg-white p-6 pt-7 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22)] ring-1 ring-zinc-900/5"
        // keep notches anchored to the perforation line
      >
        <div className="flex items-start justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 ring-1 ring-cyan-100">
            <Icon className="h-6 w-6 text-cyan-600" strokeWidth={2.2} />
          </div>
          <span className="font-mono text-xs font-medium text-zinc-400">
            #{feature.ticket}
          </span>
        </div>

        {/* perforation */}
        <div className="relative flex items-center gap-2">
          <span className="h-0.5 flex-1 border-t-2 border-dashed border-zinc-200" />
          <svg
            className="h-3 w-3 text-zinc-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2a6 6 0 0 0-6 6c0 4 6 14 6 14s6-10 6-14a6 6 0 0 0-6-6Z" />
          </svg>
          <span className="h-0.5 flex-1 border-t-2 border-dashed border-zinc-200" />
        </div>

        <div>
          <h3 className="text-base font-bold text-zinc-900">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}