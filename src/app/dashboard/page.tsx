"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {

  const [provider, setProvider] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProvider();
  }, []);

  async function loadProvider() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProvider(data);

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-black">
          Loading Dashboard...
        </h1>
      </main>
    );
  }

  if (!provider) {
    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="glass rounded-[40px] p-14 text-center max-w-2xl">

          <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-6">
            Provider Required
          </p>

          <h1 className="text-6xl font-black mb-6">
            Become a Provider
          </h1>

          <p className="text-zinc-400 text-xl mb-10 leading-relaxed">
            You do not yet have a provider
            account. Create your professional
            marketplace profile to continue.
          </p>

          <Link href="/become-provider">

            <button className="bg-red-500 hover:bg-red-600 transition px-10 py-5 rounded-2xl text-xl font-bold">
              Become Provider
            </button>

          </Link>

        </div>

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-20">

          <div>

            <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-6">
              Provider Workspace
            </p>

            <h1 className="text-7xl font-black mb-6 leading-none">
              Welcome back,
              <br />
              {provider.full_name}
            </h1>

            <p className="text-zinc-400 text-2xl max-w-3xl leading-relaxed">
              Manage bookings, visibility,
              rankings and marketplace growth.
            </p>

          </div>

          <div className="flex gap-4 flex-wrap">

            <Link href="/dashboard/settings">

              <button className="bg-black border border-zinc-800 hover:border-red-500 transition px-8 py-5 rounded-2xl font-bold text-lg">
                Edit Profile
              </button>

            </Link>

            <Link href="/dashboard/portfolio">

              <button className="bg-red-500 hover:bg-red-600 transition px-8 py-5 rounded-2xl font-bold text-lg">
                Portfolio
              </button>

            </Link>

          </div>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">

          <div className="glass rounded-[32px] p-8 border-t-2 border-red-500">

            <p className="text-zinc-500 text-lg mb-6">
              Bookings
            </p>

            <h2 className="text-6xl font-black">
              {provider.total_bookings || 0}
            </h2>

          </div>

          <div className="glass rounded-[32px] p-8 border-t-2 border-green-500">

            <p className="text-zinc-500 text-lg mb-6">
              Trust Score
            </p>

            <h2 className="text-6xl font-black">
              {provider.trust_score || 0}
            </h2>

          </div>

          <div className="glass rounded-[32px] p-8 border-t-2 border-blue-500">

            <p className="text-zinc-500 text-lg mb-6">
              AI Score
            </p>

            <h2 className="text-6xl font-black">
              {provider.ai_score || 0}
            </h2>

          </div>

          <div className="glass rounded-[32px] p-8 border-t-2 border-yellow-500">

            <p className="text-zinc-500 text-lg mb-6">
              Rating
            </p>

            <h2 className="text-6xl font-black">
              {provider.rating || 0}
            </h2>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="glass rounded-[40px] p-10">

            <div className="flex items-center justify-between mb-10">

              <h2 className="text-4xl font-black">
                Marketplace Status
              </h2>

              <div className="flex items-center gap-3 text-green-400">

                <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />

                Active

              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-black rounded-3xl p-8">

                <p className="text-zinc-500 mb-4">
                  Verification
                </p>

                <h3 className="text-3xl font-black">

                  {provider.verified
                    ? "Verified"
                    : "Pending"}

                </h3>

              </div>

              <div className="bg-black rounded-3xl p-8">

                <p className="text-zinc-500 mb-4">
                  Premium
                </p>

                <h3 className="text-3xl font-black">

                  {provider.premium
                    ? "Active"
                    : "Inactive"}

                </h3>

              </div>

              <div className="bg-black rounded-3xl p-8">

                <p className="text-zinc-500 mb-4">
                  Featured
                </p>

                <h3 className="text-3xl font-black">

                  {provider.featured
                    ? "Featured"
                    : "Normal"}

                </h3>

              </div>

              <div className="bg-black rounded-3xl p-8">

                <p className="text-zinc-500 mb-4">
                  City
                </p>

                <h3 className="text-3xl font-black">
                  {provider.city || "-"}
                </h3>

              </div>

            </div>

          </div>

          <div className="glass rounded-[40px] p-10">

            <div className="flex items-center justify-between mb-10">

              <h2 className="text-4xl font-black">
                Professional Profile
              </h2>

              <div className="text-red-400">
                AI Ranked
              </div>

            </div>

            <div className="space-y-8">

              <div>

                <p className="text-zinc-500 mb-3">
                  Service Category
                </p>

                <h3 className="text-3xl font-black">
                  {provider.service_category}
                </h3>

              </div>

              <div>

                <p className="text-zinc-500 mb-3">
                  Bio
                </p>

                <p className="text-zinc-300 text-lg leading-relaxed">
                  {provider.bio || "No bio yet"}
                </p>

              </div>

              <div>

                <p className="text-zinc-500 mb-3">
                  Availability
                </p>

                <h3 className="text-2xl font-bold">
                  {provider.availability ||
                    "Not updated"}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}