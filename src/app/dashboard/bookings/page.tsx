"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookingsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadBookings() {

    setLoading(true);

    // GET LOGGED IN USER
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // FIND PROVIDER PROFILE
    const { data: provider } =
      await supabase
        .from("providers")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!provider) {
      setLoading(false);
      return;
    }

    // LOAD ONLY THIS PROVIDER BOOKINGS
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("provider_id", provider.id)
      .order("created_at", {
        ascending: false,
      });

    setBookings(data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {

    await supabase
      .from("bookings")
      .update({
        status,
      })
      .eq("id", id);

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
            }
          : booking
      )
    );
  }

  function getStatusColor(status: string) {

    switch (status) {

      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/20";

      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";

      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/20";
    }
  }

  return (

    <main className="min-h-screen bg-black text-white px-4 lg:px-8 py-16">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-14">

          <div>

            <p className="text-red-500 text-sm uppercase tracking-[0.3em] mb-3">
              Provider Dashboard
            </p>

            <h1 className="text-5xl lg:text-7xl font-bold leading-none">
              Bookings
            </h1>

          </div>

          <div className="glass rounded-[28px] px-8 py-5">

            <p className="text-zinc-500 text-sm mb-1">
              Total Requests
            </p>

            <h2 className="text-4xl font-bold">
              {bookings.length}
            </h2>

          </div>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="grid gap-6">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="glass rounded-[32px] p-8 animate-pulse"
              >

                <div className="h-8 bg-zinc-800 rounded-xl w-48 mb-5" />

                <div className="h-5 bg-zinc-900 rounded-xl w-72 mb-3" />

                <div className="h-5 bg-zinc-900 rounded-xl w-full" />

              </div>

            ))}

          </div>

        )}

        {/* EMPTY */}

        {!loading && bookings.length === 0 && (

          <div className="glass rounded-[40px] p-14 text-center">

            <div className="text-7xl mb-6">
              🇳🇵
            </div>

            <h2 className="text-4xl font-bold mb-4">
              No Bookings Yet
            </h2>

            <p className="text-zinc-500 text-lg">
              Your booking requests will appear here.
            </p>

          </div>

        )}

        {/* BOOKINGS */}

        <div className="space-y-7">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="glass rounded-[36px] p-8 border border-white/5 hover:border-red-500/20 transition-all duration-300"
            >

              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10">

                {/* LEFT */}

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-4 mb-6">

                    <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-3xl font-bold">

                      {booking.customer_name?.charAt(0)}

                    </div>

                    <div>

                      <h2 className="text-3xl font-bold mb-2">

                        {booking.customer_name}

                      </h2>

                      <p className="text-zinc-400 text-lg">

                        {booking.customer_phone}

                      </p>

                    </div>

                  </div>

                  <div className="bg-black/50 rounded-[28px] p-6 border border-white/5">

                    <p className="text-zinc-500 text-sm mb-3 uppercase tracking-widest">

                      Booking Details

                    </p>

                    <p className="text-zinc-300 leading-relaxed text-lg">

                      {booking.details || "No details provided."}

                    </p>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="xl:w-[340px]">

                  <div className="flex items-center justify-between mb-7">

                    <span
                      className={`px-5 py-3 rounded-2xl border text-sm font-semibold uppercase tracking-wider ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <p className="text-zinc-500 text-sm">

                      {new Date(
                        booking.created_at
                      ).toLocaleDateString()}

                    </p>

                  </div>

                  <div className="grid grid-cols-1 gap-4">

                    <button
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "accepted"
                        )
                      }
                      className="h-14 rounded-2xl bg-green-500 hover:bg-green-400 transition-all duration-300 text-lg font-semibold"
                    >
                      Accept Booking
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "completed"
                        )
                      }
                      className="h-14 rounded-2xl bg-blue-500 hover:bg-blue-400 transition-all duration-300 text-lg font-semibold"
                    >
                      Mark Completed
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "cancelled"
                        )
                      }
                      className="h-14 rounded-2xl bg-red-500 hover:bg-red-400 transition-all duration-300 text-lg font-semibold"
                    >
                      Cancel Booking
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}