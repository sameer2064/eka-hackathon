"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationsPage() {

  const [notifications, setNotifications] =
    useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {

    const { data } =
      await supabase
        .from("notifications")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (data) {
      setNotifications(data);
    }
  }

  async function markRead(id: string) {

    await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq("id", id);

    loadNotifications();
  }

  return (

    <main className="min-h-screen bg-black text-white py-16">

      <div className="max-w-5xl mx-auto px-6">

        <p className="text-red-500 uppercase tracking-[0.3em] font-bold mb-4">
          ALERT CENTER
        </p>

        <h1 className="text-7xl font-black mb-12">
          Notifications
        </h1>

        <div className="space-y-6">

          {notifications.map((item) => (

            <div
              key={item.id}
              className={`rounded-[36px] border p-8 ${
                item.read
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-red-500/10 border-red-500"
              }`}
            >

              <div className="flex justify-between gap-6">

                <div>

                  <h2 className="text-3xl font-black mb-3">
                    {item.title}
                  </h2>

                  <p className="text-zinc-300">
                    {item.message}
                  </p>

                </div>

                {!item.read && (

                  <button
                    onClick={() =>
                      markRead(item.id)
                    }
                    className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-bold"
                  >
                    Mark Read
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}