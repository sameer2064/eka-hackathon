"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type BotMessage = {
  from: "bot" | "user";
  text: string;
};

const quickReplies = [
  {
    label: "How does EKA protect me?",
    answer:
      "EKA protects customers through verified providers, protected booking records, live chat, service code, cashback, warranty status, and customer recommendation after completion.",
  },
  {
    label: "How do I book a service?",
    answer:
      "Search for a provider, choose the best one, create a protected booking, and wait for the provider to accept. After completion, you get cashback and can recommend the provider.",
  },
  {
    label: "What if provider rejects?",
    answer:
      "If a provider rejects your booking, EKA shows the rejected status and you can choose another provider from the marketplace.",
  },
  {
    label: "How does provider earn?",
    answer:
      "Providers earn from completed jobs. EKA shows pending income, completed income, job alerts, trust score, and customer recommendations.",
  },
  {
    label: "What is EKA revenue model?",
    answer:
      "EKA earns through commission on completed bookings, provider subscriptions, verification fees, and featured provider boosts.",
  },
];

export default function EkaHelpBot() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      from: "bot",
      text: "Hello, I am EKA Assistant. I can help you understand booking, providers, cashback, warranty and support.",
    },
  ]);

  useEffect(() => {
    checkUser();

    const { data } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setIsLoggedIn(!!data.user);
  }

  function ask(question: string, answer: string) {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "bot", text: answer },
    ]);
  }

  function resetChat() {
    setMessages([
      {
        from: "bot",
        text: "Hello, I am EKA Assistant. I can help you understand booking, providers, cashback, warranty and support.",
      },
    ]);
  }

  return (
    <div className="fixed bottom-5 left-5 z-[120]">
      {!open && (
        <div className="flex items-end gap-3">
          <button
            onClick={() => setOpen(true)}
            className="group relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-red-300 via-red-500 to-red-800 shadow-[0_0_45px_rgba(239,68,68,0.35)] transition hover:scale-105"
          >
            <div className="absolute inset-[3px] rounded-[21px] bg-gradient-to-br from-white/20 to-black/20" />
            <span className="relative text-sm font-black text-white">EKA</span>

            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-black bg-green-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
          </button>

          <button
            onClick={() => setOpen(true)}
            className="hidden rounded-[22px] border border-white/10 bg-black/80 px-4 py-3 text-left shadow-2xl backdrop-blur-xl md:block"
          >
            <p className="text-sm font-black text-white">Need help?</p>
            <p className="mt-1 text-xs font-bold text-zinc-500">
              Hello, I am EKA. I am here to help.
            </p>
          </button>
        </div>
      )}

      {open && (
        <div className="w-[360px] overflow-hidden rounded-[32px] border border-white/10 bg-[#08090b]/95 shadow-[0_30px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="relative border-b border-white/10 bg-gradient-to-br from-red-500/20 via-black to-black p-5">
            <div className="absolute right-[-80px] top-[-80px] h-44 w-44 rounded-full bg-red-500/20 blur-3xl" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-red-300 via-red-500 to-red-800 shadow-[0_0_35px_rgba(239,68,68,0.35)]">
                  <span className="text-xs font-black text-white">EKA</span>
                  <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-black bg-green-400" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">EKA Assistant</h3>
                  <p className="text-xs font-bold text-green-300">
                    Online · UI demo
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-zinc-300 hover:bg-white hover:text-black"
              >
                Close
              </button>
            </div>

            <p className="relative mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs font-bold leading-5 text-red-100/80">
              {isLoggedIn
                ? "Welcome back. I can help with bookings, status, cashback and provider support."
                : "Not logged in? I can still explain how EKA works before you sign up."}
            </p>
          </div>

          <div className="max-h-[310px] space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-bold leading-6 ${
                    message.from === "user"
                      ? "bg-red-500 text-white"
                      : "border border-white/10 bg-white/[0.06] text-zinc-300"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
              Quick help
            </p>

            <div className="grid gap-2">
              {quickReplies.map((item) => (
                <button
                  key={item.label}
                  onClick={() => ask(item.label, item.answer)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-black text-zinc-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={resetChat}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-zinc-300 hover:bg-white hover:text-black"
              >
                Reset
              </button>

              <button
                onClick={() =>
                  ask(
                    "Contact support",
                    "For this demo, support is shown as an AI-ready assistant. In production, this can connect to OpenAI API, WhatsApp, phone support, or a ticket system."
                  )
                }
                className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}