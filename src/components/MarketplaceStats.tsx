"use client";

import { useEffect, useState } from "react";

export default function MarketplaceStats() {

  const [providers, setProviders] =
    useState(0);

  const [bookings, setBookings] =
    useState(0);

  const [reviews, setReviews] =
    useState(0);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setProviders((p) =>
          p < 120 ? p + 1 : p
        );

        setBookings((b) =>
          b < 4200 ? b + 25 : b
        );

        setReviews((r) =>
          r < 1800 ? r + 12 : r
        );

      }, 30);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="grid md:grid-cols-3 gap-8">

        <div className="glass rounded-[32px] p-10 text-center">

          <h2 className="text-6xl font-semibold mb-4">
            {providers}+
          </h2>

          <p className="text-zinc-500">
            Active Providers
          </p>

        </div>

        <div className="glass rounded-[32px] p-10 text-center">

          <h2 className="text-6xl font-semibold mb-4">
            {bookings}+
          </h2>

          <p className="text-zinc-500">
            Bookings Completed
          </p>

        </div>

        <div className="glass rounded-[32px] p-10 text-center">

          <h2 className="text-6xl font-semibold mb-4">
            {reviews}+
          </h2>

          <p className="text-zinc-500">
            Customer Reviews
          </p>

        </div>

      </div>

    </section>

  );
}