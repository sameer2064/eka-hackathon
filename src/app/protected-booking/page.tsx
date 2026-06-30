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
import { createNotification } from "@/lib/ekaActions";
import { useI18n } from "@/lib/i18n";

export default function ProtectedBookingPage() {
  const { t } = useI18n();

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
  const [saving, setSaving] = useState(false);

  const split = useMemo(() => calculateRevenue(Number(amount || 0)), [amount]);

  const filteredProviders = providers.filter((provider) => {
    const q = providerSearch.toLowerCase();

    return (
      (provider.full_name || "").toLowerCase().includes(q) ||
      (provider.service_category || "").toLowerCase().includes(q) ||
      (provider.city || "").toLowerCase().includes(q)
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

    if (data && data.length > 0) {
      setProviderId(data[0].id);
    }
  }

  async function createBooking() {
    setMessage("");
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage(t("Please login as customer first.", "कृपया पहिले ग्राहकको रूपमा लग इन गर्नुहोस्।"));
      setSaving(false);
      return;
    }

    if (!providerId || !customerName || !phone || !city || !address || !amount) {
      setMessage(t("Choose provider and fill all required fields.", "प्रदायक छान्नुहोस् र सबै आवश्यक विवरण भर्नुहोस्।"));
      setSaving(false);
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
      setSaving(false);
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
      t(
        `Booking created. Service code: ${serviceCode}. Provider has been notified.`,
        `बुकिङ सफल भयो। सेवा कोड: ${serviceCode}। प्रदायकलाई सूचना पठाइयो।`
      )
    );

    setSaving(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] px-5 pb-20 pt-40 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.08),transparent_24%)]" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
              {t("Protected Booking", "सुरक्षित बुकिङ")}
            </p>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              {t("Book safely in minutes.", "केही मिनेटमै सुरक्षित बुकिङ।")}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              {t(
                "Choose a trusted provider, create a protected booking, track status, receive cashback, and keep proof of service.",
                "विश्वसनीय प्रदायक छान्नुहोस्, सुरक्षित बुकिङ गर्नुहोस्, स्थिति ट्र्याक गर्नुहोस्, क्यासब्याक पाउनुहोस् र सेवाको प्रमाण राख्नुहोस्।"
              )}
            </p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
              {t("Money split", "पैसा विभाजन")}
            </p>

            <div className="mt-5 space-y-3">
              <Money label={t("Customer pays", "ग्राहकले तिर्छ")} value={formatMoney(split.totalAmount)} />
              <Money label={t("EKA earns", "EKA कमाउँछ")} value={formatMoney(split.platformFee)} green />
              <Money label={t("Provider earns", "प्रदायकले कमाउँछ")} value={formatMoney(split.providerEarning)} blue />
              <Money label={t("Cashback", "क्यासब्याक")} value={formatMoney(split.cashbackAmount)} orange />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <Panel>
            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                  {t("Step 1", "चरण १")}
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                  {t("Choose provider", "प्रदायक छान्नुहोस्")}
                </h2>
              </div>

              <Link
                href="/providers"
                className="rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
              >
                {t("View marketplace", "मार्केटप्लेस हेर्नुहोस्")}
              </Link>
            </div>

            <input
              value={providerSearch}
              onChange={(event) => setProviderSearch(event.target.value)}
              placeholder={t("Search by service, city or provider name...", "सेवा, शहर वा प्रदायकको नामबाट खोज्नुहोस्...")}
              className="mb-6 w-full rounded-[22px] border border-white/10 bg-black/45 px-5 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
            />

            {providers.length === 0 ? (
              <div className="rounded-[28px] border border-orange-400/20 bg-orange-500/10 p-6">
                <h3 className="text-2xl font-black text-orange-200">
                  {t("No approved providers yet.", "अहिलेसम्म स्वीकृत प्रदायक छैन।")}
                </h3>
                <p className="mt-2 text-orange-100/80">
                  {t("Admin must approve providers first.", "पहिले Admin ले प्रदायक स्वीकृत गर्नुपर्छ।")}
                </p>
              </div>
            ) : (
              <div className="grid max-h-[520px] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
                {filteredProviders.map((provider) => {
                  const active = provider.id === providerId;

                  return (
                    <button
                      key={provider.id}
                      onClick={() => setProviderId(provider.id)}
                      className={`group rounded-[30px] border p-5 text-left transition hover:-translate-y-1 ${
                        active
                          ? "border-red-400/70 bg-red-500/15 shadow-[0_0_50px_rgba(239,68,68,0.16)]"
                          : "border-white/10 bg-black/35 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-2xl font-black tracking-[-0.04em]">
                            {provider.full_name || "Provider"}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-zinc-500">
                            {provider.service_category || "Service"} · {provider.city || "City"}
                          </p>
                        </div>

                        {active && (
                          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                            {t("Selected", "छानिएको")}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <Mini label="Trust" value={provider.trust_score || 70} />
                        <Mini label="AI" value={provider.ai_score || 70} />
                        <Mini label="Jobs" value={provider.total_bookings || 0} />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {provider.verified && <Badge text="Verified" />}
                        {provider.premium && <Badge text="Premium" />}
                        {provider.featured && <Badge text="Featured" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
              {t("Step 2", "चरण २")}
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
              {t("Service details", "सेवा विवरण")}
            </h2>

            {selectedProvider && (
              <div className="mt-5 rounded-[26px] border border-red-400/20 bg-red-500/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
                  {t("Selected provider", "छानिएको प्रदायक")}
                </p>
                <h3 className="mt-3 text-2xl font-black">
                  {selectedProvider.full_name}
                </h3>
                <p className="mt-2 text-sm font-bold text-zinc-400">
                  {selectedProvider.service_category} · {selectedProvider.city}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <Input label={t("Customer name", "ग्राहकको नाम")} value={customerName} setValue={setCustomerName} />
              <Input label={t("Phone", "फोन")} value={phone} setValue={setPhone} />
              <Input label={t("City", "शहर")} value={city} setValue={setCity} />
              <Input label={t("Address", "ठेगाना")} value={address} setValue={setAddress} />
              <Input label={t("Service amount", "सेवा रकम")} value={amount} setValue={setAmount} type="number" />
              <Input label={t("Service note", "सेवा नोट")} value={notes} setValue={setNotes} />
            </div>

            {message && (
              <p className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-200">
                {message}
              </p>
            )}

            <button
              onClick={createBooking}
              disabled={!providerId || providers.length === 0 || saving}
              className="mt-6 w-full rounded-[22px] bg-white px-5 py-4 font-black text-black transition hover:scale-[1.01] disabled:opacity-40"
            >
              {saving ? t("Creating...", "बनाउँदै...") : t("Create Protected Booking", "सुरक्षित बुकिङ बनाउनुहोस्")}
            </button>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[38px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      {children}
    </div>
  );
}

function Input({ label, value, setValue, type = "text" }: any) {
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

function Money({ label, value, green, blue, orange }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4">
      <p className="font-bold text-zinc-500">{label}</p>
      <p className={`font-black ${green ? "text-green-300" : blue ? "text-sky-300" : orange ? "text-orange-300" : "text-white"}`}>
        {value}
      </p>
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

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-black text-green-300">
      {text}
    </span>
  );
}