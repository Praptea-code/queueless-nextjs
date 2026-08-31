import Link from "next/link";
import { Bell, Clock, MapPin, Sparkles } from "lucide-react";

const sections = [
  {
    icon: MapPin,
    eyebrow: "Join",
    title: "Customers join from their phones",
    body: "Scan a QR code on the counter or open your share link. A name and a phone number is all it takes — no app download, no account.",
  },
  {
    icon: Clock,
    eyebrow: "Track",
    title: "Live position with smart wait estimates",
    body: "Every ticket sees its spot in line update in real time. Estimated wait times are predicted from how the queue has actually been moving.",
  },
  {
    icon: Bell,
    eyebrow: "Alert",
    title: "SMS alerts when it's time",
    body: "Customers get a text when their turn is close. They step away freely — coffee run, parking, errand — and still don't miss their call.",
  },
  {
    icon: Sparkles,
    eyebrow: "Optimize",
    title: "AI no-show risk & conversational check-in",
    body: "Flag likely no-shows before they stall your queue, and let customers text to confirm, reschedule or cancel — parsed automatically.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-dots min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
          ← Back to home
        </Link>
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
            Everything a line shouldn&apos;t be
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            QueueLess turns the worst part of visiting a business into the best
            part — never waiting for it.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-900/5"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100">
                  <Icon className="h-6 w-6 text-cyan-600" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-600">
                  {section.eyebrow}
                </p>
                <h2 className="mt-2 text-xl font-bold text-zinc-900">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-zinc-500">
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/sign-up"
            className="inline-flex rounded-full bg-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-600/30 transition hover:bg-cyan-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}