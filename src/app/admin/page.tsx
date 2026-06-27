"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Provider = {
  id: string;
  full_name?: string;
  phone?: string;
  city?: string;
  service_category?: string;
  description?: string;
  image?: string;
  approved?: boolean;
  premium?: boolean;
  featured?: boolean;
  verified?: boolean;
  ai_score?: number;
  trust_score?: number;
  total_bookings?: number;
  created_at?: string;
};

type Booking = {
  id: string;
  customer_name?: string;
  phone?: string;
  city?: string;
  address?: string;
  notes?: string;
  message?: string;
  status?: string;
  created_at?: string;
};

export default function AdminPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const stats = {
    totalProviders: providers.length,
    totalBookings: bookings.length,
    revenue: bookings.length * 2500,
    pendingProviders: providers.filter((p) => !p.approved).length,
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    const { data: providersData, error: providersError } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (providersError) {
      setError(providersError.message);
    }

    if (bookingsError) {
      setError(bookingsError.message);
    }

    setProviders(providersData || []);
    setBookings(bookingsData || []);
    setLoading(false);
  }

  async function updateProvider(
    id: string,
    payload: Partial<Provider>,
    actionName: string
  ) {
    setActionLoading(`${id}-${actionName}`);
    setError("");

    const { error } = await supabase
      .from("providers")
      .update(payload)
      .eq("id", id);

    if (error) {
      setError(error.message);
      console.error(error);
    }

    setActionLoading(null);
    loadData();
  }

  async function removeProvider(id: string) {
    const ok = confirm("Are you sure you want to remove this provider?");
    if (!ok) return;

    setActionLoading(`${id}-remove`);
    setError("");

    const { error } = await supabase.from("providers").delete().eq("id", id);

    if (error) {
      setError(error.message);
      console.error(error);
    }

    setActionLoading(null);
    loadData();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[130px]" />
        <div className="absolute right-0 top-32 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-red-400">
              EKA Control Center
            </p>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Admin Panel
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              Manage providers, bookings, verification, premium visibility,
              featured providers, AI score and trust score.
            </p>
          </div>

          <button
            onClick={loadData}
            className="w-fit rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:scale-105"
          >
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            <p className="font-black">Supabase Error</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <StatCard title="Providers" value={stats.totalProviders} />
          <StatCard title="Bookings" value={stats.totalBookings} />
          <StatCard title="Revenue" value={`Rs ${stats.revenue}`} green />
          <StatCard title="Pending" value={stats.pendingProviders} red />
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-black md:text-5xl">
                Provider Control
              </h2>
              <p className="mt-2 text-zinc-500">
                Approve, verify, feature, boost and manage providers.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-400/10 px-4 py-2 text-sm font-black text-green-300">
              {providers.length} providers loaded
            </span>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-black/50 p-8 text-zinc-400">
              Loading admin data...
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-3xl bg-black/50 p-8 text-zinc-400">
              No providers found.
            </div>
          ) : (
            <div className="space-y-5">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="rounded-[30px] border border-white/10 bg-black/55 p-5 transition hover:border-red-500/40"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row">
                    <div className="flex gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 text-4xl">
                        {provider.image ? (
                          <img
                            src={provider.image}
                            alt={provider.full_name || "Provider"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          "🛠️"
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-black">
                            {provider.full_name || "Unnamed Provider"}
                          </h3>

                          {provider.approved && <Badge text="APPROVED" color="green" />}
                          {provider.verified && <Badge text="VERIFIED" color="blue" />}
                          {provider.premium && <Badge text="PREMIUM" color="yellow" />}
                          {provider.featured && <Badge text="FEATURED" color="red" />}
                        </div>

                        <p className="mt-2 text-zinc-400">
                          {provider.service_category || "No category"} ·{" "}
                          {provider.city || "No city"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-600">
                          {provider.phone || "No phone"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <SmallMetric label="AI" value={provider.ai_score || 0} />
                          <SmallMetric
                            label="Trust"
                            value={provider.trust_score || 0}
                          />
                          <SmallMetric
                            label="Bookings"
                            value={provider.total_bookings || 0}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
                      {!provider.approved && (
                        <AdminButton
                          text="Approve"
                          loading={actionLoading === `${provider.id}-approve`}
                          className="bg-green-500 text-black hover:bg-green-400"
                          onClick={() =>
                            updateProvider(
                              provider.id,
                              { approved: true },
                              "approve"
                            )
                          }
                        />
                      )}

                      <AdminButton
                        text={provider.verified ? "Unverify" : "Verify"}
                        loading={actionLoading === `${provider.id}-verify`}
                        className="bg-blue-500 hover:bg-blue-400"
                        onClick={() =>
                          updateProvider(
                            provider.id,
                            { verified: !provider.verified },
                            "verify"
                          )
                        }
                      />

                      <AdminButton
                        text={provider.premium ? "Remove Premium" : "Make Premium"}
                        loading={actionLoading === `${provider.id}-premium`}
                        className="bg-yellow-400 text-black hover:bg-yellow-300"
                        onClick={() =>
                          updateProvider(
                            provider.id,
                            { premium: !provider.premium },
                            "premium"
                          )
                        }
                      />

                      <AdminButton
                        text={provider.featured ? "Unfeature" : "Feature"}
                        loading={actionLoading === `${provider.id}-featured`}
                        className="bg-red-500 hover:bg-red-400"
                        onClick={() =>
                          updateProvider(
                            provider.id,
                            { featured: !provider.featured },
                            "featured"
                          )
                        }
                      />

                      <AdminButton
                        text="Boost AI +10"
                        loading={actionLoading === `${provider.id}-ai`}
                        className="bg-white text-black hover:bg-zinc-200"
                        onClick={() =>
                          updateProvider(
                            provider.id,
                            { ai_score: (provider.ai_score || 0) + 10 },
                            "ai"
                          )
                        }
                      />

                      <AdminButton
                        text="Boost Trust +10"
                        loading={actionLoading === `${provider.id}-trust`}
                        className="bg-zinc-800 hover:bg-zinc-700"
                        onClick={() =>
                          updateProvider(
                            provider.id,
                            { trust_score: (provider.trust_score || 0) + 10 },
                            "trust"
                          )
                        }
                      />

                      <AdminButton
                        text="Remove Provider"
                        loading={actionLoading === `${provider.id}-remove`}
                        className="bg-red-950 hover:bg-red-900 sm:col-span-2"
                        onClick={() => removeProvider(provider.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="mb-6 text-3xl font-black md:text-5xl">
              Live Bookings
            </h2>

            {bookings.length === 0 ? (
              <p className="rounded-3xl bg-black/50 p-6 text-zinc-500">
                No bookings found.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-3xl border border-white/10 bg-black/55 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black">
                          {booking.customer_name || "Customer"}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          {booking.city || booking.address || "No location"}
                        </p>

                        <p className="mt-3 text-zinc-400">
                          {booking.notes || booking.message || "No booking note"}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-400/10 px-4 py-2 text-xs font-black uppercase text-green-300">
                        {booking.status || "pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="mb-6 text-3xl font-black md:text-5xl">
              Marketplace Health
            </h2>

            <div className="space-y-4">
              <HealthCard title="AI Matching Accuracy" value="98%" color="green" />
              <HealthCard title="Realtime Activity" value="LIVE" color="red" />
              <HealthCard title="Growth Signal" value="+42%" color="blue" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  green = false,
  red = false,
}: {
  title: string;
  value: string | number;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.055] p-6 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <h3
        className={`mt-3 text-4xl font-black ${
          green ? "text-green-300" : red ? "text-red-300" : "text-white"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 px-4 py-3">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}

function Badge({
  text,
  color,
}: {
  text: string;
  color: "green" | "blue" | "yellow" | "red";
}) {
  const classes = {
    green: "bg-green-400/10 text-green-300",
    blue: "bg-blue-400/10 text-blue-300",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-500/20 text-red-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${classes[color]}`}>
      {text}
    </span>
  );
}

function AdminButton({
  text,
  onClick,
  loading,
  className,
}: {
  text: string;
  onClick: () => void;
  loading: boolean;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`min-h-14 rounded-2xl px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? "Working..." : text}
    </button>
  );
}

function HealthCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "green" | "red" | "blue";
}) {
  const colors = {
    green: "text-green-300",
    red: "text-red-300",
    blue: "text-blue-300",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/55 p-6">
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <h3 className={`mt-3 text-5xl font-black ${colors[color]}`}>{value}</h3>
    </div>
  );
}