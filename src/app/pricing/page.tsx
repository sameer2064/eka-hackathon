import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "Rs 0",
    badge: "Start",
    description: "For new providers joining EKA.",
    features: [
      "Basic provider profile",
      "Limited visibility",
      "Manual booking requests",
      "Trust score starts from 70",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Rs 999/mo",
    badge: "Most Practical",
    description: "For providers who want more bookings.",
    features: [
      "Higher ranking in search",
      "Verified badge priority",
      "Portfolio gallery",
      "Provider analytics",
      "More booking leads",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Elite",
    price: "Rs 2499/mo",
    badge: "Maximum Growth",
    description: "For serious businesses and agencies.",
    features: [
      "Top category visibility",
      "Featured homepage placement",
      "Emergency booking boost",
      "Business verified badge",
      "Priority support",
    ],
    cta: "Become Elite",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[130px]" />
        <div className="absolute right-0 top-32 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-red-400">
            Provider Revenue Model
          </p>

          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
            EKA earns when providers grow.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Subscription, lead credits, commission, featured ads, verification
            and protected booking fees make EKA a real business.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[36px] border p-6 shadow-2xl backdrop-blur-xl ${
                plan.highlight
                  ? "border-red-400/40 bg-red-500/10"
                  : "border-white/10 bg-white/[0.055]"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-black">{plan.name}</h2>
                <span
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    plan.highlight
                      ? "bg-red-500 text-white"
                      : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              <p className="text-zinc-400">{plan.description}</p>

              <h3 className="mt-7 text-5xl font-black">{plan.price}</h3>

              <div className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-2xl bg-black/40 p-4"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-400/15 text-green-300">
                      ✓
                    </span>
                    <p className="font-bold text-zinc-300">{feature}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/protected-booking"
                className={`mt-8 block rounded-2xl px-6 py-4 text-center font-black transition hover:scale-[1.02] ${
                  plan.highlight
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl font-black">Other Revenue Streams</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <RevenueItem title="Booking Commission" value="8–12%" />
            <RevenueItem title="Lead Credits" value="Rs 500+" />
            <RevenueItem title="Verification Fee" value="Rs 299+" />
            <RevenueItem title="Featured Ads" value="Rs 150/day" />
            <RevenueItem title="Emergency Boost" value="Rs 100/job" />
            <RevenueItem title="Warranty Fee" value="Optional" />
          </div>
        </div>
      </section>
    </main>
  );
}

function RevenueItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/45 p-5">
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <h3 className="mt-2 text-3xl font-black text-white">{value}</h3>
    </div>
  );
}