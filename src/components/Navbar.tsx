"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    getUser();

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      async () => {
        getUser();
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  async function getUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function logout() {

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (

    <header className="sticky top-0 z-[999] backdrop-blur-2xl bg-black/70 border-b border-white/5">

      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        <Link href="/">

          <div className="flex items-center gap-5">

            <div className="w-10 h-10 rounded-sm rotate-45 bg-gradient-to-br from-red-400 to-red-700 shadow-[0_0_40px_rgba(239,68,68,0.6)]" />

            <h1 className="text-5xl font-black tracking-tight">
              EKA
            </h1>

          </div>

        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-zinc-400 font-semibold">

          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          <Link href="/providers" className="hover:text-white transition">
            Providers
          </Link>

          <Link href="/jobs" className="hover:text-white transition">
            Jobs
          </Link>

          <Link href="/dashboard" className="hover:text-white transition">
            Dashboard
          </Link>

          <Link href="/dashboard/messages" className="hover:text-white transition">
            Messages
          </Link>

          <Link href="/dashboard/notifications" className="hover:text-white transition">
            Notifications
          </Link>

          <Link href="/dashboard/portfolio" className="hover:text-white transition">
            Portfolio
          </Link>

          <Link href="/dashboard/settings" className="hover:text-white transition">
            Settings
          </Link>

          <Link href="/admin" className="hover:text-white transition">
            Admin
          </Link>

        </nav>

        {user ? (

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 transition h-16 px-10 rounded-[24px] font-black shadow-[0_0_40px_rgba(239,68,68,0.35)]"
          >
            Logout
          </button>

        ) : (

          <Link href="/login">

            <button className="bg-red-500 hover:bg-red-600 transition h-16 px-10 rounded-[24px] font-black shadow-[0_0_40px_rgba(239,68,68,0.35)]">
              Login
            </button>

          </Link>

        )}

      </div>

    </header>
  );
}