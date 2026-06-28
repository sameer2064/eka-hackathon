import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07080a] px-5 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-4xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
            Choose your EKA workspace
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">
            One platform. Different dashboards for different users.
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Customers book services. Providers manage work. Admins control trust,
            revenue and platform quality.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <RoleCard
            title="Customer Dashboard"
            description="Track bookings, cashback, warranty, service code and dispute support."
            href="/customer"
            cta="Open Customer Dashboard"
            accent="from-sky-500 to-cyan-400"
            points={[
              "My bookings",
              "Warranty status",
              "Cashback rewards",
              "Book again",
            ]}
          />

          <RoleCard
            title="Provider Dashboard"
            description="Manage incoming jobs, earnings, trust score, profile and premium visibility."
            href="/provider-dashboard"
            cta="Open Provider Dashboard"
            accent="from-orange-500 to-red-500"
            points={[
              "Incoming bookings",
              "Provider earnings",
              "Trust score",
              "Premium status",
            ]}
          />

          <RoleCard
            title="Admin Dashboard"
            description="Control providers, revenue, protected bookings, cashback and marketplace quality."
            href="/admin/revenue"
            cta="Open Admin Revenue"
            accent="from-emerald-500 to-green-400"
            points={[
              "Platform revenue",
              "Provider approvals",
              "Commission tracking",
              "Marketplace health",
            ]}
          />
        </div>
      </section>
    </main>
  );
}

function RoleCard({
  title,
  description,
  href,
  cta,
  accent,
  points,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: string;
  points: string[];
}) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className={`mb-8 h-2 w-24 rounded-full bg-gradient-to-r ${accent}`} />

      <h2 className="text-3xl font-black">{title}</h2>

      <p className="mt-4 min-h-[96px] leading-7 text-zinc-400">
        {description}
      </p>

      <div className="mt-6 space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-zinc-300"
          >
            {point}
          </div>
        ))}
      </div>

      <Link
        href={href}
        className="mt-8 block rounded-2xl bg-white px-5 py-4 text-center font-black text-black transition hover:scale-[1.02]"
      >
        {cta}
      </Link>
    </div>
  );
}