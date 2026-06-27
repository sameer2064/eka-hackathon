"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function EditProviderPage() {
  const [providerId, setProviderId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceCategory, setServiceCategory] =
    useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProvider();
  }, []);

  async function fetchProvider() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProviderId(data.id);
      setFullName(data.full_name);
      setPhone(data.phone);
      setServiceCategory(
        data.service_category
      );
    }

    setLoading(false);
  }

  async function handleUpdate(e: any) {
    e.preventDefault();

    const { error } = await supabase
      .from("providers")
      .update({
        full_name: fullName,
        phone: phone,
        service_category: serviceCategory,
      })
      .eq("id", providerId);

    if (error) {
      alert("Update failed");
      console.log(error);
    } else {
      alert("Profile updated");

      window.location.href = "/dashboard";
    }
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center text-4xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto py-20 px-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-5xl font-bold mb-10">
            Edit Profile
          </h1>

          <form
            onSubmit={handleUpdate}
            className="space-y-6"
          >

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
            />

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
            />

            <input
              type="text"
              value={serviceCategory}
              onChange={(e) =>
                setServiceCategory(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
            />

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 transition py-5 rounded-2xl text-2xl font-bold"
            >
              Update Profile
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}
