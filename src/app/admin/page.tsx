"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/revenue";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAdmin();

    const channel = supabase
      .channel("admin-command-center")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "providers" },
        () => loadAdmin()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => loadAdmin()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadAdmin() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;
    setUser(currentUser);

    if (!currentUser) {
      setProfile(null);
      setProviders([]);
      setBookings([]);
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    setProfile(profileData || null);

    const { data: providerRows } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: bookingRows } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    setProviders(providerRows || []);
    setBookings(bookingRows || []);
    setLoading(false);
  }

  async function updateProvider(providerId: string, updates: any) {
    setMessage("");

    const { error } = await supabase
      .from("providers")
      .update(updates)
      .eq("id", providerId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Provider updated successfully.");
    loadAdmin();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "completed");
    const pending = bookings.filter((b) => b.status === "pending");
    const accepted = bookings.filter((b) => b.status === "accepted");
    const rejected = bookings.filter((b) => b.status === "rejected");

    const revenue = completed.reduce(
      (sum, b) => sum + Number(b.platform_fee || 0),
      0
    );

    const providerPayout = completed.reduce(
      (sum, b) => sum + Number(b.provider_earning || 0),
      0
    );

    const cashback = completed.reduce(
      (sum, b) => sum + Number(b.cashback_amount || 0),
      0
    );

    const totalVolume = bookings.reduce(
      (sum, b) => sum + Number(b.total_amount || 0),
      0
    );

    const pendingProviders = providers.filter((p) => !p.approved).length;
    const approvedProviders = providers.filter((p) => p.approved).length;
    const verifiedProviders = providers.filter((p) => p.verified).length;
    const premiumProviders = providers.filter((p) => p.premium).length;

    return {
      revenue,
      providerPayout,
      cashback,
      totalVolume,
      pendingProviders,
      approvedProviders,
      verifiedProviders,
      premiumProviders,
      completed: completed.length,
      pending: pending.length,
      accepted: accepted.length,
      rejected: rejected.length,
      totalBookings: bookings.length,
    };
  }, [providers, bookings]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black">Loading admin command center...</h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-3xl rounded-[36px] border border-white/10 bg-white/[0.055] p-8">
          <h1 className="text-5xl font-black tracking-[-0.05em]">
            Admin login required.
          </h1>
          <p className="mt-4 text-zinc-400">
            Please login with your admin account first.
          </p>
          <Link
            href="/admin-login"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-black text-black"
          >
            Admin Login
          </Link>
        </div>
      </main>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-3xl rounded-[36px] border border-red-400/20 bg-red-500/10 p-8">
          <h1 className="text-5xl font-black tracking-[-0.05em]">
            Access denied.
          </h1>
          <p className="mt-4 text-red-100/80">
            This page is only for EKA admins.
          </p>
          <button
            onClick={logout}
            className="mt-6 rounded-full bg-white px-6 py-3 font-black text-black"
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] px-5 pb-20 pt-40 text-white">
      <Background />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
              Admin Command Center
            </p>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              Run EKA like a real platform.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Track revenue, approve providers, monitor bookings, manage trust,
              and control marketplace quality from one place.
            </p>
          </div>

          <Panel>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
              Platform Revenue
            </p>

            <h2 className="mt-5 text-6xl font-black tracking-[-0.08em] text-green-300">
              {formatMoney(stats.revenue)}
            </h2>

            <p className="mt-3 text-sm font-bold text-zinc-500">
              From completed protected bookings
            </p>
          </Panel>
        </div>

        {message && <Alert>{message}</Alert>}

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat title="Booking Volume" value={formatMoney(stats.totalVolume)} />
          <Stat title="Provider Payout" value={formatMoney(stats.providerPayout)} />
          <Stat title="Cashback Given" value={formatMoney(stats.cashback)} />
          <Stat title="Total Bookings" value={stats.totalBookings} />
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat title="Pending Jobs" value={stats.pending} color="orange" />
          <Stat title="Accepted Jobs" value={stats.accepted} color="blue" />
          <Stat title="Completed Jobs" value={stats.completed} color="green" />
          <Stat title="Rejected Jobs" value={stats.rejected} color="red" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
          <div className="space-y-6">
            <Panel>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                Provider Control
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Mini label="Pending" value={stats.pendingProviders} />
                <Mini label="Approved" value={stats.approvedProviders} />
                <Mini label="Verified" value={stats.verifiedProviders} />
                <Mini label="Premium" value={stats.premiumProviders} />
              </div>
            </Panel>

            <Panel>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-300">
                Business Model
              </p>

              <div className="mt-5 space-y-3">
                <Business title="Commission" text="5–10% from completed bookings" />
                <Business title="Provider Plans" text="Monthly premium visibility" />
                <Business title="Verification" text="Paid trust badge and ranking" />
                <Business title="Boosts" text="Featured placement in marketplace" />
              </div>
            </Panel>

            <Panel>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-300">
                Admin Actions
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/providers"
                  className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-center font-black text-white transition hover:bg-white hover:text-black"
                >
                  View Marketplace
                </Link>
                <Link
                  href="/protected-booking"
                  className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-center font-black text-white transition hover:bg-white hover:text-black"
                >
                  Test Booking
                </Link>
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel>
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                    Provider Approvals
                  </p>
                  <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                    Marketplace Quality
                  </h2>
                </div>
              </div>

              {providers.length === 0 ? (
                <Empty title="No providers yet." />
              ) : (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      updateProvider={updateProvider}
                    />
                  ))}
                </div>
              )}
            </Panel>

            <Panel>
              <div className="mb-6">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                  Live Transactions
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                  Recent Bookings
                </h2>
              </div>

              {bookings.length === 0 ? (
                <Empty title="No bookings yet." />
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 8).map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProviderCard({
  provider,
  updateProvider,
}: {
  provider: any;
  updateProvider: (providerId: string, updates: any) => void;
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-black/35 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-[-0.04em]">
              {provider.full_name || "Unnamed Provider"}
            </h3>

            <Status active={provider.approved} yes="Approved" no="Pending" />
          </div>

          <p className="mt-2 text-sm font-bold text-zinc-500">
            {provider.service_category || "Service"} · {provider.city || "City"}
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            {provider.description || "No description added."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Mini label="Trust" value={provider.trust_score || 70} />
          <Mini label="AI" value={provider.ai_score || 72} />
          <Mini label="Jobs" value={provider.total_bookings || 0} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <AdminButton
          active={provider.approved}
          onClick={() =>
            updateProvider(provider.id, { approved: !provider.approved })
          }
        >
          {provider.approved ? "Unapprove" : "Approve"}
        </AdminButton>

        <AdminButton
          active={provider.verified}
          onClick={() =>
            updateProvider(provider.id, { verified: !provider.verified })
          }
        >
          {provider.verified ? "Unverify" : "Verify"}
        </AdminButton>

        <AdminButton
          active={provider.premium}
          onClick={() =>
            updateProvider(provider.id, { premium: !provider.premium })
          }
        >
          {provider.premium ? "Remove Pro" : "Make Pro"}
        </AdminButton>

        <AdminButton
          active={provider.featured}
          onClick={() =>
            updateProvider(provider.id, { featured: !provider.featured })
          }
        >
          {provider.featured ? "Unfeature" : "Feature"}
        </AdminButton>
      </div>
    </div>
  );
}

function BookingRow({ booking }: { booking: any }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-black/35 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-black">
              {booking.customer_name || "Customer"}
            </h3>
            <BookingStatus status={booking.status || "pending"} />
          </div>

          <p className="mt-2 text-sm font-bold text-zinc-500">
            {booking.city || "City"} · {booking.address || "Address"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Mini
            label="Total"
            value={formatMoney(Number(booking.total_amount || 0))}
          />
          <Mini
            label="Fee"
            value={formatMoney(Number(booking.platform_fee || 0))}
          />
          <Mini
            label="Cashback"
            value={formatMoney(Number(booking.cashback_amount || 0))}
          />
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.08),transparent_24%)]" />
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      {children}
    </div>
  );
}

