"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

type Service = {
  icon: string;
  en: string;
  np: string;
  color: string;
  href: string;
};

export default function HomePage() {
  const router = useRouter();
  const { lang } = useI18n();
  const isNp = lang === "np";

  const [service, setService] = useState("");
  const [city, setCity] = useState("");

  const copy = {
    badge: isNp ? "नेपालको स्मार्ट सेवा नेटवर्क" : "Nepal’s Smart Service Network",
    title1: isNp ? "सेवा चाहियो?" : "Need trusted help?",
    title2: isNp ? "EKA ले मिलाउँछ।" : "EKA finds the right pro.",
    subtitle: isNp
      ? "प्लम्बर, इलेक्ट्रिसियन, CCTV, क्लिनिङ, पेन्टर र स्थानीय पेशेवरहरू — छिटो, सरल र भरोसायोग्य।"
      : "Book plumbers, electricians, CCTV installers, cleaners, painters and verified local professionals — fast, simple and trusted.",
    searchService: isNp ? "सेवा खोज्नुहोस्" : "Search service",
    searchCity: isNp ? "शहर" : "City",
    find: isNp ? "Find Pro" : "Find Pro",
    explore: isNp ? "Explore Providers" : "Explore Providers",
    provider: isNp ? "Become Provider" : "Become Provider",
    live: isNp ? "लाइभ सेवा गतिविधि" : "Live Service Activity",
    popular: isNp ? "Popular Services" : "Popular Services",
    aiTitle: isNp ? "AI ले राम्रो प्रदायक अगाडि ल्याउँछ" : "AI ranks the best providers first",
    aiText: isNp
      ? "EKA ले rating, city, trust score, booking activity र AI match हेरेर राम्रो सेवा प्रदायक देखाउँछ।"
      : "EKA compares rating, city, trust score, booking activity and AI match to surface stronger providers.",
    howTitle: isNp ? "एकदम सरल प्रक्रिया" : "A dead-simple booking flow",
    finalTitle: isNp ? "अब सेवा खोज्न झन्झट छैन।" : "Stop searching randomly. Use EKA.",
    finalText: isNp
      ? "ग्राहकले सेवा पाउँछन्। प्रदायकले काम पाउँछन्। नेपालले राम्रो सेवा marketplace पाउँछ।"
      : "Customers get help. Providers get work. Nepal gets a smarter service marketplace.",
  };

  const services: Service[] = useMemo(
    () => [
      {
        icon: "🔧",
        en: "Plumber",
        np: "प्लम्बर",
        color: "from-sky-500 to-cyan-400",
        href: "/providers?category=plumber",
      },
      {
        icon: "⚡",
        en: "Electrician",
        np: "इलेक्ट्रिसियन",
        color: "from-yellow-400 to-orange-500",
        href: "/providers?category=electrician",
      },
      {
        icon: "📷",
        en: "CCTV",
        np: "CCTV",
        color: "from-violet-500 to-fuchsia-500",
        href: "/providers?category=cctv",
      },
      {
        icon: "🧹",
        en: "Cleaning",
        np: "क्लिनिङ",
        color: "from-emerald-400 to-teal-500",
        href: "/providers?category=cleaning",
      },
      {
        icon: "🎨",
        en: "Painter",
        np: "पेन्टर",
        color: "from-rose-500 to-red-500",
        href: "/providers?category=painter",
      },
      {
        icon: "🪚",
        en: "Carpenter",
        np: "कार्पेन्टर",
        color: "from-amber-600 to-orange-400",
        href: "/providers?category=carpenter",
      },
    ],
    []
  );

  function handleSearch() {
    const params = new URLSearchParams();
    if (service.trim()) params.set("search", service.trim());
    if (city.trim()) params.set("city", city.trim());

    router.push(params.toString() ? `/providers?${params.toString()}` : "/providers");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030305] text-white">
      <style jsx global>{`
        @keyframes eka-float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(2deg);
          }
        }

        @keyframes eka-float-soft {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes eka-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes eka-pulse-ring {
          0% {
            transform: scale(0.85);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes eka-scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(420%);
          }
        }

        @keyframes eka-shine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes eka-spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .eka-animated-grid {
          background-image: linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(circle at top, black, transparent 72%);
        }

        .eka-glow-card {
          position: relative;
          overflow: hidden;
        }

        .eka-glow-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          background: linear-gradient(
            120deg,
            rgba(239, 68, 68, 0),
            rgba(239, 68, 68, 0.55),
            rgba(251, 146, 60, 0.25),
            rgba(239, 68, 68, 0)
          );
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .eka-glow-card:hover::before {
          opacity: 1;
        }

        .eka-glow-card > * {
          position: relative;
          z-index: 1;
        }

        .eka-shine {
          position: relative;
          overflow: hidden;
        }

        .eka-shine::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 45%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent
          );
          transform: translateX(-120%);
          animation: eka-shine 3.2s infinite;
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#030305]" />
        <div className="eka-animated-grid absolute inset-0 opacity-70" />

        <div className="absolute -left-28 top-0 h-[520px] w-[520px] rounded-full bg-red-600/25 blur-[120px]" />
        <div className="absolute right-[-120px] top-28 h-[540px] w-[540px] rounded-full bg-orange-500/20 blur-[130px]" />
        <div className="absolute bottom-[-150px] left-1/3 h-[540px] w-[540px] rounded-full bg-fuchsia-600/10 blur-[140px]" />

        <div className="absolute left-1/2 top-24 h-[260px] w-[260px] rounded-full border border-red-500/20 opacity-60" />
        <div
          className="absolute left-[54%] top-36 h-[200px] w-[200px] rounded-full border border-orange-400/20 opacity-50"
          style={{ animation: "eka-spin-slow 22s linear infinite" }}
        />
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-red-400/20 bg-white/[0.06] px-4 py-2 shadow-2xl backdrop-blur-xl">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>
              <span className="text-sm font-black text-red-100">{copy.badge}</span>
            </div>

            <h1 className="max-w-5xl text-[52px] font-black leading-[0.9] tracking-[-0.06em] md:text-[82px] lg:text-[96px]">
              <span className="block">{copy.title1}</span>
              <span className="block bg-gradient-to-r from-red-400 via-orange-300 to-white bg-clip-text text-transparent">
                {copy.title2}
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-zinc-300 md:text-xl">
              {copy.subtitle}
            </p>

            {/* SEARCH */}
            <div className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.08] p-3 shadow-[0_30px_120px_rgba(239,68,68,0.18)] backdrop-blur-2xl">
              <div className="grid gap-3 md:grid-cols-[1.2fr_0.75fr_auto]">
                <div className="group flex items-center gap-3 rounded-[24px] border border-white/5 bg-black/45 px-5 py-5 transition focus-within:border-red-400/50">
                  <span className="text-2xl">🔎</span>
                  <input
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder={copy.searchService}
                    className="w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-zinc-500"
                  />
                </div>

                <div className="group flex items-center gap-3 rounded-[24px] border border-white/5 bg-black/45 px-5 py-5 transition focus-within:border-orange-400/50">
                  <span className="text-2xl">📍</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={copy.searchCity}
                    className="w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-zinc-500"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  className="eka-shine rounded-[24px] bg-gradient-to-r from-red-500 via-orange-500 to-red-500 px-8 py-5 text-base font-black text-white shadow-[0_22px_70px_rgba(239,68,68,0.45)] transition hover:scale-[1.03] active:scale-[0.98]"
                >
                  {copy.find}
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/providers"
                className="rounded-full bg-white px-8 py-4 text-sm font-black text-black shadow-2xl transition hover:-translate-y-1 hover:scale-105"
              >
                {copy.explore}
              </Link>

              <Link
                href="/become-provider"
                className="rounded-full border border-white/10 bg-white/[0.07] px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
              >
                {copy.provider}
              </Link>
            </div>

            {/* SMALL PROOF */}
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <MiniProof value="98%" label={isNp ? "AI Match" : "AI Match"} />
              <MiniProof value="120+" label={isNp ? "Providers" : "Providers"} />
              <MiniProof value="18+" label={isNp ? "Cities" : "Cities"} />
            </div>
          </div>

          {/* RIGHT HERO VISUAL */}
          <div className="relative min-h-[640px]">
            <div
              className="absolute left-4 top-4 h-72 w-72 rounded-full bg-red-500/20 blur-[90px]"
              style={{ animation: "eka-float 6s ease-in-out infinite" }}
            />

            {/* Main phone/dashboard */}
            <div
              className="absolute left-1/2 top-10 w-[92%] max-w-[460px] -translate-x-1/2 rounded-[46px] border border-white/10 bg-white/[0.08] p-4 shadow-[0_40px_140px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
              style={{ animation: "eka-float 7s ease-in-out infinite" }}
            >
              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[#08080b]">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 p-6">
                  <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/25 blur-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white/75">EKA AI MATCH</p>
                      <h3 className="mt-2 text-4xl font-black leading-none">
                        98%
                      </h3>
                    </div>

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black/25 backdrop-blur">
                      <span
                        className="absolute h-full w-full rounded-full border border-white/60"
                        style={{ animation: "eka-pulse-ring 1.8s ease-out infinite" }}
                      />
                      <span className="text-4xl">🤖</span>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 rounded-2xl bg-black/25 p-3 backdrop-blur">
                    <div className="h-2 rounded-full bg-white/20">
                      <div className="h-2 w-[88%] rounded-full bg-white" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-white/80">
                      Trust + Rating + Location + Response Speed
                    </p>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <SmartProvider
                    icon="⚡"
                    name="Ramesh Electric Works"
                    meta="Kathmandu · 4.9 ⭐"
                    score="98"
                    hot
                  />
                  <SmartProvider
                    icon="🔧"
                    name="Quick Fix Plumbing"
                    meta="Lalitpur · 4.8 ⭐"
                    score="94"
                  />
                  <SmartProvider
                    icon="📷"
                    name="Secure CCTV Nepal"
                    meta="Pokhara · 4.7 ⭐"
                    score="91"
                  />
                </div>
              </div>
            </div>

            {/* Floating service cards */}
            <FloatingBubble
              className="left-0 top-14"
              icon="🔧"
              title="Plumber"
              color="from-sky-400 to-cyan-400"
              delay="0s"
            />
            <FloatingBubble
              className="right-0 top-24"
              icon="⚡"
              title="Electrician"
              color="from-yellow-300 to-orange-500"
              delay="0.7s"
            />
            <FloatingBubble
              className="bottom-24 left-4"
              icon="🛡️"
              title="Verified"
              color="from-green-400 to-emerald-500"
              delay="1.1s"
            />
            <FloatingBubble
              className="bottom-10 right-6"
              icon="📍"
              title="Nearby"
              color="from-red-400 to-orange-500"
              delay="1.5s"
            />
          </div>
        </div>
      </section>

      {/* MOVING SERVICE STRIP */}
      <section className="border-y border-white/10 bg-white/[0.04] py-5 backdrop-blur-xl">
        <div className="flex overflow-hidden">
          <div
            className="flex min-w-max gap-4 px-4"
            style={{ animation: "eka-slide 24s linear infinite" }}
          >
            {[...services, ...services, ...services].map((item, index) => (
              <Link
                key={`${item.en}-${index}`}
                href={item.href}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 transition hover:border-red-400/50 hover:bg-white/10"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-black">{isNp ? item.np : item.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              {isNp ? "ट्याप गरेर खोज्नुहोस्" : "Tap to discover"}
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              {copy.popular}
            </h2>
          </div>

          <Link
            href="/providers"
            className="w-fit rounded-full border border-white/10 bg-white/[0.07] px-7 py-4 text-sm font-black transition hover:bg-white/[0.13]"
          >
            {isNp ? "सबै प्रदायक हेर्नुहोस् →" : "View all providers →"}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {services.map((item, index) => (
            <Link
              key={item.en}
              href={item.href}
              className="eka-glow-card group rounded-[32px] border border-white/10 bg-white/[0.055] p-[1px] transition hover:-translate-y-2"
              style={{ animation: `eka-float-soft ${5 + index * 0.25}s ease-in-out infinite` }}
            >
              <div className="h-full rounded-[31px] bg-[#08080b]/95 p-5">
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-4xl shadow-2xl transition group-hover:scale-110 group-hover:rotate-6`}
                >
                  {item.icon}
                </div>

                <h3 className="text-xl font-black">{isNp ? item.np : item.en}</h3>
                <p className="mt-2 text-sm font-semibold text-zinc-500">
                  {isNp ? "नजिकै उपलब्ध" : "Nearby available"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI ENGINE SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-orange-300">
              EKA INTELLIGENCE
            </p>
            <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              {copy.aiTitle}
            </h2>
            <p className="mt-6 text-lg font-medium leading-8 text-zinc-400">
              {copy.aiText}
            </p>

            <div className="mt-8 grid gap-3">
              <AiPoint text={isNp ? "Trust score based provider sorting" : "Trust-score based provider sorting"} />
              <AiPoint text={isNp ? "City and service category matching" : "City and service category matching"} />
              <AiPoint text={isNp ? "Premium and verified visibility system" : "Premium and verified visibility system"} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#08080b] p-6 shadow-2xl">
            <div
              className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-red-500/15 to-transparent"
              style={{ animation: "eka-scan 3s linear infinite" }}
            />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-zinc-500">MATCHING ENGINE</p>
                  <h3 className="mt-1 text-3xl font-black">Provider Ranking</h3>
                </div>
                <span className="rounded-full bg-green-400/10 px-4 py-2 text-sm font-black text-green-300">
                  LIVE
                </span>
              </div>

              <div className="space-y-4">
                <RankingBar label="Trust Score" value={96} color="from-green-400 to-emerald-500" />
                <RankingBar label="AI Match" value={98} color="from-red-400 to-orange-500" />
                <RankingBar label="Response Speed" value={88} color="from-sky-400 to-cyan-500" />
                <RankingBar label="Booking Quality" value={91} color="from-violet-400 to-fuchsia-500" />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <GlassMetric value="4.9" label="Avg Rating" />
                <GlassMetric value="12m" label="Avg Response" />
                <GlassMetric value="98%" label="Safe Match" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-[48px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="mb-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              {isNp ? "सरल प्रक्रिया" : "Simple process"}
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              {copy.howTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <StepCard
              number="01"
              icon="🔎"
              title={isNp ? "सेवा खोज्नुहोस्" : "Search"}
              text={isNp ? "सेवा र शहर राख्नुहोस्।" : "Enter service and city."}
            />
            <StepCard
              number="02"
              icon="🤖"
              title={isNp ? "AI मिलान हेर्नुहोस्" : "AI Match"}
              text={isNp ? "रेटिङ र ट्रस्ट अनुसार प्रदायक छान्नुहोस्।" : "Compare ranked providers."}
            />
            <StepCard
              number="03"
              icon="✅"
              title={isNp ? "बुकिङ पठाउनुहोस्" : "Book"}
              text={isNp ? "सेकेन्डमै request पठाउनुहोस्।" : "Send request in seconds."}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-14">
        <div className="relative overflow-hidden rounded-[52px] border border-white/10 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 p-8 shadow-[0_40px_160px_rgba(239,68,68,0.4)] md:p-16">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/25 blur-[100px]" />
          <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-black/20 blur-[90px]" />

          <div className="relative z-10 max-w-4xl">
            <h2 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              {copy.finalTitle}
            </h2>
            <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-white/85 md:text-xl">
              {copy.finalText}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/providers"
                className="rounded-full bg-white px-9 py-5 text-sm font-black text-black shadow-2xl transition hover:-translate-y-1 hover:scale-105"
              >
                {copy.explore}
              </Link>
              <Link
                href="/become-provider"
                className="rounded-full border border-white/30 bg-black/20 px-9 py-5 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-black/30"
              >
                {copy.provider}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniProof({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-zinc-500">{label}</p>
    </div>
  );
}

function SmartProvider({
  icon,
  name,
  meta,
  score,
  hot = false,
}: {
  icon: string;
  name: string;
  meta: string;
  score: string;
  hot?: boolean;
}) {
  return (
    <div className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.055] p-4 transition hover:border-red-400/40 hover:bg-white/[0.09]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/45 text-3xl transition group-hover:scale-110">
          {icon}
        </div>
        <div>
          <h4 className="font-black">{name}</h4>
          <p className="mt-1 text-sm font-semibold text-zinc-500">{meta}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={hot ? "text-sm font-black text-green-300" : "text-sm font-black text-red-300"}>
          AI {score}
        </p>
        <p className="text-xs font-bold text-zinc-500">Verified</p>
      </div>
    </div>
  );
}

function FloatingBubble({
  icon,
  title,
  color,
  className,
  delay,
}: {
  icon: string;
  title: string;
  color: string;
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-20 rounded-[28px] border border-white/10 bg-black/45 p-3 shadow-2xl backdrop-blur-xl ${className}`}
      style={{ animation: "eka-float 5.5s ease-in-out infinite", animationDelay: delay }}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${color} p-3 text-3xl`}>
          {icon}
        </div>
        <p className="pr-2 text-sm font-black">{title}</p>
      </div>
    </div>
  );
}

function AiPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-400/15 text-sm text-green-300">
        ✓
      </span>
      <span className="font-bold text-zinc-300">{text}</span>
    </div>
  );
}

function RankingBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black text-zinc-300">{label}</p>
        <p className="text-sm font-black text-white">{value}%</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function GlassMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold text-zinc-500">{label}</p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[34px] border border-white/10 bg-black/35 p-7 transition hover:-translate-y-2 hover:border-red-400/40 hover:bg-black/50">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-6xl transition group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
        <p className="text-6xl font-black text-white/10">{number}</p>
      </div>

      <h3 className="text-3xl font-black">{title}</h3>
      <p className="mt-4 text-lg font-medium leading-7 text-zinc-400">{text}</p>
    </div>
  );
}