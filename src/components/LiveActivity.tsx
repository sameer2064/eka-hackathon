"use client";

import { useEffect, useState } from "react";

export default function LiveActivity() {

  const activities = [
    "🔥 Premium provider joined EKA",
    "⚡ AI ranking updated",
    "💰 New booking completed",
    "🚀 Provider boosted trust score",
    "🏆 Featured provider trending",
    "📈 Booking demand increasing",
  ];

  const [index, setIndex] =
    useState(0);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setIndex((prev) =>
          (prev + 1) %
          activities.length
        );

      }, 2500);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="fixed bottom-8 right-8 z-50">

      <div className="glass-heavy rounded-[28px] px-6 py-5 border border-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.15)]">

        <div className="flex items-center gap-4">

          <div className="live-dot" />

          <div>

            <p className="text-sm text-zinc-500 mb-1">
              Live Marketplace
            </p>

            <p className="font-semibold">
              {activities[index]}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}