"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  calculateRevenue,
  formatMoney,
  generateServiceCode,
  getWarrantyDate,
} from "@/lib/revenue";
import { createNotification } from "@/lib/ekaActions";

export default function ProtectedBookingPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [providerId, setProviderId] = useState("");
  const [providerSearch, setProviderSearch] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("2000");
  const [message, setMessage] = useState("");

  const split = useMemo(() => calculateRevenue(Number(amount || 0)), [amount]);

  const filteredProviders = providers.filter((provider) => {
    const q = providerSearch.toLowerCase();
    return (
      provider.full_name?.toLowerCase().includes(q) ||
      provider.service_category?.toLowerCase().includes(q) ||
      provider.city?.toLowerCase().includes(q)
    );
  });

  const selectedProvider = providers.find((provider) => provider.id === providerId);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("approved", true)
      .order("verified", { ascending: false })
      .order("premium", { ascending: false })
      .order("trust_score", { ascending: false });

    setProviders(data || []);
    if (data && data.length > 0) setProviderId(data[0].id);
  }

  async function createBooking() {
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("Please login as customer first.");
      return;
    }

    if (!providerId) {
      setMessage("Please choose a provider.");
      return;
    }

    if (!customerName || !phone || !city || !address || !amount) {
      setMessage("Fill all required fields.");
      return;
    }

    const serviceCode = generateServiceCode();

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        provider_id: providerId,
        customer_id: user.id,
        user_id: user.id,
        customer_name: customerName,
        phone,
        city,
        address,
        notes,
        message: notes,
        status: "pending",
        total_amount: split.totalAmount,
        platform_fee: split.platformFee,
        cashback_amount: split.cashbackAmount,
        provider_earning: split.providerEarning,
        service_code: serviceCode,
        payment_status: "pending",
        cashback_status: "pending",
        warranty_status: "active",
        warranty_until: getWarrantyDate(),
        provider_phone_hidden: true,
        customer_reviewed: false,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    await createNotification({
      userId: selectedProvider?.owner_id,
      actorId: user.id,
      bookingId: booking.id,
      title: "New job request",
      content: `${customerName} requested ${
        selectedProvider?.service_category || "service"
      } in ${city}. Estimated earning: ${formatMoney(split.providerEarning)}.`,
      type: "new_job",
    });

    await createNotification({
      userId: user.id,
      bookingId: booking.id,
      title: "Booking created",
      content: `Your protected booking was created. Service code: ${serviceCode}.`,
      type: "booking_created",
    });

    setMessage(
      `Booking created. Provider notified. Code: ${serviceCode}. Cashback: ${formatMoney(
        split.cashbackAmount
      )}.`
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-sky-300">
          Protected Booking
        </p>

        <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
          Choose provider easily.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
          Search by name, city, or service. Pick a provider card and create protected booking.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <div className="mb-6">
            <p className="mb-2 text-sm font-black text-zinc-500">
              Search provider
            </p>

            <input
              value={providerSearch}
              onChange={(event) => setProviderSearch(event.target.value)}
              placeholder="Search plumber, electrician, Kathmandu..."
              className="w-full rounded-2xl border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
            />
          </div>

          {providers.length === 0 ? (
            <div className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-6">
              <h2 className="text-2xl font-black text-orange-200">
                No approved providers yet.
              </h2>
              <p className="mt-2 text-orange-100/80">
                Admin must approve providers first.
              </p>
            </div>
          ) : (
            <div className="mb-8 grid max-h-[420px] gap-3 overflow-y-auto pr-1">
              {filteredProviders.length === 0 ? (
                <p className="rounded-2xl bg-white/[0.05] p-4 font-bold text-zinc-500">
                  No matching provider found.
                </p>
              ) : (
                filteredProviders.map((provider) => {
                  const active = provider.id === providerId;

                  return (
                    <button
                      key={provider.id}
                      onClick={() => setProviderId(provider.id)}
                      className={`rounded-[26px] border p-5 text-left transition hover:-translate-y-0.5 ${
                        active
                          ? "border-red-400/50 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.12)]"
                          : "border-white/10 bg-black/35 hover:border-white/20"
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-black text-white">
                              {provider.full_name || "Provider"}
                            </h3>

                            {provider.verified && <Badge text="Verified" />}
                            {provider.premium && <Badge text="Premium" />}
                          </div>

                          <p className="mt-2 font-bold text-zinc-400">
                            {provider.service_category || "Service"} ·{" "}
                            {provider.city || "Nepal"}
                          </p>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                            {provider.description || "Trusted provider on EKA."}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:w-[190px]">
                          <Mini title="Trust" value={provider.trust_score || 70} />
                          <Mini title="AI" value={provider.ai_score || 70} />
                        </div>
                      </div>

                      {active && (
                        <p className="mt-4 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-black text-red-100">
                          Selected for this booking
                        </p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Customer name" value={customerName} setValue={setCustomerName} />
            <Input label="Phone" value={phone} setValue={setPhone} />
            <Input label="City" value={city} setValue={setCity} />
            <Input label="Address" value={address} setValue={setAddress} />
            <Input label="Service amount" value={amount} setValue={setAmount} type="number" />
            <Input label="Service note" value={notes} setValue={setNotes} />
          </div>

          {message && (
            <p className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-200">
              {message}
            </p>
          )}

          <button
            onClick={createBooking}
            disabled={providers.length === 0}
            className="mt-6 w-full rounded-2xl bg-red-500 px-5 py-4 font-black text-white shadow-[0_0_35px_rgba(239,68,68,0.22)] transition hover:bg-red-400 disabled:opacity-40"
          >
            Create Protected Booking
          </button>
        </Panel>

        <Panel>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
            Live money split
          </p>

          <div className="mt-6 space-y-3">
            <Row label="Customer pays" value={formatMoney(split.totalAmount)} />
            <Row label="EKA commission" value={formatMoney(split.platformFee)} green />
            <Row label="Provider earns" value={formatMoney(split.providerEarning)} blue />
            <Row label="Customer cashback" value={formatMoney(split.cashbackAmount)} orange />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <h3 className="text-xl font-black">Why users stay inside EKA</h3>
            <p className="mt-3 leading-7 text-zinc-400">
              Direct phone calls give no cashback, warranty, service code, booking proof,
              or dispute support.
            </p>
          </div>

          {selectedProvider && (
            <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-red-200">
                Selected provider
              </p>
              <h3 className="mt-3 text-2xl font-black">
                {selectedProvider.full_name}
              </h3>
              <p className="mt-2 text-zinc-400">
                {selectedProvider.service_category} · {selectedProvider.city}
              </p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <p className="mb-2 text-sm font-black text-zinc-500">{label}</p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        type={type}
        placeholder={label}
        className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
      />
    </label>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-black uppercase text-green-300">
      {text}
    </span>
  );
}

function Mini({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/[0.055] p-3 text-center">
      <p className="text-xs font-bold text-zinc-500">{title}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  green,
  blue,
  orange,
}: {
  label: string;
  value: string;
  green?: boolean;
  blue?: boolean;
  orange?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/[0.055] px-4 py-4">
      <p className="font-bold text-zinc-500">{label}</p>
      <p
        className={`font-black ${
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
      </p>
    </div>
  );
}