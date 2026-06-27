"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    getUser();

    const { data } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight">
          EKA<span className="text-red-500">.</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-zinc-300 md:flex">
          <Link href="/">{t.navHome}</Link>
          <Link href="/providers">{t.navProviders}</Link>
          <Link href="/jobs">{t.navJobs}</Link>
          <Link href="/dashboard">{t.navDashboard}</Link>
          <Link href="/admin">{t.navAdmin}</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "np" : "en")}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10"
          >
            {t.switchLang}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold"
            >
              {t.logout}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
            >
              {t.login}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}