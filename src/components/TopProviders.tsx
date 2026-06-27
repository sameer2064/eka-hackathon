"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TopProviders() {

  const [providers, setProviders] =
    useState<any[]>([]);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {

    const { data } = await supabase
      .from("providers")
      .select("*")
      .order("trust_score", {
        ascending: false,
      })
      .limit(5);

    setProviders(data || []);
  }

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="mb-14">

        <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-5">
          Leaderboard
        </p>

        <h2 className="heading-lg">
          Top trusted providers.
        </h2>

      </div>

      <div className="space-y-5">

        {providers.map((provider, index) => (

          <Link
            key={provider.id}
            href={`/providers/${provider.id}`}
          >

            <div className="glass rounded-[32px] p-8 hover:border-red-500/40 border border-transparent transition cursor-pointer">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">

                  <div className="text-5xl font-black text-zinc-700">
                    #{index + 1}
                  </div>

                  <div className="w-20 h-20 rounded-[28px] bg-red-500 flex items-center justify-center text-4xl font-bold">

                    {provider.full_name?.charAt(0)}

                  </div>

                  <div>

                    <div className="flex items-center gap-3 mb-2">

                      <h3 className="text-3xl font-bold">
                        {provider.full_name}
                      </h3>

                      {provider.verified && (
                        <div className="px-3 py-1 rounded-full bg-blue-500 text-xs font-bold">
                          VERIFIED
                        </div>
                      )}

                    </div>

                    <p className="text-zinc-400">
                      {provider.service_category}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-zinc-500 mb-2">
                    Trust Score
                  </p>

                  <h4 className="text-5xl font-black">
                    {provider.trust_score || 0}
                  </h4>

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}