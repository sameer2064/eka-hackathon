import Link from "next/link";

export default function RevenueEngineCTA() {
  return (
    <section className="eka-container py-20">
      <div className="eka-card-strong overflow-hidden rounded-[34px]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 md:p-10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-green-300">
              Real Business Engine
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              EKA earns only when trust is created.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Protected booking gives customers warranty, cashback, service proof
              and dispute support. In return, EKA earns commission and providers
              get verified leads.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ProofItem title="10% platform fee" text="Commission per completed booking" />
              <ProofItem title="2% cashback" text="Reason for customers to return" />
              <ProofItem title="7-day warranty" text="Protection against poor service" />
              <ProofItem title="Service code" text="Proof before completion" />
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/protected-booking" className="eka-button-primary">
                Create Demo Booking
              </Link>
              <Link href="/admin/revenue" className="eka-button-dark">
                View Revenue Dashboard
              </Link>
              <Link href="/pricing" className="eka-button-dark">
                Pricing Plans
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/20 p-7 md:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <div className="rounded-[28px] border border-white/10 bg-black/40 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-zinc-500">Demo Job</p>
                  <h3 className="mt-1 text-2xl font-black">
                    Electrical repair
                  </h3>
                </div>

                <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-black text-green-300">
                  PROTECTED
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <MoneyRow label="Customer pays" value="Rs 2,000" />
                <MoneyRow label="EKA commission" value="Rs 200" green />
                <MoneyRow label="Provider earns" value="Rs 1,800" blue />
                <MoneyRow label="Cashback" value="Rs 40" orange />
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-bold text-zinc-500">Judge answer</p>
                <p className="mt-2 leading-7 text-zinc-300">
                  If users bypass EKA, they lose cashback, warranty, booking
                  proof and dispute support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
    </div>
  );
}

function MoneyRow({
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
    <div className="flex items-center justify-between rounded-2xl bg-white/[0.045] px-4 py-3">
      <p className="text-sm font-bold text-zinc-500">{label}</p>
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