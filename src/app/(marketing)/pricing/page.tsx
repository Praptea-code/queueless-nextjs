import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Solo",
    price: "$0",
    period: "/mo",
    description: "For one shop testing the waters.",
    features: ["1 queue", "50 tickets / month", "SMS alerts", "Live position"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For busy storefronts that hate lines.",
    features: [
      "Unlimited queues",
      "Unlimited tickets",
      "AI wait + no-show insights",
      "Conversational check-in",
      "Analytics dashboard",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Multi-site",
    price: "Custom",
    period: "",
    description: "For chains and multi-location businesses.",
    features: [
      "Everything in Pro",
      "Unified reporting",
      "SSO & team roles",
      "Dedicated support",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-dots min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">
          ← Back to home
        </Link>
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
            Simple pricing. No lines.
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            Start free. Upgrade when your waitlist outgrows a clipboard.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 ring-1 transition ${
                plan.highlighted
                  ? "ring-2 ring-cyan-600 shadow-xl shadow-cyan-600/10"
                  : "ring-zinc-900/5 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-bold text-zinc-900">{plan.name}</h2>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-950">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-400">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-zinc-500">{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-50">
                      <Check className="h-3.5 w-3.5 text-cyan-600" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`mt-10 block rounded-full py-3 text-center text-sm font-semibold ${
                  plan.highlighted
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}