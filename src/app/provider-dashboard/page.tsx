"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/revenue";
import { createNotification, creditCashbackOnce } from "@/lib/ekaActions";
import BookingChat from "@/components/BookingChat";

export default function ProviderDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadWorkspace();

    const channel = supabase
      .channel("provider-live-final")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => loadWorkspace()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => loadWorkspace()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadWorkspace() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const { data: providerData } = await supabase
      .from("providers")
      .select("*")
      .eq("owner_id", currentUser.id)
      .maybeSingle();

    setProvider(providerData || null);

    const { data: notificationData } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setAlerts(notificationData || []);

    if (providerData) {
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("*")
        .eq("provider_id", providerData.id)
        .order("created_at", { ascending: false });

      setBookings(bookingData || []);
    }

    setLoading(false);
  }

  async function createProviderProfile() {
    setMessage("");

    if (!user) {
      setMessage("Login required.");
      return;
    }

    if (!fullName || !phone || !city || !serviceCategory) {
      setMessage("Fill provider name, phone, city and category.");
      return;
    }

    const { error } = await supabase.from("providers").insert({
      owner_id: user.id,
      full_name: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      service_category: serviceCategory.trim().toLowerCase(),
      description:
        description.trim() ||
        `Professional ${serviceCategory.trim()} service provider on EKA.`,
      approved: false,
      verified: false,
      premium: false,
      featured: false,
      ai_score: 72,
      trust_score: 70,
      total_bookings: 0,
      rating_count: 0,
      recommend_count: 0,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Provider profile created. Admin can approve it now.");
    loadWorkspace();
  }

  async function acceptBooking(booking: any) {
    await supabase.from("bookings").update({ status: "accepted" }).eq("id", booking.id);

    await createNotification({
      userId: booking.customer_id || booking.user_id,
      actorId: user?.id,
      bookingId: booking.id,
      title: "Booking accepted",
      content: `${provider.full_name} accepted your service request.`,
      type: "booking_accepted",
    });

    loadWorkspace();
  }

  async function rejectBooking(booking: any) {
    await supabase.from("bookings").update({ status: "rejected" }).eq("id", booking.id);

    await createNotification({
      userId: booking.customer_id || booking.user_id,
      actorId: user?.id,
      bookingId: booking.id,
      title: "Booking rejected",
      content: `${provider.full_name} rejected your request. Please choose another provider.`,
      type: "booking_rejected",
    });

    loadWorkspace();
  }

  async function completeBooking(booking: any) {
    if (booking.status !== "accepted") {
      alert("Accept the job first, then complete it.");
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

    await creditCashbackOnce(booking);

    await supabase
      .from("providers")
      .update({
        total_bookings: Number(provider.total_bookings || 0) + 1,
        trust_score: Math.min(Number(provider.trust_score || 70) + 2, 100),
      })
      .eq("id", provider.id);

    await createNotification({
      userId: booking.customer_id || booking.user_id,
      actorId: user?.id,
      bookingId: booking.id,
      title: "Service completed",
      content: `Your service is completed. Cashback ${formatMoney(
        booking.cashback_amount
      )} is credited. Please rate the provider.`,
      type: "booking_completed",
    });

    loadWorkspace();
  }

  const stats = useMemo(() => {
    const completed = bookings.filter((booking) => booking.status === "completed");
    const accepted = bookings.filter((booking) => booking.status === "accepted");
    const pending = bookings.filter((booking) => booking.status === "pending");

    return {
      completedJobs: completed.length,
      pendingJobs: pending.length,
      acceptedJobs: accepted.length,
      totalIncome: completed.reduce(
        (sum, booking) => sum + Number(booking.provider_earning || 0),
        0
      ),
      pendingIncome: [...accepted, ...pending].reduce(
        (sum, booking) => sum + Number(booking.provider_earning || 0),
        0
      ),
    };
  }, [bookings]);

  if (loading) {
    return (
      <Panel>
        <h1 className="text-4xl font-black">Loading workspace...</h1>
      </Panel>
    );
  }

  if (!provider) {
    return (
      <Panel>
        <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
          Provider Onboarding
        </p>

        <h1 className="text-5xl font-black tracking-[-0.05em]">
          Create provider profile.
        </h1>

        <p className="mt-4 leading-7 text-zinc-400">
          Your profile will go to admin approval center.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Input label="Provider name" value={fullName} setValue={setFullName} />
          <Input label="Phone" value={phone} setValue={setPhone} />
          <Input label="City" value={city} setValue={setCity} />
          <Input label="Category" value={serviceCategory} setValue={setServiceCategory} />

          <label className="md:col-span-2">
            <p className="mb-2 text-sm font-black text-zinc-500">Description</p>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none"
              placeholder="Describe your services."
            />
          </label>
        </div>

        {message && (
          <p className="mt-5 rounded-2xl bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-200">
            {message}
          </p>
        )}

        <button
          onClick={createProviderProfile}
          className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-black text-black"
        >
          Create Provider Profile
        </button>
      </Panel>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
          Provider Dashboard
        </p>

        <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
          {provider.full_name}
        </h1>

        <p className="mt-4 text-lg text-zinc-400">
          {provider.service_category} · {provider.city}
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <Stat title="Available Income" value={formatMoney(stats.totalIncome)} green />
        <Stat title="Pending Income" value={formatMoney(stats.pendingIncome)} orange />
        <Stat title="Accepted Jobs" value={stats.acceptedJobs} blue />
        <Stat title="Completed" value={stats.completedJobs} />
        <Stat title="Trust Score" value={provider.trust_score || 70} />
      </div>

      <Panel>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black">Job alerts</h2>
          <span className="rounded-full bg-green-400/10 px-4 py-2 text-xs font-black text-green-300">
            LIVE
          </span>
        </div>

        {alerts.length === 0 ? (
          <p className="rounded-2xl bg-black/35 p-4 text-zinc-500">No alerts yet.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4"
              >
                <p className="font-black text-orange-200">{alert.title}</p>
                <p className="mt-1 text-sm leading-6 text-orange-100/80">
                  {alert.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="mt-8">
        <Panel>
          <h2 className="mb-6 text-3xl font-black">Incoming bookings</h2>

          {bookings.length === 0 ? (
            <div className="rounded-[28px] bg-black/35 p-8">
              <h3 className="text-2xl font-black">No bookings yet.</h3>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[28px] border border-white/10 bg-black/35 p-5"
                >
                  <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div>
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
                      </div>

                      <p className="mt-2 text-zinc-500">
                        {booking.city} · {booking.address} ·{" "}
                        {booking.notes || booking.message}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-4">
                        <Mini title="Amount" value={formatMoney(booking.total_amount)} />
                        <Mini title="Income" value={formatMoney(booking.provider_earning)} green />
                        <Mini title="Code" value={booking.service_code || "-"} />
                        <Mini title="Warranty" value={booking.warranty_status || "active"} blue />
                      </div>

                      <BookingChat booking={booking} role="provider" />
                    </div>

                    <div className="grid h-fit gap-3">
                      <button
                        onClick={() => acceptBooking(booking)}
                        disabled={booking.status !== "pending"}
                        className="rounded-2xl bg-white px-4 py-3 font-black text-black disabled:opacity-40"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectBooking(booking)}
                        disabled={booking.status !== "pending"}
                        className="rounded-2xl bg-red-600 px-4 py-3 font-black text-white disabled:opacity-40"
                      >
                        Deny
                      </button>

                      <button
                        onClick={() => completeBooking(booking)}
                        disabled={booking.status !== "accepted"}
                        className="rounded-2xl bg-green-500 px-4 py-3 font-black text-black disabled:opacity-40"
                      >
                        Complete Work
                      </button>
                    </div>
                  </div>
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
    <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <label>
      <p className="mb-2 text-sm font-black text-zinc-500">{label}</p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={label}
        className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none"
      />
    </label>
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

function Mini({
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
  tone: "green" | "blue" | "orange" | "red" | "white";
}) {
  const styles: Record<string, string> = {
    green: "bg-green-400/10 text-green-300",
    blue: "bg-sky-400/10 text-sky-300",
    orange: "bg-orange-400/10 text-orange-300",
    red: "bg-red-500/20 text-red-200",
    white: "bg-white/10 text-zinc-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
        styles[tone] || styles.white
      }`}
    >
      {text}
    </span>
  );
}