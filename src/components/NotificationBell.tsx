"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationBell() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("navbar-notifications-final")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    setUser(currentUser);

    if (!currentUser) {
      setItems([]);
      return;
    }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(8);

    setItems(data || []);
  }

  async function markAllRead() {
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    load();
  }

  if (!user) return null;

  const unread = items.filter((item) => !item.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-black text-white transition hover:bg-white/[0.1]"
      >
        Alerts
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[90] w-[360px] rounded-[26px] border border-white/10 bg-[#0b0c10] p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-black text-white">Notifications</h3>

            <button
              onClick={markAllRead}
              className="text-xs font-black text-zinc-500 hover:text-white"
            >
              Mark read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="rounded-2xl bg-white/[0.05] p-4 text-sm font-bold text-zinc-500">
              No notifications yet.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 ${
                    item.is_read
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-orange-400/20 bg-orange-500/10"
                  }`}
                >
                  <p className="font-black text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}