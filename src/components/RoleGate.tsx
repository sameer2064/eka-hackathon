"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Role = "customer" | "provider" | "admin";

export default function RoleGate({
  allowed,
  children,
  redirectTo = "/login",
}: {
  allowed: Role[];
  children: ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    check();
  }, []);

  async function check() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as Role | undefined;

    if (!role || !allowed.includes(role)) {
      if (role === "admin") router.replace("/admin/revenue");
      else if (role === "provider") router.replace("/provider-dashboard");
      else if (role === "customer") router.replace("/customer");
      else router.replace("/login");
      return;
    }

    setOk(true);
    setChecking(false);
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080a] px-5 text-white">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-500">
            EKA Security
          </p>
          <h1 className="mt-3 text-3xl font-black">Checking access...</h1>
        </div>
      </main>
    );
  }

  if (!ok) return null;
  return <>{children}</>;
}