"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SortMode = "trust" | "premium" | "jobs";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortMode>("trust");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || "";
    const initialCity = params.get("city") || "";

    setSearch(initialSearch);
    if (initialCity) setCity(initialCity);

    loadProviders();
  }, []);

  async function loadProviders() {
    setLoading(true);

    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("approved", true)
      .order("verified", { ascending: false })
      .order("premium", { ascending: false })
      .order("trust_score", { ascending: false });

    setProviders(data || []);
    setLoading(false);
  }

  const categories = useMemo(() => {
    const list = providers
      .map((provider) => provider.service_category)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(list))];
  }, [providers]);

  const cities = useMemo(() => {
    const list = providers.map((provider) => provider.city).filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [providers]);

  const filteredProviders = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = providers.filter((provider) => {
      const matchesSearch =
        !query ||
        (provider.full_name || "").toLowerCase().includes(query) ||
        (provider.service_category || "").toLowerCase().includes(query) ||
        (provider.city || "").toLowerCase().includes(query) ||
        (provider.description || "").toLowerCase().includes(query);

      const matchesCity = city === "All" || provider.city === city;

      const matchesCategory =
        category === "All" || provider.service_category === category;

      return matchesSearch && matchesCity && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      if (sort === "premium") {
        return Number(b.premium || false) - Number(a.premium || false);
      }

      if (sort === "jobs") {
        return Number(b.total_bookings || 0) - Number(a.total_bookings || 0);
      }

      return Number(b.trust_score || 70) - Number(a.trust_score || 70);
    });

    return result;
  }, [providers, search, city, category, sort]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] px-5 pb-20 pt-40 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.08),transparent_24%)]" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
              EKA Marketplace
            </p>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              Find trusted providers.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Search verified local professionals by service, city, trust score,
              and provider history.
            </p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-2xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
              Marketplace
            </p>

            <h2 className="mt-5 text-6xl font-black tracking-[-0.08em] text-white">
              {filteredProviders.length}
            </h2>

            <p className="mt-3 text-sm font-bold text-zinc-500">
              Matching trusted providers
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-[36px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search plumber, electrician, CCTV..."
              className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none focus:border-red-400/50"
            >
              {categories.map((item) => (
                <option key={item} value={item} className="bg-black">
                  {item === "All" ? "All services" : item}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none focus:border-red-400/50"
            >
              {cities.map((item) => (
                <option key={item} value={item} className="bg-black">
                  {item === "All" ? "All cities" : item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none focus:border-red-400/50"
            >
              <option value="trust" className="bg-black">
                Best trust
              </option>
              <option value="premium" className="bg-black">
                Premium first
              </option>
              <option value="jobs" className="bg-black">
                Most jobs
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-8">
            <h2 className="text-3xl font-black">Loading providers...</h2>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-8">
            <h2 className="text-3xl font-black">No providers found.</h2>
            <p className="mt-3 text-zinc-400">
              Try another service, city, or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProviderCard({ provider }: { provider: any }) {
  const trust = Number(provider.trust_score || 70);
  const jobs = Number(provider.total_bookings || 0);

  return (
    <div className="group rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-red-400/30 hover:bg-white/[0.075]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-white">
            {provider.full_name || "Provider"}
          </h2>

          <p className="mt-2 text-sm font-bold text-zinc-500">
            {provider.service_category || "Service"} · {provider.city || "City"}
          </p>
        </div>

        <TrustCircle value={trust} />
      </div>

      <p className="mt-5 min-h-[72px] text-sm leading-6 text-zinc-400">
        {provider.description ||
          "Trusted local service provider available for protected bookings through EKA."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {provider.verified && <Badge text="Verified" green />}
        {provider.premium && <Badge text="Premium" />}
        {provider.featured && <Badge text="Featured" />}
        {!provider.verified && !provider.premium && !provider.featured && (
          <Badge text="Available" muted />
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Mini label="Trust" value={trust} />
        <Mini label="AI" value={provider.ai_score || 72} />
        <Mini label="Jobs" value={jobs} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/protected-booking?provider=${provider.id}`}
          className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-black transition hover:scale-[1.02]"
        >
          Book Now
        </Link>

        <Link
          href={`/providers/${provider.id}`}
          className="rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-white hover:text-black"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

function TrustCircle({ value }: { value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40">
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-green-400/25 to-red-500/15" />
      <div className="relative text-center">
        <p className="text-lg font-black text-green-300">{safeValue}</p>
        <p className="text-[9px] font-black uppercase text-zinc-500">Trust</p>
      </div>
    </div>
  );
}

function Badge({
  text,
  green,
  muted,
}: {
  text: string;
  green?: boolean;
  muted?: boolean;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        green
          ? "bg-green-400/10 text-green-300"
          : muted
          ? "bg-white/[0.055] text-zinc-400"
          : "bg-red-500/10 text-red-200"
      }`}
    >
      {text}
    </span>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/35 p-3">
      <p className="text-[11px] font-bold text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}