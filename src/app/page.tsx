import AIRecommendations from "@/components/AIRecommendations";
import FloatingDock from "@/components/FloatingDock";
import LiveActivity from "@/components/LiveActivity";
import Testimonials from "@/components/Testimonials";
import CategoryExplorer from "@/components/CategoryExplorer";
import TopProviders from "@/components/TopProviders";
import Link from "next/link";

export default function HomePage() {

  return (

    <main className="min-h-screen text-white overflow-hidden relative">

      {/* GRID BACKGROUND */}

      <div className="eka-grid" />

      {/* LIVE MARKETPLACE */}

      <LiveActivity />

      {/* HERO */}

      <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-28">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />

        <div className="max-w-5xl relative z-10">

          <div className="inline-flex items-center gap-3 glass px-6 py-4 rounded-full mb-10 border border-red-500/20">

            <div className="live-dot" />

            <p className="uppercase tracking-[0.3em] text-red-400 text-sm font-bold">

              Nepal’s AI-Powered Marketplace

            </p>

          </div>

          <h1 className="heading-hero mb-10 max-w-6xl text-gradient">

            Find trusted professionals
            across Nepal powered
            by intelligent ranking.

          </h1>

          <p className="text-zinc-400 text-2xl leading-relaxed max-w-4xl mb-14">

            EKA combines AI recommendations,
            trust infrastructure, realtime
            engagement and premium provider
            discovery to transform how Nepal
            hires skilled professionals.

          </p>

          {/* HERO BUTTONS */}

          <div className="flex flex-wrap gap-6 mb-16">

            <Link href="/providers">

              <button className="button-primary px-10">
                Explore Providers
              </button>

            </Link>

            <Link href="/jobs">

              <button className="button-secondary">
                Browse Jobs
              </button>

            </Link>

            <Link href="/become-provider">

              <button className="button-secondary">
                Become Provider
              </button>

            </Link>

          </div>

          {/* LIVE STATS */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="glass rounded-[30px] p-7">

              <p className="text-zinc-500 text-sm mb-3">
                Providers Online
              </p>

              <h3 className="text-5xl font-black">
                84+
              </h3>

            </div>

            <div className="glass rounded-[30px] p-7">

              <p className="text-zinc-500 text-sm mb-3">
                AI Match Accuracy
              </p>

              <h3 className="text-5xl font-black text-green-400">
                98%
              </h3>

            </div>

            <div className="glass rounded-[30px] p-7">

              <p className="text-zinc-500 text-sm mb-3">
                Cities Covered
              </p>

              <h3 className="text-5xl font-black">
                12+
              </h3>

            </div>

            <div className="glass rounded-[30px] p-7">

              <p className="text-zinc-500 text-sm mb-3">
                Bookings Completed
              </p>

              <h3 className="text-5xl font-black text-red-400">
                4200+
              </h3>

            </div>

          </div>

        </div>

      </section>

      {/* TRUST SECTION */}

      <section className="max-w-7xl mx-auto px-6 pb-28">

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="premium-card rounded-[36px] p-10">

            <div className="text-6xl mb-8">
              🧠
            </div>

            <h3 className="text-4xl font-black mb-5">
              AI Ranked Providers
            </h3>

            <p className="text-zinc-400 text-xl leading-relaxed">
              Intelligent recommendation systems
              identify the best professionals
              based on trust, performance,
              ratings and responsiveness.
            </p>

          </div>

          <div className="premium-card rounded-[36px] p-10">

            <div className="text-6xl mb-8">
              🛡️
            </div>

            <h3 className="text-4xl font-black mb-5">
              Verified Marketplace
            </h3>

            <p className="text-zinc-400 text-xl leading-relaxed">
              Providers undergo verification,
              trust scoring and activity analysis
              to create a safer service ecosystem
              for Nepali customers.
            </p>

          </div>

          <div className="premium-card rounded-[36px] p-10">

            <div className="text-6xl mb-8">
              ⚡
            </div>

            <h3 className="text-4xl font-black mb-5">
              Realtime Marketplace
            </h3>

            <p className="text-zinc-400 text-xl leading-relaxed">
              Instant bookings, live provider
              discovery, intelligent visibility
              systems and realtime engagement
              infrastructure.
            </p>

          </div>

        </div>

      </section>

      {/* AI SECTION */}

      <AIRecommendations />

      {/* CATEGORY SECTION */}

      <CategoryExplorer />

      {/* TOP PROVIDERS */}

      <TopProviders />

      {/* TESTIMONIALS */}

      <Testimonials />

      {/* FINAL CTA */}

      <section className="max-w-7xl mx-auto px-6 py-32">

        <div className="glass rounded-[50px] p-14 lg:p-20 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/10 blur-[120px]" />

          <div className="relative z-10 max-w-4xl">

            <p className="uppercase tracking-[0.3em] text-red-500 font-bold mb-6">
              Join Nepal’s Next Generation Marketplace
            </p>

            <h2 className="heading-lg mb-8">

              Build your professional
              presence with EKA.

            </h2>

            <p className="text-zinc-400 text-2xl leading-relaxed mb-12">

              Create your provider identity,
              receive bookings, grow visibility,
              build trust and scale your services
              across Nepal.

            </p>

            <div className="flex flex-wrap gap-6">

              <Link href="/become-provider">

                <button className="button-primary px-10">
                  Become Provider
                </button>

              </Link>

              <Link href="/providers">

                <button className="button-secondary">
                  Explore Marketplace
                </button>

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* FLOATING NAV */}

      <FloatingDock />

    </main>
  );
}