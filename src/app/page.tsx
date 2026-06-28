"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const services = [
  "Electrician",
  "Plumber",
  "CCTV",
  "Cleaning",
  "AC Repair",
  "Internet",
  "Carpenter",
  "Painter",
];

const problems = [
  "No trust before hiring local workers",
  "No proof after the service is done",
  "No cashback, warranty, or service history",
  "Good providers do not get steady digital jobs",
];

const workflow = [
  "Customer creates protected booking",
  "Provider receives live job alert",
  "Provider accepts or denies request",
  "Work is completed with service code",
  "Cashback is credited to customer",
  "Recommendation updates provider trust score",
];

const revenue = [
  {
    title: "Commission",
    value: "10%",
    text: "EKA earns from every completed protected booking.",
  },
  {
    title: "Provider Plans",
    value: "Pro",
    text: "Providers pay for more visibility and better job access.",
  },
  {
    title: "Verification",
    value: "Trust",
    text: "Verified providers get stronger credibility and ranking.",
  },
  {
    title: "Boosts",
    value: "Featured",
    text: "Premium providers can appear higher in marketplace search.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (city.trim()) params.set("city", city.trim());

    router.push(`/providers?${params.toString()}`);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <style>{`
        @keyframes ekaFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes ekaGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes ekaSlide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes ekaLine {
          0%, 100% {
            width: 20%;
            opacity: 0.45;
          }
          50% {
            width: 82%;
            opacity: 1;
          }
        }

        .eka-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at 50% 22%, black, transparent 72%);
        }

        .eka-card {
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.085),
            rgba(255,255,255,0.035)
          );
          box-shadow: 0 40px 140px rgba(0,0,0,0.45);
          backdrop-filter: blur(24px);
        }

        .eka-soft {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(20px);
        }

        .eka-float {
          animation: ekaFloat 6s ease-in-out infinite;
        }

        .eka-glow {
          animation: ekaGlow 5s ease-in-out infinite;
        }

        .eka-marquee {
          animation: ekaSlide 28s linear infinite;
        }

        .eka-line {
          animation: ekaLine 3.4s ease-in-out infinite;
        }
      `}</style>

      <section className="relative border-b border-white/10">
        <div className="eka-grid pointer-events-none absolute inset-0" />

        <div className="eka-glow pointer-events-none absolute left-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="eka-glow pointer-events-none absolute right-[-220px] top-[20px] h-[620px] w-[620px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-220px] left-[35%] h-[460px] w-[460px] rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-orange-200">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.8)]" />
              Protected service marketplace
            </div>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              Trust layer for local services.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-400 md:text-xl">
              EKA turns random local service calls into protected bookings with
              provider alerts, service code, live chat, cashback, warranty,
              ratings, and a real revenue engine.
            </p>

            <form
              onSubmit={handleSearch}
              className="eka-card mt-9 rounded-[32px] p-3"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_0.7fr_auto]">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search electrician, plumber, CCTV..."
                  className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-orange-400/50"
                />

                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="City"
                  className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-orange-400/50"
                />

                <button className="rounded-2xl bg-white px-7 py-4 font-black text-black transition hover:scale-[1.015]">
                  Find Providers
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/protected-booking"
                className="rounded-full bg-white px-7 py-3.5 font-black text-black transition hover:scale-[1.02]"
              >
                Start Protected Booking
              </Link>

              <Link
                href="/providers"
                className="rounded-full border border-white/10 bg-white/[0.055] px-7 py-3.5 font-black text-white transition hover:bg-white hover:text-black"
              >
                View Marketplace
              </Link>

              <Link
                href="/admin-login"
                className="rounded-full border border-red-400/20 bg-red-500/10 px-7 py-3.5 font-black text-red-200 transition hover:bg-red-500/20"
              >
                Admin Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <Metric value="10%" label="Commission" />
              <Metric value="Live" label="Provider workflow" />
              <Metric value="Cashback" label="Customer retention" />
            </div>
          </div>

          <HeroVisual />
        </div>

        <div className="border-t border-white/10 bg-white/[0.025] py-4">
          <div className="overflow-hidden">
            <div className="eka-marquee flex w-max gap-3 px-5">
              {[...services, ...services, ...services].map((service, index) => (
                <Link
                  key={`${service}-${index}`}
                  href={`/providers?search=${encodeURIComponent(service)}`}
                  className="rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white hover:text-black"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-4xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
            Real problem
          </p>

          <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
            Local service is still unmanaged.
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            EKA gives structure to an offline trust-based market by adding
            proof, accountability, payment logic, cashback, and provider
            scoring.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {problems.map((problem, index) => (
            <div key={problem} className="eka-soft rounded-[34px] p-6">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="text-xl font-black leading-tight">{problem}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-sky-300">
              Demo flow
            </p>

            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
              One workflow judges understand fast.
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Show this flow live in 5 minutes. It proves customer value,
              provider value, and EKA’s revenue model.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 h-[calc(100%-4rem)] w-px bg-white/10" />

            <div className="space-y-4">
              {workflow.map((step, index) => (
                <div key={step} className="relative flex gap-5">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                    {index + 1}
                  </div>

                  <div className="eka-soft flex-1 rounded-[28px] p-5">
                    <h3 className="text-2xl font-black">{step}</h3>
                    <p className="mt-2 leading-7 text-zinc-400">
                      This step keeps the transaction inside EKA through trust,
                      proof, cashback, or accountability.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-4xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-green-300">
            Revenue model
          </p>

          <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
            EKA earns when trust becomes a transaction.
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            The business is not just ads. It is protected bookings, provider
            growth, verification, and marketplace trust.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {revenue.map((item) => (
            <div
              key={item.title}
              className="eka-card rounded-[34px] p-6 transition hover:-translate-y-1"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-600">
                {item.title}
              </p>

              <h3 className="mt-5 text-4xl font-black tracking-[-0.04em] text-green-300">
                {item.value}
              </h3>

              <p className="mt-4 leading-7 text-zinc-400">{item.text}</p>

              <div className="mt-6 h-1 rounded-full bg-white/10">
                <div className="eka-line h-1 rounded-full bg-gradient-to-r from-green-400 to-sky-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="eka-card relative overflow-hidden rounded-[46px] p-8 md:p-12">
          <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[340px] w-[340px] rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
                Final pitch
              </p>

              <h2 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
                Safer for customers. Better income for providers. Revenue for EKA.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                EKA is a protected local service transaction platform for Nepal.
                Not just listings. Not just phone numbers. A full trust and
                revenue layer.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-4 text-center font-black text-black transition hover:scale-[1.02]"
              >
                Join EKA
              </Link>

              <Link
                href="/protected-booking"
                className="rounded-full border border-white/10 bg-black/30 px-8 py-4 text-center font-black text-white transition hover:bg-white hover:text-black"
              >
                Try Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroVisual() {
  return (
    <div className="eka-float relative">
      <div className="absolute -inset-8 rounded-[54px] bg-gradient-to-br from-orange-500/20 via-white/0 to-sky-500/10 blur-3xl" />

      <div className="eka-card relative rounded-[44px] p-5">
        <div className="rounded-[34px] border border-white/10 bg-black/50 p-6">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-600">
                Protected booking
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Live transaction
              </h2>
            </div>

            <span className="rounded-full bg-green-400/10 px-4 py-2 text-xs font-black text-green-300">
              ACTIVE
            </span>
          </div>

          <div className="grid gap-3">
            <MoneyRow label="Customer pays" value="Rs 2,000" />
            <MoneyRow label="EKA commission" value="Rs 200" green />
            <MoneyRow label="Provider earns" value="Rs 1,800" blue />
            <MoneyRow label="Cashback" value="Rs 40" orange />
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.055] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                  Service code
                </p>

                <h3 className="mt-2 text-5xl font-black tracking-[-0.05em]">
                  482913
                </h3>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-black">
                Proof
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Completion, cashback, and recommendation are tied to the booking
              record.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Mini label="Status" value="Accepted" />
            <Mini label="Warranty" value="Active" />
            <Mini label="Trust" value="+4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  green,
  blue,
  orange,
}: {
  label: string;
  value: string;
  green?: boolean;
  blue?: boolean;
  orange?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4">
      <p className="font-bold text-zinc-500">{label}</p>

      <p
        className={`font-black ${
          green
            ? "text-green-300"
            : blue
            ? "text-sky-300"
            : orange
            ? "text-orange-300"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-4">
      <p className="text-xs font-bold text-zinc-600">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-bold text-zinc-500">{label}</p>
    </div>
  );
}