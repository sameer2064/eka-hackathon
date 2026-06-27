const providers = [
  {
    name: "Ram Bahadur",
    profession: "Electrician",
    location: "Kathmandu",
    slug: "ram-bahadur",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    about:
      "Professional electrician with 8+ years experience in wiring and repair.",
  },

  {
    name: "Hari Lama",
    profession: "Plumber",
    location: "Pokhara",
    slug: "hari-lama",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    about:
      "Expert plumber specializing in bathroom fittings and pipe maintenance.",
  },

  {
    name: "Sita Gurung",
    profession: "Cleaner",
    location: "Lalitpur",
    slug: "sita-gurung",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    about:
      "Trusted home cleaning professional with excellent customer reviews.",
  },
];

export default async function ProviderProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const provider = providers.find(
    (item) => item.slug === slug
  );

  if (!provider) {
    return (
      <div className="text-white p-10">
        Provider not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">

        <img
          src={provider.image}
          className="w-full h-[400px] object-cover rounded-3xl"
        />

        <div className="mt-8">
          <h1 className="text-6xl font-bold">
            {provider.name}
          </h1>

          <p className="text-zinc-400 text-2xl mt-3">
            {provider.profession} • {provider.location}
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-red-500 px-8 py-4 rounded-full text-lg">
              Call Now
            </button>

            <button className="border border-zinc-700 px-8 py-4 rounded-full text-lg">
              Message
            </button>
          </div>

          <div className="mt-10 bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">
              About Provider
            </h2>

            <p className="text-zinc-300 leading-8">
              {provider.about}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}