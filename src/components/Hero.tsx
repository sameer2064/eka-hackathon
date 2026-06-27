"use client";

import { useState } from "react";

export default function Hero() {
  const [service, setService] =
    useState("");

  const [city, setCity] =
    useState("");

  function handleSearch() {
    let url = "/providers?";

    if (service) {
      url += `search=${service}`;
    }

    if (city) {
      url += `&city=${city}`;
    }

    window.location.href = url;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        <div>

          <div className="inline-block bg-red-950 text-red-400 px-6 py-3 rounded-full text-xl mb-8">
            Trusted by 10,000+ Nepali homes
          </div>

          <h1 className="text-7xl font-bold leading-tight">

            Trusted home

            <span className="text-red-500">
              {" "}services
            </span>

            , verified for Nepal.

          </h1>

          <p className="text-zinc-400 text-2xl mt-10 leading-10">

            Book plumbers, electricians,
            CCTV installers and more —
            vetted, reviewed and just a tap away.

          </p>

          <div className="space-y-5 mt-12">

            <input
              type="text"
              placeholder="What service do you need?"
              value={service}
              onChange={(e) =>
                setService(e.target.value)
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-2xl outline-none"
            />

            <input
              type="text"
              placeholder="Enter city (Kathmandu, Pokhara...)"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-2xl outline-none"
            />

            <button
              onClick={handleSearch}
              className="w-full bg-red-500 hover:bg-red-600 py-6 rounded-2xl text-2xl font-bold transition"
            >
              Search Providers
            </button>

          </div>

          <div className="flex flex-wrap gap-5 mt-10">

            <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-full text-lg">
              ✔ Verified Providers
            </div>

            <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-full text-lg">
              ✔ Real Reviews
            </div>

            <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-full text-lg">
              ✔ Instant Contact
            </div>

          </div>

        </div>

        <div>

          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-[700px] object-cover rounded-[40px]"
          />

        </div>

      </div>

    </section>
  );
}