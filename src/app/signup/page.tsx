"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSignup() {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created!");

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <h1 className="text-4xl font-bold mb-3">
          Create Account
        </h1>

        <p className="text-zinc-400 mb-8">
          Join EKA marketplace
        </p>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 outline-none focus:border-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 outline-none focus:border-red-500"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 transition rounded-xl py-4 font-semibold text-lg"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
}