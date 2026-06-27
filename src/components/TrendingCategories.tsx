export default function TrendingCategories() {

  const categories = [
    "Electrician",
    "Plumber",
    "Designer",
    "Photographer",
    "Developer",
    "Cleaner",
    "Tutor",
    "Painter",
  ];

  return (

    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="mb-12">

        <p className="uppercase tracking-[0.3em] text-red-500 font-semibold mb-5">
          Trending Categories
        </p>

        <h2 className="heading-lg">
          Popular services.
        </h2>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        {categories.map((category) => (

          <div
            key={category}
            className="glass rounded-[28px] p-8 hover:border-red-500 transition cursor-pointer"
          >

            <h3 className="text-2xl font-semibold mb-3">
              {category}
            </h3>

            <p className="text-zinc-500">
              AI ranked professionals
            </p>

          </div>

        ))}

      </div>

    </section>

  );
}