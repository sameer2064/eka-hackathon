"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookingChat({
  booking,
  role,
}: {
  booking: any;
  role: "customer" | "provider" | "admin";
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel(`chat-${booking.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking.id]);

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", booking.id)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  async function sendMessage() {
    if (!text.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    await supabase.from("messages").insert({
      booking_id: booking.id,
      provider_id: booking.provider_id,
      user_id: booking.customer_id || booking.user_id,
      sender_id: user.id,
      sender_role: role,
      message_text: text.trim(),
    });

    setText("");
    loadMessages();
  }

  return (
    <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-black text-white">Live job chat</h4>
        <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-black text-green-300">
          LIVE
        </span>
      </div>

      <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="rounded-2xl bg-black/30 p-3 text-sm font-bold text-zinc-500">
            No messages yet.
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="rounded-2xl bg-black/35 p-3">
              <p className="text-xs font-black uppercase text-zinc-600">
                {message.sender_role || "user"}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-300">
                {message.message_text}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write message..."
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700"
        />

        <button
          onClick={sendMessage}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}