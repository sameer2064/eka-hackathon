"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PortfolioPage() {

  const [projects, setProjects] =
    useState<any[]>([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: provider } =
      await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user?.id)
        .single();

    const { data } =
      await supabase
        .from("portfolio")
        .select("*")
        .eq("provider_id", provider.id)
        .order("created_at", {
          ascending: false,
        });

    setProjects(data || []);
  }

  async function uploadImage(
    e: any
  ) {

    const file = e.target.files[0];

    const filename =
      Date.now() + file.name;

    await supabase.storage
      .from("portfolio-images")
      .upload(filename, file);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filename);

    setImage(publicUrl);
  }

  async function createProject() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: provider } =
      await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user?.id)
        .single();

    await supabase
      .from("portfolio")
      .insert({
        provider_id: provider.id,
        title,
        description,
        image,
      });

    setTitle("");
    setDescription("");
    setImage("");

    loadProjects();
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-7xl mx-auto px-6 py-32">

        <div className="mb-16">

          <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-6">
            Portfolio System
          </p>

          <h1 className="text-7xl font-black mb-6">
            Showcase Your Work
          </h1>

        </div>

        <div className="glass rounded-[40px] p-10 mb-16 space-y-6">

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Project title"
            className="w-full bg-black rounded-2xl p-6 border border-zinc-800"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Project description"
            rows={5}
            className="w-full bg-black rounded-2xl p-6 border border-zinc-800"
          />

          <label className="bg-red-500 px-8 py-4 rounded-2xl inline-block cursor-pointer font-bold">

            Upload Image

            <input
              type="file"
              hidden
              onChange={uploadImage}
            />

          </label>

          <button
            onClick={createProject}
            className="block bg-white text-black px-10 py-5 rounded-2xl font-black"
          >
            Create Project
          </button>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((project) => (

            <div
              key={project.id}
              className="glass rounded-[32px] overflow-hidden"
            >

              <img
                src={project.image}
                className="w-full h-72 object-cover"
              />

              <div className="p-8">

                <h2 className="text-3xl font-bold mb-4">
                  {project.title}
                </h2>

                <p className="text-zinc-400 leading-relaxed">
                  {project.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}