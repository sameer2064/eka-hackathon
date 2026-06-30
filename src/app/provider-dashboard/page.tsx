"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createNotification, creditCashbackOnce } from "@/lib/ekaActions";
import { formatMoney } from "@/lib/revenue";
import BookingChat from "@/components/BookingChat";

export default function ProviderDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    load();

    const channel = supabase
      .channel("provider-dashboard-clean")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;
    setUser(currentUser);

    if (!currentUser) {
      setProvider(null);
      setBookings([]);
      setLoading(false);
      return;
    }

    const { data: providerRows } = await supabase
      .from("providers")
      .select("*")
      .eq("owner_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const currentProvider = providerRows?.[0] || null;
    setProvider(currentProvider);

    if (!currentProvider) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const { data: bookingRows } = await supabase
      .from("bookings")
      .select("*")
      .eq("provider_id", currentProvider.id)
      .order("created_at", { ascending: false });

    setBookings(bookingRows || []);
    setLoading(false);
  }

  async function createProviderProfile() {
    setMessage("");

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    if (!fullName || !phone || !city || !category) {
      setMessage("Fill name, phone, city and service category.");
      return;
    }

    const { error } = await supabase.from("providers").insert({
      owner_id: user.id,
      full_name: fullName,
      phone,
      city,
      service_category: category,
      description,
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

    setMessage("Provider profile submitted. Admin approval is required.");

    setFullName("");
    setPhone("");
    setCity("");
    setCategory("");
    setDescription("");

    load();
  }

  async function updateBookingStatus(booking: any, status: string) {
    setMessage("");

    const updateData: any = { status };

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.cashback_status = "credited";
    }

    const { data: updatedBooking, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", booking.id)
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    const customerId = booking.customer_id || booking.user_id;

    if (status === "accepted") {
      await createNotification({
        userId: customerId,
        actorId: user?.id,
        bookingId: booking.id,
        title: "Booking accepted",
        content: "Your provider accepted your service request.",
        type: "booking_accepted",
      });
    }

    if (status === "rejected") {
      await createNotification({
        userId: customerId,
        actorId: user?.id,
        bookingId: booking.id,
        title: "Booking rejected",
        content: "The provider rejected your request. Please choose another provider.",
        type: "booking_rejected",
      });
    }

    if (status === "completed") {
      await creditCashbackOnce(updatedBooking);

      await createNotification({
        userId: customerId,
        actorId: user?.id,
        bookingId: booking.id,
        title: "Service completed",
        content: `Your service is completed. Cashback: ${formatMoney(
          Number(booking.cashback_amount || 0)
        )}.`,
        type: "booking_completed",
      });
    }

    setMessage(`Booking marked as ${status}.`);
    load();
  }

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const accepted = bookings.filter((b) => b.status === "accepted").length;
    const completed = bookings.filter((b) => b.status === "completed").length;

    const completedIncome = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + Number(b.provider_earning || 0), 0);

    const pendingIncome = bookings
      .filter((b) => b.status === "pending" || b.status === "accepted")
      .reduce((sum, b) => sum + Number(b.provider_earning || 0), 0);

    return {
      pending,
      accepted,
      completed,
      completedIncome,
      pendingIncome,
      total: bookings.length,
    };
  }, [bookings]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black">Loading provider dashboard...</h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050608] px-5 pt-40 text-white">
        <div className="mx-auto max-w-3xl rounded-[34px] border border-white/10 bg-white/[0.055] p-8">
          <h1 className="text-5xl font-black">Login required</h1>
          <p className="mt-4 text-zinc-400">
            Please login as provider to access your dashboard.
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

  if (!provider) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#050608] px-5 pb-20 pt-40 text-white">
        <Background />

        <section className="relative mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-red-300">
            Provider Onboarding
          </p>

          <h1 className="text-6xl font-black leading-[0.9] tracking-[-0.07em] md:text-8xl">
            Start receiving jobs.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Create your provider profile. Admin approval is required before your
            profile appears in the marketplace.
          </p>

          {message && <Alert>{message}</Alert>}

          <Panel className="mt-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full name" value={fullName} setValue={setFullName} />
              <Input label="Phone" value={phone} setValue={setPhone} />
              <Input label="City" value={city} setValue={setCity} />
              <Input
                label="Service category"
                value={category}
                setValue={setCategory}
              />
            </div>

            <div className="mt-4">
              <Input
                label="Short description"
                value={description}
                setValue={setDescription}
              />
            </div>

            <button
              onClick={createProviderProfile}
              className="mt-6 rounded-[22px] bg-white px-7 py-4 font-black text-black transition hover:scale-[1.02]"
            >
              Submit for approval
            </button>
          </Panel>
        </section>
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
              Provider Dashboard
            </p>

            <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-[-0.08em] md:text-8xl">
              Run your service business.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Accept jobs, track income, complete bookings, chat with customers,
              and grow your trust score.
            </p>
          </div>

          <Panel>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-300">
              Income
            </p>

            <div className="mt-5 space-y-3">
              <Money
                label="Completed"
                value={formatMoney(stats.completedIncome)}
                green
              />
              <Money
                label="Pending"
                value={formatMoney(stats.pendingIncome)}
                orange
              />
              <Money label="Total jobs" value={String(stats.total)} />
            </div>
          </Panel>
        </div>

        {message && <Alert>{message}</Alert>}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Stat title="Pending" value={stats.pending} color="text-orange-300" />
          <Stat title="Accepted" value={stats.accepted} color="text-sky-300" />
          <Stat title="Completed" value={stats.completed} color="text-green-300" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <Panel>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                Profile
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
                {provider.full_name}
              </h2>

              <p className="mt-2 text-sm font-bold text-zinc-500">
                {provider.service_category} · {provider.city}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Mini label="Trust" value={provider.trust_score || 70} />
                <Mini label="AI" value={provider.ai_score || 72} />
                <Mini label="Jobs" value={provider.total_bookings || 0} />
              </div>

              <div className="mt-5">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    provider.approved
                      ? "bg-green-400/10 text-green-300"
                      : "bg-orange-400/10 text-orange-300"
                  }`}
                >
                  {provider.approved ? "Approved" : "Waiting approval"}
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-zinc-500">
                {provider.description || "No description added."}
              </p>
            </Panel>

            <Panel>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-300">
                Growth
              </p>

              <div className="mt-5 space-y-3">
                <Tool title="Fast response" text="Accept jobs quickly" />
                <Tool title="Good service" text="Get customer recommendation" />
                <Tool title="Trust score" text="Rank higher in marketplace" />
              </div>
            </Panel>
          </div>

          <Panel>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-zinc-600">
                  Live jobs
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                  Bookings
                </h2>
              </div>

              <Link
                href="/providers"
                className="rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
              >
                Marketplace
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-[30px] border border-white/10 bg-black/35 p-6">
                <h3 className="text-2xl font-black">No jobs yet.</h3>
                <p className="mt-2 text-zinc-500">
                  When customers book your service, jobs will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    updateBookingStatus={updateBookingStatus}
                  />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </section>
    </main>
  );
}

function BookingCard({
  booking,
  updateBookingStatus,
}: {
  booking: any;
  updateBookingStatus: (booking: any, status: string) => void;
}) {
  const status = booking.status || "pending";

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/35 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-[-0.04em]">
              {booking.customer_name || "Customer"}
            </h3>

            <Status status={status} />
          </div>

          <p className="mt-2 text-sm font-bold text-zinc-500">
            {booking.city || "City"} · {booking.address || "Address"}
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {booking.notes || booking.message || "No service note."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Mini
            label="Amount"
            value={formatMoney(Number(booking.total_amount || 0))}
          />
          <Mini
            label="Earn"
            value={formatMoney(Number(booking.provider_earning || 0))}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Action
          disabled={status !== "pending"}
          onClick={() => updateBookingStatus(booking, "accepted")}
        >
          Accept
        </Action>

        <Action
          disabled={status !== "pending"}
          onClick={() => updateBookingStatus(booking, "rejected")}
        >
          Reject
        </Action>

        <Action
          disabled={status !== "accepted"}
          onClick={() => updateBookingStatus(booking, "completed")}
        >
          Complete
        </Action>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-black text-zinc-400">
          Code: {booking.service_code || "------"}
        </div>
      </div>

      <BookingChat booking={booking} role="provider" />
    </div>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.08),transparent_24%)]" />
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[36px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <label>
      <p className="mb-2 text-sm font-black text-zinc-500">{label}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
        className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
      />
    </label>
  );
}

function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-[24px] border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm font-bold text-green-200">
      {children}
    </div>
  );
}

function Money({ label, value, green, orange }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4">
      <p className="font-bold text-zinc-500">{label}</p>
      <p
        className={`font-black ${
          green ? "text-green-300" : orange ? "text-orange-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Stat({ title, value, color }: any) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.055] p-6">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-600">
        {title}
      </p>
      <h3 className={`mt-4 text-5xl font-black tracking-[-0.06em] ${color}`}>
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

function Tool({ title, text }: any) {
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

function Action({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}