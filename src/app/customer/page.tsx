"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/revenue";
import BookingChat from "@/components/BookingChat";

export default function CustomerPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    load();

    const channel = supabase
      .channel("customer-live-final")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_transactions" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .or(`customer_id.eq.${user.id},user_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    const { data: walletData } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookings(bookingData || []);
    setWallet(walletData || []);
  }

  async function submitRecommendation(booking: any, recommend: boolean) {
    if (booking.customer_reviewed) return;

    await supabase
      .from("bookings")
      .update({
        customer_reviewed: true,
        customer_recommend: recommend,
        customer_review_text: reviewText || null,
      })
      .eq("id", booking.id);

    const { data: provider } = await supabase
      .from("providers")
      .select("*")
      .eq("id", booking.provider_id)
      .maybeSingle();

    if (provider) {
      await supabase
        .from("providers")
        .update({
          rating_count: Number(provider.rating_count || 0) + 1,
          recommend_count: Number(provider.recommend_count || 0) + (recommend ? 1 : 0),
          trust_score: Math.min(
            Math.max(Number(provider.trust_score || 70) + (recommend ? 4 : -6), 20),
            100
          ),
        })
        .eq("id", booking.provider_id);
    }

    setReviewText("");
    load();
  }

  const stats = useMemo(() => {
    return {
      spent: bookings.reduce(
        (sum, booking) => sum + Number(booking.total_amount || 0),
        0
      ),
      walletCashback: wallet.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
      completed: bookings.filter((booking) => booking.status === "completed").length,
      rejected: bookings.filter((booking) => booking.status === "rejected").length,
      active: bookings.filter(
        (booking) => booking.status === "accepted" || booking.status === "pending"
      ).length,
    };
  }, [bookings, wallet]);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-sky-300">
            Customer Dashboard
          </p>

          <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
            My bookings, cashback and reviews.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Track accepted, rejected, completed bookings and rate providers after completion.
          </p>
        </div>

        <Link
          href="/protected-booking"
          className="rounded-full bg-white px-6 py-3 font-black text-black"
        >
          Book New Service
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <Stat title="Total Spent" value={formatMoney(stats.spent)} />
        <Stat title="Wallet Cashback" value={formatMoney(stats.walletCashback)} green />
        <Stat title="Active" value={stats.active} blue />
        <Stat title="Completed" value={stats.completed} />
        <Stat title="Rejected" value={stats.rejected} orange />
      </div>

      <Panel>
        <h2 className="mb-6 text-3xl font-black">My protected bookings</h2>

        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-black/35 p-8">
            <h3 className="text-2xl font-black">No bookings yet.</h3>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[28px] border border-white/10 bg-black/35 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-black">{booking.customer_name}</h3>

                  <Badge
                    text={booking.status || "pending"}
                    tone={
                      booking.status === "completed"
                        ? "green"
                        : booking.status === "rejected"
                        ? "red"
                        : booking.status === "accepted"
                        ? "blue"
                        : "orange"
                    }
                  />

                  <Badge
                    text={booking.cashback_status || "cashback pending"}
                    tone={booking.cashback_status === "credited" ? "green" : "orange"}
                  />
                </div>

                {booking.status === "rejected" && (
                  <Notice
                    tone="red"
                    text="Provider denied this booking. Please choose another provider."
                  />
                )}

                {booking.status === "accepted" && (
                  <Notice
                    tone="blue"
                    text="Provider accepted this booking. You can now coordinate through live chat."
                  />
                )}

                {booking.status === "completed" && (
                  <Notice
                    tone="green"
                    text="Service completed. Cashback has been credited to your EKA wallet."
                  />
                )}

                <p className="mt-3 text-zinc-500">
                  {booking.city} · {booking.address} ·{" "}
                  {booking.notes || booking.message}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-5">
                  <Small title="Amount" value={formatMoney(booking.total_amount)} />
                  <Small title="Cashback" value={formatMoney(booking.cashback_amount)} green />
                  <Small title="Service Code" value={booking.service_code || "-"} />
                  <Small title="Warranty" value={booking.warranty_status || "active"} blue />
                  <Small title="Payment" value={booking.payment_status || "pending"} />
                </div>

                {booking.status === "completed" && !booking.customer_reviewed && (
                  <div className="mt-5 rounded-[24px] border border-green-400/20 bg-green-500/10 p-5">
                    <h4 className="text-xl font-black text-green-200">
                      Would you recommend this provider to others?
                    </h4>

                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      placeholder="Optional: write one short feedback..."
                      className="mt-4 min-h-[90px] w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none placeholder:text-zinc-600"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => submitRecommendation(booking, true)}
                        className="rounded-full bg-green-400 px-6 py-3 font-black text-black"
                      >
                        Yes, recommend
                      </button>

                      <button
                        onClick={() => submitRecommendation(booking, false)}
                        className="rounded-full bg-red-500 px-6 py-3 font-black text-white"
                      >
                        No, not recommend
                      </button>
                    </div>
                  </div>
                )}

                {booking.customer_reviewed && (
                  <Notice
                    tone="green"
                    text="Thanks. Your recommendation updated the provider trust score."
                  />
                )}

                <BookingChat booking={booking} role="customer" />
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="mt-8">
        <Panel>
          <h2 className="mb-6 text-3xl font-black">Cashback wallet</h2>

          {wallet.length === 0 ? (
            <p className="rounded-3xl bg-black/35 p-6 text-zinc-500">
              No cashback credited yet.
            </p>
          ) : (
            <div className="space-y-3">
              {wallet.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-black/35 px-4 py-4"
                >
                  <div>
                    <p className="font-black text-white">{formatMoney(item.amount)}</p>
                    <p className="text-sm text-zinc-500">
                      {item.type} · {item.status}
                    </p>
                  </div>

                  <Badge text="credited" tone="green" />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl">
      {children}
    </div>
  );
}

function Notice({ text, tone }: { text: string; tone: "green" | "red" | "blue" }) {
  const style =
    tone === "green"
      ? "border-green-400/20 bg-green-500/10 text-green-200"
      : tone === "red"
      ? "border-red-400/20 bg-red-500/10 text-red-200"
      : "border-sky-400/20 bg-sky-500/10 text-sky-200";

  return (
    <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${style}`}>
      {text}
    </p>
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
    <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6">
      <p className="text-sm font-bold text-zinc-500">{title}</p>

      <h3
        className={`mt-3 text-2xl font-black ${
          green
            ? "text-green-300"
            : blue
            ? "text-sky-300"
            : orange
            ? "text-orange-300"
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
  blue,
}: {
  title: string;
  value: any;
  green?: boolean;
  blue?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-4">
      <p className="text-xs font-bold text-zinc-500">{title}</p>

      <p
        className={`mt-1 font-black ${
          green ? "text-green-300" : blue ? "text-sky-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({
  text,
  tone,
}: {
  text: string;
  tone: "green" | "blue" | "orange" | "red";
}) {
  const styles: Record<string, string> = {
    green: "bg-green-400/10 text-green-300",
    blue: "bg-sky-400/10 text-sky-300",
    orange: "bg-orange-400/10 text-orange-300",
    red: "bg-red-500/20 text-red-200",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
        styles[tone] || "bg-white/10 text-zinc-300"
      }`}
    >
      {text}
    </span>
  );
}