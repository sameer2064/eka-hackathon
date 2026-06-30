"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/revenue";
import { createNotification } from "@/lib/ekaActions";
import BookingChat from "@/components/BookingChat";

export default function CustomerPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCustomerData();

    const channel = supabase
      .channel("customer-dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => loadCustomerData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_transactions" },
        () => loadCustomerData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => loadCustomerData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadCustomerData() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    setUser(currentUser);

    if (!currentUser) {
      setBookings([]);
      setProviders([]);
      setWallet([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data: customerBookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_id", currentUser.id)
      .order("created_at", { ascending: false });

    const { data: userBookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    const merged = [...(customerBookings || []), ...(userBookings || [])];

    const uniqueBookings = Array.from(
      new Map(merged.map((booking) => [booking.id, booking])).values()
    );

    uniqueBookings.sort((a: any, b: any) => {
      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    });

    setBookings(uniqueBookings);

    const providerIds = uniqueBookings
      .map((booking: any) => booking.provider_id)
      .filter(Boolean);

    if (providerIds.length > 0) {
      const uniqueProviderIds = Array.from(new Set(providerIds));

      const { data: providerRows } = await supabase
        .from("providers")
        .select("*")
        .in("id", uniqueProviderIds);

      setProviders(providerRows || []);
    } else {
      setProviders([]);
    }

    const { data: walletRows } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    setWallet(walletRows || []);

    const { data: notificationRows } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(6);

    setNotifications(notificationRows || []);

    setLoading(false);
  }

  function getProvider(providerId: string) {
    return providers.find((provider) => provider.id === providerId);
  }

  async function recommendProvider(booking: any, recommend: boolean) {
    setMessage("");

    if (booking.customer_reviewed) {
      setMessage("You already reviewed this booking.");
      return;
    }

    const provider = getProvider(booking.provider_id);

    await supabase
      .from("bookings")
      .update({
        customer_reviewed: true,
        customer_recommend: recommend,
        customer_review_text: recommend
          ? "Customer recommended this provider."
          : "Customer did not recommend this provider.",
      })
      .eq("id", booking.id);

    if (provider) {
      const trust = Number(provider.trust_score || 70);
      const ratings = Number(provider.rating_count || 0);
      const recommends = Number(provider.recommend_count || 0);

      await supabase
        .from("providers")
        .update({
          trust_score: recommend
            ? Math.min(100, trust + 4)
            : Math.max(40, trust - 3),
          rating_count: ratings + 1,
          recommend_count: recommend ? recommends + 1 : recommends,
        })
        .eq("id", provider.id);
    }

    await createNotification({
      userId: user?.id,
      actorId: user?.id,
      bookingId: booking.id,
      title: "Feedback submitted",
      content: recommend
        ? "Thank you. Your recommendation improved provider trust."
        : "Thank you. Your feedback has been saved.",
      type: "review",
    });

    setMessage("Feedback submitted successfully.");
    loadCustomerData();
  }

  async function reportIssue(booking: any) {
    setMessage("");

    await createNotification({
      userId: user?.id,
      actorId: user?.id,
      bookingId: booking.id,
      title: "Support request created",
      content:
        "Your support request has been recorded. EKA support will review this issue.",
      type: "support",
    });

    setMessage("Support request created successfully.");
    loadCustomerData();
  }

  const stats = useMemo(() => {
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === "pending" || booking.status === "accepted"
    );

    const completedBookings = bookings.filter(
      (booking) => booking.status === "completed"
    );

    const totalSpent = bookings.reduce((sum, booking) => {
      return sum + Number(booking.total_amount || 0);
    }, 0);

    const totalCashback = wallet.reduce((sum, item) => {
      return sum + Number(item.amount || 0);
    }, 0);

    return {
      totalBookings: bookings.length,
      activeBookings: activeBookings.length,
      completedBookings: completedBookings.length,
      totalSpent,
      totalCashback,
    };
  }, [bookings, wallet]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black">Loading customer dashboard...</h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-3xl rounded-[34px] border border-white/10 bg-white/[0.055] p-8 shadow-2xl">
          <h1 className="text-5xl font-black tracking-[-0.05em]">
            Login required
          </h1>

          <p className="mt-4 text-zinc-400">
            Please login to view your bookings, cashback, warranty and service
            history.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-black text-black"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] px-5 pb-20 pt-40 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.08),transparent_24%)]" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
              Customer Dashboard
            </p>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              Your services, protected.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Track bookings, provider status, cashback, warranty, service code,
              support and chat from one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/protected-booking"
                className="rounded-full bg-white px-7 py-3.5 font-black text-black transition hover:scale-[1.02]"
              >
                Book Service
              </Link>

              <Link
                href="/providers"
                className="rounded-full border border-white/10 bg-white/[0.055] px-7 py-3.5 font-black text-white transition hover:bg-white hover:text-black"
              >
                Find Providers
              </Link>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-2xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
              Cashback Wallet
            </p>

            <h2 className="mt-5 text-6xl font-black tracking-[-0.08em] text-green-300">
              {formatMoney(stats.totalCashback)}
            </h2>

            <p className="mt-3 text-sm font-bold text-zinc-500">
              Earned from completed bookings
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-[24px] border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm font-bold text-green-200">
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat title="Total Spent" value={formatMoney(stats.totalSpent)} />
          <Stat title="Bookings" value={stats.totalBookings} />
          <Stat title="Active" value={stats.activeBookings} color="orange" />
          <Stat title="Completed" value={stats.completedBookings} color="green" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                  Protected Bookings
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                  Service history
                </h2>
              </div>

              <Link
                href="/protected-booking"
                className="rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
              >
                New Booking
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-[30px] border border-white/10 bg-black/35 p-6">
                <h3 className="text-2xl font-black">No bookings yet.</h3>
                <p className="mt-2 text-zinc-500">
                  Book your first trusted service from EKA marketplace.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    provider={getProvider(booking.provider_id)}
                    recommendProvider={recommendProvider}
                    reportIssue={reportIssue}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <SidePanel title="Protection">
              <HelpItem title="Booking Proof" text="Every service has record" />
              <HelpItem title="Service Code" text="Unique job verification" />
              <HelpItem title="Cashback" text="Reward after completion" />
              <HelpItem title="Support" text="Report service issue" />
            </SidePanel>

            <SidePanel title="Notifications">
              {notifications.length === 0 ? (
                <p className="rounded-2xl bg-black/35 p-4 text-sm font-bold text-zinc-500">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <p className="font-black text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {item.content}
                    </p>
                  </div>
                ))
              )}
            </SidePanel>

            <SidePanel title="Wallet">
              {wallet.length === 0 ? (
                <p className="rounded-2xl bg-black/35 p-4 text-sm font-bold text-zinc-500">
                  No cashback yet.
                </p>
              ) : (
                wallet.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <p className="font-bold text-zinc-400">
                      {item.type || "cashback"}
                    </p>

                    <p className="font-black text-green-300">
                      +{formatMoney(Number(item.amount || 0))}
                    </p>
                  </div>
                ))
              )}
            </SidePanel>
          </div>
        </div>
      </section>
    </main>
  );
}

