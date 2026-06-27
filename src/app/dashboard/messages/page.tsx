"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    loadUser();
    loadMessages();

    const channel =
      supabase
        .channel("live-chat")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          () => {
            loadMessages();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  async function loadUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function loadMessages() {

    const {
      data,
    } = await supabase
      .from("messages")
      .select("*")
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    if (data) {
      setMessages(data);
    }
  }

  async function sendMessage() {

    if (!message) return;

    let senderType = "guest";
    let senderName = "Guest User";

    if (user) {
      senderType = "customer";
      senderName =
        user.email || "Customer";
    }

    await supabase
      .from("messages")
      .insert([
        {
          provider_id:
            crypto.randomUUID(),

          customer_name:
            senderName,

          customer_phone:
            "N/A",

          message:
            message,

          sender:
            senderType,

          sender_name:
            senderName,
        },
      ]);

    setMessage("");
  }

  return (

    <main className="min-h-screen bg-black text-white py-16">

      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">

          <p className="text-red-500 uppercase tracking-[0.3em] font-bold mb-4">
            LIVE REALTIME CHAT
          </p>

          <h1 className="text-7xl font-black mb-5">
            Messages
          </h1>

          <p className="text-zinc-400 text-xl">
            Real communication between customers and providers.
          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden">

          <div className="h-[700px] overflow-y-auto p-8 space-y-6">

            {messages.map((msg) => {

              const isProvider =
                msg.sender === "provider";

              return (

                <div
                  key={msg.id}
                  className={`flex ${
                    isProvider
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[70%] rounded-[32px] p-6 ${
                      isProvider
                        ? "bg-red-500"
                        : "bg-black border border-zinc-800"
                    }`}
                  >

                    <div className="flex items-center justify-between mb-4 gap-6">

                      <div>

                        <h3 className="font-black text-2xl">
                          {msg.sender_name}
                        </h3>

                        <p className="text-sm uppercase tracking-widest opacity-70">
                          {msg.sender}
                        </p>

                      </div>

                    </div>

                    <p className="text-lg leading-relaxed">
                      {msg.message}
                    </p>

                  </div>

                </div>

              );
            })}

          </div>

          <div className="border-t border-zinc-800 p-6 flex gap-4">

            <input
              type="text"
              placeholder="Type message..."
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-5 text-lg outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-red-500 hover:bg-red-600 transition px-10 rounded-2xl font-black text-lg"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}