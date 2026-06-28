"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Role = "customer" | "provider" | "admin";

const config = {
  customer: {
    eyebrow: "Customer Workspace",
    title: "Protected Services",
    subtitle: "Bookings, warranty, cashback and service proof.",
    accent: "from-sky-400 to-cyan-300",
    links: [
      { href: "/customer", label: "My Bookings" },
      { href: "/protected-booking", label: "Book Service" },
      { href: "/providers", label: "Find Providers" },
    ],
  },
  provider: {
    eyebrow: "Provider Workspace",
    title: "Business Console",
    subtitle: "Approval, jobs, earnings and trust score.",
    accent: "from-orange-400 to-rose-500",
    links: [
      { href: "/provider-dashboard", label: "Overview" },
      { href: "/pricing", label: "Plans" },
      { href: "/providers", label: "Marketplace" },
    ],
  },
  admin: {
    eyebrow: "Admin Command",
    title: "Platform Control",
    subtitle: "Approve providers, manage users, bookings and cashback.",
    accent: "from-emerald-400 to-green-300",
    links: [
      { href: "/admin", label: "Command Center" },
      { href: "/providers", label: "Marketplace" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
};

export default function WorkspaceShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const data = config[role];

  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(244,63,94,0.16),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(249,115,22,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.08),transparent_35%),#06070a]" />

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8 rounded-[34px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className={`mb-4 h-2 w-32 rounded-full bg-gradient-to-r ${data.accent}`} />
              <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-500">
                {data.eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
                {data.title}
              </h1>
              <p className="mt-2 max-w-3xl leading-7 text-zinc-400">
                {data.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}