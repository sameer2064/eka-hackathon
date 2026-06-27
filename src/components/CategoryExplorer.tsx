"use client";

import Link from "next/link";

export default function CategoryExplorer() {

  const categories = [
    {
      name: "Electrician",
      icon: "⚡",
      providers: "120+",
    },
    {
      name: "Plumber",
      icon: "🔧",
      providers: "85+",
    },
    {
      name: "Doctor",
      icon: "🩺",
      providers: "42+",
    },
    {
      name: "Cleaner",
      icon: "🧼",
      providers: "63+",
    },
    {
      name: "Tutor",
      icon: "📚",
      providers: "91+",
    },
    {
      name: "Mechanic",
      icon: "🚗",
      providers: "54+",
    },
    {
      name: "Designer",
      icon: "🎨",
      providers: "38+",
    },
    {
      name: "Developer",
      icon: "💻",
      providers: "67+",
    },
  ];

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="mb-14">

        <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-5">
          Explore Marketplace
        </p>

        <h2 className="heading-lg">
          Discover service categories.
        </h2>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        {categories.map((category) => (

          <Link
            key={category.name}
            href={`/providers?search=${category.name}`}
          >

            <div className="premium-card rounded-[36px] p-8 h-full cursor-pointer">

              <div className="text-6xl mb-8">
                {category.icon}
              </div>

              <h3 className="text-3xl font-black mb-4">
                {category.name}
              </h3>

              <p className="text-zinc-500 mb-6">
                AI ranked professionals
              </p>

              <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm font-semibold">

                {category.providers} providers

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}