"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/revenue";

type Booking = any;
type Payment = any;
type WalletTx = any;

export default function RevenueDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [walletTxs, setWalletTxs] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    const totalBookingValue = bookings.reduce(
      (sum, b) => sum + Number(b.total_amount || 0),
      0
    );

    const platformCommission = bookings.reduce(
      (sum, b) => sum + Number(b.platform_fee || 0),
      0
    );

    const providerEarnings = bookings.reduce(
      (sum, b) => sum + Number(b.provider_earning || 0),
      0
    );

    const cashbackLiability = bookings.reduce(
      (sum, b) => sum + Number(b.cashback_amount || 0),
      0
    );

    const completedBookings = bookings.filter(
      (b) => b.status === "completed"
    ).length;

    const pendingPayments = bookings.filter(
      (b) => b.payment_status !== "paid"
    ).length;

    return {
      totalBookingValue,
      platformCommission,
      providerEarnings,
      cashbackLiability,
      completedBookings,
      pendingPayments,
      totalBookings: bookings.length,
    };
  }, [bookings]);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("admin-revenue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => loadData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => loadData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_transactions" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: walletData } = await supabase
      .from("wallet_transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsError) {
      setMessage(bookingsError.message);
    }

    setBookings(bookingsData || []);
    setPayments(paymentsData || []);
    setWalletTxs(walletData || []);
    setLoading(false);
  }

  async function markPaid(booking: Booking) {
    setMessage("");

    const { error } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
      })
      .eq("id", booking.id);

    await supabase.from("payments").insert({
      booking_id: String(booking.id),
      user_id: booking.user_id || null,
      provider_id: booking.provider_id || null,
      amount: booking.total_amount || 0,
      platform_fee: booking.platform_fee || 0,
      cashback_amount: booking.cashback_amount || 0,
      provider_earning: booking.provider_earning || 0,
      status: "paid",
      payment_method: "demo_cash",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Payment marked as paid.");
    loadData();
  }

  async function completeBooking(booking: Booking) {
    setMessage("");

    const code = prompt(
      `Enter service code to complete booking. Demo code is: ${booking.service_code}`
    );

    if (!code) return;

    if (code !== booking.service_code) {
      setMessage("Wrong service code. Booking not completed.");
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        provider_phone_hidden: false,
      })
      .eq("id", booking.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Booking completed. Provider phone unlocked.");
    loadData();
  }

  async function creditCashback(booking: Booking) {
    setMessage("");

    if (booking.cashback_status === "credited") {
      setMessage("Cashback already credited.");
      return;
    }

    const { error: txError } = await supabase.from("wallet_transactions").insert({
      user_id: booking.user_id || null,
      booking_id: String(booking.id),
      amount: Number(booking.cashback_amount || 0),
      type: "cashback",
      status: "credited",
    });

    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        cashback_status: "credited",
      })
      .eq("id", booking.id);

    if (txError || bookingError) {
      setMessage(txError?.message || bookingError?.message || "Cashback error");
      return;
    }

    setMessage("Cashback credited successfully.");
    loadData();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[130px]" />
        <div className="absolute right-0 top-32 h-[450px] w-[450px] rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-green-300">
              Real Revenue Engine
            </p>

            <h1 className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
              Commission, cashback and protected bookings.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              This dashboard proves EKA can generate revenue while giving
              customers warranty, cashback and protection.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/protected-booking"
              className="rounded-full bg-white px-6 py-3 text-sm font-black text-black"
            >
              Create Booking
            </Link>

            <button
              onClick={loadData}
              className="rounded-full border border-white/10 bg-white/[0.07] px-6 py-3 text-sm font-black"
            >
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-8 rounded-3xl border border-green-400/20 bg-green-400/10 p-5 text-green-200">
            {message}
          </div>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <Metric title="Total Booking Value" value={formatMoney(stats.totalBookingValue)} />
          <Metric title="Platform Commission" value={formatMoney(stats.platformCommission)} green />
          <Metric title="Provider Earnings" value={formatMoney(stats.providerEarnings)} blue />
          <Metric title="Cashback Liability" value={formatMoney(stats.cashbackLiability)} red />
          <Metric title="Total Bookings" value={String(stats.totalBookings)} />
          <Metric title="Completed" value={String(stats.completedBookings)} green />
          <Metric title="Pending Payments" value={String(stats.pendingPayments)} red />
          <Metric title="Wallet Credits" value={String(walletTxs.length)} blue />
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-black md:text-5xl">
              Revenue Bookings
            </h2>

            <span className="rounded-full bg-green-400/10 px-4 py-2 text-xs font-black text-green-300">
              REALTIME
            </span>
          </div>

          {loading ? (
            <p className="rounded-3xl bg-black/45 p-6 text-zinc-500">
              Loading revenue data...
            </p>
          ) : bookings.length === 0 ? (
            <p className="rounded-3xl bg-black/45 p-6 text-zinc-500">
              No bookings found. Create one from Protected Booking page.
            </p>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[30px] border border-white/10 bg-black/55 p-5"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black">
                          {booking.customer_name || "Customer"}
                        </h3>

                        <Badge text={booking.status || "pending"} />
                        <Badge text={booking.payment_status || "demo_pending"} />
                        <Badge text={`Code: ${booking.service_code || "-"}`} />
                      </div>

                      <p className="mt-2 text-zinc-500">
                        {booking.city || "No city"} ·{" "}
                        {booking.notes || booking.message || "No note"}
                      </p>

                      <p className="mt-2 text-sm text-zinc-600">
                        Warranty until:{" "}
                        {booking.warranty_until
                          ? new Date(booking.warranty_until).toLocaleDateString()
                          : "Not set"}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-4">
                        <Small title="Amount" value={formatMoney(booking.total_amount)} />
                        <Small title="EKA Fee" value={formatMoney(booking.platform_fee)} green />
                        <Small title="Provider" value={formatMoney(booking.provider_earning)} blue />
                        <Small title="Cashback" value={formatMoney(booking.cashback_amount)} red />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                      <Action
                        text="Mark Paid"
                        onClick={() => markPaid(booking)}
                        className="bg-green-500 text-black hover:bg-green-400"
                      />

                      <Action
                        text="Complete by Code"
                        onClick={() => completeBooking(booking)}
                        className="bg-white text-black hover:bg-zinc-200"
                      />

                      <Action
                        text="Credit Cashback"
                        onClick={() => creditCashback(booking)}
                        className="bg-blue-500 hover:bg-blue-400"
                      />

                      <Action
                        text="Open Warranty"
                        onClick={() =>
                          alert(
                            "Warranty system: customer can file complaint for this booking if service fails."
                          )
                        }
                        className="bg-red-500 hover:bg-red-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <InfoCard
            title="Why customers do not bypass EKA"
            points={[
              "They get cashback only through EKA.",
              "They get 7-day warranty only through EKA.",
              "They get proof, booking ID and service code.",
              "They can raise disputes if service fails.",
            ]}
          />

          <InfoCard
            title="Why providers stay on EKA"
            points={[
              "They receive verified booking leads.",
              "Premium providers get higher visibility.",
              "Trust score becomes their digital reputation.",
              "Lead credits and subscriptions create repeat revenue.",
            ]}
          />
        </div>
      </section>
    </main>
  );
}

function Metric({
  title,
  value,
  green,
  red,
  blue,
}: {
  title: string;
  value: string;
  green?: boolean;
  red?: boolean;
  blue?: boolean;
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.055] p-6 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <h3
        className={`mt-3 text-3xl font-black ${
          green
            ? "text-green-300"
            : red
            ? "text-red-300"
            : blue
            ? "text-blue-300"
            : "text-white"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function Small({
  title,
  value,
  green,
  red,
  blue,
}: {
  title: string;
  value: string;
  green?: boolean;
  red?: boolean;
  blue?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 p-4">
      <p className="text-xs font-bold text-zinc-500">{title}</p>
      <p
        className={`mt-1 font-black ${
          green
            ? "text-green-300"
            : red
            ? "text-red-300"
            : blue
            ? "text-blue-300"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-200">
      {text}
    </span>
  );
}

function Action({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-14 rounded-2xl px-4 py-3 text-sm font-black transition ${className}`}
    >
      {text}
    </button>
  );
}

function InfoCard({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
      <h3 className="text-3xl font-black">{title}</h3>

      <div className="mt-6 space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-3 rounded-2xl bg-black/45 p-4"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-400/15 text-green-300">
              ✓
            </span>
            <p className="font-bold text-zinc-300">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}