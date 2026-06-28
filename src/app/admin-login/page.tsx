"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@eka.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setMessage("Access denied. This is not an admin account.");
      setLoading(false);
      return;
    }

    router.push("/admin/revenue");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#07080a] px-5 py-14 text-white">
      <section className="mx-auto max-w-xl">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
          Admin Access
        </p>

        <h1 className="text-5xl font-black tracking-[-0.05em]">
          Platform control login.
        </h1>

        <p className="mt-4 leading-7 text-zinc-400">
          Only admin-role accounts can enter revenue and control panels.
        </p>

        <div className="mt-8 rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
          <Input label="Admin email" value={email} setValue={setEmail} />
          <div className="mt-4">
            <Input label="Admin password" value={password} setValue={setPassword} type="password" />
          </div>

          {message && (
            <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              {message}
            </p>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-red-500 px-5 py-4 font-black text-white disabled:opacity-60"
          >
            {loading ? "Checking..." : "Enter Admin Panel"}
          </button>

          <p className="mt-5 text-center text-sm font-bold text-zinc-500">
            Normal user?{" "}
            <Link href="/login" className="text-white">
              User login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <label>
      <p className="mb-2 text-sm font-black text-zinc-500">{label}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder={label}
        className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/60"
      />
    </label>
  );
}