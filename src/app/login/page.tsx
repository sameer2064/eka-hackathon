"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful!");

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <h1 className="text-4xl font-bold mb-3">
          Welcome Back
        </h1>

        <p className="text-zinc-400 mb-8">
          Login to your EKA account
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
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 transition rounded-xl py-4 font-semibold text-lg"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          <Link href="/signup">
            <button className="w-full bg-black border border-zinc-800 hover:border-zinc-600 transition rounded-xl py-4 font-semibold">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}