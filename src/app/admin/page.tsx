"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [providers, setProviders] =
    useState<any[]>([]);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState({
      totalProviders: 0,
      totalBookings: 0,
      revenue: 0,
      pendingProviders: 0,
    });

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    const { data: providersData } =
      await supabase
        .from("providers")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    const { data: bookingsData } =
      await supabase
        .from("bookings")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setProviders(providersData || []);
    setBookings(bookingsData || []);

    setStats({
      totalProviders:
        providersData?.length || 0,

      totalBookings:
        bookingsData?.length || 0,

      revenue:
        (bookingsData?.length || 0) * 2500,

      pendingProviders:
        providersData?.filter(
          (p) => !p.approved
        ).length || 0,
    });
  }

  async function approveProvider(
    id: string
  ) {

    await supabase
      .from("providers")
      .update({
        approved: true,
      })
      .eq("id", id);

    loadData();
  }

  async function removeProvider(
    id: string
  ) {

    await supabase
      .from("providers")
      .delete()
      .eq("id", id);

    loadData();
  }

  async function togglePremium(
    id: string,
    current: boolean
  ) {

    await supabase
      .from("providers")
      .update({
        premium: !current,
      })
      .eq("id", id);

    loadData();
  }

  async function toggleFeatured(
    id: string,
    current: boolean
  ) {

    await supabase
      .from("providers")
      .update({
        featured: !current,
      })
      .eq("id", id);

    loadData();
  }

  async function toggleVerified(
    id: string,
    current: boolean
  ) {

    await supabase
      .from("providers")
      .update({
        verified: !current,
      })
      .eq("id", id);

    loadData();
  }

  async function boostAI(
    id: string,
    current: number
  ) {

    await supabase
      .from("providers")
      .update({
        ai_score:
          (current || 0) + 10,
      })
      .eq("id", id);

    loadData();
  }

  async function boostTrust(
    id: string,
    current: number
  ) {

    await supabase
      .from("providers")
      .update({
        trust_score:
          (current || 0) + 10,
      })
      .eq("id", id);

    loadData();
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-[1600px] mx-auto px-6 py-32">

        <div className="mb-20">

          <p className="uppercase tracking-[0.4em] text-red-500 font-black mb-6">
            EKA CONTROL CENTER
          </p>

          <h1 className="text-8xl font-black leading-none mb-8">
            Super Admin Panel
          </h1>

          <p className="text-zinc-500 text-2xl max-w-3xl">
            Complete control over providers,
            AI ranking systems, bookings,
            premium systems and marketplace growth.
          </p>

        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-20">

          <div className="glass-heavy rounded-[40px] p-8">

            <p className="text-zinc-500 mb-5 text-lg">
              Providers
            </p>

            <h2 className="text-7xl font-black">
              {stats.totalProviders}
            </h2>

          </div>

          <div className="glass-heavy rounded-[40px] p-8">

            <p className="text-zinc-500 mb-5 text-lg">
              Bookings
            </p>

            <h2 className="text-7xl font-black">
              {stats.totalBookings}
            </h2>

          </div>

          <div className="glass-heavy rounded-[40px] p-8 border border-green-500/20">

            <p className="text-zinc-500 mb-5 text-lg">
              Revenue
            </p>

            <h2 className="text-7xl font-black text-green-400">
              Rs {stats.revenue}
            </h2>

          </div>

          <div className="glass-heavy rounded-[40px] p-8 border border-red-500/20">

            <p className="text-zinc-500 mb-5 text-lg">
              Pending
            </p>

            <h2 className="text-7xl font-black text-red-400">
              {stats.pendingProviders}
            </h2>

          </div>

        </div>

        <div className="glass-heavy rounded-[40px] p-10 mb-16">

          <div className="flex items-center justify-between mb-10">

            <div>

              <h2 className="text-5xl font-black mb-3">
                Provider Control Center
              </h2>

              <p className="text-zinc-500 text-xl">
                Manage marketplace intelligence
              </p>

            </div>

          </div>

          <div className="space-y-8">

            {providers.map((provider) => (

              <div
                key={provider.id}
                className="bg-black rounded-[36px] p-8 border border-white/5"
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

                  <div className="flex items-center gap-6">

                    <img
                      src={
                        provider.image ||
                        "https://placehold.co/200x200"
                      }
                      className="w-28 h-28 rounded-[32px] object-cover border border-white/10"
                    />

                    <div>

                      <div className="flex flex-wrap items-center gap-3 mb-3">

                        <h3 className="text-4xl font-black">
                          {provider.full_name}
                        </h3>

                        {provider.verified && (

                          <div className="bg-blue-500 px-4 py-2 rounded-full text-sm font-black">
                            VERIFIED
                          </div>

                        )}

                        {provider.premium && (

                          <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-black">
                            PREMIUM
                          </div>

                        )}

                        {provider.featured && (

                          <div className="bg-red-500 px-4 py-2 rounded-full text-sm font-black">
                            FEATURED
                          </div>

                        )}

                      </div>

                      <p className="text-zinc-400 text-xl mb-4">
                        {provider.service_category}
                      </p>

                      <div className="flex flex-wrap gap-4">

                        <div className="bg-zinc-900 px-5 py-3 rounded-2xl">
                          AI:
                          {" "}
                          <span className="text-green-400 font-black">
                            {provider.ai_score || 0}
                          </span>
                        </div>

                        <div className="bg-zinc-900 px-5 py-3 rounded-2xl">
                          Trust:
                          {" "}
                          <span className="text-blue-400 font-black">
                            {provider.trust_score || 0}
                          </span>
                        </div>

                        <div className="bg-zinc-900 px-5 py-3 rounded-2xl">
                          Bookings:
                          {" "}
                          <span className="font-black">
                            {provider.total_bookings || 0}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="grid md:grid-cols-3 gap-4 min-w-[500px]">

                    {!provider.approved && (

                      <button
                        onClick={() =>
                          approveProvider(
                            provider.id
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 h-16 rounded-2xl font-black transition"
                      >
                        Approve
                      </button>

                    )}

                    <button
                      onClick={() =>
                        togglePremium(
                          provider.id,
                          provider.premium
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-black h-16 rounded-2xl font-black transition"
                    >
                      {provider.premium
                        ? "Remove Premium"
                        : "Make Premium"}
                    </button>

                    <button
                      onClick={() =>
                        toggleFeatured(
                          provider.id,
                          provider.featured
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 h-16 rounded-2xl font-black transition"
                    >
                      {provider.featured
                        ? "Unfeature"
                        : "Feature"}
                    </button>

                    <button
                      onClick={() =>
                        toggleVerified(
                          provider.id,
                          provider.verified
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 h-16 rounded-2xl font-black transition"
                    >
                      {provider.verified
                        ? "Unverify"
                        : "Verify"}
                    </button>

                    <button
                      onClick={() =>
                        boostAI(
                          provider.id,
                          provider.ai_score
                        )
                      }
                      className="bg-white text-black hover:scale-[1.03] h-16 rounded-2xl font-black transition"
                    >
                      Boost AI
                    </button>

                    <button
                      onClick={() =>
                        boostTrust(
                          provider.id,
                          provider.trust_score
                        )
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 h-16 rounded-2xl font-black transition"
                    >
                      Boost Trust
                    </button>

                    <button
                      onClick={() =>
                        removeProvider(
                          provider.id
                        )
                      }
                      className="bg-red-950 hover:bg-red-900 h-16 rounded-2xl font-black transition md:col-span-3"
                    >
                      Remove Provider
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="glass-heavy rounded-[40px] p-10">

            <h2 className="text-5xl font-black mb-10">
              Live Bookings
            </h2>

            <div className="space-y-5">

              {bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="bg-black rounded-[28px] p-6 border border-white/5"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-2xl font-black mb-2">
                        {booking.customer_name}
                      </h3>

                      <p className="text-zinc-500">
                        {booking.message}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-green-400 font-black text-lg mb-2">
                        {booking.status}
                      </p>

                      <p className="text-zinc-500 text-sm">
                        Live Booking
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="glass-heavy rounded-[40px] p-10">

            <h2 className="text-5xl font-black mb-10">
              AI Marketplace Status
            </h2>

            <div className="space-y-6">

              <div className="bg-black rounded-[30px] p-8">

                <p className="text-zinc-500 mb-4">
                  AI Matching Accuracy
                </p>

                <h3 className="text-6xl font-black text-green-400">
                  98%
                </h3>

              </div>

              <div className="bg-black rounded-[30px] p-8">

                <p className="text-zinc-500 mb-4">
                  Realtime Activity
                </p>

                <h3 className="text-6xl font-black text-red-400">
                  LIVE
                </h3>

              </div>

              <div className="bg-black rounded-[30px] p-8">

                <p className="text-zinc-500 mb-4">
                  Marketplace Growth
                </p>

                <h3 className="text-6xl font-black text-blue-400">
                  +42%
                </h3>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}