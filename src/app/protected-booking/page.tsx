"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  calculateRevenue,
  formatMoney,
  generateServiceCode,
  getWarrantyDate,
} from "@/lib/revenue";

type Provider = any;
type Booking = any;

export default function ProtectedBookingPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    provider_id: "",
    customer_name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
    total_amount: "2000",
  });

  const revenue = useMemo(
    () => calculateRevenue(Number(form.total_amount || 0)),
    [form.total_amount]
  );

  const selectedProvider = providers.find((p) => p.id === form.provider_id);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("protected-booking-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          loadRecentBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadData() {
    await Promise.all([loadProviders(), loadRecentBookings()]);
  }

  async function loadProviders() {
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setProviders(data || []);

    if (data && data.length > 0) {
      setForm((prev) => ({
        ...prev,
        provider_id: prev.provider_id || data[0].id,
      }));
    }
  }

  async function loadRecentBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    setRecentBookings(data || []);
  }

  async function createProtectedBooking() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const serviceCode = generateServiceCode();
    const warrantyUntil = getWarrantyDate();

    const payload = {
      provider_id: form.provider_id,
      user_id: user?.id || null,
      customer_name: form.customer_name || "Demo Customer",
      phone: form.phone || "9800000000",
      city: form.city || "Kathmandu",
      address: form.address || "Demo address",
      notes: form.notes || "Protected booking demo",
      message: form.notes || "Protected booking demo",
      status: "pending",
      total_amount: revenue.totalAmount,
      commission_rate: revenue.commissionRate,
      platform_fee: revenue.platformFee,
      cashback_amount: revenue.cashbackAmount,
      provider_earning: revenue.providerEarning,
      service_code: serviceCode,
      payment_status: "demo_pending",
      cashback_status: "not_credited",
      warranty_status: "active",
      warranty_until: warrantyUntil,
      provider_phone_hidden: true,
    };

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert(payload)
      .select()
      .single();

    if (bookingError) {
      setLoading(false);
      setMessage(`Booking error: ${bookingError.message}`);
      return;
    }

    await supabase.from("payments").insert({
      booking_id: String(booking.id),
      user_id: user?.id || null,
      provider_id: form.provider_id,
      amount: revenue.totalAmount,
      platform_fee: revenue.platformFee,
      cashback_amount: revenue.cashbackAmount,
      provider_earning: revenue.providerEarning,
      status: "demo_pending",
      payment_method: "demo",
    });

    setMessage(
      `Protected booking created. Service Code: ${serviceCode}. Platform fee: ${formatMoney(
        revenue.platformFee
      )}. Cashback: ${formatMoney(revenue.cashbackAmount)}.`
    );

    setForm((prev) => ({
      ...prev,
      customer_name: "",
      phone: "",
      address: "",
      notes: "",
    }));

    setLoading(false);
    loadRecentBookings();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[130px]" />
        <div className="absolute right-0 top-32 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="mb-10">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-red-400">
            EKA Protected Booking
          </p>

          <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Stop bypass. Add warranty, commission and cashback.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Customers get service protection and cashback. Providers get verified
            leads. EKA earns platform commission per completed booking.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/admin/revenue"
              className="rounded-full bg-white px-6 py-3 text-sm font-black text-black"
            >
              Open Revenue Dashboard
            </Link>

            <Link
              href="/pricing"
              className="rounded-full border border-white/10 bg-white/[0.07] px-6 py-3 text-sm font-black"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-8 rounded-3xl border border-green-400/20 bg-green-400/10 p-5 text-green-200">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-6 text-3xl font-black">Create Protected Booking</h2>

            <div className="space-y-4">
              <Field label="Provider">
                <select
                  value={form.provider_id}
                  onChange={(e) =>
                    setForm({ ...form, provider_id: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 font-bold text-white outline-none"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.full_name || "Unnamed Provider"} —{" "}
                      {provider.service_category || "Service"} —{" "}
                      {provider.city || "City"}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Customer Name">
                <input
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                  placeholder="Sameer Pathak"
                  className="input"
                />
              </Field>

              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="98XXXXXXXX"
                  className="input"
                />
              </Field>

              <Field label="City">
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Kathmandu"
                  className="input"
                />
              </Field>

              <Field label="Address">
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Full address"
                  className="input"
                />
              </Field>

              <Field label="Service Note">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Example: Fix electric wiring in room"
                  className="input min-h-28"
                />
              </Field>

              <Field label="Estimated Service Amount">
                <input
                  value={form.total_amount}
                  onChange={(e) =>
                    setForm({ ...form, total_amount: e.target.value })
                  }
                  type="number"
                  className="input"
                />
              </Field>

              <button
                onClick={createProtectedBooking}
                disabled={loading || !form.provider_id}
                className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-5 font-black text-white shadow-[0_20px_80px_rgba(239,68,68,0.35)] transition hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Protected Booking"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="mb-6 text-3xl font-black">Revenue Split</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Metric title="Customer Pays" value={formatMoney(revenue.totalAmount)} />
                <Metric title="EKA Commission" value={formatMoney(revenue.platformFee)} red />
                <Metric title="Provider Gets" value={formatMoney(revenue.providerEarning)} green />
                <Metric title="Customer Cashback" value={formatMoney(revenue.cashbackAmount)} blue />
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/45 p-5">
                <p className="font-black">Selected Provider</p>
                <p className="mt-2 text-zinc-400">
                  {selectedProvider
                    ? `${selectedProvider.full_name || "Provider"} · ${
                        selectedProvider.service_category || "Service"
                      } · ${selectedProvider.city || "City"}`
                    : "No provider selected"}
                </p>

                <p className="mt-4 text-sm text-zinc-500">
                  Phone number stays hidden until protected booking is created.
                  Direct call gives no warranty, no cashback, no invoice and no
                  dispute support.
                </p>
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-3xl font-black">Live Bookings</h2>
                <span className="rounded-full bg-green-400/10 px-4 py-2 text-xs font-black text-green-300">
                  REALTIME
                </span>
              </div>

              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <p className="rounded-3xl bg-black/45 p-5 text-zinc-500">
                    No bookings yet.
                  </p>
                ) : (
                  recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-3xl border border-white/10 bg-black/45 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-black">
                            {booking.customer_name || "Customer"}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            {booking.city || "No city"} ·{" "}
                            {formatMoney(booking.total_amount)}
                          </p>
                        </div>

                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-black uppercase text-red-300">
                          {booking.status || "pending"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <Small label="Fee" value={formatMoney(booking.platform_fee)} />
                        <Small label="Cashback" value={formatMoney(booking.cashback_amount)} />
                        <Small label="Code" value={booking.service_code || "-"} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.55);
          padding: 1rem;
          color: white;
          font-weight: 700;
          outline: none;
        }

        .input::placeholder {
          color: rgb(113, 113, 122);
        }

        .input:focus {
          border-color: rgba(248, 113, 113, 0.7);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm font-black text-zinc-400">{label}</p>
      {children}
    </label>
  );
}

function Metric({
  title,
  value,
  red,
  green,
  blue,
}: {
  title: string;
  value: string;
  red?: boolean;
  green?: boolean;
  blue?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/45 p-5">
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <h3
        className={`mt-2 text-3xl font-black ${
          red
            ? "text-red-300"
            : green
            ? "text-green-300"
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

function Small({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-900 p-3">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}