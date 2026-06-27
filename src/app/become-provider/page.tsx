"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BecomeProviderPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      full_name: "",
      phone: "",
      city: "",
      service_category: "",
      bio: "",
    });

  async function createProvider() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login first");
      return;
    }

    const { data: existing } =
      await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (existing) {
      router.push("/dashboard");
      return;
    }

    await supabase
      .from("providers")
      .insert({
        user_id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
        service_category:
          form.service_category,
        bio: form.bio,

        verified: false,
        approved: false,
        featured: false,
        premium: false,

        total_bookings: 0,
        total_views: 0,
        trust_score: 20,
        ai_score: 20,
        trending_score: 0,
        completion_rate: 0,
      });

    alert("Provider account created");

    router.push("/dashboard");
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-3xl mx-auto px-6 py-32">

        <div className="mb-16">

          <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-6">
            Provider Onboarding
          </p>

          <h1 className="text-7xl font-black mb-6">
            Become a Provider
          </h1>

          <p className="text-zinc-400 text-2xl">
            Join Nepal’s intelligent
            AI-powered marketplace.
          </p>

        </div>

        <div className="glass rounded-[40px] p-10 space-y-6">

          <input
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value,
              })
            }
            className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-lg outline-none"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-lg outline-none"
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-lg outline-none"
          />

          <input
            placeholder="Service category"
            value={form.service_category}
            onChange={(e) =>
              setForm({
                ...form,
                service_category:
                  e.target.value,
              })
            }
            className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-lg outline-none"
          />

          <textarea
            rows={5}
            placeholder="Professional bio"
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio: e.target.value,
              })
            }
            className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-lg outline-none"
          />

          <button
            onClick={createProvider}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 transition rounded-2xl py-6 text-xl font-bold"
          >

            {loading
              ? "Creating..."
              : "Create Provider Account"}

          </button>

        </div>

      </section>

    </main>
  );
}