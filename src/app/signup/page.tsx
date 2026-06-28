"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Role = "customer" | "provider";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signup() {
    setMessage("");

    if (!fullName || !email || !password) {
      setMessage("Fill name, email and password.");
      return;
    }

    if (role === "provider" && (!phone || !city || !serviceCategory)) {
      setMessage("Provider must fill phone, city and service category.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
          phone,
          city,
          service_category: serviceCategory,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setMessage("Account created. Please login.");
      setLoading(false);
      return;
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      email: email.trim(),
      full_name: fullName.trim(),
      role,
      updated_at: new Date().toISOString(),
    });

    if (role === "provider") {
      await supabase.from("providers").insert({
        owner_id: user.id,
        full_name: fullName.trim(),
        phone,
        city,
        service_category: serviceCategory,
        description: "Verified local service provider on EKA.",
        approved: false,
        verified: false,
        premium: false,
        featured: false,
        ai_score: 72,
        trust_score: 70,
        total_bookings: 0,
      });

      router.push("/provider-dashboard");
    } else {
      router.push("/customer");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#07080a] px-5 py-14 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-orange-300">
          Create Account
        </p>

        <h1 className="max-w-4xl text-5xl font-black tracking-[-0.05em] md:text-7xl">
          Choose how you use EKA.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
          Customers get a protected booking dashboard. Providers get a business dashboard.
        </p>

        <div className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <RoleButton
              active={role === "customer"}
              title="Customer"
              text="Book services with warranty, cashback and proof."
              onClick={() => setRole("customer")}
            />
            <RoleButton
              active={role === "provider"}
              title="Provider"
              text="Receive jobs, manage bookings and earn through EKA."
              onClick={() => setRole("provider")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full name" value={fullName} setValue={setFullName} />
            <Input label="Email" value={email} setValue={setEmail} type="email" />
            <Input label="Password" value={password} setValue={setPassword} type="password" />

            {role === "provider" && (
              <>
                <Input label="Phone" value={phone} setValue={setPhone} />
                <Input label="City" value={city} setValue={setCity} />
                <Input
                  label="Service category"
                  value={serviceCategory}
                  setValue={setServiceCategory}
                  placeholder="Electrician, plumber, CCTV..."
                />
              </>
            )}
          </div>

          {message && (
            <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              {message}
            </p>
          )}

          <button
            onClick={signup}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-black text-black disabled:opacity-60"
          >
            {loading ? "Creating..." : `Create ${role} account`}
          </button>

          <p className="mt-5 text-center text-sm font-bold text-zinc-500">
            Already have account?{" "}
            <Link href="/login" className="text-white">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function RoleButton({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[28px] border p-6 text-left transition ${
        active
          ? "border-white bg-white text-black"
          : "border-white/10 bg-black/35 text-white hover:bg-white/[0.08]"
      }`}
    >
      <h2 className="text-2xl font-black">{title}</h2>
      <p className={`mt-3 leading-7 ${active ? "text-zinc-700" : "text-zinc-500"}`}>
        {text}
      </p>
    </button>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label>
      <p className="mb-2 text-sm font-black text-zinc-500">{label}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder={placeholder || label}
        className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-4 font-bold text-white outline-none placeholder:text-zinc-700 focus:border-orange-400/60"
      />
    </label>
  );
}