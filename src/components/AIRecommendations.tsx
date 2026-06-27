"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AIRecommendations() {

  const [providers, setProviders] =
    useState<any[]>([]);

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
      })
      .limit(3);

    setProviders(data || []);
  }

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="mb-12">

        <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-5">
          AI Recommendations
        </p>

        <h2 className="heading-xl">
          Recommended for you.
        </h2>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {providers.map((provider) => (

          <div
            key={provider.id}
            className="premium-card rounded-[36px] p-8 group relative overflow-hidden"
          >

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-red-500/10 to-transparent" />

            <div className="flex items-center gap-5 mb-8 relative z-10">

              <div className="w-20 h-20 rounded-[28px] bg-red-500 flex items-center justify-center text-4xl font-bold">

                {provider.full_name?.charAt(0)}

              </div>

              <div>

                <h3 className="text-3xl font-semibold mb-2">
                  {provider.full_name}
                </h3>

                <p className="text-zinc-400 text-lg">
                  {provider.service_category}
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">

              <div className="bg-black rounded-2xl p-5">

                <p className="text-zinc-500 text-sm mb-2">
                  AI
                </p>

                <h4 className="text-4xl font-bold">
                  {provider.ai_score || 0}
                </h4>

              </div>

              <div className="bg-black rounded-2xl p-5">

                <p className="text-zinc-500 text-sm mb-2">
                  Trust
                </p>

                <h4 className="text-4xl font-bold">
                  {provider.trust_score || 0}
                </h4>

              </div>

            </div>

            <Link
              href={`/providers/${provider.id}`}
            >

              <button className="button-primary w-full relative z-10">
                View Provider
              </button>

            </Link>

          </div>

        ))}

      </div>

    </section>
  );
}