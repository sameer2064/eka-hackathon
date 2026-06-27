"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProvidersPage() {

  const [providers, setProviders] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [city, setCity] =
    useState("");

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {

    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("approved", true)
      .order("ai_score", {
        ascending: false,
      });

    setProviders(data || []);
  }

  const filteredProviders =
    providers.filter((provider) => {

      const matchesSearch =
        provider.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        provider.service_category
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCity =
        city === "" ||
        provider.city
          ?.toLowerCase()
          .includes(city.toLowerCase());

      return matchesSearch && matchesCity;
    });

  return (

    <main className="min-h-screen text-white">

      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        <div className="mb-14">

          <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-5">
            Marketplace
          </p>

          <h1 className="heading-xl mb-8">
            Explore providers.
          </h1>

          <div className="grid lg:grid-cols-2 gap-5">

            <input
              placeholder="Search services or providers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="input-primary"
            />

            <input
              placeholder="Filter by city..."
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="input-primary"
            />

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {filteredProviders.map((provider) => (

            <div
              key={provider.id}
              className={`premium-card rounded-[36px] p-8 relative overflow-hidden ${
                provider.featured
                  ? "border border-yellow-500/30"
                  : ""
              }`}
            >

              {provider.premium && (

                <div className="absolute top-5 right-5 bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-black">
                  PREMIUM
                </div>

              )}

              <div className="flex items-center gap-5 mb-8">

                <img
                  src={
                    provider.profile_image ||
                    "https://placehold.co/200x200"
                  }
                  className="w-24 h-24 rounded-[28px] object-cover border border-white/10"
                />

                <div>

                  <div className="flex items-center gap-3 mb-2">

                    <h2 className="text-3xl font-bold">
                      {provider.full_name}
                    </h2>

                    {provider.verified && (
                      <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        VERIFIED
                      </div>
                    )}

                  </div>

                  <p className="text-zinc-400">
                    {provider.service_category}
                  </p>

                  <p className="text-zinc-500 text-sm mt-2">
                    📍 {provider.city}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">

                <div className="glass rounded-2xl p-5">

                  <p className="text-zinc-500 text-sm mb-2">
                    AI
                  </p>

                  <h3 className="text-3xl font-black text-green-400">
                    {provider.ai_score || 0}
                  </h3>

                </div>

                <div className="glass rounded-2xl p-5">

                  <p className="text-zinc-500 text-sm mb-2">
                    Trust
                  </p>

                  <h3 className="text-3xl font-black">
                    {provider.trust_score || 0}
                  </h3>

                </div>

                <div className="glass rounded-2xl p-5">

                  <p className="text-zinc-500 text-sm mb-2">
                    Rating
                  </p>

                  <h3 className="text-3xl font-black text-yellow-400">
                    {provider.rating || 0}
                  </h3>

                </div>

                <div className="glass rounded-2xl p-5">

                  <p className="text-zinc-500 text-sm mb-2">
                    Bookings
                  </p>

                  <h3 className="text-3xl font-black">
                    {provider.total_bookings || 0}
                  </h3>

                </div>

              </div>

              <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3 text-green-400">

                  <div className="live-dot" />

                  Online

                </div>

                <p className="text-zinc-500 text-sm">
                  Fast Response
                </p>

              </div>

              <Link
                href={`/providers/${provider.id}`}
              >

                <button className="button-primary w-full">
                  View Provider
                </button>

              </Link>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}