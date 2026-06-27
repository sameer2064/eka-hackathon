"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProviderCard from "./ProviderCard";

export default function TrendingProviders() {

  const [providers, setProviders] =
    useState<any[]>([]);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {

    const { data } =
      await supabase
        .from("providers")
        .select("*")
        .order(
          "trending_score",
          {
            ascending: false,
          }
        )
        .limit(4);

    if (data) {
      setProviders(data);
    }
  }

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="mb-14">

        <p className="uppercase tracking-[0.4em] text-red-500 font-black mb-5">
          TRENDING NOW
        </p>

        <h2 className="heading-lg">
          Most active providers.
        </h2>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {providers.map((provider) => (

          <ProviderCard
            key={provider.id}
            provider={provider}
          />

        ))}

      </div>

    </section>
  );
}