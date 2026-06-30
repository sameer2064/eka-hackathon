"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

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

export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();
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
      <section className="relative min-h-screen border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(239,68,68,0.20),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:radial-gradient(circle_at_50%_25%,black,transparent_75%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-44 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-red-400/20 bg-red-500/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-red-200">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
              {t("Protected local service platform", "सुरक्षित स्थानीय सेवा प्लेटफर्म")}
            </div>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              {t("Book trusted local services.", "विश्वसनीय स्थानीय सेवा बुक गर्नुहोस्।")}
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-400 md:text-xl">
              {t(
                "EKA helps customers find verified providers, create protected bookings, track service status, receive cashback, and build trust through recommendations.",
                "EKA ले ग्राहकलाई प्रमाणित सेवा प्रदायक खोज्न, सुरक्षित बुकिङ गर्न, सेवा ट्र्याक गर्न, क्यासब्याक पाउन र विश्वास निर्माण गर्न मद्दत गर्छ।"
              )}
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-9 rounded-[34px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_0.7fr_auto]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("Search electrician, plumber, CCTV...", "इलेक्ट्रिसियन, प्लम्बर, CCTV खोज्नुहोस्...")}
                  className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
                />

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t("City", "शहर")}
                  className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
                />

                <button className="rounded-2xl bg-white px-7 py-4 font-black text-black transition hover:scale-[1.02]">
                  {t("Find", "खोज्नुहोस्")}
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/protected-booking"
                className="rounded-full bg-white px-7 py-3.5 font-black text-black transition hover:scale-[1.02]"
              >
                {t("Start Booking", "बुकिङ सुरु गर्नुहोस्")}
              </Link>

              <Link
                href="/providers"
                className="rounded-full border border-white/10 bg-white/[0.055] px-7 py-3.5 font-black text-white transition hover:bg-white hover:text-black"
              >
                {t("View Providers", "प्रदायकहरू हेर्नुहोस्")}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <Metric value="Trust" label={t("Verified providers", "प्रमाणित प्रदायक")} />
              <Metric value="Proof" label={t("Service records", "सेवा रेकर्ड")} />
              <Metric value="Cashback" label={t("Customer retention", "ग्राहक फिर्ता")} />
            </div>
          </div>

          <HeroCard />
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.025] py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-5">
          {services.map((service) => (
            <Link
              key={service}
              href={`/providers?search=${encodeURIComponent(service)}`}
              className="rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white hover:text-black"
            >
              {service}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle
          eyebrow={t("Real problem", "वास्तविक समस्या")}
          title={t("Local service is still based on guesswork.", "स्थानीय सेवा अझै अनुमान र चिनजानमा चल्छ।")}
          text={t(
            "People call random numbers, trust unknown workers, and have no proof, warranty, price clarity, or complaint record.",
            "मानिसहरूले अपरिचित नम्बरमा फोन गर्छन्, अज्ञात कामदारलाई विश्वास गर्छन्, र प्रमाण, वारेन्टी, मूल्य स्पष्टता वा उजुरी रेकर्ड हुँदैन।"
          )}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Problem title={t("Trust", "विश्वास")} text={t("Who is reliable?", "कसलाई विश्वास गर्ने?")} />
          <Problem title={t("Proof", "प्रमाण")} text={t("Was work completed?", "काम सकियो कि सकेन?")} />
          <Problem title={t("Warranty", "वारेन्टी")} text={t("What if it fails again?", "फेरि बिग्रियो भने?")} />
          <Problem title={t("Accountability", "जिम्मेवारी")} text={t("Who is responsible?", "जिम्मेवार को?")} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <SectionTitle
            eyebrow={t("EKA solution", "EKA समाधान")}
            title={t("A complete service workflow.", "पूर्ण सेवा प्रक्रिया।")}
            text={t(
              "EKA manages the journey from provider search to booking, provider action, completion, cashback, and recommendation.",
              "EKA ले प्रदायक खोजाइदेखि बुकिङ, प्रदायकको निर्णय, सेवा सम्पन्न, क्यासब्याक र सिफारिससम्मको प्रक्रिया व्यवस्थापन गर्छ।"
            )}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              t("Search", "खोज्नुहोस्"),
              t("Book", "बुक गर्नुहोस्"),
              t("Accept", "स्वीकार"),
              t("Complete", "सम्पन्न"),
              t("Cashback", "क्यासब्याक"),
              t("Trust Score", "ट्रस्ट स्कोर"),
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[30px] border border-white/10 bg-white/[0.055] p-6"
              >
                <p className="text-sm font-black text-red-300">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-3xl font-black">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle
          eyebrow={t("Revenue model", "आम्दानी मोडेल")}
          title={t("EKA earns when trust becomes a transaction.", "विश्वास कारोबारमा बदलिँदा EKA कमाउँछ।")}
          text={t(
            "The business model is based on completed bookings, provider growth, verification, and featured visibility.",
            "व्यवसाय मोडेल सम्पन्न बुकिङ, प्रदायक वृद्धि, प्रमाणिकरण र Featured Visibility मा आधारित छ।"
          )}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Revenue title={t("Commission", "कमिसन")} value="5–10%" />
          <Revenue title={t("Plans", "योजना")} value="Pro" />
          <Revenue title={t("Verification", "प्रमाणिकरण")} value="Trust" />
          <Revenue title={t("Boosts", "बुस्ट")} value="Featured" />
        </div>
      </section>

      <section id="support" className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-[46px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
            {t("Support", "सहायता")}
          </p>

          <h2 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
            {t("Need help? EKA is always available.", "मद्दत चाहियो? EKA सधैं उपलब्ध छ।")}
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            {t(
              "The support assistant helps customers understand booking, cashback, warranty, and provider process. In production, it can connect with AI, WhatsApp, and tickets.",
              "Support Assistant ले ग्राहकलाई बुकिङ, क्यासब्याक, वारेन्टी र प्रदायक प्रक्रियाबारे बुझाउँछ। Production मा यसलाई AI, WhatsApp र Ticket System सँग जोड्न सकिन्छ।"
            )}
          </p>
        </div>
      </section>
    </main>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[54px] bg-gradient-to-br from-red-500/20 via-white/0 to-sky-500/10 blur-3xl" />

      <div className="relative rounded-[44px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="rounded-[34px] border border-white/10 bg-black/50 p-6">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-600">
                Protected Booking
              </p>
              <h2 className="mt-2 text-3xl font-black">Live transaction</h2>
            </div>

            <span className="rounded-full bg-green-400/10 px-4 py-2 text-xs font-black text-green-300">
              Active
            </span>
          </div>

          <div className="space-y-3">
            <Money label="Customer pays" value="Rs 2,000" />
            <Money label="EKA commission" value="Rs 200" green />
            <Money label="Provider earns" value="Rs 1,800" blue />
            <Money label="Cashback" value="Rs 40" orange />
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.055] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
              Service code
            </p>
            <h3 className="mt-3 text-5xl font-black tracking-[-0.05em]">482913</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Completion, cashback, and recommendation are tied to the booking record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }: any) {
  return (
    <div className="max-w-4xl">
      <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
        {eyebrow}
      </p>
      <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-zinc-400">{text}</p>
    </div>
  );
}

function Problem({ title, text }: any) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6">
      <div className="mb-6 h-2 w-20 rounded-full bg-gradient-to-r from-red-400 to-orange-400" />
      <h3 className="text-3xl font-black">{title}</h3>
      <p className="mt-3 text-zinc-400">{text}</p>
    </div>
  );
}

function Revenue({ title, value }: any) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-600">
        {title}
      </p>
      <h3 className="mt-5 text-5xl font-black text-green-300">{value}</h3>
    </div>
  );
}

function Metric({ value, label }: any) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold text-zinc-500">{label}</p>
    </div>
  );
}

function Money({ label, value, green, blue, orange }: any) {
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