function Stat({ title, value, color = "white" }: any) {
  const colorClass =
    color === "green"
      ? "text-green-300"
      : color === "blue"
      ? "text-sky-300"
      : color === "red"
      ? "text-red-300"
      : color === "orange"
      ? "text-orange-300"
      : "text-white";

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.055] p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-600">
        {title}
      </p>
      <h3 className={`mt-4 text-4xl font-black tracking-[-0.05em] ${colorClass}`}>
        {value}
      </h3>
    </div>
  );
}

function Mini({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-3">
      <p className="text-[11px] font-bold text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Business({ title, text }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-1 text-sm font-bold text-zinc-500">{text}</p>
    </div>
  );
}

function Empty({ title }: { title: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-black/35 p-6">
      <h3 className="text-2xl font-black">{title}</h3>
    </div>
  );
}

function Status({
  active,
  yes,
  no,
}: {
  active: boolean;
  yes: string;
  no: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        active ? "bg-green-400/10 text-green-300" : "bg-orange-400/10 text-orange-300"
      }`}
    >
      {active ? yes : no}
    </span>
  );
}

function BookingStatus({ status }: { status: string }) {
  const color =
    status === "completed"
      ? "bg-green-400/10 text-green-300"
      : status === "accepted"
      ? "bg-sky-400/10 text-sky-300"
      : status === "rejected"
      ? "bg-red-400/10 text-red-300"
      : "bg-orange-400/10 text-orange-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>
      {status}
    </span>
  );
}

function AdminButton({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black transition hover:scale-[1.01] ${
        active
          ? "bg-green-400 text-black"
          : "border border-white/10 bg-white/[0.055] text-white hover:bg-white hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-[24px] border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm font-bold text-green-200">
      {children}
    </div>
  );
}