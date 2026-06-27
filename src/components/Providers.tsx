"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Providers() {

  const [providers, setProviders] =
    useState<any[]>([]);

  async function loadProviders() {

    const {
      data,
    } = await supabase
      .from("providers")
      .select("*")
      .eq(
        "approved",
        true
      )
      .order(
        "premium",
        {
          ascending: false,
        }
      )
      .order(
        "trending_score",
        {
          ascending: false,
        }
      )
      .order(
        "trust_score",
        {
          ascending: false,
        }
      );

    setProviders(data || []);
  }

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <section className="py-24 bg-black text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-16">

          <p className="text-red-500 uppercase tracking-widest font-bold mb-4">
            Nepal's Best Professionals
          </p>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Featured Providers
          </h2>

          <p className="text-zinc-400 text-xl max-w-3xl">
            Trusted, AI-ranked and verified professionals across Nepal.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {providers.map(
            (provider) => (

              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
              >

                <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden hover:border-red-500 transition duration-300 hover:-translate-y-2">

                  <img
                    src={
                      provider.profile_image ||
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                    }
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-8">

                    <div className="flex flex-wrap gap-3 mb-5">

                      {provider.verified && (
                        <span className="bg-blue-600 text-sm px-4 py-2 rounded-full font-bold">
                          VERIFIED
                        </span>
                      )}

                      {provider.premium && (
                        <span className="bg-yellow-500 text-black text-sm px-4 py-2 rounded-full font-bold">
                          PREMIUM
                        </span>
                      )}

                    </div>

                    <h3 className="text-3xl font-black mb-3">
                      {provider.full_name}
                    </h3>

                    <p className="text-zinc-400 mb-6 text-lg">
                      {provider.service_category}
                    </p>

                    <div className="grid grid-cols-2 gap-4">

                      <div className="bg-black rounded-2xl p-4">

                        <p className="text-zinc-500 text-sm mb-2">
                          Rating
                        </p>

                        <h4 className="text-2xl font-black">
                          ⭐ {provider.rating || 5}
                        </h4>

                      </div>

                      <div className="bg-black rounded-2xl p-4">

                        <p className="text-zinc-500 text-sm mb-2">
                          AI Score
                        </p>

                        <h4 className="text-2xl font-black">
                          🧠 {provider.ai_score || 0}
                        </h4>

                      </div>

                      <div className="bg-black rounded-2xl p-4">

                        <p className="text-zinc-500 text-sm mb-2">
                          Trust
                        </p>

                        <h4 className="text-2xl font-black">
                          🛡️ {provider.trust_score || 0}
                        </h4>

                      </div>

                      <div className="bg-black rounded-2xl p-4">

                        <p className="text-zinc-500 text-sm mb-2">
                          Jobs
                        </p>

                        <h4 className="text-2xl font-black">
                          📦 {provider.total_bookings || 0}
                        </h4>

                      </div>

                    </div>

                  </div>

                </div>

              </Link>
            )
          )}

        </div>

      </div>

    </section>
  );
}