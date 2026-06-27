"use client";

import Link from "next/link";

export default function FloatingDock() {

  return (

    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden xl:block">

      <div className="glass rounded-[32px] border border-red-500/10 px-5 py-4 flex items-center gap-3 shadow-[0_0_60px_rgba(239,68,68,0.15)]">

        <Link href="/">
          <button className="dock-btn">
            🏠 Home
          </button>
        </Link>

        <Link href="/providers">
          <button className="dock-btn">
            🧑‍🔧 Providers
          </button>
        </Link>

        <Link href="/jobs">
          <button className="dock-btn">
            💼 Jobs
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="dock-btn">
            📊 Dashboard
          </button>
        </Link>

        <Link href="/dashboard/messages">
          <button className="dock-btn">
            💬 Messages
          </button>
        </Link>

        <Link href="/admin">
          <button className="dock-btn">
            ⚙ Admin
          </button>
        </Link>

      </div>

    </div>
  );
}