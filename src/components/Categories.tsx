"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Categories() {
  const [categories, setCategories] =
    useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } =
      await supabase
        .from("categories")
        .select("*");

    if (error) {
      console.log(error);
    } else {
      setCategories(data || []);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="flex justify-between items-center mb-14">

        <div>

          <h2 className="text-6xl font-bold">
            Browse Categories
          </h2>

          <p className="text-zinc-400 text-xl mt-4">
            Find trusted experts by category
          </p>

        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

        {categories.map((category) => (

          <Link
            key={category.id}
            href={`/providers?search=${category.name}`}
          >

            <div className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500 rounded-3xl p-8 text-center transition cursor-pointer">

              <div className="text-6xl">
                {category.icon}
              </div>

              <h3 className="text-2xl font-bold mt-5">
                {category.name}
              </h3>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}