"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/revenue";

type Provider = any;
type Profile = any;
type Booking = any;

export default function AdminCommandCenterPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<"providers" | "users" | "bookings" | "cashback">(
    "providers"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAll();

    const channel = supabase
      .channel("admin-command")
      .on("postgres_changes", { event: "*", schema: "public", table: "providers" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, loadAll)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadAll() {
    setLoading(true);

    const [providerRes, profileRes, bookingRes, walletRes] = await Promise.all([
      supabase.from("providers").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    setProviders(providerRes.data || []);
    setProfiles(profileRes.data || []);
    setBookings(bookingRes.data || []);
    setWallet(walletRes.data || []);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const totalValue = bookings.reduce((s, b) => s + Number(b.total_amount || 0), 0);
    const commission = bookings.reduce((s, b) => s + Number(b.platform_fee || 0), 0);
    const cashback = bookings.reduce((s, b) => s + Number(b.cashback_amount || 0), 0);
    const providerEarning = bookings.reduce((s, b) => s + Number(b.provider_earning || 0), 0);

    return {
      users: profiles.length,
      customers: profiles.filter((p) => p.role === "customer").length,
      providers: providers.length,
      pendingProviders: providers.filter((p) => !p.approved).length,
      approvedProviders: providers.filter((p) => p.approved).length,
      bookings: bookings.length,
      completed: bookings.filter((b) => b.status === "completed").length,
      totalValue,
      commission,
      cashback,
      providerEarning,
      creditedCashback: wallet.reduce((s, w) => s + Number(w.amount || 0), 0),
    };
  }, [providers, profiles, bookings, wallet]);

  async function updateProvider(id: string, patch: Partial<Provider>) {
    setMessage("");

    const { error } = await supabase.from("providers").update(patch).eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadAll();
  }

  async function updateProfileRole(id: string, role: "customer" | "provider" | "admin") {
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadAll();
  }

  async function deleteProvider(id: string) {
    const ok = confirm("Delete this provider profile?");
    if (!ok) return;

    const { error } = await supabase.from("providers").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadAll();
  }

  async function markPaid(booking: Booking) {
    await supabase.from("bookings").update({ payment_status: "paid" }).eq("id", booking.id);
    await loadAll();
  }

  async function completeBooking(booking: Booking) {
    const code = prompt("Enter customer service code:");
    if (!code) return;

    if (code !== booking.service_code) {
      alert("Wrong service code.");
      return;
    }

    await supabase
      .from("bookings")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        provider_phone_hidden: false,
      })
      .eq("id", booking.id);

    await loadAll();
  }

  async function creditCashback(booking: Booking) {
    if (!booking.customer_id && !booking.user_id) {
      alert("No customer ID found for this booking.");
      return;
    }

    await supabase.from("wallet_transactions").insert({
      user_id: booking.customer_id || booking.user_id,
      booking_id: booking.id,
      amount: Number(booking.cashback_amount || 0),
      type: "cashback",
      status: "credited",
    });

    await supabase
      .from("bookings")
      .update({ cashback_status: "credited" })
      .eq("id", booking.id);

    await loadAll();
  }

  async function seedDemoProviders() {
    const demoProviders = [
      {
        full_name: "Ramesh Electric Works",
        phone: "9800000001",
        city: "Kathmandu",
        service_category: "electrician",
        description: "Wiring, inverter, fan, switchboard and electrical safety work.",
        approved: true,
        verified: true,
        premium: true,
        featured: true,
        ai_score: 96,
        trust_score: 94,
        total_bookings: 38,
      },
      {
        full_name: "Aarav Plumbing Service",
        phone: "9800000002",
        city: "Lalitpur",
        service_category: "plumber",
        description: "Leakage repair, bathroom fitting, kitchen pipe and emergency plumbing.",
        approved: true,
        verified: true,
        premium: false,
        featured: true,
        ai_score: 91,
        trust_score: 89,
        total_bookings: 27,
      },
      {
        full_name: "SecureView CCTV Nepal",
        phone: "9800000003",
        city: "Bhaktapur",
        service_category: "cctv",
        description: "CCTV camera setup, DVR configuration and home security installation.",
        approved: true,
        verified: true,
        premium: true,
        featured: false,
        ai_score: 93,
        trust_score: 92,
        total_bookings: 19,
      },
      {
        full_name: "CleanPro Home Care",
        phone: "9800000004",
        city: "Kathmandu",
        service_category: "cleaning",
        description: "Home cleaning, office cleaning, deep cleaning and post-service cleanup.",
        approved: true,
        verified: false,
        premium: false,
        featured: false,
        ai_score: 84,
        trust_score: 80,
        total_bookings: 12,
      },
    ];

    const { error } = await supabase.from("providers").insert(demoProviders);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadAll();
  }

  return (
    <div className="relative">
      <style jsx global>{`
        @keyframes adminGlow {
          0%,
          100% {
            opacity: 0.55;
            transform: translateY(0px);
          }
          50% {
            opacity: 0.95;
            transform: translateY(-8px);
          }
        }

        .admin-panel {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.035)
          );
          box-shadow: 0 35px 120px rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(24px);
        }
      `}</style>

      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
            Admin Command Center
          </p>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl">
            Control trust, users, providers and money.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            This is the real marketplace brain of EKA. Admin approves providers,
            verifies trust, manages roles, completes protected bookings and credits cashback.
          </p>
        </div>

        <button
          onClick={seedDemoProviders}
          className="w-fit rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
        >
          Add Demo Providers
        </button>
      </div>

      {message && (
        <p className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {message}
        </p>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Users" value={stats.users} />
        <Stat title="Pending Providers" value={stats.pendingProviders} orange />
        <Stat title="EKA Commission" value={formatMoney(stats.commission)} green />
        <Stat title="Cashback Credited" value={formatMoney(stats.creditedCashback)} blue />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Customers" value={stats.customers} />
        <Stat title="Providers" value={stats.providers} />
        <Stat title="Bookings" value={stats.bookings} />
        <Stat title="Booking Value" value={formatMoney(stats.totalValue)} />
      </div>

      <div className="admin-panel mb-8 rounded-[28px] p-2">
        <div className="grid gap-2 md:grid-cols-4">
          <Tab active={active === "providers"} onClick={() => setActive("providers")} label="Provider Approval" />
          <Tab active={active === "users"} onClick={() => setActive("users")} label="User Roles" />
          <Tab active={active === "bookings"} onClick={() => setActive("bookings")} label="Booking Control" />
          <Tab active={active === "cashback"} onClick={() => setActive("cashback")} label="Cashback Wallet" />
        </div>
      </div>

      {loading ? (
        <div className="admin-panel rounded-[34px] p-8">
          <h2 className="text-3xl font-black">Loading admin control...</h2>
        </div>
      ) : (
        <>
          {active === "providers" && (
            <section className="admin-panel rounded-[34px] p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-3xl font-black">Provider Approval Center</h2>
                  <p className="mt-2 text-zinc-500">
                    Approve, verify, feature and upgrade provider accounts.
                  </p>
                </div>
                <span className="rounded-full bg-orange-400/10 px-4 py-2 text-xs font-black text-orange-300">
                  {stats.pendingProviders} pending
                </span>
              </div>

              {providers.length === 0 ? (
                <Empty
                  title="No providers yet."
                  text="Create provider account from signup or click Add Demo Providers."
                />
              ) : (
                <div className="grid gap-4">
                  {providers.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-[30px] border border-white/10 bg-black/35 p-5"
                    >
                      <div className="grid gap-6 xl:grid-cols-[1fr_440px] xl:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-black">{p.full_name || "Unnamed Provider"}</h3>
                            <Badge text={p.approved ? "approved" : "pending"} tone={p.approved ? "green" : "orange"} />
                            <Badge text={p.verified ? "verified" : "unverified"} tone={p.verified ? "blue" : "white"} />
                            <Badge text={p.premium ? "premium" : "free"} tone={p.premium ? "yellow" : "white"} />
                            {p.featured && <Badge text="featured" tone="red" />}
                          </div>

                          <p className="mt-2 text-zinc-500">
                            {p.service_category || "Service"} · {p.city || "City"} · {p.phone || "No phone"}
                          </p>

                          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
                            {p.description || "No description added."}
                          </p>

                          <div className="mt-5 grid gap-3 sm:grid-cols-4">
                            <Mini title="AI Score" value={p.ai_score || 70} green />
                            <Mini title="Trust" value={p.trust_score || 70} blue />
                            <Mini title="Jobs" value={p.total_bookings || 0} />
                            <Mini title="Owner" value={p.owner_id ? "Linked" : "Demo"} />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <Action
                            label={p.approved ? "Unapprove" : "Approve"}
                            tone={p.approved ? "dark" : "green"}
                            onClick={() => updateProvider(p.id, { approved: !p.approved })}
                          />
                          <Action
                            label={p.verified ? "Remove Verify" : "Verify"}
                            tone={p.verified ? "dark" : "blue"}
                            onClick={() => updateProvider(p.id, { verified: !p.verified })}
                          />
                          <Action
                            label={p.premium ? "Free Plan" : "Make Premium"}
                            tone={p.premium ? "dark" : "yellow"}
                            onClick={() => updateProvider(p.id, { premium: !p.premium })}
                          />
                          <Action
                            label={p.featured ? "Unfeature" : "Feature"}
                            tone={p.featured ? "dark" : "red"}
                            onClick={() => updateProvider(p.id, { featured: !p.featured })}
                          />
                          <Action
                            label="+ AI Score"
                            tone="white"
                            onClick={() => updateProvider(p.id, { ai_score: Number(p.ai_score || 70) + 5 })}
                          />
                          <Action
                            label="+ Trust"
                            tone="white"
                            onClick={() => updateProvider(p.id, { trust_score: Number(p.trust_score || 70) + 5 })}
                          />
                          <button
                            onClick={() => deleteProvider(p.id)}
                            className="sm:col-span-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 font-black text-red-200"
                          >
                            Delete Provider
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {active === "users" && (
            <section className="admin-panel rounded-[34px] p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-black">User Role Management</h2>
                <p className="mt-2 text-zinc-500">
                  Change accounts between customer, provider and admin.
                </p>
              </div>

              {profiles.length === 0 ? (
                <Empty title="No user profiles found." text="Create users from signup first." />
              ) : (
                <div className="grid gap-4">
                  {profiles.map((u) => (
                    <div
                      key={u.id}
                      className="rounded-[28px] border border-white/10 bg-black/35 p-5"
                    >
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-black">
                              {u.full_name || "Unnamed User"}
                            </h3>
                            <Badge text={u.role || "customer"} tone={u.role === "admin" ? "red" : u.role === "provider" ? "orange" : "blue"} />
                          </div>
                          <p className="mt-2 text-zinc-500">{u.email || "No email"}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                          <Action label="Customer" tone="blue" onClick={() => updateProfileRole(u.id, "customer")} />
                          <Action label="Provider" tone="orange" onClick={() => updateProfileRole(u.id, "provider")} />
                          <Action label="Admin" tone="red" onClick={() => updateProfileRole(u.id, "admin")} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {active === "bookings" && (
            <section className="admin-panel rounded-[34px] p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-black">Booking Control</h2>
                <p className="mt-2 text-zinc-500">
                  Mark paid, verify service code, complete booking and trigger cashback.
                </p>
              </div>

              {bookings.length === 0 ? (
                <Empty
                  title="No bookings yet."
                  text="Create a protected booking from the customer workspace."
                />
              ) : (
                <div className="grid gap-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-[28px] border border-white/10 bg-black/35 p-5">
                      <div className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-black">{b.customer_name || "Customer"}</h3>
                            <Badge text={b.status || "pending"} tone={b.status === "completed" ? "green" : "orange"} />
                            <Badge text={b.payment_status || "payment pending"} tone={b.payment_status === "paid" ? "green" : "white"} />
                            <Badge text={b.cashback_status || "cashback pending"} tone={b.cashback_status === "credited" ? "blue" : "white"} />
                          </div>

                          <p className="mt-2 text-zinc-500">
                            {b.city || "No city"} · Code: {b.service_code || "-"} · {b.notes || b.message || "No note"}
                          </p>

                          <div className="mt-5 grid gap-3 sm:grid-cols-4">
                            <Mini title="Amount" value={formatMoney(b.total_amount)} />
                            <Mini title="Commission" value={formatMoney(b.platform_fee)} green />
                            <Mini title="Provider" value={formatMoney(b.provider_earning)} blue />
                            <Mini title="Cashback" value={formatMoney(b.cashback_amount)} orange />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                          <Action label="Mark Paid" tone="white" onClick={() => markPaid(b)} />
                          <Action label="Complete with Code" tone="green" onClick={() => completeBooking(b)} />
                          <Action label="Credit Cashback" tone="blue" onClick={() => creditCashback(b)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {active === "cashback" && (
            <section className="admin-panel rounded-[34px] p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-black">Cashback Wallet</h2>
                <p className="mt-2 text-zinc-500">
                  Every credited cashback transaction appears here.
                </p>
              </div>

              {wallet.length === 0 ? (
                <Empty
                  title="No cashback credited yet."
                  text="Complete a booking and click Credit Cashback."
                />
              ) : (
                <div className="grid gap-4">
                  {wallet.map((w) => (
                    <div key={w.id} className="rounded-[28px] border border-white/10 bg-black/35 p-5">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <h3 className="text-2xl font-black">{formatMoney(w.amount)}</h3>
                          <p className="mt-2 text-zinc-500">
                            {w.type || "cashback"} · {w.status || "credited"}
                          </p>
                        </div>
                        <Badge text="credited" tone="blue" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Tab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-4 text-sm font-black transition ${
        active ? "bg-white text-black" : "bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({
  title,
  value,
  green,
  blue,
  orange,
}: {
  title: string;
  value: any;
  green?: boolean;
  blue?: boolean;
  orange?: boolean;
}) {
  return (
    <div className="admin-panel rounded-[28px] p-6">
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <h3
        className={`mt-3 text-3xl font-black ${
          green ? "text-green-300" : blue ? "text-sky-300" : orange ? "text-orange-300" : "text-white"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function Mini({
  title,
  value,
  green,
  blue,
  orange,
}: {
  title: string;
  value: any;
  green?: boolean;
  blue?: boolean;
  orange?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-4">
      <p className="text-xs font-bold text-zinc-500">{title}</p>
      <p
        className={`mt-1 font-black ${
          green ? "text-green-300" : blue ? "text-sky-300" : orange ? "text-orange-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({
  text,
  tone = "white",
}: {
  text: string;
  tone?: "white" | "green" | "blue" | "orange" | "yellow" | "red";
}) {
  const styles = {
    white: "bg-white/10 text-zinc-300",
    green: "bg-green-400/10 text-green-300",
    blue: "bg-sky-400/10 text-sky-300",
    orange: "bg-orange-400/10 text-orange-300",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-500/20 text-red-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${styles[tone]}`}>
      {text}
    </span>
  );
}

function Action({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone: "white" | "green" | "blue" | "orange" | "yellow" | "red" | "dark";
}) {
  const styles = {
    white: "bg-white text-black",
    green: "bg-green-500 text-black",
    blue: "bg-sky-500 text-black",
    orange: "bg-orange-500 text-black",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-500 text-white",
    dark: "border border-white/10 bg-white/[0.06] text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black transition hover:scale-[1.02] ${styles[tone]}`}
    >
      {label}
    </button>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-black/35 p-8">
      <h3 className="text-3xl font-black">{title}</h3>
      <p className="mt-3 max-w-2xl leading-7 text-zinc-500">{text}</p>
    </div>
  );
}