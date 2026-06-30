"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import NotificationBell from "@/components/NotificationBell";

type Role = "customer" | "provider" | "admin" | null;

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>(null);
  const { isNp, toggleLang, t } = useI18n();

  useEffect(() => {
    loadUser();
    const { data } = supabase.auth.onAuthStateChange(() => loadUser());
    return () => data.subscription.unsubscribe();
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;
    setUser(currentUser);

    if (!currentUser) {
      setRole(null);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    setRole((profile?.role as Role) || null);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const dashboardHref =
    role === "admin"
      ? "/admin"
      : role === "provider"
      ? "/provider-dashboard"
      : "/customer";

  const dashboardLabel =
    role === "admin"
      ? "Admin"
      : role === "provider"
      ? "Provider"
      : "Dashboard";

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-gradient-to-b from-black via-black/75 to-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link href="/" className="group flex items-center gap-5">
          <div className="relative h-14 w-14 rotate-45 rounded-[10px] bg-gradient-to-br from-red-300 via-red-500 to-red-700 shadow-[0_0_45px_rgba(239,68,68,0.35)] transition group-hover:scale-105">
            <div className="absolute inset-[3px] rounded-[8px] bg-gradient-to-br from-white/20 to-black/10" />
          </div>

          <div>
            <p className="text-5xl font-black leading-none tracking-[-0.08em] text-white">
              EKA
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-red-200/50">
              {t("Protected Services", "सुरक्षित सेवा")}
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-10 text-base font-black text-zinc-400 lg:flex">
          <NavItem href="/" label={t("Home", "गृह")} active={pathname === "/"} />
          <NavItem
            href="/providers"
            label={t("Providers", "प्रदायकहरू")}
            active={pathname.startsWith("/providers")}
          />
          <NavItem href="/#support" label={t("Support", "सहायता")} />

          {user && (
            <NavItem
              href="/protected-booking"
              label={t("Book Service", "बुकिङ")}
              active={pathname.startsWith("/protected-booking")}
            />
          )}

          {user && (
            <NavItem
              href={dashboardHref}
              label={dashboardLabel}
              active={pathname === dashboardHref}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && <NotificationBell />}

          <button
            onClick={toggleLang}
            className="hidden rounded-full border border-white/10 bg-black/35 px-5 py-3 text-sm font-black text-white backdrop-blur-xl transition hover:border-red-400/30 hover:bg-red-500/10 sm:block"
          >
            {isNp ? "English" : "नेपाली"}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="rounded-[24px] bg-red-500 px-9 py-4 text-base font-black text-white shadow-[0_0_35px_rgba(239,68,68,0.25)] transition hover:scale-[1.02] hover:bg-red-400"
            >
              {t("Logout", "लग आउट")}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-white/10 bg-black/35 px-5 py-3 text-sm font-black text-white backdrop-blur-xl transition hover:border-red-400/30 hover:bg-red-500/10 sm:block"
              >
                {t("Login", "लग इन")}
              </Link>

              <Link
                href="/signup"
                className="rounded-[24px] bg-red-500 px-8 py-4 text-base font-black text-white shadow-[0_0_35px_rgba(239,68,68,0.25)] transition hover:scale-[1.02] hover:bg-red-400"
              >
                {t("Sign up", "साइन अप")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`transition ${active ? "text-white" : "text-zinc-400 hover:text-white"}`}
    >
      {label}
    </Link>
  );
}