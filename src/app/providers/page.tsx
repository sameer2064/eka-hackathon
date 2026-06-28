"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Provider = any;

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    setCity(params.get("city") || "");
    setCategory(params.get("category") || "");

    loadProviders();
  }, []);

  async function loadProviders() {
    const { data } = await supabase
      .from("providers")
      .select("*")
      .order("approved", { ascending: false })
      .order("verified", { ascending: false })
      .order("premium", { ascending: false })
      .order("trust_score", { ascending: false });

    setProviders(data || []);
  }

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const text = `${p.full_name || ""} ${p.service_category || ""} ${p.city || ""} ${
        p.description || ""
      }`.toLowerCase();

      const matchSearch = search ? text.includes(search.toLowerCase()) : true;
      const matchCity = city ? String(p.city || "").toLowerCase().includes(city.toLowerCase()) : true;
      const matchCategory = category
        ? String(p.service_category || "").toLowerCase().includes(category.toLowerCase())
        : true;

      return matchSearch && matchCity && matchCategory;
    });
  }, [providers, search, city, category]);

  return (
    <main className="min-h-screen bg-[#07080a] px-5 py-14 text-white">
      <style jsx global>{`
        .market-panel {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035));
          box-shadow: 0 35px 120px rgba(0,0,0,0.35);
          backdrop-filter: blur(24px);
        }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
              Provider Marketplace
            </p>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl">
              Find verified local providers.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              Approved providers appear with trust score, verification status and protected booking support.
            </p>
          </div>

          <div className="market-panel rounded-[30px] p-5">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-green-300">
              Why EKA?
            </p>
            <p className="mt-3 leading-7 text-zinc-400">
              Book through EKA to unlock warranty, cashback, proof and dispute support.
            </p>
          </div>
        </div>

        <div className="market-panel mb-8 rounded-[30px] p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service or provider"
              className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700"
            />
            <Link
              href="/protected-booking"
              className="flex items-center justify-center rounded-2xl bg-white px-4 py-4 font-black text-black"
            >
              Book Safely
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="market-panel rounded-[34px] p-8">
            <h2 className="text-3xl font-black">No providers found.</h2>
            <p className="mt-3 text-zinc-400">
              Create provider accounts or ask admin to add demo providers from Admin Command Center.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  const approved = Boolean(provider.approved);

  return (
    <div className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.075]">
      <div className="absolute right-[-90px] top-[-90px] h-48 w-48 rounded-full bg-orange-400/10 blur-3xl transition group-hover:bg-orange-400/20" />

      <div className="relative z-10">
        <div className="mb-7 flex flex-wrap gap-2">
          <Badge text={approved ? "approved" : "pending"} tone={approved ? "green" : "orange"} />
          {provider.verified && <Badge text="verified" tone="blue" />}
          {provider.premium && <Badge text="premium" tone="yellow" />}
          {provider.featured && <Badge text="featured" tone="red" />}
        </div>

        <h2 className="text-3xl font-black tracking-tight">
          {provider.full_name || "Unnamed Provider"}
        </h2>

        <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-600">
          {provider.service_category || "Service"} · {provider.city || "City"}
        </p>

        <p className="mt-5 min-h-[84px] leading-7 text-zinc-400">
          {provider.description || "Verified local service provider on EKA."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Mini title="Trust" value={provider.trust_score || 70} />
          <Mini title="AI" value={provider.ai_score || 70} />
          <Mini title="Jobs" value={provider.total_bookings || 0} />
        </div>

        <Link
          href="/protected-booking"
          className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center font-black text-black transition hover:scale-[1.02]"
        >
          Book with EKA Protection
        </Link>
      </div>
    </div>
  );
}

function Badge({
  text,
  tone,
}: {
  text: string;
  tone: "green" | "orange" | "blue" | "yellow" | "red";
}) {
  const styles = {
    green: "bg-green-400/10 text-green-300",
    orange: "bg-orange-400/10 text-orange-300",
    blue: "bg-sky-400/10 text-sky-300",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-500/20 text-red-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${styles[tone]}`}>
      {text}
    </span>
  );
}

function Mini({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-4">
      <p className="text-xs font-bold text-zinc-500">{title}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}