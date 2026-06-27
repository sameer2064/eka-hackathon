"use client";

import { useState } from "react";

export default function SettingsPage() {

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [bio, setBio] =
    useState("");

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-5xl mx-auto px-6 py-32">

        <div className="mb-16">

          <p className="uppercase tracking-[0.3em] text-red-500 font-bold mb-6">
            ACCOUNT SETTINGS
          </p>

          <h1 className="text-7xl font-black">
            Settings
          </h1>

        </div>

        <div className="glass-heavy rounded-[40px] p-10 space-y-6">

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Full name"
            className="input-primary"
          />

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="Phone"
            className="input-primary"
          />

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            placeholder="Professional bio"
            className="input-primary h-40 py-5"
          />

          <div className="grid md:grid-cols-2 gap-6">

            <button className="button-primary">
              Save Changes
            </button>

            <button className="button-secondary">
              Upgrade Premium
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}