function BookingCard({
  booking,
  provider,
  recommendProvider,
  reportIssue,
}: {
  booking: any;
  provider: any;
  recommendProvider: (booking: any, recommend: boolean) => void;
  reportIssue: (booking: any) => void;
}) {
  const status = booking.status || "pending";
  const completed = status === "completed";

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/35 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-[-0.04em]">
              {provider?.full_name || "Provider"}
            </h3>

            <Status status={status} />
          </div>

          <p className="mt-2 text-sm font-bold text-zinc-500">
            {provider?.service_category || "Service"} · {booking.city || "City"}
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {booking.notes || booking.message || "No service note."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Mini
            label="Total"
            value={formatMoney(Number(booking.total_amount || 0))}
          />

          <Mini
            label="Cashback"
            value={formatMoney(Number(booking.cashback_amount || 0))}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Info label="Code" value={booking.service_code || "------"} />
        <Info label="Payment" value={booking.payment_status || "pending"} />
        <Info label="Cashback" value={booking.cashback_status || "pending"} />
        <Info label="Warranty" value={booking.warranty_status || "active"} />
      </div>

      {completed && !booking.customer_reviewed && (
        <div className="mt-5 rounded-[24px] border border-green-400/20 bg-green-500/10 p-5">
          <p className="font-black text-green-200">Was the provider good?</p>

          <p className="mt-2 text-sm leading-6 text-green-100/70">
            Your feedback improves EKA provider trust score.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => recommendProvider(booking, true)}
              className="rounded-full bg-green-400 px-5 py-3 text-sm font-black text-black"
            >
              Recommend
            </button>

            <button
              onClick={() => recommendProvider(booking, false)}
              className="rounded-full border border-white/10 bg-black/35 px-5 py-3 text-sm font-black text-white"
            >
              Not satisfied
            </button>
          </div>
        </div>
      )}

      {completed && booking.customer_reviewed && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-zinc-400">
          Feedback submitted.
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => reportIssue(booking)}
          className="rounded-full border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
        >
          Report Issue
        </button>
      </div>

      <BookingChat booking={booking} role="customer" />
    </div>
  );
}

function Stat({
  title,
  value,
  color = "white",
}: {
  title: string;
  value: string | number;
  color?: "white" | "orange" | "green";
}) {
  const colorClass =
    color === "green"
      ? "text-green-300"
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

function SidePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-2xl">
      <p className="mb-5 text-sm font-black uppercase tracking-[0.25em] text-red-300">
        {title}
      </p>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function HelpItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <p className="font-black text-white">{title}</p>
      <p className="mt-1 text-sm font-bold text-zinc-500">{text}</p>
    </div>
  );
}

function Status({ status }: { status: string }) {
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

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-3">
      <p className="text-[11px] font-bold text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}