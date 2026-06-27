"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    loadJobs();

  }, []);

  async function loadJobs() {

    const { data } =
      await supabase
        .from("jobs")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setJobs(data || []);
  }

  const filteredJobs =
    jobs.filter((job) =>
      job.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-7xl mx-auto px-6 py-32">

        <div className="mb-14">

          <p className="uppercase tracking-[0.3em] text-red-500 font-bold mb-5">
            AI JOB MARKETPLACE
          </p>

          <h1 className="text-7xl font-black mb-8">
            Explore Jobs
          </h1>

          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="input-primary"
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              className="premium-card rounded-[36px] p-8 relative overflow-hidden"
            >

              {job.featured && (

                <div className="absolute top-5 right-5 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-black">
                  FEATURED
                </div>

              )}

              <div className="mb-8">

                <h2 className="text-4xl font-black mb-4">
                  {job.title}
                </h2>

                <p className="text-zinc-400 text-xl">
                  {job.company}
                </p>

              </div>

              <div className="flex flex-wrap gap-3 mb-8">

                <div className="bg-black rounded-full px-5 py-3 text-sm border border-white/5">
                  📍 {job.location}
                </div>

                <div className="bg-black rounded-full px-5 py-3 text-sm border border-white/5">
                  💰 Rs {job.salary}
                </div>

                {job.urgent && (

                  <div className="bg-red-500 rounded-full px-5 py-3 text-sm font-bold">
                    URGENT
                  </div>

                )}

              </div>

              <p className="text-zinc-300 leading-relaxed text-lg mb-8">

                {job.description}

              </p>

              <button className="button-primary w-full">
                Apply Now
              </button>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}